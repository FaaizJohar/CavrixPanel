import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    ACCENT_BY_ID,
    Customization,
    DEFAULT_CUSTOMIZATION,
    PRESETS,
    STORAGE_KEY,
    ThemeMode,
    ThemeState,
} from '@/theme/tokens';

export interface ThemeEngineContextValue {
    mode: ThemeMode;
    customization: Customization;
    resolvedTheme: 'dark' | 'light';
    setMode: (mode: ThemeMode) => void;
    setCustomization: (patch: Partial<Customization>) => void;
    resetCustomization: () => void;
    applyPreset: (key: keyof typeof PRESETS) => void;
}

const ThemeEngineContext = createContext<ThemeEngineContextValue | undefined>(undefined);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const loadStoredState = (): ThemeState => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { mode: 'system', customization: DEFAULT_CUSTOMIZATION };

        const parsed = JSON.parse(raw);
        return {
            mode: parsed.mode === 'dark' || parsed.mode === 'light' ? parsed.mode : 'system',
            customization: { ...DEFAULT_CUSTOMIZATION, ...(parsed.customization || {}) },
        };
    } catch (e) {
        console.warn('Failed to load Pigeon theme settings.', e);
        return { mode: 'system', customization: DEFAULT_CUSTOMIZATION };
    }
};

const resolveSystemTheme = (): 'dark' | 'light' =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';

const applyCustomization = (customization: Customization) => {
    const root = document.documentElement;
    const ramp = ACCENT_BY_ID[customization.accent]?.ramp || ACCENT_BY_ID.indigo.ramp;
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

    shades.forEach((shade, index) => {
        root.style.setProperty(`--pg-accent-${shade}`, ramp[index]);
    });

    root.style.setProperty('--pg-radius', `${clamp(customization.radius, 0, 24)}px`);
    root.style.setProperty('--pg-radius-sm', `${clamp(customization.radius * 0.72, 4, 18)}px`);
    root.style.setProperty('--pg-radius-lg', `${clamp(customization.radius * 1.5, 0, 32)}px`);
    root.style.setProperty('--pg-glass-opacity', String(clamp(customization.glass, 0.35, 1)));
    root.style.setProperty('--pg-blur', `${clamp(customization.blur, 0, 28)}px`);
    root.style.setProperty('--pg-sidebar-width', `${clamp(customization.sidebarWidth, 200, 320)}px`);
    root.style.setProperty('--pg-motion', String(clamp(customization.motion, 0, 1)));
    root.style.setProperty('--pg-font-scale', String(clamp(customization.fontScale, 0.85, 1.25)));
    root.style.setProperty('--pg-density', String(clamp(customization.density, 0.7, 1.3)));
};

const applyTheme = (mode: ThemeMode) => {
    const resolved = mode === 'system' ? resolveSystemTheme() : mode;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.style.setProperty('color-scheme', resolved);
};

export const ThemeEngineProvider: React.FC = ({ children }) => {
    const initial = useMemo(loadStoredState, []);
    const [mode, setMode] = useState<ThemeMode>(initial.mode);
    const [customization, setCustomizationState] = useState<Customization>(initial.customization);
    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
        const resolved = initial.mode === 'system' ? resolveSystemTheme() : initial.mode;
        return resolved as 'dark' | 'light';
    });

    // React to system preference changes.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: light)');
        const handler = () => {
            if (mode === 'system') {
                const resolved = media.matches ? 'light' : 'dark';
                setResolvedTheme(resolved);
                applyTheme(mode);
            }
        };
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [mode]);

    useEffect(() => {
        const resolved = mode === 'system' ? resolveSystemTheme() : mode;
        setResolvedTheme(resolved);
        applyTheme(mode);
    }, [mode]);

    useEffect(() => {
        applyCustomization(customization);
    }, [customization]);

    // Persist.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, customization }));
        } catch (e) {
            console.warn('Failed to persist Pigeon theme settings.', e);
        }
    }, [mode, customization]);

    const setCustomization = useCallback((patch: Partial<Customization>) => {
        setCustomizationState((state) => ({ ...state, ...patch }));
    }, []);

    const resetCustomization = useCallback(() => {
        setCustomizationState(DEFAULT_CUSTOMIZATION);
    }, []);

    const applyPreset = useCallback((key: keyof typeof PRESETS) => {
        const preset = PRESETS[key];
        if (preset) {
            setCustomizationState((state) => ({ ...state, ...preset.customization }));
        }
    }, []);

    const value = useMemo<ThemeEngineContextValue>(
        () => ({
            mode,
            customization,
            resolvedTheme,
            setMode,
            setCustomization,
            resetCustomization,
            applyPreset,
        }),
        [mode, customization, resolvedTheme, setCustomization, resetCustomization, applyPreset]
    );

    return <ThemeEngineContext.Provider value={value}>{children}</ThemeEngineContext.Provider>;
};

export const usePigeonTheme = (): ThemeEngineContextValue => {
    const context = useContext(ThemeEngineContext);
    if (!context) {
        throw new Error('usePigeonTheme must be used within a ThemeEngineProvider.');
    }
    return context;
};
