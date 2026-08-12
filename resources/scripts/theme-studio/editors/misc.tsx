import React, { useState } from 'react';
import { LoginButtonStyle, LoginCardStyle } from '@/theme-studio/config';
import { uploadThemeMedia } from '@/theme-studio/api';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import {
    ColorField,
    EditorSection,
    MediaField,
    Segmented,
    Slider,
    TextAreaField,
    TextField,
    Toggle,
} from '@/theme-studio/controls';

export const BrandingEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { branding } = theme;
    const [uploading, setUploading] = useState(false);

    const handleLogo = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadThemeMedia(file);
            const field = file.type === 'image/svg+xml' ? 'loginLogo' : 'sidebarLogo';
            updateSection('branding', { [field]: url });
        } catch (e) {
            console.warn('Logo upload failed.', e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <EditorSection title='Identity'>
                <TextField
                    label='Panel name'
                    value={branding.panelName}
                    onChange={(value) => updateSection('branding', { panelName: value })}
                />
                <TextAreaField
                    label='Panel description'
                    value={branding.panelDescription}
                    rows={2}
                    onChange={(value) => updateSection('branding', { panelDescription: value })}
                />
                <TextField
                    label='Browser title'
                    value={branding.browserTitle}
                    onChange={(value) => updateSection('branding', { browserTitle: value })}
                />
                <TextField
                    label='Login title'
                    value={branding.loginTitle}
                    onChange={(value) => updateSection('branding', { loginTitle: value })}
                />
                <TextField
                    label='Footer text'
                    value={branding.footerText}
                    onChange={(value) => updateSection('branding', { footerText: value })}
                />
            </EditorSection>

            <EditorSection title='Logos' hint='SVG uploads are used as the login logo.'>
                <MediaField
                    label='Login logo'
                    value={branding.loginLogo || ''}
                    uploading={uploading}
                    onSelect={handleLogo}
                    onClear={() => updateSection('branding', { loginLogo: null })}
                />
                <MediaField
                    label='Sidebar logo'
                    value={branding.sidebarLogo || ''}
                    uploading={uploading}
                    onSelect={handleLogo}
                    onClear={() => updateSection('branding', { sidebarLogo: null })}
                />
                <MediaField
                    label='Favicon'
                    value={branding.favicon || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('branding', { favicon: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('branding', { favicon: null })}
                />
                <MediaField
                    label='Loading logo'
                    value={branding.loadingLogo || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('branding', { loadingLogo: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('branding', { loadingLogo: null })}
                />
                <MediaField
                    label='Logo (light)'
                    value={branding.logoLight || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('branding', { logoLight: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('branding', { logoLight: null })}
                />
                <MediaField
                    label='Logo (dark)'
                    value={branding.logoDark || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('branding', { logoDark: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('branding', { logoDark: null })}
                />
            </EditorSection>
        </>
    );
};

const LOGIN_CARD_STYLES: Array<{ value: LoginCardStyle; label: string }> = [
    { value: 'flat', label: 'Flat' },
    { value: 'glass', label: 'Glass' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'minimal', label: 'Minimal' },
];

const LOGIN_BUTTON_STYLES: Array<{ value: LoginButtonStyle; label: string }> = [
    { value: 'solid', label: 'Solid' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
];

export const LoginEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { login } = theme;
    const uploading = false;

    return (
        <>
            <EditorSection title='Copy'>
                <TextField
                    label='Headline'
                    value={login.headline}
                    onChange={(value) => updateSection('login', { headline: value })}
                />
                <TextField
                    label='Description'
                    value={login.description}
                    onChange={(value) => updateSection('login', { description: value })}
                />
            </EditorSection>

            <EditorSection title='Card'>
                <Segmented
                    label='Card style'
                    value={login.cardStyle}
                    options={LOGIN_CARD_STYLES}
                    onChange={(value) => updateSection('login', { cardStyle: value })}
                />
                <Segmented
                    label='Button style'
                    value={login.buttonStyle}
                    options={LOGIN_BUTTON_STYLES}
                    onChange={(value) => updateSection('login', { buttonStyle: value })}
                />
                <Slider
                    label='Glass'
                    value={login.glass}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('login', { glass: value })}
                />
            </EditorSection>

            <EditorSection title='Background'>
                <Toggle
                    label='Use global background'
                    checked={login.useGlobalBackground}
                    onChange={(value) => updateSection('login', { useGlobalBackground: value })}
                />
                <ColorField
                    label='Accent'
                    value={login.accent || theme.colors.accent}
                    onChange={(value) => updateSection('login', { accent: value })}
                />
                <ColorField
                    label='Overlay'
                    value={login.overlay}
                    onChange={(value) => updateSection('login', { overlay: value })}
                />
                <Slider
                    label='Overlay opacity'
                    value={login.overlayOpacity}
                    min={0}
                    max={100}
                    unit='%'
                    onChange={(value) => updateSection('login', { overlayOpacity: value })}
                />
                <Slider
                    label='Blur'
                    value={login.blur}
                    min={0}
                    max={60}
                    unit='px'
                    onChange={(value) => updateSection('login', { blur: value })}
                />
                <MediaField
                    label='Background image'
                    value={login.backgroundImage || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('login', { backgroundImage: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('login', { backgroundImage: null })}
                />
                <MediaField
                    label='Background video'
                    value={login.backgroundVideo || ''}
                    uploading={uploading}
                    onSelect={async (file) => updateSection('login', { backgroundVideo: await uploadThemeMedia(file) })}
                    onClear={() => updateSection('login', { backgroundVideo: null })}
                />
            </EditorSection>
        </>
    );
};

export const AdvancedEditor: React.FC = () => {
    const { theme, updateSection } = useThemeStudio();
    const { advanced } = theme;

    const variablesText = Object.entries(advanced.cssVariables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');

    const handleVariables = (text: string) => {
        const cssVariables: Record<string, string> = {};
        text.split('\n').forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.includes(':')) return;
            const index = trimmed.indexOf(':');
            const key = trimmed.slice(0, index).trim();
            const value = trimmed
                .slice(index + 1)
                .replace(/;$/, '')
                .trim();
            if (/^--[a-z0-9-]+$/i.test(key)) {
                cssVariables[key] = value;
            }
        });
        updateSection('advanced', { cssVariables });
    };

    return (
        <>
            <EditorSection title='Custom CSS' hint='Appended to the stylesheet after every generated rule.'>
                <TextAreaField
                    label='CSS'
                    value={advanced.customCss}
                    rows={8}
                    onChange={(value) => updateSection('advanced', { customCss: value })}
                />
            </EditorSection>

            <EditorSection title='Custom variables' hint='One `--name: value;` per line. Merged into the token set.'>
                <TextAreaField label='Variables' value={variablesText} rows={6} onChange={handleVariables} />
            </EditorSection>
        </>
    );
};
