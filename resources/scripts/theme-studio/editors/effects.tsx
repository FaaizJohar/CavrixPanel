import React from 'react';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import { ColorField, EditorSection, Segmented, Slider, Toggle } from '@/theme-studio/controls';

export const EffectsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { effects } = theme;

    return (
        <>
            <EditorSection title='Glow' hint='Soft luminous halos around accent elements.'>
                <Toggle
                    label='Enabled'
                    checked={effects.glow.enabled}
                    onChange={(value) => updateSection('effects', { glow: { ...effects.glow, enabled: value } })}
                />
                <Slider
                    label='Intensity'
                    value={effects.glow.intensity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('effects', { glow: { ...effects.glow, intensity: value } })}
                />
            </EditorSection>

            <EditorSection title='Gradient wash' hint='The ambient accent gradient behind the canvas.'>
                <Toggle
                    label='Enabled'
                    checked={effects.gradient.enabled}
                    onChange={(value) =>
                        updateSection('effects', { gradient: { ...effects.gradient, enabled: value } })
                    }
                />
                <Slider
                    label='Intensity'
                    value={effects.gradient.intensity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) =>
                        updateSection('effects', { gradient: { ...effects.gradient, intensity: value } })
                    }
                />
            </EditorSection>

            <EditorSection title='Aurora' hint='Slow drifting color blobs.'>
                <Toggle
                    label='Enabled'
                    checked={effects.aurora.enabled}
                    onChange={(value) => updateSection('effects', { aurora: { ...effects.aurora, enabled: value } })}
                />
                <Slider
                    label='Intensity'
                    value={effects.aurora.intensity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('effects', { aurora: { ...effects.aurora, intensity: value } })}
                />
                <Slider
                    label='Speed'
                    value={effects.aurora.speed}
                    min={0.2}
                    max={4}
                    step={0.1}
                    onChange={(value) => updateSection('effects', { aurora: { ...effects.aurora, speed: value } })}
                />
            </EditorSection>

            <EditorSection title='Particles' hint='Floating specks above the background.'>
                <Toggle
                    label='Enabled'
                    checked={effects.particles.enabled}
                    onChange={(value) =>
                        updateSection('effects', { particles: { ...effects.particles, enabled: value } })
                    }
                />
                <Slider
                    label='Density'
                    value={effects.particles.density}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) =>
                        updateSection('effects', { particles: { ...effects.particles, density: value } })
                    }
                />
                <Slider
                    label='Speed'
                    value={effects.particles.speed}
                    min={0.2}
                    max={4}
                    step={0.1}
                    onChange={(value) =>
                        updateSection('effects', { particles: { ...effects.particles, speed: value } })
                    }
                />
            </EditorSection>

            <EditorSection title='Vignette' hint='Subtle edge darkening for depth.'>
                <Toggle
                    label='Enabled'
                    checked={effects.vignette.enabled}
                    onChange={(value) =>
                        updateSection('effects', { vignette: { ...effects.vignette, enabled: value } })
                    }
                />
                <Slider
                    label='Intensity'
                    value={effects.vignette.intensity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) =>
                        updateSection('effects', { vignette: { ...effects.vignette, intensity: value } })
                    }
                />
            </EditorSection>

            <EditorSection title='Depth & motion'>
                <Toggle
                    label='Depth'
                    checked={effects.depth.enabled}
                    onChange={(value) => updateSection('effects', { depth: { enabled: value } })}
                />
                <Toggle
                    label='Hover elevation'
                    checked={effects.hoverElevation.enabled}
                    onChange={(value) =>
                        updateSection('effects', { hoverElevation: { ...effects.hoverElevation, enabled: value } })
                    }
                />
                <Slider
                    label='Lift distance'
                    value={effects.hoverElevation.distance}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) =>
                        updateSection('effects', { hoverElevation: { ...effects.hoverElevation, distance: value } })
                    }
                />
                <Toggle
                    label='Page transitions'
                    checked={effects.pageTransitions.enabled}
                    onChange={(value) => updateSection('effects', { pageTransitions: { enabled: value } })}
                />
                <Toggle
                    label='Performance mode'
                    checked={effects.performanceMode}
                    onChange={(value) => updateSection('effects', { performanceMode: value })}
                />
            </EditorSection>
        </>
    );
};

const INTENSITY_OPTIONS = [
    { value: 'off' as const, label: 'Off' },
    { value: 'subtle' as const, label: 'Subtle' },
    { value: 'normal' as const, label: 'Normal' },
    { value: 'expressive' as const, label: 'Expressive' },
];

const DURATION_OPTIONS = [
    { value: 'fast' as const, label: 'Fast' },
    { value: 'normal' as const, label: 'Normal' },
    { value: 'slow' as const, label: 'Slow' },
];

export const AnimationsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { animations } = theme;

    return (
        <>
            <EditorSection title='Global'>
                <Segmented
                    label='Intensity'
                    value={animations.intensity}
                    options={INTENSITY_OPTIONS}
                    onChange={(value) => updateSection('animations', { intensity: value })}
                />
                <Segmented
                    label='Duration'
                    value={animations.duration}
                    options={DURATION_OPTIONS}
                    onChange={(value) => updateSection('animations', { duration: value })}
                />
            </EditorSection>

            <EditorSection title='Motion targets' hint='Toggle animation categories independently.'>
                <Toggle
                    label='Page transitions'
                    checked={animations.page}
                    onChange={(value) => updateSection('animations', { page: value })}
                />
                <Toggle
                    label='Modals'
                    checked={animations.modal}
                    onChange={(value) => updateSection('animations', { modal: value })}
                />
                <Toggle
                    label='Dropdowns'
                    checked={animations.dropdown}
                    onChange={(value) => updateSection('animations', { dropdown: value })}
                />
                <Toggle
                    label='Hover'
                    checked={animations.hover}
                    onChange={(value) => updateSection('animations', { hover: value })}
                />
                <Toggle
                    label='Sidebar'
                    checked={animations.sidebar}
                    onChange={(value) => updateSection('animations', { sidebar: value })}
                />
                <Toggle
                    label='Buttons'
                    checked={animations.buttons}
                    onChange={(value) => updateSection('animations', { buttons: value })}
                />
            </EditorSection>
        </>
    );
};

const CURSOR_MODES = [
    { value: 'default' as const, label: 'Default' },
    { value: 'minimal' as const, label: 'Minimal' },
    { value: 'dot' as const, label: 'Dot' },
    { value: 'ring' as const, label: 'Ring' },
];

export const CursorEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { cursor } = theme;

    return (
        <>
            <EditorSection title='Style'>
                <Segmented
                    label='Cursor'
                    value={cursor.mode}
                    options={CURSOR_MODES}
                    onChange={(value) => updateSection('cursor', { mode: value })}
                />
            </EditorSection>

            {cursor.mode !== 'default' && (
                <EditorSection title='Custom cursor'>
                    <Slider
                        label='Size'
                        value={cursor.size}
                        min={8}
                        max={48}
                        unit='px'
                        onChange={(value) => updateSection('cursor', { size: value })}
                    />
                    <Slider
                        label='Opacity'
                        value={cursor.opacity}
                        min={0}
                        max={100}
                        unit='%'
                        onChange={(value) => updateSection('cursor', { opacity: value })}
                    />
                    <ColorField
                        label='Color'
                        value={cursor.color}
                        onChange={(value) => updateSection('cursor', { color: value })}
                    />
                </EditorSection>
            )}
        </>
    );
};
