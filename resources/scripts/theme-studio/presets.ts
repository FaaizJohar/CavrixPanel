import { DEFAULT_THEME, sanitizeTheme, ThemeConfig } from '@/theme-studio/config';

export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    swatch: string[];
    build: () => ThemeConfig;
}

const patch = (overrides: Record<string, unknown>): ThemeConfig => sanitizeTheme({ ...DEFAULT_THEME, ...overrides });

export const PRESETS: ThemePreset[] = [
    {
        id: 'default',
        name: 'Pigeon Default',
        description: 'The out-of-the-box Pigeon Panel look: indigo accent, soft glass.',
        swatch: ['#5a61e3', '#27272d', '#16161b', '#a1a1aa'],
        build: () => patch({}),
    },
    {
        id: 'aurora',
        name: 'Aurora',
        description: 'A deep violet-to-blue mesh with a subtle animated drift.',
        swatch: ['#8b5cf6', '#3b82f6', '#0f172a'],
        build: () =>
            patch({
                meta: { name: 'Aurora', description: 'Deep violet and blue with an animated mesh.' },
                colors: {
                    accent: '#8b5cf6',
                    primary: '#8b5cf6',
                    info: '#8b5cf6',
                    states: { hover: '#7c3aed', active: '#6d28d9', focus: '#a78bfa', disabled: '#3f3f46' },
                    dark: {
                        background: '#0c0d17',
                        surface: '#171a2b',
                        surfaceElevated: '#2a2f47',
                        border: '#2a2f47',
                        text: '#f4f4f6',
                        textMuted: '#9aa3bd',
                    },
                },
                background: {
                    type: 'mesh',
                    color: '#12142a',
                    secondaryColor: '#3b82f6',
                    tertiaryColor: '#8b5cf6',
                },
                effects: {
                    aurora: { enabled: true, intensity: 35, speed: 1.2 },
                    glow: { enabled: true, intensity: 55 },
                },
            }),
    },
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'Ultra-dark surfaces with a restrained electric-blue accent.',
        swatch: ['#38bdf8', '#0a0a0f', '#1c1c24'],
        build: () =>
            patch({
                meta: { name: 'Midnight', description: 'Ultra-dark, focused, electric blue.' },
                colors: {
                    accent: '#38bdf8',
                    primary: '#38bdf8',
                    info: '#38bdf8',
                    states: { hover: '#0ea5e9', active: '#0284c7', focus: '#7dd3fc', disabled: '#26262e' },
                    dark: {
                        background: '#0a0a0f',
                        surface: '#15151d',
                        surfaceElevated: '#23232e',
                        border: '#23232e',
                        text: '#e8e8ee',
                        textMuted: '#8b8b99',
                    },
                },
                background: { type: 'solid', color: '#0a0a0f' },
                glass: { enabled: true, transparency: 88, blur: 12, borderOpacity: 40 },
                shadows: { preset: 'subtle', intensity: 80, blur: 20, opacity: 30 },
                effects: { gradient: { enabled: false, intensity: 30 } },
            }),
    },
    {
        id: 'crystal',
        name: 'Crystal',
        description: 'Heavy glassmorphism, cyan accents, and floating cards.',
        swatch: ['#06b6d4', '#1e293b', '#0f172a'],
        build: () =>
            patch({
                meta: { name: 'Crystal', description: 'Bright cyan glassmorphism.' },
                colors: {
                    accent: '#06b6d4',
                    primary: '#06b6d4',
                    info: '#06b6d4',
                    states: { hover: '#0891b2', active: '#0e7490', focus: '#67e8f9', disabled: '#3f3f46' },
                    dark: {
                        background: '#0f172a',
                        surface: '#1e293b',
                        surfaceElevated: '#334155',
                        border: '#334155',
                        text: '#f1f5f9',
                        textMuted: '#94a3b8',
                    },
                },
                background: {
                    type: 'gradient',
                    color: '#0f172a',
                    secondaryColor: '#155e75',
                    tertiaryColor: '#0e0f2a',
                    angle: 160,
                },
                glass: {
                    enabled: true,
                    intensity: 65,
                    blur: 24,
                    transparency: 72,
                    borderOpacity: 60,
                    highlight: 35,
                },
                cards: { style: 'glass', opacity: 60, blur: 24, radius: 16, hoverEffect: 'glow' },
                navbar: { mode: 'glass', transparency: 72, blur: 24 },
                sidebar: { transparency: 55, blur: 24, active: { glow: true } },
                radius: { preset: 'rounded', value: 14 },
                effects: {
                    glow: { enabled: true, intensity: 60 },
                    aurora: { enabled: true, intensity: 25, speed: 0.8 },
                },
            }),
    },
    {
        id: 'ember',
        name: 'Ember',
        description: 'Warm amber and orange glow on dark carbon surfaces.',
        swatch: ['#f59e0b', '#18181b', '#3f3f46'],
        build: () =>
            patch({
                meta: { name: 'Ember', description: 'Warm amber glow on carbon.' },
                colors: {
                    accent: '#f59e0b',
                    primary: '#f59e0b',
                    info: '#f59e0b',
                    states: { hover: '#d97706', active: '#b45309', focus: '#fcd34d', disabled: '#3f3f46' },
                },
                background: {
                    type: 'gradient',
                    color: '#18181b',
                    secondaryColor: '#2a1f10',
                    tertiaryColor: '#151013',
                    angle: 140,
                },
                effects: { glow: { enabled: true, intensity: 50 }, gradient: { enabled: true, intensity: 45 } },
                cursor: { mode: 'ring', color: '#f59e0b' },
            }),
    },
    {
        id: 'emerald',
        name: 'Emerald',
        description: 'Fresh green tones with a crisp, elevated card look.',
        swatch: ['#10b981', '#1c1c23', '#ffffff'],
        build: () =>
            patch({
                meta: { name: 'Emerald', description: 'Fresh emerald with elevated cards.' },
                colors: {
                    accent: '#10b981',
                    primary: '#10b981',
                    info: '#10b981',
                    states: { hover: '#059669', active: '#047857', focus: '#6ee7b7', disabled: '#3f3f46' },
                },
                background: { type: 'solid', color: '#101613' },
                cards: { style: 'elevated', shadow: 55, opacity: 90 },
                shadows: { preset: 'medium', intensity: 90, opacity: 40 },
                radius: { preset: 'soft', value: 10 },
            }),
    },
    {
        id: 'monochrome',
        name: 'Monochrome',
        description: 'A clean, minimal grayscale interface with a slate accent.',
        swatch: ['#64748b', '#18181b', '#f4f4f5'],
        build: () =>
            patch({
                meta: { name: 'Monochrome', description: 'Clean grayscale minimalism.' },
                colors: {
                    accent: '#64748b',
                    primary: '#64748b',
                    secondary: '#71717a',
                    info: '#64748b',
                    states: { hover: '#475569', active: '#334155', focus: '#94a3b8', disabled: '#3f3f46' },
                },
                background: { type: 'solid', color: '#131316' },
                glass: { enabled: false, transparency: 90 },
                cards: { style: 'flat', opacity: 100, shadow: 25, hoverEffect: 'lift' },
                effects: {
                    glow: { enabled: false, intensity: 0 },
                    gradient: { enabled: false, intensity: 0 },
                    vignette: { enabled: false, intensity: 0 },
                },
                animations: { intensity: 'subtle' },
                cursor: { mode: 'default' },
            }),
    },
    {
        id: 'rosewater',
        name: 'Rosewater',
        description: 'Soft rose and pink gradients with a dreamy glow.',
        swatch: ['#f43f5e', '#ec4899', '#1c1420'],
        build: () =>
            patch({
                meta: { name: 'Rosewater', description: 'Soft rose dreamscape.' },
                colors: {
                    accent: '#f43f5e',
                    primary: '#f43f5e',
                    info: '#f43f5e',
                    states: { hover: '#e11d48', active: '#be123c', focus: '#fda4af', disabled: '#3f3f46' },
                    dark: {
                        background: '#1c1420',
                        surface: '#241a2a',
                        surfaceElevated: '#382838',
                        border: '#382838',
                        text: '#fbeaf1',
                        textMuted: '#c49aa8',
                    },
                },
                background: {
                    type: 'aurora',
                    color: '#3d1a2e',
                    secondaryColor: '#f43f5e',
                    tertiaryColor: '#ec4899',
                },
                effects: {
                    aurora: { enabled: true, intensity: 45, speed: 1.4 },
                    glow: { enabled: true, intensity: 55 },
                },
                radius: { preset: 'rounded', value: 14 },
            }),
    },
];

export const PRESET_BY_ID = PRESETS.reduce<Record<string, ThemePreset>>((map, preset) => {
    map[preset.id] = preset;
    return map;
}, {});
