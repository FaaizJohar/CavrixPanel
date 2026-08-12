import { ThemeConfig, sanitizeTheme } from '@/theme-studio/config';

export const THEME_STUDIO_KEY = 'pigeon:theme-studio:draft';
export const THEME_VERSIONS_KEY = 'pigeon:theme-studio:versions';
export const THEME_SESSION_KEY = 'pigeon:theme-studio:session';

export interface ThemeVersion {
    id: string;
    name: string;
    createdAt: string;
    theme: ThemeConfig;
}

const safeParse = <T>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch (e) {
        console.warn('Failed to parse theme studio storage.', e);
        return fallback;
    }
};

export function loadDraft(): ThemeConfig | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(THEME_STUDIO_KEY);
    const parsed = safeParse<unknown>(raw, null);
    return parsed ? sanitizeTheme(parsed) : null;
}

export function saveDraft(theme: ThemeConfig): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(THEME_STUDIO_KEY, JSON.stringify(theme));
    } catch (e) {
        console.warn('Failed to save theme studio draft.', e);
    }
}

export function clearDraft(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(THEME_STUDIO_KEY);
}

export function loadVersions(): ThemeVersion[] {
    if (typeof window === 'undefined') return [];
    return safeParse<ThemeVersion[]>(window.localStorage.getItem(THEME_VERSIONS_KEY), []);
}

export function saveVersions(versions: ThemeVersion[]): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(THEME_VERSIONS_KEY, JSON.stringify(versions.slice(0, 20)));
    } catch (e) {
        console.warn('Failed to save theme studio versions.', e);
    }
}

export function addVersion(name: string, theme: ThemeConfig): ThemeVersion[] {
    const versions = loadVersions();
    const version: ThemeVersion = {
        id: Math.random().toString(36).slice(2, 10),
        name: name || `Version ${versions.length + 1}`,
        createdAt: new Date().toISOString(),
        theme: sanitizeTheme(theme),
    };
    const next = [version, ...versions];
    saveVersions(next);
    return next;
}

export function deleteVersion(id: string): ThemeVersion[] {
    const next = loadVersions().filter((version) => version.id !== id);
    saveVersions(next);
    return next;
}

export interface StudioSession {
    activeSection: string;
    lastOpenedAt: string;
}

export function loadSession(): StudioSession | null {
    if (typeof window === 'undefined') return null;
    return safeParse<StudioSession | null>(window.localStorage.getItem(THEME_SESSION_KEY), null);
}

export function saveSession(session: StudioSession): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(THEME_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
        console.warn('Failed to save theme studio session.', e);
    }
}
