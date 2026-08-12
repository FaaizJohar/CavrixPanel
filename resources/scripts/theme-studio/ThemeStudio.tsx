import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { deepmerge } from 'deepmerge-ts';
import { DEFAULT_THEME, sanitizeTheme, ThemeConfig, ThemeSection } from '@/theme-studio/config';
import { compileTheme, THEME_ENGINE_OVERLAP_VARS } from '@/theme-studio/tokens';
import { ThemePreset } from '@/theme-studio/presets';
import {
    addVersion,
    clearDraft,
    deleteVersion,
    loadDraft,
    loadSession,
    loadVersions,
    saveDraft,
    saveSession,
    ThemeVersion,
} from '@/theme-studio/storage';
import { publishTheme, resetTheme } from '@/theme-studio/api';

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface ExtendedWindow extends Window {
    SiteConfiguration?: {
        theme?: unknown;
    };
}

const STYLE_ELEMENT_ID = 'pigeon-theme-studio-style';

const getPublishedFromWindow = (): ThemeConfig | null => {
    try {
        const raw = (window as unknown as ExtendedWindow).SiteConfiguration?.theme;
        return raw ? sanitizeTheme(raw) : null;
    } catch (e) {
        console.warn('Failed to load published theme.', e);
        return null;
    }
};

export interface ThemeStudioContextValue {
    published: ThemeConfig | null;
    theme: ThemeConfig;
    dirty: boolean;
    previewing: boolean;
    activeSection: ThemeSection;
    versions: ThemeVersion[];
    setActiveSection: (section: ThemeSection) => void;
    update: (patch: DeepPartial<ThemeConfig>) => void;
    updateSection: <K extends keyof ThemeConfig>(section: K, patch: DeepPartial<ThemeConfig[K]>) => void;
    applyPreset: (preset: ThemePreset) => void;
    resetToDefault: () => void;
    resetToPublished: () => void;
    importTheme: (json: string) => boolean;
    exportTheme: () => string;
    saveDraftNow: () => void;
    discardDraft: () => void;
    publish: () => Promise<void>;
    resetPublished: () => Promise<void>;
    saveVersion: (name: string) => void;
    restoreVersion: (version: ThemeVersion) => void;
    removeVersion: (id: string) => void;
}

const ThemeStudioContext = createContext<ThemeStudioContextValue | undefined>(undefined);

export const ThemeStudioProvider: React.FC = ({ children }) => {
    const publishedRef = useRef<ThemeConfig | null>(null);
    const themeRef = useRef<ThemeConfig>(DEFAULT_THEME);
    const [published, setPublished] = useState<ThemeConfig | null>(() => getPublishedFromWindow());
    const [theme, setTheme] = useState<ThemeConfig>(() => loadDraft() || getPublishedFromWindow() || DEFAULT_THEME);
    const [previewing, setPreviewing] = useState<boolean>(() => !!loadDraft());
    const [activeSection, setActiveSection] = useState<ThemeSection>(
        () => ((loadSession()?.activeSection as ThemeSection) || 'appearance') as ThemeSection
    );
    const [versions, setVersions] = useState<ThemeVersion[]>(() => loadVersions());
    const [dirty, setDirty] = useState<boolean>(() => {
        const draft = loadDraft();
        const base = getPublishedFromWindow();
        return !!draft && (!base || JSON.stringify(draft) !== JSON.stringify(base));
    });

    const applyStyles = useCallback((next: ThemeConfig | null) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;
        if (!next) {
            const style = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
            if (style) style.remove();
            THEME_ENGINE_OVERLAP_VARS.forEach((property) => root.style.removeProperty(property));
            root.classList.remove('pg-cursor-active');
            return;
        }

        const { variables, css } = compileTheme(next);

        let style = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ELEMENT_ID;
            document.head.appendChild(style);
        }
        style.textContent = css;

        THEME_ENGINE_OVERLAP_VARS.forEach((property) => {
            const value = variables[property];
            if (value !== undefined) {
                root.style.setProperty(property, value);
            }
        });

        root.classList.toggle('pg-cursor-active', next.cursor.mode === 'dot' || next.cursor.mode === 'ring');
    }, []);

    // Apply the active theme. While the studio is open the working copy is
    // previewed; otherwise the published theme drives the whole panel.
    useEffect(() => {
        applyStyles(previewing ? theme : published);
    }, [theme, published, previewing, applyStyles]);

    useEffect(() => {
        publishedRef.current = published;
    }, [published]);

    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    const update = useCallback((patch: DeepPartial<ThemeConfig>) => {
        setTheme((current) => sanitizeTheme(deepmerge(current, patch)));
        setPreviewing(true);
        setDirty(true);
    }, []);

    const updateSection = useCallback(
        <K extends keyof ThemeConfig>(section: K, patch: DeepPartial<ThemeConfig[K]>) => {
            update({ [section]: patch } as DeepPartial<ThemeConfig>);
        },
        [update]
    );

    const applyPreset = useCallback((preset: ThemePreset) => {
        setTheme(sanitizeTheme(preset.build()));
        setPreviewing(true);
        setDirty(true);
    }, []);

    const resetToDefault = useCallback(() => {
        setTheme(sanitizeTheme(DEFAULT_THEME));
        setPreviewing(true);
        setDirty(true);
    }, []);

    const resetToPublished = useCallback(() => {
        const base = publishedRef.current;
        setTheme(base ? sanitizeTheme(base) : sanitizeTheme(DEFAULT_THEME));
        setPreviewing(false);
        setDirty(false);
        clearDraft();
    }, []);

    const importTheme = useCallback((json: string): boolean => {
        try {
            const parsed = JSON.parse(json);
            const sanitized = sanitizeTheme(parsed);
            if (sanitized.meta.schema !== 'pigeon-theme') {
                console.warn('Imported theme is not a valid pigeon-theme document.');
                return false;
            }
            setTheme(sanitized);
            setPreviewing(true);
            setDirty(true);
            saveDraft(sanitized);
            return true;
        } catch (e) {
            console.warn('Failed to import theme.', e);
            return false;
        }
    }, []);

    const exportTheme = useCallback((): string => {
        const { theme: current } = { theme: themeRef.current };
        return JSON.stringify(current, null, 2);
    }, []);

    const saveDraftNow = useCallback(() => {
        saveDraft(themeRef.current);
        setPreviewing(true);
    }, []);

    const discardDraft = useCallback(() => {
        clearDraft();
        setPreviewing(false);
        setDirty(false);
        setTheme(publishedRef.current ? sanitizeTheme(publishedRef.current) : sanitizeTheme(DEFAULT_THEME));
    }, []);

    const publish = useCallback(async () => {
        const next = sanitizeTheme(themeRef.current);
        const stamped = sanitizeTheme({
            ...next,
            meta: {
                ...next.meta,
                updatedAt: new Date().toISOString(),
                updatedBy: (window as unknown as { PterodactylUser?: { username?: string } }).PterodactylUser
                    ?.username as string,
            },
        });
        await publishTheme(stamped);
        setPublished(stamped);
        setTheme(stamped);
        setPreviewing(false);
        setDirty(false);
        clearDraft();
    }, []);

    const resetPublished = useCallback(async () => {
        await resetTheme();
        setPublished(null);
        setPreviewing(false);
        setDirty(false);
        clearDraft();
    }, []);

    const saveVersion = useCallback((name: string) => {
        setVersions(addVersion(name, themeRef.current));
    }, []);

    const restoreVersion = useCallback((version: ThemeVersion) => {
        setTheme(sanitizeTheme(version.theme));
        setPreviewing(true);
        setDirty(true);
    }, []);

    const removeVersion = useCallback((id: string) => {
        setVersions(deleteVersion(id));
    }, []);

    // Persist session/active section.
    useEffect(() => {
        saveSession({ activeSection, lastOpenedAt: new Date().toISOString() });
    }, [activeSection]);

    const value = useMemo<ThemeStudioContextValue>(
        () => ({
            published,
            theme,
            dirty,
            previewing,
            activeSection,
            versions,
            setActiveSection,
            update,
            updateSection,
            applyPreset,
            resetToDefault,
            resetToPublished,
            importTheme,
            exportTheme,
            saveDraftNow,
            discardDraft,
            publish,
            resetPublished,
            saveVersion,
            restoreVersion,
            removeVersion,
        }),
        [
            published,
            theme,
            dirty,
            previewing,
            activeSection,
            versions,
            setActiveSection,
            update,
            updateSection,
            applyPreset,
            resetToDefault,
            resetToPublished,
            importTheme,
            exportTheme,
            saveDraftNow,
            discardDraft,
            publish,
            resetPublished,
            saveVersion,
            restoreVersion,
            removeVersion,
        ]
    );

    return <ThemeStudioContext.Provider value={value}>{children}</ThemeStudioContext.Provider>;
};

export const useThemeStudio = (): ThemeStudioContextValue => {
    const context = useContext(ThemeStudioContext);
    if (!context) {
        throw new Error('useThemeStudio must be used within a ThemeStudioProvider.');
    }
    return context;
};
