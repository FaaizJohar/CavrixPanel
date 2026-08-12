const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// The neutral/gray scale resolves through CSS custom properties so the entire
// interface can be re-themed (dark / light / system) by swapping a single
// `data-theme` attribute on the document root.
function neutralScale() {
    const out = {};
    steps.forEach((step) => (out[step] = `rgb(var(--pg-n-${step}) / <alpha-value>)`));
    return out;
}

// The accent scale (primary / blue / cyan) resolves through CSS custom
// properties so users can customize the accent color from the panel settings.
// Opacity modifiers (e.g. bg-blue-500/50) are handled by Tailwind v3 via
// color-mix() when the value is a plain CSS custom property.
function accentScale() {
    const out = {};
    steps.forEach((step) => (out[step] = `var(--pg-accent-${step})`));
    return out;
}

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx,css}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter Variable', 'Inter', 'Geist', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                header: ['Inter Variable', 'Inter', 'Geist', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
            },
            colors: {
                black: 'rgb(var(--pg-black))',
                white: 'rgb(var(--pg-white))',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: accentScale(),
                blue: accentScale(),
                cyan: accentScale(),
                gray: neutralScale(),
                neutral: neutralScale(),
                orange: colors.orange,
                red: colors.red,
                green: colors.green,
                yellow: colors.yellow,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: (theme) => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
