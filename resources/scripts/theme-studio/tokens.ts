import { ThemeConfig } from '@/theme-studio/config';
import {
    buildAccentRamp,
    colorToTriplet,
    mixColors,
    parseColor,
    readableOn,
    rgbToRgbCss,
    scaleLightness,
    shiftLightness,
    toRgba,
} from '@/theme-studio/palette';

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const NEUTRAL_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;
type NeutralStep = typeof NEUTRAL_STEPS[number];

interface NeutralAnchors {
    text: string;
    textMuted: string;
    surfaceElevated: string;
    surface: string;
    background: string;
}

/**
 * Builds the full 10-step neutral scale (`--pg-n-*`) for one palette. Dark mode
 * uses the historical "inverted" scale (higher steps = surfaces); light mode
 * flips it so lower steps are text.
 */
function buildNeutralScale(palette: NeutralAnchors, mode: 'dark' | 'light'): Record<NeutralStep, string> {
    const steps: Record<NeutralStep, string> = {} as Record<NeutralStep, string>;

    if (mode === 'dark') {
        steps['100'] = palette.text;
        steps['400'] = palette.textMuted;
        steps['600'] = palette.surfaceElevated;
        steps['700'] = palette.surface;
        steps['800'] = palette.background;
        steps['900'] = scaleLightness(palette.background, 0.55);
        steps['50'] = shiftLightness(palette.text, 0.06);
        steps['200'] = mixColors(palette.text, palette.textMuted, 0.33);
        steps['300'] = mixColors(palette.text, palette.textMuted, 0.66);
        steps['500'] = mixColors(palette.textMuted, palette.surfaceElevated, 0.5);
    } else {
        steps['50'] = palette.text;
        steps['300'] = palette.textMuted;
        steps['500'] = mixColors(palette.textMuted, palette.surfaceElevated, 0.55);
        steps['600'] = palette.surfaceElevated;
        steps['700'] = palette.surface;
        steps['800'] = palette.background;
        steps['900'] = shiftLightness(palette.background, -0.02);
        steps['100'] = mixColors(palette.text, palette.textMuted, 0.35);
        steps['200'] = mixColors(palette.text, palette.textMuted, 0.6);
        steps['400'] = mixColors(palette.textMuted, palette.surfaceElevated, 0.4);
    }

    return steps;
}

const triplet = (color: string, fallback: string): string => {
    const parsed = parseColor(color);
    return parsed ? rgbToRgbCss(parsed) : fallback;
};

const alpha = (opacity: number): number => clamp(opacity, 0, 100) / 100;

const SCALE_MULTIPLIER: Record<ThemeConfig['typography']['scale'], number> = {
    tiny: 0.86,
    small: 0.93,
    default: 1,
    large: 1.08,
    huge: 1.16,
};

const DENSITY_MULTIPLIER: Record<ThemeConfig['layout']['density'], number> = {
    compact: 0.88,
    comfortable: 1,
    spacious: 1.14,
};

const MOTION_MULTIPLIER: Record<ThemeConfig['animations']['intensity'], number> = {
    off: 0,
    subtle: 0.5,
    normal: 1,
    expressive: 1.5,
};

const DURATION_SCALE: Record<ThemeConfig['animations']['duration'], number> = {
    fast: 0.7,
    normal: 1,
    slow: 1.6,
};

const RADIUS_MULTIPLIER: Record<ThemeConfig['radius']['preset'], number> = {
    sharp: 0,
    compact: 0.6,
    soft: 1,
    rounded: 1.5,
    pill: 3,
};

const SHADOW_PRESETS: Record<ThemeConfig['shadows']['preset'], { blur: number; opacity: number; spread: number }> = {
    none: { blur: 0, opacity: 0, spread: 0 },
    subtle: { blur: 10, opacity: 0.18, spread: 0 },
    soft: { blur: 24, opacity: 0.35, spread: 0 },
    medium: { blur: 34, opacity: 0.45, spread: 0 },
    deep: { blur: 50, opacity: 0.55, spread: 2 },
    floating: { blur: 64, opacity: 0.62, spread: 4 },
};

const fontStack = (family: string, fallback: string): string => {
    switch (family) {
        case 'System UI':
            return 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        default:
            return `'${family}', ${fallback}`;
    }
};

function compileBackgroundCss(theme: ThemeConfig, variables: Record<string, string>): string {
    const background = theme.background;
    const fallback = variables['--pg-canvas'] || theme.colors.dark.background;
    const brightness = background.brightness / 100;
    const contrast = background.contrast / 100;
    const saturation = background.saturation / 100;
    const filter = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturation.toFixed(
        2
    )})`;
    const opacity = alpha(background.opacity);

    const imageCss = (): string => {
        if (background.image.data) {
            const pos = background.image.position || 'center';
            const size = background.image.size || 'cover';
            const repeat = background.image.repeat || 'no-repeat';
            return `background-image: url('${background.image.data}'); background-position: ${pos}; background-size: ${size}; background-repeat: ${repeat};`;
        }
        return '';
    };

    let bodyBackground = `background-color: ${fallback};`;
    let animated = false;

    switch (background.type) {
        case 'gradient':
            bodyBackground = `background-image: linear-gradient(${background.angle}deg, ${background.color}, ${background.secondaryColor});`;
            if (theme.effects.gradient.enabled) {
                animated = true;
                bodyBackground = `background-image: linear-gradient(${background.angle}deg, ${background.color}, ${
                    background.secondaryColor
                }, ${background.tertiaryColor || background.color}); background-size: 220% 220%;`;
            }
            break;
        case 'mesh': {
            bodyBackground = `background-color: ${background.color}; background-image:
                radial-gradient(at 18% 18%, ${toRgba(background.color, 0.9)} 0%, transparent 55%),
                radial-gradient(at 82% 24%, ${toRgba(background.secondaryColor, 0.8)} 0%, transparent 50%),
                radial-gradient(at 55% 80%, ${toRgba(
                    background.tertiaryColor || background.secondaryColor,
                    0.8
                )} 0%, transparent 55%);`;
            break;
        }
        case 'image':
            bodyBackground = `background-color: ${background.color || fallback}; ${imageCss()}`;
            break;
        case 'video':
            bodyBackground = `background-color: ${
                background.video.fallbackImage || background.color || fallback
            }; background-size: cover; background-position: center;`;
            break;
        case 'animated':
            animated = true;
            bodyBackground = `background-image: linear-gradient(120deg, ${background.color}, ${
                background.secondaryColor
            }, ${background.tertiaryColor || background.color}); background-size: 240% 240%;`;
            break;
        case 'aurora':
            animated = true;
            bodyBackground = `background-image:
                radial-gradient(50% 50% at 20% 30%, ${toRgba(background.color, 0.7)} 0%, transparent 60%),
                radial-gradient(50% 50% at 80% 20%, ${toRgba(background.secondaryColor, 0.7)} 0%, transparent 60%),
                radial-gradient(60% 60% at 60% 85%, ${toRgba(
                    background.tertiaryColor || background.color,
                    0.7
                )} 0%, transparent 65%);
                background-color: ${background.color};`;
            break;
        case 'noise':
            bodyBackground = `background-color: ${
                background.color || fallback
            }; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${(
                background.intensity / 200
            ).toFixed(2)}'/%3E%3C/svg%3E");`;
            break;
        case 'custom':
            break;
        default:
            bodyBackground = `background-color: ${background.color || fallback};`;
    }

    const filterCss = brightness !== 1 || contrast !== 1 || saturation !== 1 ? `filter: ${filter};` : '';
    const opacityCss = opacity < 1 ? `opacity: ${opacity.toFixed(2)};` : '';

    if (animated) {
        bodyBackground += ` animation: pg-bg-gradient-shift ${Math.max(
            6,
            background.animatedSpeed
        )}s ease-in-out infinite;`;
    }
    if (background.type === 'aurora') {
        bodyBackground = bodyBackground.replace('animation:', 'animation: pg-bg-aurora 22s ease-in-out infinite,');
    }

    return `body { ${bodyBackground} ${filterCss} ${opacityCss} background-attachment: fixed; }`;
}

/**
 * Compiles a ThemeConfig into the CSS custom-property overrides that power the
 * whole interface. Returns a `{ variables, css }` pair — `variables` is the flat
 * token map suitable for inline application, `css` is a full stylesheet block
 * (backgrounds, fonts, keyframes, cursor, reduced-motion guards) that the
 * provider injects into the document.
 */
export function compileTheme(theme: ThemeConfig): { variables: Record<string, string>; css: string } {
    const variables: Record<string, string> = {};
    const css: string[] = [];

    const ramp = buildAccentRamp(theme.colors.accent);

    // Override the accent ramp stops driven by the state colors.
    const states = theme.colors.states;
    ramp.shades['400'] = states.focus || ramp.shades['400'];
    ramp.shades['700'] = states.hover || ramp.shades['700'];
    ramp.shades['800'] = states.active || ramp.shades['800'];

    Object.entries(ramp.shades).forEach(([shade, color]) => {
        variables[`--pg-accent-${shade}`] = color;
    });
    variables['--pg-accent'] = ramp.base500;
    variables['--pg-accent-strong'] = ramp.base;
    variables['--pg-accent-text'] = readableOn(ramp.base500);

    variables['--pg-primary'] = theme.colors.primary;
    variables['--pg-secondary'] = theme.colors.secondary;
    variables['--pg-success'] = theme.colors.success;
    variables['--pg-danger'] = theme.colors.danger;
    variables['--pg-warning'] = theme.colors.warning;
    variables['--pg-info'] = theme.colors.info;

    const emitPalette = (mode: 'dark' | 'light') => {
        const palette = mode === 'dark' ? theme.colors.dark : theme.colors.light;
        const anchors: NeutralAnchors = {
            text: palette.text,
            textMuted: palette.textMuted,
            surfaceElevated: palette.surfaceElevated,
            surface: palette.surface,
            background: palette.background,
        };
        const scale = buildNeutralScale(anchors, mode);
        const block: string[] = [];
        NEUTRAL_STEPS.forEach((step) => {
            block.push(`--pg-n-${step}: ${triplet(scale[step], '0 0 0')};`);
        });

        block.push(`--pg-n-${mode === 'dark' ? '800' : '900'}: ${colorToTriplet(palette.background)};`);
        block.push(`--pg-n-${mode === 'dark' ? '700' : '700'}: ${colorToTriplet(palette.surface)};`);
        block.push(`--pg-n-${mode === 'dark' ? '600' : '600'}: ${colorToTriplet(palette.surfaceElevated)};`);
        block.push(`--pg-n-${mode === 'dark' ? '100' : '50'}: ${colorToTriplet(palette.text)};`);
        block.push(`--pg-n-${mode === 'dark' ? '400' : '300'}: ${colorToTriplet(palette.textMuted)};`);

        block.push(`--pg-black: 9 9 12;`);
        block.push(`--pg-white: 255 255 255;`);

        // Semantic tokens derived from the palette.
        const surface = palette.surface;
        const surfaceElevated = palette.surfaceElevated;
        const background = palette.background;
        const text = palette.text;
        const textMuted = palette.textMuted;

        block.push(`--pg-canvas: ${background};`);
        block.push(`--pg-surface: ${surface};`);
        block.push(`--pg-surface-2: ${surfaceElevated};`);
        block.push(`--pg-elevated: ${surfaceElevated};`);
        block.push(`--pg-text: ${text};`);
        block.push(`--pg-text-muted: ${textMuted};`);
        block.push(`--pg-text-faint: ${mixColors(text, background, 0.55)};`);
        block.push(`--pg-border: ${toRgba(surfaceElevated, 0.85)};`);
        block.push(`--pg-border-strong: ${toRgba(mixColors(textMuted, surfaceElevated, 0.4), 0.5)};`);
        block.push(`--pg-divider: ${toRgba(surfaceElevated, 0.85)};`);
        block.push(`--pg-hover-bg: ${toRgba(surfaceElevated, 0.5)};`);
        block.push(`--pg-active-bg: ${toRgba(ramp.base500, 0.16)};`);
        block.push(`--pg-modal-bg: ${toRgba(surface, 0.94)};`);
        block.push(`--pg-focus-ring: ${toRgba(ramp.shades['400'], 0.45)};`);
        block.push(`--pg-ok: ${theme.colors.success};`);
        block.push(`--pg-warn: ${theme.colors.warning};`);
        block.push(`--pg-muted: ${textMuted};`);
        block.push(`--pg-text-secondary: ${textMuted};`);
        block.push(`--pg-elevated-bg: ${surfaceElevated};`);

        const selector = mode === 'dark' ? `:root, [data-theme='dark']` : `[data-theme='light']`;
        css.push(`${selector} { color-scheme: ${mode}; ${block.join(' ')} }`);
    };

    emitPalette('dark');
    emitPalette('light');

    // ---------------------------------------------------------------- fonts
    const typography = theme.typography;
    variables['--pg-font-ui'] = fontStack(typography.ui.family, 'system-ui, -apple-system, sans-serif');
    variables['--pg-font-heading'] = fontStack(typography.heading.family, 'system-ui, -apple-system, sans-serif');
    variables['--pg-font-mono'] = fontStack(typography.mono.family, 'ui-monospace, "JetBrains Mono", monospace');
    variables['--pg-font-size'] = `${typography.ui.baseSize}px`;
    variables['--pg-line-height'] = String(typography.ui.lineHeight);
    variables['--pg-letter-spacing'] = `${typography.ui.letterSpacing}em`;
    variables['--pg-ui-weight'] = String(typography.ui.weight);
    variables['--pg-heading-weight'] = String(typography.heading.weight);
    variables['--pg-heading-scale'] = String(typography.heading.scale);
    variables['--pg-font-scale'] = String(SCALE_MULTIPLIER[typography.scale]);
    variables['--pg-mono-weight'] = String(typography.mono.weight);

    // ---------------------------------------------------------------- layout
    const layout = theme.layout;
    variables['--pg-density'] = String(DENSITY_MULTIPLIER[layout.density]);
    variables['--pg-sidebar-width'] = `${theme.sidebar.width}px`;
    variables['--pg-sidebar-collapsed-width'] = `${theme.sidebar.collapsedWidth}px`;
    variables['--pg-topbar-height'] = `${theme.navbar.height}px`;
    variables['--pg-content-gutter'] = '24px';
    variables['--pg-content-max-width'] = `${layout.contentMaxWidth}px`;
    variables['--pg-card-padding'] = `${layout.cardPadding}px`;
    variables['--pg-section-spacing'] = `${layout.sectionSpacing}px`;
    variables['--pg-nav-spacing'] = `${layout.navSpacing}px`;
    variables['--pg-table-row-height'] = `${layout.tableRowHeight}px`;
    variables['--pg-button-height'] = `${layout.buttonHeight}px`;
    variables['--pg-input-height'] = `${layout.inputHeight}px`;

    // ---------------------------------------------------------------- glass
    const glass = theme.glass;
    variables['--pg-glass-opacity'] = String(alpha(glass.transparency));
    variables['--pg-blur'] = `${glass.blur}px`;
    variables['--pg-glass-border-opacity'] = String(alpha(glass.borderOpacity));
    variables['--pg-glass-bg'] = `rgb(var(--pg-n-700) / ${alpha(glass.transparency)})`;
    variables['--pg-glass-border'] = 'var(--pg-border)';
    variables['--pg-glass-border-strong'] = 'var(--pg-border-strong)';

    const surfaceKeys = [
        'background',
        'sidebar',
        'navbar',
        'cards',
        'modals',
        'dropdowns',
        'inputs',
        'tables',
    ] as const;
    surfaceKeys.forEach((key) => {
        const surface = glass.surfaces[key];
        if (!surface) return;
        variables[`--pg-glass-${key}-opacity`] = String(alpha(surface.transparency));
        variables[`--pg-glass-${key}-blur`] = `${surface.blur}px`;
        variables[`--pg-glass-${key}-border`] = String(alpha(surface.border));
        variables[`--pg-glass-${key}-shadow`] = String(alpha(surface.shadow));
    });

    // ---------------------------------------------------------------- radius
    const radius = theme.radius;
    const radiusMult = RADIUS_MULTIPLIER[radius.preset];
    const pillMode = radius.preset === 'pill';
    const baseRadius = clamp(radius.value * radiusMult, 0, 40);
    variables['--pg-radius'] = `${clamp(baseRadius, 0, 32)}px`;
    variables['--pg-radius-sm'] = `${clamp(baseRadius * 0.72, 0, 18)}px`;
    variables['--pg-radius-lg'] = `${clamp(baseRadius * 1.5, 0, 40)}px`;
    variables['--pg-radius-full'] = '9999px';
    variables['--pg-radius-card'] = `${radius.components.cards ?? clamp(radius.value, 0, 32)}px`;
    variables['--pg-radius-button'] = `${
        pillMode && radius.components.buttons === null
            ? 9999
            : radius.components.buttons ?? clamp(radius.value * 0.8, 0, 32)
    }px`;
    variables['--pg-radius-input'] = `${
        pillMode && radius.components.inputs === null
            ? 9999
            : radius.components.inputs ?? clamp(radius.value * 0.8, 0, 32)
    }px`;
    variables['--pg-radius-modal'] = `${radius.components.modals ?? clamp(radius.value * 1.4, 0, 40)}px`;
    variables['--pg-radius-sidebar'] = `${radius.components.sidebar ?? clamp(radius.value * 0.9, 0, 32)}px`;
    variables['--pg-radius-dropdown'] = `${
        pillMode && radius.components.dropdowns === null
            ? 9999
            : radius.components.dropdowns ?? clamp(radius.value * 0.8, 0, 32)
    }px`;
    variables['--pg-radius-badge'] = `${radius.components.badges ?? 9999}px`;

    // ---------------------------------------------------------------- shadows
    const shadows = theme.shadows;
    const shadowBase = SHADOW_PRESETS[shadows.preset];
    const shadowEnabled = shadows.preset !== 'none' && shadows.intensity > 0;
    const shadowBlur =
        shadows.preset === 'none'
            ? 0
            : Math.max(2, (shadowBase.blur * shadows.blur) / 24) * (shadows.intensity / 100 + 0.4);
    const shadowOpacity = clamp(
        ((shadowBase.opacity * shadows.opacity) / 100) * (shadows.intensity / 100 + 0.4),
        0,
        0.9
    );
    const shadowSpread = (shadowBase.spread * shadows.spread) / 40;
    const shadowCss = (extraBlur: number): string =>
        shadowEnabled
            ? `0 ${Math.max(2, shadowBlur * 0.35 + extraBlur)}px ${Math.max(
                  4,
                  shadowBlur * (1 + extraBlur)
              )}px ${Math.max(0, shadowSpread)}px rgb(0 0 0 / ${shadowOpacity.toFixed(3)})`
            : 'none';

    variables['--pg-shadow-sm'] = shadowCss(0);
    variables['--pg-shadow'] = shadowCss(4);
    variables['--pg-shadow-lg'] = shadowCss(12);

    // ---------------------------------------------------------------- cards/buttons/inputs
    const cards = theme.cards;
    variables['--pg-card-style'] = cards.style;
    variables['--pg-card-bg'] = cards.background || 'var(--pg-surface-2)';
    variables['--pg-card-opacity'] = String(alpha(cards.opacity));
    variables['--pg-card-blur'] = `${cards.blur}px`;
    variables['--pg-card-border'] = cards.border ? 'var(--pg-border)' : 'transparent';
    variables['--pg-card-radius'] = `${cards.radius}px`;
    variables['--pg-card-shadow'] = shadowEnabled ? shadowCss(4) : 'none';
    variables['--pg-card-hover-effect'] = cards.hoverEffect;

    const buttons = theme.buttons;
    variables['--pg-button-height'] = `${buttons.height}px`;
    variables['--pg-button-radius'] = `${buttons.radius}px`;
    variables['--pg-button-padding-x'] = `${buttons.paddingX}px`;
    variables['--pg-button-font-weight'] = String(buttons.fontWeight);
    variables['--pg-button-border'] = buttons.border ? 'var(--pg-border)' : 'transparent';
    variables['--pg-button-shadow'] = buttons.shadow > 0 ? shadowCss(2) : 'none';
    variables['--pg-button-disabled-opacity'] = String(alpha(buttons.disabledOpacity));

    const inputs = theme.inputs;
    variables['--pg-input-height'] = `${inputs.height}px`;
    variables['--pg-input-radius'] = `${inputs.radius}px`;
    variables['--pg-input-padding-x'] = `${inputs.paddingX}px`;
    variables['--pg-input-bg'] = inputs.background || 'rgb(var(--pg-n-600) / 0.6)';
    variables['--pg-input-border'] = inputs.border || 'var(--pg-border)';
    variables['--pg-input-focus-ring'] = String(alpha(inputs.focusRing));

    // ---------------------------------------------------------------- effects
    const effects = theme.effects;
    variables['--pg-effect-glow'] = effects.glow.enabled ? String(effects.glow.intensity / 100) : '0';
    variables['--pg-effect-noise'] = effects.noise.enabled ? String(effects.noise.intensity / 100) : '0';
    variables['--pg-effect-gradient'] = effects.gradient.enabled ? String(effects.gradient.intensity / 100) : '0';
    variables['--pg-effect-aurora'] = effects.aurora.enabled ? String(effects.aurora.intensity / 100) : '0';
    variables['--pg-effect-aurora-speed'] = String(effects.aurora.speed);
    variables['--pg-effect-particles'] = effects.particles.enabled ? String(effects.particles.density / 100) : '0';
    variables['--pg-effect-particles-speed'] = String(effects.particles.speed);
    variables['--pg-effect-vignette'] = effects.vignette.enabled ? String(effects.vignette.intensity / 100) : '0';
    variables['--pg-effect-depth'] = effects.depth.enabled ? '1' : '0';
    variables['--pg-hover-lift'] = effects.hoverElevation.enabled ? `${effects.hoverElevation.distance}px` : '0';
    variables['--pg-transitions'] = effects.pageTransitions.enabled ? '1' : '0';
    variables['--pg-performance'] = effects.performanceMode ? '1' : '0';

    // ---------------------------------------------------------------- animations
    const animations = theme.animations;
    const motion = MOTION_MULTIPLIER[animations.intensity];
    variables['--pg-motion'] = String(motion);
    const durationScale = DURATION_SCALE[animations.duration];
    variables['--pg-duration-fast'] = `${Math.round(150 * durationScale)}ms`;
    variables['--pg-duration'] = `${Math.round(220 * durationScale)}ms`;
    variables['--pg-duration-slow'] = `${Math.round(320 * durationScale)}ms`;
    variables['--pg-anim-page'] = animations.page ? '1' : '0';
    variables['--pg-anim-modal'] = animations.modal ? '1' : '0';
    variables['--pg-anim-dropdown'] = animations.dropdown ? '1' : '0';
    variables['--pg-anim-hover'] = animations.hover ? '1' : '0';
    variables['--pg-anim-sidebar'] = animations.sidebar ? '1' : '0';
    variables['--pg-anim-buttons'] = animations.buttons ? '1' : '0';

    // ---------------------------------------------------------------- cursor
    const cursor = theme.cursor;
    variables['--pg-cursor-mode'] = cursor.mode;
    variables['--pg-cursor-size'] = `${cursor.size}px`;
    variables['--pg-cursor-opacity'] = String(alpha(cursor.opacity));
    variables['--pg-cursor-color'] = cursor.color;

    // ---------------------------------------------------------------- background css
    css.push(compileBackgroundCss(theme, variables));

    // ---------------------------------------------------------------- base rules
    css.push(`
        :root {
            font-size: calc(${typography.ui.baseSize}px * var(--pg-font-scale));
            --pg-space: 4px;
            --pg-ease: cubic-bezier(0.2, 0, 0, 1);
        }
        body {
            font-family: var(--pg-font-ui);
            font-size: var(--pg-font-size);
            line-height: var(--pg-line-height);
            letter-spacing: var(--pg-letter-spacing);
            font-weight: var(--pg-ui-weight);
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: var(--pg-font-heading);
            font-weight: var(--pg-heading-weight);
        }
        code, pre, kbd, samp {
            font-family: var(--pg-font-mono);
        }
        button {
            font-family: inherit;
        }
    `);

    // ---------------------------------------------------------------- cursor styles
    if (cursor.mode === 'dot' || cursor.mode === 'ring') {
        const size = cursor.size;
        const isRing = cursor.mode === 'ring';
        css.push(`
            @media (pointer: fine) {
                html.pg-cursor-active, html.pg-cursor-active * { cursor: none !important; }
                body::after {
                    content: '';
                    position: fixed;
                    z-index: 2147483000;
                    top: 0;
                    left: 0;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    border: ${isRing ? '1.5px' : '0'} solid ${toRgba(cursor.color, 0.85)};
                    background: ${isRing ? 'transparent' : toRgba(cursor.color, alpha(cursor.opacity))};
                    box-shadow: 0 0 12px ${toRgba(cursor.color, 0.35)};
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: transform 0.12s var(--pg-ease);
                    mix-blend-mode: difference;
                }
            }
        `);
    }

    // ---------------------------------------------------------------- effects css
    if (effects.vignette.enabled && effects.vignette.intensity > 0) {
        css.push(`
            body::before {
                content: '';
                position: fixed;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                background: radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / ${alpha(
                    effects.vignette.intensity
                )}) 100%);
            }
        `);
    }

    if (effects.noise.enabled) {
        css.push(`
            body::after {
                content: '';
                position: fixed;
                inset: 0;
                z-index: 3;
                pointer-events: none;
                opacity: ${alpha(effects.noise.intensity)};
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                mix-blend-mode: overlay;
            }
        `);
    }

    // ---------------------------------------------------------------- reduced motion
    css.push(`
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `);

    // ---------------------------------------------------------------- keyframes
    css.push(`
        @keyframes pg-bg-gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes pg-bg-aurora {
            0% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(8%, -6%) scale(1.15); }
            50% { transform: translate(-6%, 10%) scale(0.95); }
            75% { transform: translate(10%, 4%) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes pg-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
        }
        .pg-theme-bg-video {
            position: fixed;
            inset: 0;
            z-index: 0;
            object-fit: cover;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .pg-theme-fx-layer {
            position: fixed;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            overflow: hidden;
        }
        .pg-theme-fx-particle {
            position: absolute;
            border-radius: 50%;
            will-change: transform, opacity;
        }
    `);

    // ---------------------------------------------------------------- custom css
    if (theme.background.type === 'custom' && theme.background.customCss.trim()) {
        css.push(theme.background.customCss);
    }
    if (theme.advanced.customCss.trim()) {
        css.push(theme.advanced.customCss);
    }
    Object.entries(theme.advanced.cssVariables).forEach(([property, value]) => {
        if (/^--[a-z0-9-]+$/i.test(property) && typeof value === 'string') {
            variables[property] = value;
        }
    });

    return { variables, css: css.join('\n') };
}

/**
 * Variable names that the user-level ThemeEngine also writes as inline styles on
 * the document root. The studio preview must override these inline so its own
 * values win over the user's theme.
 */
export const THEME_ENGINE_OVERLAP_VARS = [
    '--pg-accent-50',
    '--pg-accent-100',
    '--pg-accent-200',
    '--pg-accent-300',
    '--pg-accent-400',
    '--pg-accent-500',
    '--pg-accent-600',
    '--pg-accent-700',
    '--pg-accent-800',
    '--pg-accent-900',
    '--pg-radius',
    '--pg-radius-sm',
    '--pg-radius-lg',
    '--pg-glass-opacity',
    '--pg-blur',
    '--pg-sidebar-width',
    '--pg-motion',
    '--pg-font-scale',
    '--pg-density',
] as const;
