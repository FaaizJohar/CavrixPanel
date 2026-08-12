export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export interface HslColor {
    h: number;
    s: number;
    l: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const clampInt = (value: number, min: number, max: number): number => Math.round(clamp(value, min, max));

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
    const hue = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;

    let rn = 0;
    let gn = 0;
    let bn = 0;
    if (hue < 60) {
        rn = c;
        gn = x;
    } else if (hue < 120) {
        rn = x;
        gn = c;
    } else if (hue < 180) {
        gn = c;
        bn = x;
    } else if (hue < 240) {
        gn = x;
        bn = c;
    } else if (hue < 300) {
        rn = x;
        bn = c;
    } else {
        rn = c;
        bn = x;
    }

    return {
        r: clampInt((rn + m) * 255, 0, 255),
        g: clampInt((gn + m) * 255, 0, 255),
        b: clampInt((bn + m) * 255, 0, 255),
    };
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rn) h = ((gn - bn) / delta) % 6;
        else if (max === gn) h = (bn - rn) / delta + 2;
        else h = (rn - gn) / delta + 4;
        h = (h * 60 + 360) % 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
}

const NAMED_COLORS: Record<string, RgbColor> = {
    aliceblue: { r: 240, g: 248, b: 255 },
    antiquewhite: { r: 250, g: 235, b: 215 },
    aqua: { r: 0, g: 255, b: 255 },
    aquamarine: { r: 127, g: 255, b: 212 },
    azure: { r: 240, g: 255, b: 255 },
    beige: { r: 245, g: 245, b: 220 },
    bisque: { r: 255, g: 228, b: 196 },
    black: { r: 0, g: 0, b: 0 },
    blanchedalmond: { r: 255, g: 235, b: 205 },
    blue: { r: 0, g: 0, b: 255 },
    blueviolet: { r: 138, g: 43, b: 226 },
    brown: { r: 165, g: 42, b: 42 },
    burlywood: { r: 222, g: 184, b: 135 },
    cadetblue: { r: 95, g: 158, b: 160 },
    chartreuse: { r: 127, g: 255, b: 0 },
    chocolate: { r: 210, g: 105, b: 30 },
    coral: { r: 255, g: 127, b: 80 },
    cornflowerblue: { r: 100, g: 149, b: 237 },
    cornsilk: { r: 255, g: 248, b: 220 },
    crimson: { r: 220, g: 20, b: 60 },
    cyan: { r: 0, g: 255, b: 255 },
    darkblue: { r: 0, g: 0, b: 139 },
    darkcyan: { r: 0, g: 139, b: 139 },
    darkgoldenrod: { r: 184, g: 134, b: 11 },
    darkgray: { r: 169, g: 169, b: 169 },
    darkgreen: { r: 0, g: 100, b: 0 },
    darkgrey: { r: 169, g: 169, b: 169 },
    darkkhaki: { r: 189, g: 183, b: 107 },
    darkmagenta: { r: 139, g: 0, b: 139 },
    darkolivegreen: { r: 85, g: 107, b: 47 },
    darkorange: { r: 255, g: 140, b: 0 },
    darkorchid: { r: 153, g: 50, b: 204 },
    darkred: { r: 139, g: 0, b: 0 },
    darksalmon: { r: 233, g: 150, b: 122 },
    darkseagreen: { r: 143, g: 188, b: 143 },
    darkslateblue: { r: 72, g: 61, b: 139 },
    darkslategray: { r: 47, g: 79, b: 79 },
    darkslategrey: { r: 47, g: 79, b: 79 },
    darkturquoise: { r: 0, g: 206, b: 209 },
    darkviolet: { r: 148, g: 0, b: 211 },
    deeppink: { r: 255, g: 20, b: 147 },
    deepskyblue: { r: 0, g: 191, b: 255 },
    dimgray: { r: 105, g: 105, b: 105 },
    dimgrey: { r: 105, g: 105, b: 105 },
    dodgerblue: { r: 30, g: 144, b: 255 },
    firebrick: { r: 178, g: 34, b: 34 },
    floralwhite: { r: 255, g: 250, b: 240 },
    forestgreen: { r: 34, g: 139, b: 34 },
    fuchsia: { r: 255, g: 0, b: 255 },
    gainsboro: { r: 220, g: 220, b: 220 },
    ghostwhite: { r: 248, g: 248, b: 255 },
    gold: { r: 255, g: 215, b: 0 },
    goldenrod: { r: 218, g: 165, b: 32 },
    gray: { r: 128, g: 128, b: 128 },
    green: { r: 0, g: 128, b: 0 },
    greenyellow: { r: 173, g: 255, b: 47 },
    grey: { r: 128, g: 128, b: 128 },
    honeydew: { r: 240, g: 255, b: 240 },
    hotpink: { r: 255, g: 105, b: 180 },
    indianred: { r: 205, g: 92, b: 92 },
    indigo: { r: 75, g: 0, b: 130 },
    ivory: { r: 255, g: 255, b: 240 },
    khaki: { r: 240, g: 230, b: 140 },
    lavender: { r: 230, g: 230, b: 250 },
    lavenderblush: { r: 255, g: 240, b: 245 },
    lawngreen: { r: 124, g: 252, b: 0 },
    lemonchiffon: { r: 255, g: 250, b: 205 },
    lightblue: { r: 173, g: 216, b: 230 },
    lightcoral: { r: 240, g: 128, b: 128 },
    lightcyan: { r: 224, g: 255, b: 255 },
    lightgoldenrodyellow: { r: 250, g: 250, b: 210 },
    lightgray: { r: 211, g: 211, b: 211 },
    lightgreen: { r: 144, g: 238, b: 144 },
    lightgrey: { r: 211, g: 211, b: 211 },
    lightpink: { r: 255, g: 182, b: 193 },
    lightsalmon: { r: 255, g: 160, b: 122 },
    lightseagreen: { r: 32, g: 178, b: 170 },
    lightskyblue: { r: 135, g: 206, b: 250 },
    lightslategray: { r: 119, g: 136, b: 153 },
    lightslategrey: { r: 119, g: 136, b: 153 },
    lightsteelblue: { r: 176, g: 196, b: 222 },
    lightyellow: { r: 255, g: 255, b: 224 },
    lime: { r: 0, g: 255, b: 0 },
    limegreen: { r: 50, g: 205, b: 50 },
    linen: { r: 250, g: 240, b: 230 },
    magenta: { r: 255, g: 0, b: 255 },
    maroon: { r: 128, g: 0, b: 0 },
    mediumaquamarine: { r: 102, g: 205, b: 170 },
    mediumblue: { r: 0, g: 0, b: 205 },
    mediumorchid: { r: 186, g: 85, b: 211 },
    mediumpurple: { r: 147, g: 112, b: 219 },
    mediumseagreen: { r: 60, g: 179, b: 113 },
    mediumslateblue: { r: 123, g: 104, b: 238 },
    mediumspringgreen: { r: 0, g: 250, b: 154 },
    mediumturquoise: { r: 72, g: 209, b: 204 },
    mediumvioletred: { r: 199, g: 21, b: 133 },
    midnightblue: { r: 25, g: 25, b: 112 },
    mintcream: { r: 245, g: 255, b: 250 },
    mistyrose: { r: 255, g: 228, b: 225 },
    moccasin: { r: 255, g: 228, b: 181 },
    navajowhite: { r: 255, g: 222, b: 173 },
    navy: { r: 0, g: 0, b: 128 },
    oldlace: { r: 253, g: 245, b: 230 },
    olive: { r: 128, g: 128, b: 0 },
    olivedrab: { r: 107, g: 142, b: 35 },
    orange: { r: 255, g: 165, b: 0 },
    orangered: { r: 255, g: 69, b: 0 },
    orchid: { r: 218, g: 112, b: 214 },
    palegoldenrod: { r: 238, g: 232, b: 170 },
    palegreen: { r: 152, g: 251, b: 152 },
    paleturquoise: { r: 175, g: 238, b: 238 },
    palevioletred: { r: 219, g: 112, b: 147 },
    papayawhip: { r: 255, g: 239, b: 213 },
    peachpuff: { r: 255, g: 218, b: 185 },
    peru: { r: 205, g: 133, b: 63 },
    pink: { r: 255, g: 192, b: 203 },
    plum: { r: 221, g: 160, b: 221 },
    powderblue: { r: 176, g: 224, b: 230 },
    purple: { r: 128, g: 0, b: 128 },
    rebeccapurple: { r: 102, g: 51, b: 153 },
    red: { r: 255, g: 0, b: 0 },
    rosybrown: { r: 188, g: 143, b: 143 },
    royalblue: { r: 65, g: 105, b: 225 },
    saddlebrown: { r: 139, g: 69, b: 19 },
    salmon: { r: 250, g: 128, b: 114 },
    sandybrown: { r: 244, g: 164, b: 96 },
    seagreen: { r: 46, g: 139, b: 87 },
    seashell: { r: 255, g: 245, b: 238 },
    sienna: { r: 160, g: 82, b: 45 },
    silver: { r: 192, g: 192, b: 192 },
    skyblue: { r: 135, g: 206, b: 235 },
    slateblue: { r: 106, g: 90, b: 205 },
    slategray: { r: 112, g: 128, b: 144 },
    slategrey: { r: 112, g: 128, b: 144 },
    snow: { r: 255, g: 250, b: 250 },
    springgreen: { r: 0, g: 255, b: 127 },
    steelblue: { r: 70, g: 130, b: 180 },
    tan: { r: 210, g: 180, b: 140 },
    teal: { r: 0, g: 128, b: 128 },
    thistle: { r: 216, g: 191, b: 216 },
    tomato: { r: 255, g: 99, b: 71 },
    turquoise: { r: 64, g: 224, b: 208 },
    violet: { r: 238, g: 130, b: 238 },
    wheat: { r: 245, g: 222, b: 179 },
    white: { r: 255, g: 255, b: 255 },
    whitesmoke: { r: 245, g: 245, b: 245 },
    yellow: { r: 255, g: 255, b: 0 },
    yellowgreen: { r: 154, g: 205, b: 50 },
};

/**
 * Parses a color string into its RGB components. Supports `#rgb`, `#rgba`,
 * `#rrggbb`, `#rrggbbaa`, `rgb(...)`, `rgba(...)` and the 140 named colors.
 * Returns null for anything unrecognizable.
 */
export function parseColor(input: string): RgbColor | null {
    if (typeof input !== 'string') return null;

    const value = input.trim().toLowerCase();
    if (!value) return null;

    if (value.startsWith('#')) {
        const hex = value.slice(1);
        if (hex.length === 3 || hex.length === 4) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
            return { r, g, b };
        }
        if (hex.length === 6 || hex.length === 8) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
            return { r, g, b };
        }
        return null;
    }

    const func = value.match(/^rgba?\(([^)]+)\)$/);
    if (func) {
        const channels = func[1].split(/[\s/]+/).map((part) => parseFloat(part.replace(/%$/, '')));
        const numeric = channels.filter((channel) => !Number.isNaN(channel));
        if (numeric.length < 3) return null;
        const scale = channels.some((channel, index) => index < 3 && String(channels[index]).endsWith('%')) ? 2.55 : 1;
        return {
            r: clampInt(numeric[0] * scale, 0, 255),
            g: clampInt(numeric[1] * scale, 0, 255),
            b: clampInt(numeric[2] * scale, 0, 255),
        };
    }

    const hsl = value.match(/^hsla?\(([^)]+)\)$/);
    if (hsl) {
        const channels = hsl[1].split(/[\s/]+/).map((part) => parseFloat(part.replace(/%$/, '')));
        const numeric = channels.filter((channel) => !Number.isNaN(channel));
        if (numeric.length < 3) return null;
        return hslToRgb({ h: numeric[0], s: numeric[1] / 100, l: numeric[2] / 100 });
    }

    const named = NAMED_COLORS[value];
    if (named) return named;

    return null;
}

export function isValidColor(input: string): boolean {
    return parseColor(input) !== null;
}

export function clampColor(value: string, fallback: string): string {
    return isValidColor(value) ? value : fallback;
}

export function rgbToHex({ r, g, b }: RgbColor): string {
    const toHex = (channel: number) => clampInt(channel, 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToRgbCss({ r, g, b }: RgbColor, alpha?: number): string {
    const channels = `${clampInt(r, 0, 255)} ${clampInt(g, 0, 255)} ${clampInt(b, 0, 255)}`;
    return typeof alpha === 'number' ? `${channels} / ${alpha}` : channels;
}

/** Convert a hex/rgb/named color into the `r g b` triplet form used by --pg-n-*. */
export function colorToTriplet(input: string): string {
    const parsed = parseColor(input);
    return parsed ? rgbToRgbCss(parsed) : input;
}

export function hexToHsl(input: string): HslColor | null {
    const parsed = parseColor(input);
    return parsed ? rgbToHsl(parsed) : null;
}

export function hslToHex(hsl: HslColor): string {
    return rgbToHex(hslToRgb(hsl));
}

export function mixColors(a: string, b: string, weight: number): string {
    const ca = parseColor(a);
    const cb = parseColor(b);
    if (!ca || !cb) return weight < 0.5 ? a : b;

    const t = clamp(weight, 0, 1);
    return rgbToHex({
        r: Math.round(ca.r + (cb.r - ca.r) * t),
        g: Math.round(ca.g + (cb.g - ca.g) * t),
        b: Math.round(ca.b + (cb.b - ca.b) * t),
    });
}

/** Adjust a color's lightness by an absolute step (positive = lighter, negative = darker). */
export function shiftLightness(input: string, amount: number): string {
    const parsed = parseColor(input);
    if (!parsed) return input;
    const hsl = rgbToHsl(parsed);
    return hslToHex({ ...hsl, l: clamp(hsl.l + amount, 0, 1) });
}

/** Adjust a color's lightness by a relative multiplier. */
export function scaleLightness(input: string, factor: number): string {
    const parsed = parseColor(input);
    if (!parsed) return input;
    const hsl = rgbToHsl(parsed);
    return hslToHex({ ...hsl, l: clamp(hsl.l * factor, 0, 1) });
}

export function adjustSaturation(input: string, factor: number): string {
    const parsed = parseColor(input);
    if (!parsed) return input;
    const hsl = rgbToHsl(parsed);
    return hslToHex({ ...hsl, s: clamp(hsl.s * factor, 0, 1) });
}

export function toRgba(input: string, alpha: number): string {
    const parsed = parseColor(input);
    if (!parsed) return input;
    return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${clamp(alpha, 0, 1)})`;
}

/**
 * Computes the perceived contrast ratio (0–1) between a color and the given
 * background. Used to decide whether white or dark text reads better.
 */
export function contrastWith(input: string, background: string): number {
    const fg = parseColor(input);
    const bg = parseColor(background);
    if (!fg || !bg) return 0.5;

    const luminance = ({ r, g, b }: RgbColor) => {
        const linear = (channel: number) => {
            const c = channel / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
    };

    const lighter = Math.max(luminance(fg), luminance(bg));
    const darker = Math.min(luminance(fg), luminance(bg));
    return (lighter + 0.05) / (darker + 0.05);
}

/** Returns a readable foreground color for a given background. */
export function readableOn(background: string): string {
    return contrastWith('#ffffff', background) >= 1.6 ? '#ffffff' : '#18181b';
}

const SHADE_STOPS: Array<{ name: string; lightness: number }> = [
    { name: '50', lightness: 0.96 },
    { name: '100', lightness: 0.91 },
    { name: '200', lightness: 0.84 },
    { name: '300', lightness: 0.76 },
    { name: '400', lightness: 0.66 },
    { name: '500', lightness: 0.56 },
    { name: '600', lightness: 0.46 },
    { name: '700', lightness: 0.38 },
    { name: '800', lightness: 0.31 },
    { name: '900', lightness: 0.25 },
];

export interface AccentRamp {
    shades: Record<string, string>;
    base: string;
    base500: string;
}

/**
 * Generates a deterministic 10-step accent ramp from a base color. The base is
 * pinned to the 500 stop, and the surrounding shades are interpolated through
 * HSL space so a swap of the accent recolors the entire interface.
 */
export function buildAccentRamp(base: string): AccentRamp {
    const parsed = parseColor(base);
    const fallback = parsed ? rgbToHsl(parsed) : { h: 240, s: 0.7, l: 0.56 };
    const { h, s } = fallback;

    const shades: Record<string, string> = {};
    SHADE_STOPS.forEach(({ name, lightness }) => {
        shades[name] = hslToHex({ h, s: name === '50' || name === '100' ? Math.min(s * 0.75, 0.5) : s, l: lightness });
    });

    // Pin the 500 stop exactly to the requested base color.
    shades['500'] = rgbToHex(parsed || hslToRgb({ h, s, l: 0.56 }));

    return { shades, base, base500: shades['500'] };
}
