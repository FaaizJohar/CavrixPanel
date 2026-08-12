import React from 'react';
import { ACCENT_OPTIONS, FONT_HEADING_OPTIONS, FONT_MONO_OPTIONS, FONT_UI_OPTIONS } from '@/theme-studio/config';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import {
    ColorField,
    EditorSection,
    Segmented,
    SelectField,
    Slider,
    TextAreaField,
    TextField,
} from '@/theme-studio/controls';

const DENSITY_OPTIONS = [
    { value: 'compact' as const, label: 'Compact' },
    { value: 'comfortable' as const, label: 'Comfortable' },
    { value: 'spacious' as const, label: 'Spacious' },
];

const SCALE_OPTIONS = [
    { value: 'tiny' as const, label: 'Tiny' },
    { value: 'small' as const, label: 'Small' },
    { value: 'default' as const, label: 'Default' },
    { value: 'large' as const, label: 'Large' },
    { value: 'huge' as const, label: 'Huge' },
];

export const AppearanceEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { meta } = theme;

    return (
        <>
            <EditorSection title='Identity' hint='These labels appear in the panel chrome and browser tab.'>
                <TextField
                    label='Theme name'
                    value={meta.name}
                    onChange={(value) => updateSection('meta', { name: value })}
                />
                <TextAreaField
                    label='Description'
                    value={meta.description}
                    rows={2}
                    onChange={(value) => updateSection('meta', { description: value })}
                />
            </EditorSection>
        </>
    );
};

export const ColorsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { colors } = theme;
    const accentSwatches = ACCENT_OPTIONS.map((option) => option.value);

    return (
        <>
            <EditorSection title='Accent & brand' hint='The accent drives buttons, links, focus rings and active nav.'>
                <ColorField
                    label='Accent'
                    value={colors.accent}
                    swatches={accentSwatches}
                    onChange={(value) => updateSection('colors', { accent: value, primary: value, info: value })}
                />
                <ColorField
                    label='Primary'
                    value={colors.primary}
                    onChange={(value) => updateSection('colors', { primary: value })}
                />
                <ColorField
                    label='Secondary'
                    value={colors.secondary}
                    onChange={(value) => updateSection('colors', { secondary: value })}
                />
            </EditorSection>

            <EditorSection title='Semantic' hint='Status colors used across badges and notifications.'>
                <ColorField
                    label='Success'
                    value={colors.success}
                    onChange={(value) => updateSection('colors', { success: value })}
                />
                <ColorField
                    label='Warning'
                    value={colors.warning}
                    onChange={(value) => updateSection('colors', { warning: value })}
                />
                <ColorField
                    label='Danger'
                    value={colors.danger}
                    onChange={(value) => updateSection('colors', { danger: value })}
                />
                <ColorField
                    label='Info'
                    value={colors.info}
                    onChange={(value) => updateSection('colors', { info: value })}
                />
            </EditorSection>

            <EditorSection title='States' hint='Hover, active and focus variants of the accent.'>
                <ColorField
                    label='Hover'
                    value={colors.states.hover}
                    onChange={(value) => updateSection('colors', { states: { ...colors.states, hover: value } })}
                />
                <ColorField
                    label='Active'
                    value={colors.states.active}
                    onChange={(value) => updateSection('colors', { states: { ...colors.states, active: value } })}
                />
                <ColorField
                    label='Focus'
                    value={colors.states.focus}
                    onChange={(value) => updateSection('colors', { states: { ...colors.states, focus: value } })}
                />
                <ColorField
                    label='Disabled'
                    value={colors.states.disabled}
                    onChange={(value) => updateSection('colors', { states: { ...colors.states, disabled: value } })}
                />
            </EditorSection>

            <EditorSection title='Dark palette' hint='Surfaces for the dark theme.'>
                <ColorField
                    label='Background'
                    value={colors.dark.background}
                    onChange={(value) => updateSection('colors', { dark: { ...colors.dark, background: value } })}
                />
                <ColorField
                    label='Surface'
                    value={colors.dark.surface}
                    onChange={(value) => updateSection('colors', { dark: { ...colors.dark, surface: value } })}
                />
                <ColorField
                    label='Elevated'
                    value={colors.dark.surfaceElevated}
                    onChange={(value) => updateSection('colors', { dark: { ...colors.dark, surfaceElevated: value } })}
                />
                <ColorField
                    label='Text'
                    value={colors.dark.text}
                    onChange={(value) => updateSection('colors', { dark: { ...colors.dark, text: value } })}
                />
                <ColorField
                    label='Muted text'
                    value={colors.dark.textMuted}
                    onChange={(value) => updateSection('colors', { dark: { ...colors.dark, textMuted: value } })}
                />
            </EditorSection>

            <EditorSection title='Light palette' hint='Used when the interface switches to light mode.'>
                <ColorField
                    label='Background'
                    value={colors.light.background}
                    onChange={(value) => updateSection('colors', { light: { ...colors.light, background: value } })}
                />
                <ColorField
                    label='Surface'
                    value={colors.light.surface}
                    onChange={(value) => updateSection('colors', { light: { ...colors.light, surface: value } })}
                />
                <ColorField
                    label='Elevated'
                    value={colors.light.surfaceElevated}
                    onChange={(value) =>
                        updateSection('colors', { light: { ...colors.light, surfaceElevated: value } })
                    }
                />
                <ColorField
                    label='Text'
                    value={colors.light.text}
                    onChange={(value) => updateSection('colors', { light: { ...colors.light, text: value } })}
                />
                <ColorField
                    label='Muted text'
                    value={colors.light.textMuted}
                    onChange={(value) => updateSection('colors', { light: { ...colors.light, textMuted: value } })}
                />
            </EditorSection>
        </>
    );
};

export const TypographyEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { typography } = theme;

    return (
        <>
            <EditorSection title='Base' hint='Applies across the whole interface.'>
                <SelectField
                    label='UI font'
                    value={typography.ui.family}
                    options={FONT_UI_OPTIONS.map((family) => ({ value: family, label: family }))}
                    onChange={(value) => updateSection('typography', { ui: { ...typography.ui, family: value } })}
                />
                <Slider
                    label='Base size'
                    value={typography.ui.baseSize}
                    min={10}
                    max={20}
                    unit='px'
                    onChange={(value) => updateSection('typography', { ui: { ...typography.ui, baseSize: value } })}
                />
                <Slider
                    label='Line height'
                    value={typography.ui.lineHeight}
                    min={1.1}
                    max={2}
                    step={0.05}
                    onChange={(value) => updateSection('typography', { ui: { ...typography.ui, lineHeight: value } })}
                />
                <Slider
                    label='Letter spacing'
                    value={typography.ui.letterSpacing}
                    min={-0.05}
                    max={0.2}
                    step={0.005}
                    unit='em'
                    onChange={(value) =>
                        updateSection('typography', { ui: { ...typography.ui, letterSpacing: value } })
                    }
                />
                <Slider
                    label='Weight'
                    value={typography.ui.weight}
                    min={100}
                    max={900}
                    step={100}
                    onChange={(value) => updateSection('typography', { ui: { ...typography.ui, weight: value } })}
                />
            </EditorSection>

            <EditorSection title='Headings' hint='Controls titles and section headers.'>
                <SelectField
                    label='Heading font'
                    value={typography.heading.family}
                    options={FONT_HEADING_OPTIONS.map((family) => ({ value: family, label: family }))}
                    onChange={(value) =>
                        updateSection('typography', { heading: { ...typography.heading, family: value } })
                    }
                />
                <Slider
                    label='Weight'
                    value={typography.heading.weight}
                    min={400}
                    max={900}
                    step={100}
                    onChange={(value) =>
                        updateSection('typography', { heading: { ...typography.heading, weight: value } })
                    }
                />
                <Slider
                    label='Scale'
                    value={typography.heading.scale}
                    min={0.8}
                    max={1.5}
                    step={0.05}
                    onChange={(value) =>
                        updateSection('typography', { heading: { ...typography.heading, scale: value } })
                    }
                />
            </EditorSection>

            <EditorSection title='Monospace' hint='Used for code, identifiers and logs.'>
                <SelectField
                    label='Mono font'
                    value={typography.mono.family}
                    options={FONT_MONO_OPTIONS.map((family) => ({ value: family, label: family }))}
                    onChange={(value) => updateSection('typography', { mono: { ...typography.mono, family: value } })}
                />
                <Slider
                    label='Weight'
                    value={typography.mono.weight}
                    min={400}
                    max={700}
                    step={100}
                    onChange={(value) => updateSection('typography', { mono: { ...typography.mono, weight: value } })}
                />
            </EditorSection>

            <EditorSection title='Scale' hint='Coarse sizing preset for the entire interface.'>
                <Segmented
                    label='Global scale'
                    value={typography.scale}
                    options={SCALE_OPTIONS}
                    onChange={(value) => updateSection('typography', { scale: value })}
                />
            </EditorSection>
        </>
    );
};

export const LayoutEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { layout } = theme;

    return (
        <>
            <EditorSection title='Density' hint='Overall spacing rhythm of the panel.'>
                <Segmented
                    label='Density'
                    value={layout.density}
                    options={DENSITY_OPTIONS}
                    onChange={(value) => updateSection('layout', { density: value })}
                />
            </EditorSection>

            <EditorSection title='Spacing'>
                <Slider
                    label='Card padding'
                    value={layout.cardPadding}
                    min={8}
                    max={40}
                    unit='px'
                    onChange={(value) => updateSection('layout', { cardPadding: value })}
                />
                <Slider
                    label='Section spacing'
                    value={layout.sectionSpacing}
                    min={8}
                    max={64}
                    unit='px'
                    onChange={(value) => updateSection('layout', { sectionSpacing: value })}
                />
                <Slider
                    label='Nav spacing'
                    value={layout.navSpacing}
                    min={0}
                    max={24}
                    unit='px'
                    onChange={(value) => updateSection('layout', { navSpacing: value })}
                />
                <Slider
                    label='Table row height'
                    value={layout.tableRowHeight}
                    min={28}
                    max={72}
                    unit='px'
                    onChange={(value) => updateSection('layout', { tableRowHeight: value })}
                />
            </EditorSection>

            <EditorSection title='Sizes'>
                <Slider
                    label='Content max width'
                    value={layout.contentMaxWidth}
                    min={800}
                    max={2200}
                    step={8}
                    unit='px'
                    onChange={(value) => updateSection('layout', { contentMaxWidth: value })}
                />
            </EditorSection>
        </>
    );
};

const RADIUS_PRESETS = [
    { value: 'sharp' as const, label: 'Sharp' },
    { value: 'compact' as const, label: 'Compact' },
    { value: 'soft' as const, label: 'Soft' },
    { value: 'rounded' as const, label: 'Rounded' },
    { value: 'pill' as const, label: 'Pill' },
];

export const RadiusEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { radius } = theme;

    const setComponent = (key: keyof typeof radius.components, value: number | null) =>
        updateSection('radius', { components: { ...radius.components, [key]: value } });

    return (
        <>
            <EditorSection title='Preset' hint='The preset shapes the base radius multiplier.'>
                <Segmented
                    label='Preset'
                    value={radius.preset}
                    options={RADIUS_PRESETS}
                    onChange={(value) => updateSection('radius', { preset: value })}
                />
                <Slider
                    label='Base radius'
                    value={radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => updateSection('radius', { value })}
                />
            </EditorSection>

            <EditorSection title='Components' hint='Leave a component unset to inherit the base radius.'>
                <Slider
                    label='Cards'
                    value={radius.components.cards ?? radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => setComponent('cards', value)}
                />
                <Slider
                    label='Buttons'
                    value={radius.components.buttons ?? radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => setComponent('buttons', value)}
                />
                <Slider
                    label='Inputs'
                    value={radius.components.inputs ?? radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => setComponent('inputs', value)}
                />
                <Slider
                    label='Modals'
                    value={radius.components.modals ?? radius.value}
                    min={0}
                    max={40}
                    unit='px'
                    onChange={(value) => setComponent('modals', value)}
                />
                <Slider
                    label='Sidebar'
                    value={radius.components.sidebar ?? radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => setComponent('sidebar', value)}
                />
                <Slider
                    label='Dropdowns'
                    value={radius.components.dropdowns ?? radius.value}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => setComponent('dropdowns', value)}
                />
            </EditorSection>
        </>
    );
};

const SHADOW_PRESETS = [
    { value: 'none' as const, label: 'None' },
    { value: 'subtle' as const, label: 'Subtle' },
    { value: 'soft' as const, label: 'Soft' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'deep' as const, label: 'Deep' },
    { value: 'floating' as const, label: 'Floating' },
];

export const ShadowsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { shadows } = theme;

    return (
        <>
            <EditorSection title='Preset' hint='Coarse shadow strength for cards, modals and menus.'>
                <Segmented
                    label='Preset'
                    value={shadows.preset}
                    options={SHADOW_PRESETS}
                    onChange={(value) => updateSection('shadows', { preset: value })}
                />
            </EditorSection>

            <EditorSection title='Tuning'>
                <Slider
                    label='Intensity'
                    value={shadows.intensity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('shadows', { intensity: value })}
                />
                <Slider
                    label='Blur'
                    value={shadows.blur}
                    min={0}
                    max={120}
                    unit='px'
                    onChange={(value) => updateSection('shadows', { blur: value })}
                />
                <Slider
                    label='Spread'
                    value={shadows.spread}
                    min={-40}
                    max={60}
                    unit='px'
                    onChange={(value) => updateSection('shadows', { spread: value })}
                />
                <Slider
                    label='Opacity'
                    value={shadows.opacity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('shadows', { opacity: value })}
                />
            </EditorSection>
        </>
    );
};
