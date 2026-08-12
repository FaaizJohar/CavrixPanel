export type AccentId = 'indigo' | 'sky' | 'emerald' | 'violet' | 'rose' | 'amber' | 'slate';

export interface AccentRamp {
    id: AccentId;
    label: string;
    ramp: string[]; // 9 shades [50..900]
}

export const ACCENTS: AccentRamp[] = [
    {
        id: 'indigo',
        label: 'Indigo',
        ramp: ['#eef0fe', '#e0e3fe', '#c4c9fd', '#a3aafb', '#848ef8', '#6c75f2', '#5a61e3', '#4b50c9', '#3d41a1'],
    },
    {
        id: 'sky',
        label: 'Sky',
        ramp: ['#f0f7ff', '#e0efff', '#bcdfff', '#8ec9fb', '#5babf6', '#3b8ff2', '#2874dd', '#1f5cb3', '#1d4a8a'],
    },
    {
        id: 'emerald',
        label: 'Emerald',
        ramp: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46'],
    },
    {
        id: 'violet',
        label: 'Violet',
        ramp: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
    },
    {
        id: 'rose',
        label: 'Rose',
        ramp: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239'],
    },
    {
        id: 'amber',
        label: 'Amber',
        ramp: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
    },
    {
        id: 'slate',
        label: 'Slate',
        ramp: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b'],
    },
];

export const ACCENT_BY_ID = ACCENTS.reduce<Record<AccentId, AccentRamp>>((map, accent) => {
    map[accent.id] = accent;
    return map;
}, {} as Record<AccentId, AccentRamp>);

export type ThemeMode = 'dark' | 'light' | 'system';

export interface Customization {
    accent: AccentId;
    density: number; // 0.8 - 1.2
    radius: number; // 0 - 24 px
    glass: number; // 0.35 - 0.95
    blur: number; // 0 - 28 px
    sidebarWidth: number; // 200 - 320 px
    motion: number; // 0 - 1
    fontScale: number; // 0.9 - 1.2
}

export type PresetId = 'default' | 'minimal' | 'glass' | 'compact' | 'highcontrast';

export interface ThemeState {
    mode: ThemeMode;
    customization: Customization;
}

export const DEFAULT_CUSTOMIZATION: Customization = {
    accent: 'indigo',
    density: 1,
    radius: 12,
    glass: 0.72,
    blur: 14,
    sidebarWidth: 248,
    motion: 1,
    fontScale: 1,
};

export const PRESETS: Record<PresetId, { label: string; customization: Partial<Customization> }> = {
    default: {
        label: 'Default',
        customization: {},
    },
    minimal: {
        label: 'Minimal',
        customization: { glass: 0.9, blur: 18, radius: 10, density: 1 },
    },
    glass: {
        label: 'Glass',
        customization: { glass: 0.45, blur: 24, radius: 16 },
    },
    compact: {
        label: 'Compact',
        customization: { density: 0.85, radius: 8, sidebarWidth: 216, fontScale: 0.95 },
    },
    highcontrast: {
        label: 'High Contrast',
        customization: { glass: 1, blur: 0, radius: 4, motion: 0 },
    },
};

export const STORAGE_KEY = 'pigeon:theme';
