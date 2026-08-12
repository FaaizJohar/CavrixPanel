import React from 'react';
import { ThemeSection } from '@/theme-studio/config';
import {
    AppearanceEditor,
    ColorsEditor,
    LayoutEditor,
    RadiusEditor,
    ShadowsEditor,
    TypographyEditor,
} from '@/theme-studio/editors/core';
import {
    BackgroundEditor,
    ButtonsEditor,
    CardsEditor,
    GlassEditor,
    InputsEditor,
    NavbarEditor,
    SidebarEditor,
} from '@/theme-studio/editors/surfaces';
import { AnimationsEditor, CursorEditor, EffectsEditor } from '@/theme-studio/editors/effects';
import { AdvancedEditor, BrandingEditor, LoginEditor } from '@/theme-studio/editors/misc';

export interface SectionMeta {
    key: ThemeSection;
    label: string;
    group: string;
    component: React.ComponentType;
}

export const SECTIONS: SectionMeta[] = [
    { key: 'appearance', label: 'Appearance', group: 'General', component: AppearanceEditor },
    { key: 'colors', label: 'Colors', group: 'General', component: ColorsEditor },
    { key: 'typography', label: 'Typography', group: 'General', component: TypographyEditor },
    { key: 'layout', label: 'Layout', group: 'General', component: LayoutEditor },
    { key: 'radius', label: 'Radius', group: 'General', component: RadiusEditor },
    { key: 'shadows', label: 'Shadows', group: 'General', component: ShadowsEditor },
    { key: 'background', label: 'Background', group: 'Surfaces', component: BackgroundEditor },
    { key: 'glass', label: 'Glassmorphism', group: 'Surfaces', component: GlassEditor },
    { key: 'sidebar', label: 'Sidebar', group: 'Surfaces', component: SidebarEditor },
    { key: 'navbar', label: 'Navbar', group: 'Surfaces', component: NavbarEditor },
    { key: 'cards', label: 'Cards', group: 'Surfaces', component: CardsEditor },
    { key: 'buttons', label: 'Buttons', group: 'Surfaces', component: ButtonsEditor },
    { key: 'inputs', label: 'Inputs', group: 'Surfaces', component: InputsEditor },
    { key: 'effects', label: 'Effects', group: 'Mood', component: EffectsEditor },
    { key: 'animations', label: 'Animations', group: 'Mood', component: AnimationsEditor },
    { key: 'cursor', label: 'Cursor', group: 'Mood', component: CursorEditor },
    { key: 'branding', label: 'Branding', group: 'Identity', component: BrandingEditor },
    { key: 'login', label: 'Login Page', group: 'Identity', component: LoginEditor },
    { key: 'advanced', label: 'Advanced', group: 'Identity', component: AdvancedEditor },
];

export const SECTION_BY_KEY = SECTIONS.reduce<Record<ThemeSection, SectionMeta>>((map, section) => {
    map[section.key] = section;
    return map;
}, {} as Record<ThemeSection, SectionMeta>);

export const SECTION_GROUPS = SECTIONS.reduce<Record<string, SectionMeta[]>>((groups, section) => {
    if (!groups[section.group]) groups[section.group] = [];
    groups[section.group].push(section);
    return groups;
}, {} as Record<string, SectionMeta[]>);
