import React, { useState } from 'react';
import { BackgroundType } from '@/theme-studio/config';
import { uploadThemeMedia } from '@/theme-studio/api';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import { ColorField, EditorSection, MediaField, Segmented, Slider, TextField, Toggle } from '@/theme-studio/controls';

const BACKGROUND_TYPES: Array<{ value: BackgroundType; label: string }> = [
    { value: 'solid', label: 'Solid' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'mesh', label: 'Mesh' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'animated', label: 'Animated' },
    { value: 'aurora', label: 'Aurora' },
    { value: 'noise', label: 'Noise' },
    { value: 'custom', label: 'Custom' },
];

export const BackgroundEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { background } = theme;
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadThemeMedia(file);
            const isVideo = /video\//i.test(file.type);
            if (isVideo) {
                updateSection('background', { type: 'video', video: { ...background.video, data: url } });
            } else {
                updateSection('background', { type: 'image', image: { ...background.image, data: url } });
            }
        } catch (e) {
            console.warn('Upload failed.', e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <EditorSection title='Type' hint='What sits behind the whole interface.'>
                <Segmented
                    label='Background'
                    value={background.type}
                    options={BACKGROUND_TYPES}
                    onChange={(value) => updateSection('background', { type: value })}
                />
            </EditorSection>

            {background.type !== 'custom' && (
                <EditorSection title='Colors'>
                    <ColorField
                        label='Base'
                        value={background.color}
                        onChange={(value) => updateSection('background', { color: value })}
                    />
                    <ColorField
                        label='Secondary'
                        value={background.secondaryColor}
                        onChange={(value) => updateSection('background', { secondaryColor: value })}
                    />
                    <ColorField
                        label='Tertiary'
                        value={background.tertiaryColor}
                        onChange={(value) => updateSection('background', { tertiaryColor: value })}
                    />
                </EditorSection>
            )}

            {(background.type === 'gradient' || background.type === 'animated') && (
                <EditorSection title='Gradient'>
                    <Slider
                        label='Angle'
                        value={background.angle}
                        min={0}
                        max={360}
                        unit='°'
                        onChange={(value) => updateSection('background', { angle: value })}
                    />
                </EditorSection>
            )}

            {(background.type === 'animated' || background.type === 'aurora') && (
                <EditorSection title='Motion'>
                    <Slider
                        label='Speed'
                        value={background.animatedSpeed}
                        min={4}
                        max={40}
                        unit='s'
                        onChange={(value) => updateSection('background', { animatedSpeed: value })}
                    />
                </EditorSection>
            )}

            {(background.type === 'image' || background.type === 'video') && (
                <EditorSection title='Media'>
                    <MediaField
                        label={background.type === 'video' ? 'Video' : 'Image'}
                        value={background.type === 'video' ? background.video.data : background.image.data}
                        uploading={uploading}
                        onSelect={handleUpload}
                        onClear={() =>
                            background.type === 'video'
                                ? updateSection('background', { video: { ...background.video, data: '' } })
                                : updateSection('background', { image: { ...background.image, data: '' } })
                        }
                        hint='Max 15MB · PNG, JPG, WEBP, AVIF, SVG, MP4, WebM'
                    />
                    {background.type === 'image' && (
                        <>
                            <Slider
                                label='Opacity'
                                value={background.image.opacity}
                                min={0}
                                max={100}
                                unit='%'
                                onChange={(value) =>
                                    updateSection('background', { image: { ...background.image, opacity: value } })
                                }
                            />
                            <TextField
                                label='Position'
                                value={background.image.position}
                                onChange={(value) =>
                                    updateSection('background', { image: { ...background.image, position: value } })
                                }
                            />
                        </>
                    )}
                    {background.type === 'video' && (
                        <>
                            <Slider
                                label='Opacity'
                                value={background.video.opacity}
                                min={0}
                                max={100}
                                unit='%'
                                onChange={(value) =>
                                    updateSection('background', { video: { ...background.video, opacity: value } })
                                }
                            />
                            <Slider
                                label='Speed'
                                value={background.video.speed}
                                min={0.25}
                                max={3}
                                step={0.05}
                                onChange={(value) =>
                                    updateSection('background', { video: { ...background.video, speed: value } })
                                }
                            />
                            <Toggle
                                label='Loop'
                                checked={background.video.loop}
                                onChange={(value) =>
                                    updateSection('background', { video: { ...background.video, loop: value } })
                                }
                            />
                            <MediaField
                                label='Poster'
                                value={background.video.poster}
                                uploading={uploading}
                                onSelect={async (file) =>
                                    updateSection('background', {
                                        video: { ...background.video, poster: await uploadThemeMedia(file) },
                                    })
                                }
                                onClear={() =>
                                    updateSection('background', { video: { ...background.video, poster: '' } })
                                }
                            />
                        </>
                    )}
                </EditorSection>
            )}

            <EditorSection title='Overlay'>
                <ColorField
                    label='Overlay color'
                    value={background.overlay}
                    onChange={(value) => updateSection('background', { overlay: value })}
                />
                <Slider
                    label='Overlay opacity'
                    value={background.overlayOpacity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('background', { overlayOpacity: value })}
                />
            </EditorSection>

            <EditorSection title='Image processing'>
                <Slider
                    label='Brightness'
                    value={background.brightness}
                    min={20}
                    max={200}
                    unit='%'
                    onChange={(value) => updateSection('background', { brightness: value })}
                />
                <Slider
                    label='Contrast'
                    value={background.contrast}
                    min={20}
                    max={200}
                    unit='%'
                    onChange={(value) => updateSection('background', { contrast: value })}
                />
                <Slider
                    label='Saturation'
                    value={background.saturation}
                    min={0}
                    max={200}
                    unit='%'
                    onChange={(value) => updateSection('background', { saturation: value })}
                />
            </EditorSection>

            {background.type === 'custom' && (
                <EditorSection title='Custom CSS' hint='Replaces the body background entirely.'>
                    <TextField
                        label='CSS'
                        value={background.customCss}
                        onChange={(value) => updateSection('background', { customCss: value })}
                    />
                </EditorSection>
            )}
        </>
    );
};

const GLASS_SURFACES: Array<{
    key: 'sidebar' | 'navbar' | 'cards' | 'modals' | 'dropdowns' | 'inputs' | 'tables';
    label: string;
}> = [
    { key: 'sidebar', label: 'Sidebar' },
    { key: 'navbar', label: 'Navbar' },
    { key: 'cards', label: 'Cards' },
    { key: 'modals', label: 'Modals' },
    { key: 'dropdowns', label: 'Dropdowns' },
    { key: 'inputs', label: 'Inputs' },
    { key: 'tables', label: 'Tables' },
];

const TINT_OPTIONS = [
    { value: 'none' as const, label: 'None' },
    { value: 'white' as const, label: 'White' },
    { value: 'black' as const, label: 'Black' },
    { value: 'custom' as const, label: 'Custom' },
];

export const GlassEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { glass } = theme;

    return (
        <>
            <EditorSection title='Glassmorphism'>
                <Toggle
                    label='Enabled'
                    checked={glass.enabled}
                    onChange={(value) => updateSection('glass', { enabled: value })}
                />
                <Slider
                    label='Transparency'
                    value={glass.transparency}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('glass', { transparency: value })}
                />
                <Slider
                    label='Blur'
                    value={glass.blur}
                    min={0}
                    max={100}
                    unit='px'
                    onChange={(value) => updateSection('glass', { blur: value })}
                />
                <Slider
                    label='Saturation'
                    value={glass.saturation}
                    min={0}
                    max={200}
                    unit='%'
                    onChange={(value) => updateSection('glass', { saturation: value })}
                />
                <Slider
                    label='Border opacity'
                    value={glass.borderOpacity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('glass', { borderOpacity: value })}
                />
                <Slider
                    label='Shadow'
                    value={glass.shadow}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('glass', { shadow: value })}
                />
            </EditorSection>

            <EditorSection title='Tint' hint='Adds a subtle color wash over glass surfaces.'>
                <Segmented
                    label='Tint'
                    value={glass.tint}
                    options={TINT_OPTIONS}
                    onChange={(value) => updateSection('glass', { tint: value })}
                />
                {glass.tint === 'custom' && (
                    <ColorField
                        label='Tint color'
                        value={glass.tintColor}
                        onChange={(value) => updateSection('glass', { tintColor: value })}
                    />
                )}
                <Slider
                    label='Tint strength'
                    value={glass.tintStrength}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('glass', { tintStrength: value })}
                />
            </EditorSection>

            {GLASS_SURFACES.map(({ key, label }) => {
                const surface = glass.surfaces[key];
                return (
                    <EditorSection key={key} title={`${label} surface`}>
                        <Toggle
                            label='Enabled'
                            checked={surface.enabled}
                            onChange={(value) =>
                                updateSection('glass', {
                                    surfaces: { ...glass.surfaces, [key]: { ...surface, enabled: value } },
                                })
                            }
                        />
                        <Slider
                            label='Transparency'
                            value={surface.transparency}
                            min={0}
                            max={100}
                            unit='%'
                            onChange={(value) =>
                                updateSection('glass', {
                                    surfaces: { ...glass.surfaces, [key]: { ...surface, transparency: value } },
                                })
                            }
                        />
                        <Slider
                            label='Blur'
                            value={surface.blur}
                            min={0}
                            max={60}
                            unit='px'
                            onChange={(value) =>
                                updateSection('glass', {
                                    surfaces: { ...glass.surfaces, [key]: { ...surface, blur: value } },
                                })
                            }
                        />
                        <Slider
                            label='Border'
                            value={surface.border}
                            min={0}
                            max={100}
                            unit='%'
                            onChange={(value) =>
                                updateSection('glass', {
                                    surfaces: { ...glass.surfaces, [key]: { ...surface, border: value } },
                                })
                            }
                        />
                        <Slider
                            label='Shadow'
                            value={surface.shadow}
                            min={0}
                            max={100}
                            unit='%'
                            onChange={(value) =>
                                updateSection('glass', {
                                    surfaces: { ...glass.surfaces, [key]: { ...surface, shadow: value } },
                                })
                            }
                        />
                    </EditorSection>
                );
            })}
        </>
    );
};

const SIDEBAR_MODES = [
    { value: 'default' as const, label: 'Default' },
    { value: 'compact' as const, label: 'Compact' },
    { value: 'large' as const, label: 'Large' },
    { value: 'icon-only' as const, label: 'Icon only' },
];

export const SidebarEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { sidebar } = theme;

    return (
        <>
            <EditorSection title='Size & position'>
                <Slider
                    label='Width'
                    value={sidebar.width}
                    min={180}
                    max={360}
                    unit='px'
                    onChange={(value) => updateSection('sidebar', { width: value })}
                />
                <Slider
                    label='Collapsed width'
                    value={sidebar.collapsedWidth}
                    min={48}
                    max={120}
                    unit='px'
                    onChange={(value) => updateSection('sidebar', { collapsedWidth: value })}
                />
                <Segmented
                    label='Mode'
                    value={sidebar.mode}
                    options={SIDEBAR_MODES}
                    onChange={(value) => updateSection('sidebar', { mode: value })}
                />
            </EditorSection>

            <EditorSection title='Appearance'>
                <Slider
                    label='Transparency'
                    value={sidebar.transparency}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('sidebar', { transparency: value })}
                />
                <Slider
                    label='Blur'
                    value={sidebar.blur}
                    min={0}
                    max={60}
                    unit='px'
                    onChange={(value) => updateSection('sidebar', { blur: value })}
                />
                <Slider
                    label='Radius'
                    value={sidebar.radius}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => updateSection('sidebar', { radius: value })}
                />
                <Slider
                    label='Shadow'
                    value={sidebar.shadow}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('sidebar', { shadow: value })}
                />
                <ColorField
                    label='Background'
                    value={sidebar.background || theme.colors.dark.surface}
                    onChange={(value) => updateSection('sidebar', { background: value })}
                />
                <Toggle
                    label='Border'
                    checked={sidebar.border}
                    onChange={(value) => updateSection('sidebar', { border: value })}
                />
            </EditorSection>

            <EditorSection title='Active item'>
                <Toggle
                    label='Accent'
                    checked={sidebar.active.accent}
                    onChange={(value) => updateSection('sidebar', { active: { ...sidebar.active, accent: value } })}
                />
                <Toggle
                    label='Glow'
                    checked={sidebar.active.glow}
                    onChange={(value) => updateSection('sidebar', { active: { ...sidebar.active, glow: value } })}
                />
                <Toggle
                    label='Border'
                    checked={sidebar.active.border}
                    onChange={(value) => updateSection('sidebar', { active: { ...sidebar.active, border: value } })}
                />
                <ColorField
                    label='Background'
                    value={sidebar.active.background || theme.colors.accent}
                    onChange={(value) => updateSection('sidebar', { active: { ...sidebar.active, background: value } })}
                />
            </EditorSection>
        </>
    );
};

const NAVBAR_MODES = [
    { value: 'solid' as const, label: 'Solid' },
    { value: 'glass' as const, label: 'Glass' },
    { value: 'floating' as const, label: 'Floating' },
    { value: 'minimal' as const, label: 'Minimal' },
];

export const NavbarEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { navbar } = theme;

    return (
        <>
            <EditorSection title='Style'>
                <Segmented
                    label='Mode'
                    value={navbar.mode}
                    options={NAVBAR_MODES}
                    onChange={(value) => updateSection('navbar', { mode: value })}
                />
                <Slider
                    label='Height'
                    value={navbar.height}
                    min={40}
                    max={96}
                    unit='px'
                    onChange={(value) => updateSection('navbar', { height: value })}
                />
                <Slider
                    label='Transparency'
                    value={navbar.transparency}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('navbar', { transparency: value })}
                />
                <Slider
                    label='Blur'
                    value={navbar.blur}
                    min={0}
                    max={60}
                    unit='px'
                    onChange={(value) => updateSection('navbar', { blur: value })}
                />
                <ColorField
                    label='Background'
                    value={navbar.background || theme.colors.dark.surface}
                    onChange={(value) => updateSection('navbar', { background: value })}
                />
                <Toggle
                    label='Border'
                    checked={navbar.border}
                    onChange={(value) => updateSection('navbar', { border: value })}
                />
                <Slider
                    label='Shadow'
                    value={navbar.shadow}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('navbar', { shadow: value })}
                />
            </EditorSection>
        </>
    );
};

const CARD_STYLES = [
    { value: 'flat' as const, label: 'Flat' },
    { value: 'glass' as const, label: 'Glass' },
    { value: 'elevated' as const, label: 'Elevated' },
    { value: 'floating' as const, label: 'Floating' },
    { value: 'minimal' as const, label: 'Minimal' },
];

const HOVER_EFFECTS = [
    { value: 'none' as const, label: 'None' },
    { value: 'lift' as const, label: 'Lift' },
    { value: 'glow' as const, label: 'Glow' },
    { value: 'scale' as const, label: 'Scale' },
];

export const CardsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { cards } = theme;

    return (
        <>
            <EditorSection title='Style'>
                <Segmented
                    label='Card style'
                    value={cards.style}
                    options={CARD_STYLES}
                    onChange={(value) => updateSection('cards', { style: value })}
                />
                <Segmented
                    label='Hover effect'
                    value={cards.hoverEffect}
                    options={HOVER_EFFECTS}
                    onChange={(value) => updateSection('cards', { hoverEffect: value })}
                />
            </EditorSection>

            <EditorSection title='Surface'>
                <Slider
                    label='Opacity'
                    value={cards.opacity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('cards', { opacity: value })}
                />
                <Slider
                    label='Blur'
                    value={cards.blur}
                    min={0}
                    max={60}
                    unit='px'
                    onChange={(value) => updateSection('cards', { blur: value })}
                />
                <Slider
                    label='Radius'
                    value={cards.radius}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => updateSection('cards', { radius: value })}
                />
                <Slider
                    label='Shadow'
                    value={cards.shadow}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('cards', { shadow: value })}
                />
                <Slider
                    label='Padding'
                    value={cards.padding}
                    min={8}
                    max={40}
                    unit='px'
                    onChange={(value) => updateSection('cards', { padding: value })}
                />
                <Toggle
                    label='Border'
                    checked={cards.border}
                    onChange={(value) => updateSection('cards', { border: value })}
                />
                <ColorField
                    label='Background'
                    value={cards.background || theme.colors.dark.surface}
                    onChange={(value) => updateSection('cards', { background: value })}
                />
            </EditorSection>
        </>
    );
};

export const ButtonsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { buttons } = theme;

    const variants: Array<{ key: keyof typeof buttons.variants; label: string }> = [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'ghost', label: 'Ghost' },
        { key: 'outline', label: 'Outline' },
        { key: 'danger', label: 'Danger' },
        { key: 'success', label: 'Success' },
    ];

    return (
        <>
            <EditorSection title='Shape'>
                <Slider
                    label='Radius'
                    value={buttons.radius}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => updateSection('buttons', { radius: value })}
                />
                <Slider
                    label='Height'
                    value={buttons.height}
                    min={28}
                    max={64}
                    unit='px'
                    onChange={(value) => updateSection('buttons', { height: value })}
                />
                <Slider
                    label='Padding X'
                    value={buttons.paddingX}
                    min={6}
                    max={40}
                    unit='px'
                    onChange={(value) => updateSection('buttons', { paddingX: value })}
                />
                <Slider
                    label='Font weight'
                    value={buttons.fontWeight}
                    min={400}
                    max={900}
                    step={100}
                    onChange={(value) => updateSection('buttons', { fontWeight: value })}
                />
                <Slider
                    label='Disabled opacity'
                    value={buttons.disabledOpacity}
                    min={10}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('buttons', { disabledOpacity: value })}
                />
                <Toggle
                    label='Border'
                    checked={buttons.border}
                    onChange={(value) => updateSection('buttons', { border: value })}
                />
                <Slider
                    label='Shadow'
                    value={buttons.shadow}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('buttons', { shadow: value })}
                />
            </EditorSection>

            {variants.map(({ key, label }) => (
                <EditorSection key={key} title={`${label} variant`}>
                    <ColorField
                        label='Background'
                        value={buttons.variants[key].background || theme.colors.accent}
                        onChange={(value) =>
                            updateSection('buttons', {
                                variants: {
                                    ...buttons.variants,
                                    [key]: { ...buttons.variants[key], background: value },
                                },
                            })
                        }
                    />
                    <ColorField
                        label='Text'
                        value={buttons.variants[key].text || '#ffffff'}
                        onChange={(value) =>
                            updateSection('buttons', {
                                variants: { ...buttons.variants, [key]: { ...buttons.variants[key], text: value } },
                            })
                        }
                    />
                </EditorSection>
            ))}
        </>
    );
};

export const InputsEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { inputs } = theme;

    return (
        <>
            <EditorSection title='Shape'>
                <Slider
                    label='Radius'
                    value={inputs.radius}
                    min={0}
                    max={32}
                    unit='px'
                    onChange={(value) => updateSection('inputs', { radius: value })}
                />
                <Slider
                    label='Height'
                    value={inputs.height}
                    min={28}
                    max={64}
                    unit='px'
                    onChange={(value) => updateSection('inputs', { height: value })}
                />
                <Slider
                    label='Padding X'
                    value={inputs.paddingX}
                    min={6}
                    max={40}
                    unit='px'
                    onChange={(value) => updateSection('inputs', { paddingX: value })}
                />
            </EditorSection>

            <EditorSection title='Surface'>
                <ColorField
                    label='Background'
                    value={inputs.background || theme.colors.dark.surface}
                    onChange={(value) => updateSection('inputs', { background: value })}
                />
                <ColorField
                    label='Border'
                    value={inputs.border || theme.colors.dark.border}
                    onChange={(value) => updateSection('inputs', { border: value })}
                />
                <Slider
                    label='Focus ring'
                    value={inputs.focusRing}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('inputs', { focusRing: value })}
                />
            </EditorSection>
        </>
    );
};
