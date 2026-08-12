import { useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentName = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan';
export type UiPreset = 'default' | 'minimal' | 'glass' | 'compact' | 'high-contrast';
export type Density = 'default' | 'compact' | 'comfortable';
export type Radius = 'default' | 'square' | 'soft';
export type Glass = 'default' | 'strong' | 'soft';
export type Motion = 'default' | 'reduced' | 'none';
export type FontScale = 'default' | 'small' | 'large';

export interface PigeonPreferences {
    mode: ThemeMode;
    accent: AccentName | 'custom';
    accentHex?: string;
    preset: UiPreset;
    density: Density;
    radius: Radius;
    glass: Glass;
    motion: Motion;
    fontScale: FontScale;
    sidebarWidth: number;
}

export const ACCENT_OPTIONS: { label: string; value: AccentName }[] = [
    { label: 'Blue', value: 'blue' },
    { label: 'Violet', value: 'violet' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Amber', value: 'amber' },
    { label: 'Rose', value: 'rose' },
    { label: 'Cyan', value: 'cyan' },
];

// Base colors used to generate the --pg-accent-{50..900} ramp for each named
// accent. The ramp for a custom accent is generated from the user's hex value.
export const ACCENT_BASE_COLORS: Record<AccentName, string> = {
    blue: '#3b82f6',
    violet: '#8b5cf6',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#06b6d4',
};

export const PRESET_OPTIONS: { label: string; value: UiPreset; description: string }[] = [
    { label: 'Default', value: 'default', description: 'Balanced glass, standard density and radius.' },
    { label: 'Minimal', value: 'minimal', description: 'Flat surfaces, no blur, restrained borders.' },
    { label: 'Glass', value: 'glass', description: 'Stronger translucency and blur for a glassy feel.' },
    { label: 'Compact', value: 'compact', description: 'Tighter spacing and a slimmer interface.' },
    { label: 'High Contrast', value: 'high-contrast', description: 'Maximized readability with opaque surfaces.' },
];

const STORAGE_KEY = 'pigeon:prefs';
const ACCENT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const DEFAULT_SIDEBAR_WIDTH = 252;

export const DEFAULT_PREFS: PigeonPreferences = {
    mode: 'dark',
    accent: 'blue',
    preset: 'default',
    density: 'default',
    radius: 'default',
    glass: 'default',
    motion: 'default',
    fontScale: 'default',
    sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
};

export function loadPreferences(): PigeonPreferences {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULT_PREFS;

        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFS, ...parsed };
    } catch (e) {
        return DEFAULT_PREFS;
    }
}

export function savePreferences(prefs: PigeonPreferences) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
        // ignore quota / privacy mode errors
    }
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!match) return { h: 221, s: 0.9, l: 0.55 };

    const value = parseInt(match[1], 16);
    const r = ((value >> 16) & 255) / 255;
    const g = ((value >> 8) & 255) / 255;
    const b = (value & 255) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === r) h = ((g - b) / delta) % 6;
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h *= 60;
        if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// Generates a full 50..900 scale from a single base hex color.
function generateAccentScale(hex: string): string[] {
    const { h, s, l } = hexToHsl(hex);
    const baseLightness = clamp(l, 0.48, 0.62);

    const lightness = [
        0.965,
        0.925,
        0.86,
        0.76,
        0.64,
        baseLightness,
        baseLightness * 0.82,
        baseLightness * 0.68,
        baseLightness * 0.54,
        baseLightness * 0.42,
    ];
    const saturation = [s * 0.55, s * 0.6, s * 0.65, s * 0.7, s * 0.8, s, s * 1.05, s, s * 0.92, s * 0.85];

    return lightness.map((value, index) => {
        const [r, g, b] = hslToRgb(h, clamp(saturation[index], 0, 1), clamp(value, 0, 1));
        return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
    });
}

export function applyPreferences(prefs: PigeonPreferences) {
    const root = document.documentElement;

    const resolvedMode =
        prefs.mode === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : prefs.mode;
    root.setAttribute('data-theme', resolvedMode);

    // Always write the full accent ramp so accent switching works for both
    // named accents and user-defined custom hex colors.
    const baseHex =
        prefs.accent === 'custom' && prefs.accentHex
            ? prefs.accentHex
            : ACCENT_BASE_COLORS[prefs.accent as AccentName] || ACCENT_BASE_COLORS.blue;

    const scale = generateAccentScale(baseHex);
    scale.forEach((value, index) => {
        root.style.setProperty(`--pg-accent-${ACCENT_STEPS[index]}`, value);
    });
    root.setAttribute('data-accent', prefs.accent);

    root.setAttribute('data-preset', prefs.preset);
    root.setAttribute('data-density', prefs.density);
    root.setAttribute('data-radius', prefs.radius);
    root.setAttribute('data-glass', prefs.glass);
    root.setAttribute('data-motion', prefs.motion);
    root.setAttribute('data-font-scale', prefs.fontScale);

    if (prefs.sidebarWidth !== DEFAULT_SIDEBAR_WIDTH) {
        root.style.setProperty('--pg-sidebar-width', `${clamp(prefs.sidebarWidth, 200, 340)}px`);
    } else {
        root.style.removeProperty('--pg-sidebar-width');
    }
}

export function initPigeonTheme(): PigeonPreferences {
    const prefs = loadPreferences();
    applyPreferences(prefs);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
        if (loadPreferences().mode === 'system') {
            applyPreferences(loadPreferences());
        }
    };
    media.addEventListener('change', onSystemChange);

    return prefs;
}

export function usePigeonPreferences(): [PigeonPreferences, (patch: Partial<PigeonPreferences>) => void] {
    const [prefs, setPrefs] = useState<PigeonPreferences>(DEFAULT_PREFS);

    useEffect(() => {
        setPrefs(loadPreferences());
    }, []);

    const update = (patch: Partial<PigeonPreferences>) => {
        setPrefs((previous) => {
            const next = { ...previous, ...patch };
            savePreferences(next);
            applyPreferences(next);
            return next;
        });
    };

    return [prefs, update];
}
