export const THEME_SCHEMA = 'pigeon-theme';
export const THEME_SCHEMA_VERSION = 1;

export type BackgroundType =
    | 'solid'
    | 'gradient'
    | 'mesh'
    | 'image'
    | 'video'
    | 'animated'
    | 'aurora'
    | 'noise'
    | 'custom';

export interface NeutralPalette {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textMuted: string;
}

export interface ThemeColors {
    accent: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    states: {
        hover: string;
        active: string;
        focus: string;
        disabled: string;
    };
    dark: NeutralPalette;
    light: NeutralPalette;
}

export interface ThemeTypography {
    ui: { family: string; weight: number; baseSize: number; lineHeight: number; letterSpacing: number };
    heading: { family: string; weight: number; scale: number };
    mono: { family: string; weight: number };
    scale: 'tiny' | 'small' | 'default' | 'large' | 'huge';
}

export interface BackgroundMediaImage {
    data: string;
    preset: string;
    position: string;
    size: string;
    repeat: string;
    opacity: number;
}

export interface BackgroundMediaVideo {
    data: string;
    poster: string;
    fallbackImage: string;
    opacity: number;
    speed: number;
    loop: boolean;
    muted: boolean;
    objectPosition: string;
}

export interface ThemeBackground {
    type: BackgroundType;
    color: string;
    secondaryColor: string;
    tertiaryColor: string;
    angle: number;
    intensity: number;
    opacity: number;
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
    overlay: string;
    overlayOpacity: number;
    vignette: number;
    noise: number;
    animatedSpeed: number;
    customCss: string;
    image: BackgroundMediaImage;
    video: BackgroundMediaVideo;
}

export interface SurfaceGlass {
    enabled: boolean;
    transparency: number;
    blur: number;
    border: number;
    shadow: number;
}

export interface ThemeGlass {
    enabled: boolean;
    intensity: number;
    blur: number;
    saturation: number;
    transparency: number;
    borderOpacity: number;
    shadow: number;
    highlight: number;
    noise: number;
    tint: 'none' | 'white' | 'black' | 'custom';
    tintColor: string;
    tintStrength: number;
    surfaces: {
        background: SurfaceGlass;
        sidebar: SurfaceGlass;
        navbar: SurfaceGlass;
        cards: SurfaceGlass;
        modals: SurfaceGlass;
        dropdowns: SurfaceGlass;
        inputs: SurfaceGlass;
        tables: SurfaceGlass;
    };
}

export type Density = 'compact' | 'comfortable' | 'spacious';

export interface ThemeLayout {
    density: Density;
    cardPadding: number;
    sectionSpacing: number;
    navSpacing: number;
    tableRowHeight: number;
    buttonHeight: number;
    inputHeight: number;
    contentMaxWidth: number;
}

export type SidebarNavMode = 'default' | 'compact' | 'large' | 'icon-only';

export interface ThemeSidebar {
    width: number;
    collapsedWidth: number;
    position: 'left' | 'floating-left';
    mode: SidebarNavMode;
    transparency: number;
    blur: number;
    background: string;
    border: boolean;
    radius: number;
    shadow: number;
    active: {
        background: string;
        accent: boolean;
        border: boolean;
        glow: boolean;
        text: string;
        icon: string;
    };
}

export type NavbarMode = 'solid' | 'glass' | 'floating' | 'minimal';
export type NavbarPosition = 'sticky' | 'fixed' | 'static';

export interface ThemeNavbar {
    height: number;
    mode: NavbarMode;
    transparency: number;
    blur: number;
    background: string;
    border: boolean;
    shadow: number;
    position: NavbarPosition;
}

export type CardStyle = 'flat' | 'glass' | 'elevated' | 'floating' | 'minimal';

export interface ThemeCards {
    style: CardStyle;
    background: string;
    opacity: number;
    blur: number;
    border: boolean;
    radius: number;
    shadow: number;
    padding: number;
    hoverEffect: 'none' | 'lift' | 'glow' | 'scale';
}

export interface ButtonVariant {
    background: string;
    text: string;
}

export interface ThemeButtons {
    radius: number;
    height: number;
    paddingX: number;
    fontWeight: number;
    border: boolean;
    shadow: number;
    variants: {
        primary: ButtonVariant;
        secondary: ButtonVariant;
        ghost: ButtonVariant;
        outline: ButtonVariant;
        danger: ButtonVariant;
        success: ButtonVariant;
    };
    hover: boolean;
    active: boolean;
    disabledOpacity: number;
}

export interface ThemeInputs {
    radius: number;
    height: number;
    paddingX: number;
    background: string;
    border: string;
    focusRing: number;
}

export type RadiusPreset = 'sharp' | 'compact' | 'soft' | 'rounded' | 'pill';

export interface ThemeRadius {
    preset: RadiusPreset;
    value: number;
    components: {
        cards: number | null;
        buttons: number | null;
        inputs: number | null;
        modals: number | null;
        sidebar: number | null;
        dropdowns: number | null;
        badges: number | null;
    };
}

export type ShadowPreset = 'none' | 'subtle' | 'soft' | 'medium' | 'deep' | 'floating';

export interface ThemeShadows {
    preset: ShadowPreset;
    intensity: number;
    blur: number;
    spread: number;
    opacity: number;
    cards: number | null;
    modals: number | null;
    dropdowns: number | null;
    sidebar: number | null;
}

export interface ThemeEffects {
    glow: { enabled: boolean; intensity: number };
    noise: { enabled: boolean; intensity: number };
    gradient: { enabled: boolean; intensity: number };
    aurora: { enabled: boolean; intensity: number; speed: number };
    particles: { enabled: boolean; density: number; speed: number };
    vignette: { enabled: boolean; intensity: number };
    depth: { enabled: boolean };
    hoverElevation: { enabled: boolean; distance: number };
    pageTransitions: { enabled: boolean };
    performanceMode: boolean;
}

export type AnimationIntensity = 'off' | 'subtle' | 'normal' | 'expressive';
export type AnimationDuration = 'fast' | 'normal' | 'slow';

export interface ThemeAnimations {
    intensity: AnimationIntensity;
    duration: AnimationDuration;
    page: boolean;
    modal: boolean;
    dropdown: boolean;
    hover: boolean;
    sidebar: boolean;
    buttons: boolean;
}

export type CursorMode = 'default' | 'minimal' | 'dot' | 'ring';

export interface ThemeCursor {
    mode: CursorMode;
    size: number;
    opacity: number;
    color: string;
}

export interface ThemeBranding {
    panelName: string;
    panelDescription: string;
    favicon: string | null;
    loginLogo: string | null;
    sidebarLogo: string | null;
    loadingLogo: string | null;
    logoLight: string | null;
    logoDark: string | null;
    browserTitle: string;
    loginTitle: string;
    footerText: string;
}

export type LoginCardStyle = 'flat' | 'glass' | 'elevated' | 'minimal';
export type LoginButtonStyle = 'solid' | 'outline' | 'ghost';

export interface ThemeLogin {
    headline: string;
    description: string;
    cardStyle: LoginCardStyle;
    glass: number;
    buttonStyle: LoginButtonStyle;
    accent: string | null;
    overlay: string;
    overlayOpacity: number;
    blur: number;
    useGlobalBackground: boolean;
    backgroundImage: string | null;
    backgroundVideo: string | null;
}

export interface ThemeAdvanced {
    customCss: string;
    cssVariables: Record<string, string>;
}

export interface ThemeScopes {
    login: boolean;
    dashboard: boolean;
    server: boolean;
    admin: boolean;
}

export interface ThemeMeta {
    schema: 'pigeon-theme';
    version: number;
    name: string;
    description: string;
    updatedAt: string;
    updatedBy: string;
    sourcePreset?: string;
}

export interface ThemeConfig {
    meta: ThemeMeta;
    colors: ThemeColors;
    typography: ThemeTypography;
    background: ThemeBackground;
    glass: ThemeGlass;
    layout: ThemeLayout;
    sidebar: ThemeSidebar;
    navbar: ThemeNavbar;
    cards: ThemeCards;
    buttons: ThemeButtons;
    inputs: ThemeInputs;
    radius: ThemeRadius;
    shadows: ThemeShadows;
    effects: ThemeEffects;
    animations: ThemeAnimations;
    cursor: ThemeCursor;
    branding: ThemeBranding;
    login: ThemeLogin;
    advanced: ThemeAdvanced;
    scopes: ThemeScopes;
}

export const DEFAULT_THEME: ThemeConfig = {
    meta: {
        schema: THEME_SCHEMA,
        version: THEME_SCHEMA_VERSION,
        name: 'Pigeon Default',
        description: 'The default Pigeon Panel appearance.',
        updatedAt: '',
        updatedBy: '',
    },
    colors: {
        accent: '#5a61e3',
        primary: '#5a61e3',
        secondary: '#64748b',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#5a61e3',
        states: {
            hover: '#4b50c9',
            active: '#3d41a1',
            focus: '#848ef8',
            disabled: '#3f3f46',
        },
        dark: {
            background: '#16161b',
            surface: '#27272d',
            surfaceElevated: '#3f3f46',
            border: '#3f3f46',
            text: '#f4f4f5',
            textMuted: '#a1a1aa',
        },
        light: {
            background: '#f4f4f6',
            surface: '#ffffff',
            surfaceElevated: '#e4e4e7',
            border: '#d4d4d8',
            text: '#18181b',
            textMuted: '#71717a',
        },
    },
    typography: {
        ui: { family: 'Inter', weight: 400, baseSize: 14, lineHeight: 1.55, letterSpacing: 0 },
        heading: { family: 'Inter', weight: 600, scale: 1 },
        mono: { family: 'JetBrains Mono', weight: 400 },
        scale: 'default',
    },
    background: {
        type: 'solid',
        color: '#16161b',
        secondaryColor: '#1f2340',
        tertiaryColor: '#10131f',
        angle: 135,
        intensity: 60,
        opacity: 100,
        blur: 0,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        overlay: '#000000',
        overlayOpacity: 0,
        vignette: 0,
        noise: 0,
        animatedSpeed: 12,
        customCss: '',
        image: {
            data: '',
            preset: 'cover',
            position: 'center',
            size: 'cover',
            repeat: 'no-repeat',
            opacity: 100,
        },
        video: {
            data: '',
            poster: '',
            fallbackImage: '',
            opacity: 60,
            speed: 1,
            loop: true,
            muted: true,
            objectPosition: 'center',
        },
    },
    glass: {
        enabled: true,
        intensity: 55,
        blur: 14,
        saturation: 130,
        transparency: 82,
        borderOpacity: 55,
        shadow: 35,
        highlight: 25,
        noise: 0,
        tint: 'none',
        tintColor: '#ffffff',
        tintStrength: 10,
        surfaces: {
            background: { enabled: true, transparency: 0, blur: 0, border: 0, shadow: 0 },
            sidebar: { enabled: true, transparency: 68, blur: 18, border: 55, shadow: 0 },
            navbar: { enabled: true, transparency: 82, blur: 18, border: 55, shadow: 0 },
            cards: { enabled: true, transparency: 85, blur: 16, border: 55, shadow: 20 },
            modals: { enabled: true, transparency: 94, blur: 20, border: 55, shadow: 60 },
            dropdowns: { enabled: true, transparency: 92, blur: 18, border: 55, shadow: 40 },
            inputs: { enabled: true, transparency: 60, blur: 8, border: 55, shadow: 0 },
            tables: { enabled: true, transparency: 85, blur: 14, border: 55, shadow: 0 },
        },
    },
    layout: {
        density: 'comfortable',
        cardPadding: 20,
        sectionSpacing: 24,
        navSpacing: 4,
        tableRowHeight: 44,
        buttonHeight: 38,
        inputHeight: 40,
        contentMaxWidth: 1536,
    },
    sidebar: {
        width: 252,
        collapsedWidth: 68,
        position: 'left',
        mode: 'default',
        transparency: 68,
        blur: 18,
        background: '',
        border: true,
        radius: 0,
        shadow: 0,
        active: {
            background: '',
            accent: true,
            border: false,
            glow: true,
            text: '',
            icon: '',
        },
    },
    navbar: {
        height: 56,
        mode: 'glass',
        transparency: 82,
        blur: 18,
        background: '',
        border: true,
        shadow: 0,
        position: 'sticky',
    },
    cards: {
        style: 'glass',
        background: '',
        opacity: 85,
        blur: 16,
        border: true,
        radius: 12,
        shadow: 20,
        padding: 20,
        hoverEffect: 'lift',
    },
    buttons: {
        radius: 8,
        height: 38,
        paddingX: 16,
        fontWeight: 600,
        border: true,
        shadow: 0,
        variants: {
            primary: { background: '', text: '#ffffff' },
            secondary: { background: '', text: '' },
            ghost: { background: '', text: '' },
            outline: { background: '', text: '' },
            danger: { background: '', text: '#ffffff' },
            success: { background: '', text: '#ffffff' },
        },
        hover: true,
        active: true,
        disabledOpacity: 45,
    },
    inputs: {
        radius: 8,
        height: 40,
        paddingX: 14,
        background: '',
        border: '',
        focusRing: 45,
    },
    radius: {
        preset: 'soft',
        value: 12,
        components: {
            cards: null,
            buttons: null,
            inputs: null,
            modals: null,
            sidebar: null,
            dropdowns: null,
            badges: null,
        },
    },
    shadows: {
        preset: 'soft',
        intensity: 100,
        blur: 24,
        spread: 0,
        opacity: 35,
        cards: null,
        modals: null,
        dropdowns: null,
        sidebar: null,
    },
    effects: {
        glow: { enabled: true, intensity: 45 },
        noise: { enabled: false, intensity: 4 },
        gradient: { enabled: true, intensity: 55 },
        aurora: { enabled: false, intensity: 30, speed: 1 },
        particles: { enabled: false, density: 20, speed: 1 },
        vignette: { enabled: true, intensity: 18 },
        depth: { enabled: true },
        hoverElevation: { enabled: true, distance: 4 },
        pageTransitions: { enabled: true },
        performanceMode: false,
    },
    animations: {
        intensity: 'normal',
        duration: 'normal',
        page: true,
        modal: true,
        dropdown: true,
        hover: true,
        sidebar: true,
        buttons: true,
    },
    cursor: {
        mode: 'default',
        size: 22,
        opacity: 55,
        color: '#5a61e3',
    },
    branding: {
        panelName: 'Pigeon Panel',
        panelDescription: 'A modern, glassy hosting control panel.',
        favicon: null,
        loginLogo: null,
        sidebarLogo: null,
        loadingLogo: null,
        logoLight: null,
        logoDark: null,
        browserTitle: 'Pigeon Panel',
        loginTitle: 'Pigeon Panel',
        footerText: 'Pigeon Panel',
    },
    login: {
        headline: 'Welcome back',
        description: 'Sign in to manage your servers.',
        cardStyle: 'glass',
        glass: 55,
        buttonStyle: 'solid',
        accent: null,
        overlay: '#000000',
        overlayOpacity: 35,
        blur: 0,
        useGlobalBackground: true,
        backgroundImage: null,
        backgroundVideo: null,
    },
    advanced: {
        customCss: '',
        cssVariables: {},
    },
    scopes: {
        login: true,
        dashboard: true,
        server: true,
        admin: true,
    },
};

export const FONT_UI_OPTIONS = ['Inter', 'System UI', 'Roboto', 'Segoe UI', 'Open Sans', 'Poppins'];
export const FONT_HEADING_OPTIONS = ['Inter', 'Poppins', 'Sora', 'Space Grotesk', 'Manrope', 'System UI'];
export const FONT_MONO_OPTIONS = ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'IBM Plex Mono'];

export const ACCENT_OPTIONS = [
    { label: 'Indigo', value: '#5a61e3' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Sky', value: '#0ea5e9' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Teal', value: '#14b8a6' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Lime', value: '#84cc16' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Pink', value: '#ec4899' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Violet', value: '#8b5cf6' },
];

const clamp = (value: unknown, min: number, max: number, fallback: number): number => {
    if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
    return Math.min(max, Math.max(min, value));
};

const str = (value: unknown, fallback: string): string => (typeof value === 'string' ? value : fallback);

const bool = (value: unknown, fallback: boolean): boolean => (typeof value === 'boolean' ? value : fallback);

/**
 * Deep-merges a raw (possibly partial, possibly untrusted) object onto the
 * default theme, clamping every numeric token to its allowed range. This is
 * the single validation entry point for drafts, published themes, imported
 * themes and preset output.
 */
export function sanitizeTheme(input: unknown): ThemeConfig {
    const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
    const meta = (raw.meta || {}) as Record<string, unknown>;
    const colors = (raw.colors || {}) as Record<string, unknown>;
    const typography = (raw.typography || {}) as Record<string, unknown>;
    const background = (raw.background || {}) as Record<string, unknown>;
    const glass = (raw.glass || {}) as Record<string, unknown>;
    const layout = (raw.layout || {}) as Record<string, unknown>;
    const sidebar = (raw.sidebar || {}) as Record<string, unknown>;
    const navbar = (raw.navbar || {}) as Record<string, unknown>;
    const cards = (raw.cards || {}) as Record<string, unknown>;
    const buttons = (raw.buttons || {}) as Record<string, unknown>;
    const inputs = (raw.inputs || {}) as Record<string, unknown>;
    const radius = (raw.radius || {}) as Record<string, unknown>;
    const shadows = (raw.shadows || {}) as Record<string, unknown>;
    const effects = (raw.effects || {}) as Record<string, unknown>;
    const animations = (raw.animations || {}) as Record<string, unknown>;
    const cursor = (raw.cursor || {}) as Record<string, unknown>;
    const branding = (raw.branding || {}) as Record<string, unknown>;
    const login = (raw.login || {}) as Record<string, unknown>;
    const advanced = (raw.advanced || {}) as Record<string, unknown>;
    const scopes = (raw.scopes || {}) as Record<string, unknown>;

    const colorsObj = colors as Record<string, unknown>;
    const d = colorsObj.dark as Record<string, unknown> | undefined;
    const l = colorsObj.light as Record<string, unknown> | undefined;
    const states = (colorsObj.states || {}) as Record<string, unknown>;
    const ui = (typography.ui || {}) as Record<string, unknown>;
    const heading = (typography.heading || {}) as Record<string, unknown>;
    const mono = (typography.mono || {}) as Record<string, unknown>;

    const glassObj = glass as Record<string, unknown>;
    const surfaces = (glassObj.surfaces || {}) as Record<string, Record<string, unknown>>;

    const sidebarObj = sidebar as Record<string, unknown>;
    const sidebarActive = (sidebarObj.active || {}) as Record<string, unknown>;

    const buttonsObj = buttons as Record<string, unknown>;
    const variants = (buttonsObj.variants || {}) as Record<string, Record<string, unknown>>;

    const radiusObj = radius as Record<string, unknown>;
    const radiusComponents = (radiusObj.components || {}) as Record<string, unknown>;

    const shadowsObj = shadows as Record<string, unknown>;

    const effectsObj = effects as Record<string, unknown>;

    const animationsObj = animations as Record<string, unknown>;

    const cursorObj = cursor as Record<string, unknown>;

    const loginObj = login as Record<string, unknown>;

    const backgroundObj = background as Record<string, unknown>;
    const image = (backgroundObj.image || {}) as Record<string, unknown>;
    const video = (backgroundObj.video || {}) as Record<string, unknown>;

    const pick = (value: unknown, fallback: string): string => (typeof value === 'string' ? value : fallback);

    return {
        meta: {
            schema: THEME_SCHEMA,
            version: THEME_SCHEMA_VERSION,
            name: str(meta.name, DEFAULT_THEME.meta.name),
            description: str(meta.description, DEFAULT_THEME.meta.description),
            updatedAt: str(meta.updatedAt, ''),
            updatedBy: str(meta.updatedBy, ''),
            ...(typeof meta.sourcePreset === 'string' ? { sourcePreset: meta.sourcePreset } : {}),
        },
        colors: {
            accent: pick(colorsObj.accent, DEFAULT_THEME.colors.accent),
            primary: pick(colorsObj.primary, DEFAULT_THEME.colors.primary),
            secondary: pick(colorsObj.secondary, DEFAULT_THEME.colors.secondary),
            success: pick(colorsObj.success, DEFAULT_THEME.colors.success),
            warning: pick(colorsObj.warning, DEFAULT_THEME.colors.warning),
            danger: pick(colorsObj.danger, DEFAULT_THEME.colors.danger),
            info: pick(colorsObj.info, DEFAULT_THEME.colors.info),
            states: {
                hover: pick(states.hover, DEFAULT_THEME.colors.states.hover),
                active: pick(states.active, DEFAULT_THEME.colors.states.active),
                focus: pick(states.focus, DEFAULT_THEME.colors.states.focus),
                disabled: pick(states.disabled, DEFAULT_THEME.colors.states.disabled),
            },
            dark: {
                background: pick(d?.background, DEFAULT_THEME.colors.dark.background),
                surface: pick(d?.surface, DEFAULT_THEME.colors.dark.surface),
                surfaceElevated: pick(d?.surfaceElevated, DEFAULT_THEME.colors.dark.surfaceElevated),
                border: pick(d?.border, DEFAULT_THEME.colors.dark.border),
                text: pick(d?.text, DEFAULT_THEME.colors.dark.text),
                textMuted: pick(d?.textMuted, DEFAULT_THEME.colors.dark.textMuted),
            },
            light: {
                background: pick(l?.background, DEFAULT_THEME.colors.light.background),
                surface: pick(l?.surface, DEFAULT_THEME.colors.light.surface),
                surfaceElevated: pick(l?.surfaceElevated, DEFAULT_THEME.colors.light.surfaceElevated),
                border: pick(l?.border, DEFAULT_THEME.colors.light.border),
                text: pick(l?.text, DEFAULT_THEME.colors.light.text),
                textMuted: pick(l?.textMuted, DEFAULT_THEME.colors.light.textMuted),
            },
        },
        typography: {
            ui: {
                family: str(ui.family, DEFAULT_THEME.typography.ui.family),
                weight: clamp(ui.weight, 100, 900, DEFAULT_THEME.typography.ui.weight),
                baseSize: clamp(ui.baseSize, 10, 20, DEFAULT_THEME.typography.ui.baseSize),
                lineHeight: clamp(ui.lineHeight, 1.1, 2, DEFAULT_THEME.typography.ui.lineHeight),
                letterSpacing: clamp(ui.letterSpacing, -0.05, 0.2, DEFAULT_THEME.typography.ui.letterSpacing),
            },
            heading: {
                family: str(heading.family, DEFAULT_THEME.typography.heading.family),
                weight: clamp(heading.weight, 400, 900, DEFAULT_THEME.typography.heading.weight),
                scale: clamp(heading.scale, 0.8, 1.5, DEFAULT_THEME.typography.heading.scale),
            },
            mono: {
                family: str(mono.family, DEFAULT_THEME.typography.mono.family),
                weight: clamp(mono.weight, 400, 700, DEFAULT_THEME.typography.mono.weight),
            },
            scale: ['tiny', 'small', 'default', 'large', 'huge'].includes(typography.scale as string)
                ? (typography.scale as ThemeTypography['scale'])
                : DEFAULT_THEME.typography.scale,
        },
        background: {
            type: ['solid', 'gradient', 'mesh', 'image', 'video', 'animated', 'aurora', 'noise', 'custom'].includes(
                backgroundObj.type as string
            )
                ? (backgroundObj.type as ThemeBackground['type'])
                : DEFAULT_THEME.background.type,
            color: pick(backgroundObj.color, DEFAULT_THEME.background.color),
            secondaryColor: pick(backgroundObj.secondaryColor, DEFAULT_THEME.background.secondaryColor),
            tertiaryColor: pick(backgroundObj.tertiaryColor, DEFAULT_THEME.background.tertiaryColor),
            angle: clamp(backgroundObj.angle, 0, 360, DEFAULT_THEME.background.angle),
            intensity: clamp(backgroundObj.intensity, 0, 100, DEFAULT_THEME.background.intensity),
            opacity: clamp(backgroundObj.opacity, 0, 100, DEFAULT_THEME.background.opacity),
            blur: clamp(backgroundObj.blur, 0, 60, DEFAULT_THEME.background.blur),
            brightness: clamp(backgroundObj.brightness, 20, 200, DEFAULT_THEME.background.brightness),
            contrast: clamp(backgroundObj.contrast, 20, 200, DEFAULT_THEME.background.contrast),
            saturation: clamp(backgroundObj.saturation, 0, 200, DEFAULT_THEME.background.saturation),
            overlay: pick(backgroundObj.overlay, DEFAULT_THEME.background.overlay),
            overlayOpacity: clamp(backgroundObj.overlayOpacity, 0, 100, DEFAULT_THEME.background.overlayOpacity),
            vignette: clamp(backgroundObj.vignette, 0, 100, DEFAULT_THEME.background.vignette),
            noise: clamp(backgroundObj.noise, 0, 100, DEFAULT_THEME.background.noise),
            animatedSpeed: clamp(backgroundObj.animatedSpeed, 4, 40, DEFAULT_THEME.background.animatedSpeed),
            customCss: str(backgroundObj.customCss, ''),
            image: {
                data: pick(image.data, ''),
                preset: str(image.preset, 'cover'),
                position: str(image.position, 'center'),
                size: str(image.size, 'cover'),
                repeat: str(image.repeat, 'no-repeat'),
                opacity: clamp(image.opacity, 0, 100, 100),
            },
            video: {
                data: pick(video.data, ''),
                poster: str(video.poster, ''),
                fallbackImage: str(video.fallbackImage, ''),
                opacity: clamp(video.opacity, 0, 100, 60),
                speed: clamp(video.speed, 0.25, 3, 1),
                loop: bool(video.loop, true),
                muted: bool(video.muted, true),
                objectPosition: str(video.objectPosition, 'center'),
            },
        },
        glass: {
            enabled: bool(glassObj.enabled, true),
            intensity: clamp(glassObj.intensity, 0, 100, 55),
            blur: clamp(glassObj.blur, 0, 100, 14),
            saturation: clamp(glassObj.saturation, 0, 200, 130),
            transparency: clamp(glassObj.transparency, 0, 100, 82),
            borderOpacity: clamp(glassObj.borderOpacity, 0, 100, 55),
            shadow: clamp(glassObj.shadow, 0, 100, 35),
            highlight: clamp(glassObj.highlight, 0, 100, 25),
            noise: clamp(glassObj.noise, 0, 100, 0),
            tint: ['none', 'white', 'black', 'custom'].includes(glassObj.tint as string)
                ? (glassObj.tint as ThemeGlass['tint'])
                : 'none',
            tintColor: str(glassObj.tintColor, '#ffffff'),
            tintStrength: clamp(glassObj.tintStrength, 0, 100, 10),
            surfaces: {
                background: { ...DEFAULT_THEME.glass.surfaces.background, ...(surfaces.background || {}) },
                sidebar: { ...DEFAULT_THEME.glass.surfaces.sidebar, ...(surfaces.sidebar || {}) },
                navbar: { ...DEFAULT_THEME.glass.surfaces.navbar, ...(surfaces.navbar || {}) },
                cards: { ...DEFAULT_THEME.glass.surfaces.cards, ...(surfaces.cards || {}) },
                modals: { ...DEFAULT_THEME.glass.surfaces.modals, ...(surfaces.modals || {}) },
                dropdowns: { ...DEFAULT_THEME.glass.surfaces.dropdowns, ...(surfaces.dropdowns || {}) },
                inputs: { ...DEFAULT_THEME.glass.surfaces.inputs, ...(surfaces.inputs || {}) },
                tables: { ...DEFAULT_THEME.glass.surfaces.tables, ...(surfaces.tables || {}) },
            },
        },
        layout: {
            density: ['compact', 'comfortable', 'spacious'].includes(layout.density as string)
                ? (layout.density as Density)
                : 'comfortable',
            cardPadding: clamp(layout.cardPadding, 8, 40, DEFAULT_THEME.layout.cardPadding),
            sectionSpacing: clamp(layout.sectionSpacing, 8, 64, DEFAULT_THEME.layout.sectionSpacing),
            navSpacing: clamp(layout.navSpacing, 0, 24, DEFAULT_THEME.layout.navSpacing),
            tableRowHeight: clamp(layout.tableRowHeight, 28, 72, DEFAULT_THEME.layout.tableRowHeight),
            buttonHeight: clamp(layout.buttonHeight, 28, 64, DEFAULT_THEME.layout.buttonHeight),
            inputHeight: clamp(layout.inputHeight, 28, 64, DEFAULT_THEME.layout.inputHeight),
            contentMaxWidth: clamp(layout.contentMaxWidth, 800, 2200, DEFAULT_THEME.layout.contentMaxWidth),
        },
        sidebar: {
            width: clamp(sidebarObj.width, 180, 360, DEFAULT_THEME.sidebar.width),
            collapsedWidth: clamp(sidebarObj.collapsedWidth, 48, 120, DEFAULT_THEME.sidebar.collapsedWidth),
            position: ['left', 'floating-left'].includes(sidebarObj.position as string)
                ? (sidebarObj.position as ThemeSidebar['position'])
                : 'left',
            mode: ['default', 'compact', 'large', 'icon-only'].includes(sidebarObj.mode as string)
                ? (sidebarObj.mode as SidebarNavMode)
                : 'default',
            transparency: clamp(sidebarObj.transparency, 0, 100, 68),
            blur: clamp(sidebarObj.blur, 0, 60, 18),
            background: str(sidebarObj.background, ''),
            border: bool(sidebarObj.border, true),
            radius: clamp(sidebarObj.radius, 0, 32, 0),
            shadow: clamp(sidebarObj.shadow, 0, 100, 0),
            active: {
                background: str(sidebarActive.background, ''),
                accent: bool(sidebarActive.accent, true),
                border: bool(sidebarActive.border, false),
                glow: bool(sidebarActive.glow, true),
                text: str(sidebarActive.text, ''),
                icon: str(sidebarActive.icon, ''),
            },
        },
        navbar: {
            height: clamp(navbar.height, 40, 96, DEFAULT_THEME.navbar.height),
            mode: ['solid', 'glass', 'floating', 'minimal'].includes(navbar.mode as string)
                ? (navbar.mode as NavbarMode)
                : 'glass',
            transparency: clamp(navbar.transparency, 0, 100, 82),
            blur: clamp(navbar.blur, 0, 60, 18),
            background: str(navbar.background, ''),
            border: bool(navbar.border, true),
            shadow: clamp(navbar.shadow, 0, 100, 0),
            position: ['sticky', 'fixed', 'static'].includes(navbar.position as string)
                ? (navbar.position as NavbarPosition)
                : 'sticky',
        },
        cards: {
            style: ['flat', 'glass', 'elevated', 'floating', 'minimal'].includes(cards.style as string)
                ? (cards.style as CardStyle)
                : 'glass',
            background: str(cards.background, ''),
            opacity: clamp(cards.opacity, 0, 100, 85),
            blur: clamp(cards.blur, 0, 60, 16),
            border: bool(cards.border, true),
            radius: clamp(cards.radius, 0, 32, 12),
            shadow: clamp(cards.shadow, 0, 100, 20),
            padding: clamp(cards.padding, 8, 40, 20),
            hoverEffect: ['none', 'lift', 'glow', 'scale'].includes(cards.hoverEffect as string)
                ? (cards.hoverEffect as ThemeCards['hoverEffect'])
                : 'lift',
        },
        buttons: {
            radius: clamp(buttonsObj.radius, 0, 32, 8),
            height: clamp(buttonsObj.height, 28, 64, 38),
            paddingX: clamp(buttonsObj.paddingX, 6, 40, 16),
            fontWeight: clamp(buttonsObj.fontWeight, 400, 900, 600),
            border: bool(buttonsObj.border, true),
            shadow: clamp(buttonsObj.shadow, 0, 100, 0),
            variants: {
                primary: { ...DEFAULT_THEME.buttons.variants.primary, ...(variants.primary || {}) },
                secondary: { ...DEFAULT_THEME.buttons.variants.secondary, ...(variants.secondary || {}) },
                ghost: { ...DEFAULT_THEME.buttons.variants.ghost, ...(variants.ghost || {}) },
                outline: { ...DEFAULT_THEME.buttons.variants.outline, ...(variants.outline || {}) },
                danger: { ...DEFAULT_THEME.buttons.variants.danger, ...(variants.danger || {}) },
                success: { ...DEFAULT_THEME.buttons.variants.success, ...(variants.success || {}) },
            },
            hover: bool(buttonsObj.hover, true),
            active: bool(buttonsObj.active, true),
            disabledOpacity: clamp(buttonsObj.disabledOpacity, 10, 100, 45),
        },
        inputs: {
            radius: clamp(inputs.radius, 0, 32, 8),
            height: clamp(inputs.height, 28, 64, 40),
            paddingX: clamp(inputs.paddingX, 6, 40, 14),
            background: str(inputs.background, ''),
            border: str(inputs.border, ''),
            focusRing: clamp(inputs.focusRing, 0, 100, 45),
        },
        radius: {
            preset: ['sharp', 'compact', 'soft', 'rounded', 'pill'].includes(radiusObj.preset as string)
                ? (radiusObj.preset as RadiusPreset)
                : 'soft',
            value: clamp(radiusObj.value, 0, 32, 12),
            components: {
                cards:
                    radiusComponents.cards === null || typeof radiusComponents.cards === 'number'
                        ? radiusComponents.cards
                        : null,
                buttons:
                    radiusComponents.buttons === null || typeof radiusComponents.buttons === 'number'
                        ? radiusComponents.buttons
                        : null,
                inputs:
                    radiusComponents.inputs === null || typeof radiusComponents.inputs === 'number'
                        ? radiusComponents.inputs
                        : null,
                modals:
                    radiusComponents.modals === null || typeof radiusComponents.modals === 'number'
                        ? radiusComponents.modals
                        : null,
                sidebar:
                    radiusComponents.sidebar === null || typeof radiusComponents.sidebar === 'number'
                        ? radiusComponents.sidebar
                        : null,
                dropdowns:
                    radiusComponents.dropdowns === null || typeof radiusComponents.dropdowns === 'number'
                        ? radiusComponents.dropdowns
                        : null,
                badges:
                    radiusComponents.badges === null || typeof radiusComponents.badges === 'number'
                        ? radiusComponents.badges
                        : null,
            },
        },
        shadows: {
            preset: ['none', 'subtle', 'soft', 'medium', 'deep', 'floating'].includes(shadowsObj.preset as string)
                ? (shadowsObj.preset as ShadowPreset)
                : 'soft',
            intensity: clamp(shadowsObj.intensity, 0, 100, 100),
            blur: clamp(shadowsObj.blur, 0, 120, 24),
            spread: clamp(shadowsObj.spread, -40, 60, 0),
            opacity: clamp(shadowsObj.opacity, 0, 100, 35),
            cards: shadowsObj.cards === null || typeof shadowsObj.cards === 'number' ? shadowsObj.cards : null,
            modals: shadowsObj.modals === null || typeof shadowsObj.modals === 'number' ? shadowsObj.modals : null,
            dropdowns:
                shadowsObj.dropdowns === null || typeof shadowsObj.dropdowns === 'number' ? shadowsObj.dropdowns : null,
            sidebar: shadowsObj.sidebar === null || typeof shadowsObj.sidebar === 'number' ? shadowsObj.sidebar : null,
        },
        effects: {
            glow: {
                enabled: bool((effectsObj.glow as Record<string, unknown> | undefined)?.enabled, true),
                intensity: clamp((effectsObj.glow as Record<string, unknown> | undefined)?.intensity, 0, 100, 45),
            },
            noise: {
                enabled: bool((effectsObj.noise as Record<string, unknown> | undefined)?.enabled, false),
                intensity: clamp((effectsObj.noise as Record<string, unknown> | undefined)?.intensity, 0, 100, 4),
            },
            gradient: {
                enabled: bool((effectsObj.gradient as Record<string, unknown> | undefined)?.enabled, true),
                intensity: clamp((effectsObj.gradient as Record<string, unknown> | undefined)?.intensity, 0, 100, 55),
            },
            aurora: {
                enabled: bool((effectsObj.aurora as Record<string, unknown> | undefined)?.enabled, false),
                intensity: clamp((effectsObj.aurora as Record<string, unknown> | undefined)?.intensity, 0, 100, 30),
                speed: clamp((effectsObj.aurora as Record<string, unknown> | undefined)?.speed, 0.2, 4, 1),
            },
            particles: {
                enabled: bool((effectsObj.particles as Record<string, unknown> | undefined)?.enabled, false),
                density: clamp((effectsObj.particles as Record<string, unknown> | undefined)?.density, 0, 100, 20),
                speed: clamp((effectsObj.particles as Record<string, unknown> | undefined)?.speed, 0.2, 4, 1),
            },
            vignette: {
                enabled: bool((effectsObj.vignette as Record<string, unknown> | undefined)?.enabled, true),
                intensity: clamp((effectsObj.vignette as Record<string, unknown> | undefined)?.intensity, 0, 100, 18),
            },
            depth: { enabled: bool((effectsObj.depth as Record<string, unknown> | undefined)?.enabled, true) },
            hoverElevation: {
                enabled: bool((effectsObj.hoverElevation as Record<string, unknown> | undefined)?.enabled, true),
                distance: clamp((effectsObj.hoverElevation as Record<string, unknown> | undefined)?.distance, 0, 32, 4),
            },
            pageTransitions: {
                enabled: bool((effectsObj.pageTransitions as Record<string, unknown> | undefined)?.enabled, true),
            },
            performanceMode: bool(effectsObj.performanceMode, false),
        },
        animations: {
            intensity: ['off', 'subtle', 'normal', 'expressive'].includes(animationsObj.intensity as string)
                ? (animationsObj.intensity as AnimationIntensity)
                : 'normal',
            duration: ['fast', 'normal', 'slow'].includes(animationsObj.duration as string)
                ? (animationsObj.duration as AnimationDuration)
                : 'normal',
            page: bool(animationsObj.page, true),
            modal: bool(animationsObj.modal, true),
            dropdown: bool(animationsObj.dropdown, true),
            hover: bool(animationsObj.hover, true),
            sidebar: bool(animationsObj.sidebar, true),
            buttons: bool(animationsObj.buttons, true),
        },
        cursor: {
            mode: ['default', 'minimal', 'dot', 'ring'].includes(cursorObj.mode as string)
                ? (cursorObj.mode as CursorMode)
                : 'default',
            size: clamp(cursorObj.size, 8, 48, 22),
            opacity: clamp(cursorObj.opacity, 0, 100, 55),
            color: str(cursorObj.color, '#5a61e3'),
        },
        branding: {
            panelName: str(branding.panelName, DEFAULT_THEME.branding.panelName),
            panelDescription: str(branding.panelDescription, DEFAULT_THEME.branding.panelDescription),
            favicon: branding.favicon === null || typeof branding.favicon === 'string' ? branding.favicon : null,
            loginLogo:
                branding.loginLogo === null || typeof branding.loginLogo === 'string' ? branding.loginLogo : null,
            sidebarLogo:
                branding.sidebarLogo === null || typeof branding.sidebarLogo === 'string' ? branding.sidebarLogo : null,
            loadingLogo:
                branding.loadingLogo === null || typeof branding.loadingLogo === 'string' ? branding.loadingLogo : null,
            logoLight:
                branding.logoLight === null || typeof branding.logoLight === 'string' ? branding.logoLight : null,
            logoDark: branding.logoDark === null || typeof branding.logoDark === 'string' ? branding.logoDark : null,
            browserTitle: str(branding.browserTitle, DEFAULT_THEME.branding.browserTitle),
            loginTitle: str(branding.loginTitle, DEFAULT_THEME.branding.loginTitle),
            footerText: str(branding.footerText, DEFAULT_THEME.branding.footerText),
        },
        login: {
            headline: str(loginObj.headline, DEFAULT_THEME.login.headline),
            description: str(loginObj.description, DEFAULT_THEME.login.description),
            cardStyle: ['flat', 'glass', 'elevated', 'minimal'].includes(loginObj.cardStyle as string)
                ? (loginObj.cardStyle as LoginCardStyle)
                : 'glass',
            glass: clamp(loginObj.glass, 0, 100, 55),
            buttonStyle: ['solid', 'outline', 'ghost'].includes(loginObj.buttonStyle as string)
                ? (loginObj.buttonStyle as LoginButtonStyle)
                : 'solid',
            accent: loginObj.accent === null || typeof loginObj.accent === 'string' ? loginObj.accent : null,
            overlay: str(loginObj.overlay, '#000000'),
            overlayOpacity: clamp(loginObj.overlayOpacity, 0, 100, 35),
            blur: clamp(loginObj.blur, 0, 60, 0),
            useGlobalBackground: bool(loginObj.useGlobalBackground, true),
            backgroundImage:
                loginObj.backgroundImage === null || typeof loginObj.backgroundImage === 'string'
                    ? loginObj.backgroundImage
                    : null,
            backgroundVideo:
                loginObj.backgroundVideo === null || typeof loginObj.backgroundVideo === 'string'
                    ? loginObj.backgroundVideo
                    : null,
        },
        advanced: {
            customCss: str((advanced as Record<string, unknown>).customCss, ''),
            cssVariables:
                typeof (advanced as Record<string, unknown>).cssVariables === 'object' &&
                (advanced as Record<string, unknown>).cssVariables !== null
                    ? ((advanced as Record<string, unknown>).cssVariables as Record<string, string>)
                    : {},
        },
        scopes: {
            login: bool(scopes.login, true),
            dashboard: bool(scopes.dashboard, true),
            server: bool(scopes.server, true),
            admin: bool(scopes.admin, true),
        },
    };
}

export type ThemeSection =
    | 'appearance'
    | 'background'
    | 'glass'
    | 'colors'
    | 'typography'
    | 'layout'
    | 'sidebar'
    | 'navbar'
    | 'cards'
    | 'buttons'
    | 'inputs'
    | 'radius'
    | 'shadows'
    | 'effects'
    | 'animations'
    | 'cursor'
    | 'branding'
    | 'login'
    | 'advanced';

/**
 * Deep-clones a theme config so downstream mutation never touches the source.
 */
export function cloneTheme(theme: ThemeConfig): ThemeConfig {
    return sanitizeTheme(JSON.parse(JSON.stringify(theme)));
}
