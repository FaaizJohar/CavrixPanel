import React, { useCallback, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArchive,
    faDownload,
    faEraser,
    faFileImport,
    faHistory,
    faPalette,
    faSave,
    faTimes,
    faTrash,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { PigeonLogo } from '@/components/pigeon/Logo';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import ThemePreview from '@/theme-studio/ThemePreview';
import { PRESETS } from '@/theme-studio/presets';
import { SECTION_BY_KEY, SECTION_GROUPS } from '@/theme-studio/editors';
import useFlash from '@/plugins/useFlash';

const topbarStyle: React.CSSProperties = {
    height: '3.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0 1rem',
    borderBottom: '1px solid var(--pg-border)',
    background: 'rgb(var(--pg-n-700) / 0.6)',
    backdropFilter: 'blur(18px)',
    flex: 'none',
};

const topbarButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    height: '2.1rem',
    padding: '0 0.75rem',
    borderRadius: 'var(--pg-radius-sm)',
    border: '1px solid var(--pg-border)',
    background: 'rgb(var(--pg-n-600) / 0.6)',
    color: 'var(--pg-text)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
};

const publishButtonStyle: React.CSSProperties = {
    ...topbarButtonStyle,
    background: 'var(--pg-accent-500)',
    borderColor: 'var(--pg-accent-600)',
    color: 'var(--pg-accent-text)',
};

const iconBtn: React.CSSProperties = {
    width: '1.9rem',
    height: '1.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--pg-radius-sm)',
    border: '1px solid transparent',
    background: 'transparent',
    color: 'var(--pg-text-muted)',
    cursor: 'pointer',
};

const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 0.4rem)',
    right: 0,
    zIndex: 60,
    minWidth: '14rem',
    maxHeight: 'min(60vh, 28rem)',
    overflowY: 'auto',
    borderRadius: 'var(--pg-radius)',
    border: '1px solid var(--pg-border)',
    background: 'rgb(var(--pg-n-700) / 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: 'var(--pg-shadow-lg)',
    padding: '0.4rem',
};

const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    width: '100%',
    padding: '0.5rem 0.6rem',
    borderRadius: 'var(--pg-radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--pg-text)',
    fontSize: '0.78rem',
    textAlign: 'left',
    cursor: 'pointer',
};

const ThemeStudioContainer: React.FC = () => {
    const {
        theme,
        published,
        dirty,
        previewing,
        activeSection,
        versions,
        setActiveSection,
        applyPreset,
        resetToDefault,
        resetToPublished,
        importTheme,
        exportTheme,
        saveDraftNow,
        publish,
        resetPublished,
        saveVersion,
        restoreVersion,
        removeVersion,
    } = useThemeStudio();

    const { addFlash, addError } = useFlash();
    const [publishing, setPublishing] = useState(false);
    const [panel, setPanel] = useState<'presets' | 'versions' | 'more' | null>(null);
    const [versionName, setVersionName] = useState('');
    const importRef = useRef<HTMLInputElement>(null);

    const section = SECTION_BY_KEY[activeSection];
    const SectionEditor = section.component;

    const handlePublish = useCallback(async () => {
        setPublishing(true);
        try {
            await publish();
            addFlash({ type: 'success', title: 'Published', message: 'The theme is now live for every user.' });
        } catch (e) {
            addError({ message: 'Failed to publish the theme.' });
            console.error(e);
        } finally {
            setPublishing(false);
        }
    }, [publish, addFlash, addError]);

    const handleResetPublished = useCallback(async () => {
        if (!window.confirm('Reset the published theme to the Pigeon default for all users?')) return;
        try {
            await resetPublished();
            addFlash({ type: 'success', title: 'Reset', message: 'The published theme has been cleared.' });
        } catch (e) {
            addError({ message: 'Failed to reset the theme.' });
            console.error(e);
        }
    }, [resetPublished, addFlash, addError]);

    const handleExport = useCallback(() => {
        const blob = new Blob([exportTheme()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'pigeon-theme.json';
        anchor.click();
        URL.revokeObjectURL(url);
    }, [exportTheme]);

    const handleImport = useCallback(
        async (file: File) => {
            const text = await file.text();
            if (importTheme(text)) {
                addFlash({ type: 'success', title: 'Imported', message: 'Theme imported from the file.' });
            } else {
                addError({ message: 'The file is not a valid Pigeon theme.' });
            }
        },
        [importTheme, addFlash, addError]
    );

    const handleSaveVersion = useCallback(() => {
        saveVersion(versionName.trim());
        setVersionName('');
        setPanel(null);
        addFlash({ type: 'success', title: 'Saved', message: 'Theme version saved.' });
    }, [saveVersion, versionName, addFlash]);

    const navGroups = Object.entries(SECTION_GROUPS);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                background: 'transparent',
            }}
        >
            <input
                ref={importRef}
                type='file'
                accept='.json,application/json'
                style={{ display: 'none' }}
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleImport(file);
                    event.target.value = '';
                }}
            />

            {/* Topbar */}
            <div style={topbarStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <a
                        href='/'
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--pg-text)',
                            textDecoration: 'none',
                        }}
                    >
                        <PigeonLogo size={18} />
                    </a>
                    <span
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            color: 'var(--pg-text)',
                        }}
                    >
                        Theme Studio
                    </span>
                    <span
                        style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '0.12rem 0.45rem',
                            borderRadius: 'var(--pg-radius-full)',
                            background: dirty
                                ? 'color-mix(in srgb, var(--pg-warning) 16%, transparent)'
                                : 'transparent',
                            color: dirty ? 'var(--pg-warning)' : 'var(--pg-text-faint)',
                            border:
                                '1px solid' +
                                (dirty
                                    ? ' color-mix(in srgb, var(--pg-warning) 40%, transparent)'
                                    : ' var(--pg-border)'),
                        }}
                    >
                        {dirty ? 'Unsaved changes' : previewing ? 'Draft' : published ? 'Published' : 'Default'}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 'none' }}>
                    <button
                        type='button'
                        style={topbarButtonStyle}
                        onClick={() => setPanel(panel === 'presets' ? null : 'presets')}
                    >
                        <FontAwesomeIcon icon={faPalette} css={{ width: '0.75rem', marginRight: '0.4rem' }} />
                        Presets
                    </button>
                    <button
                        type='button'
                        style={topbarButtonStyle}
                        onClick={() => setPanel(panel === 'versions' ? null : 'versions')}
                    >
                        <FontAwesomeIcon icon={faHistory} css={{ width: '0.75rem', marginRight: '0.4rem' }} />
                        Versions
                    </button>
                    <button
                        type='button'
                        style={topbarButtonStyle}
                        onClick={() => setPanel(panel === 'more' ? null : 'more')}
                    >
                        <FontAwesomeIcon icon={faArchive} css={{ width: '0.75rem', marginRight: '0.4rem' }} />
                        More
                    </button>
                    <button type='button' style={topbarButtonStyle} onClick={saveDraftNow}>
                        <FontAwesomeIcon icon={faSave} css={{ width: '0.75rem' }} />
                        Save Draft
                    </button>
                    <button type='button' style={publishButtonStyle} onClick={handlePublish} disabled={publishing}>
                        {publishing ? (
                            <span>Publishing…</span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faUpload} css={{ width: '0.8rem' }} />
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* Section nav */}
                <nav
                    style={{
                        width: '14rem',
                        flex: 'none',
                        overflowY: 'auto',
                        borderRight: '1px solid var(--pg-border)',
                        background: 'rgb(var(--pg-n-700) / 0.35)',
                        padding: '0.6rem 0.5rem',
                    }}
                >
                    {navGroups.map(([group, sections]) => (
                        <div key={group} style={{ marginBottom: '0.5rem' }}>
                            <p
                                style={{
                                    margin: '0.4rem 0.6rem 0.3rem',
                                    fontSize: '0.62rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--pg-text-faint)',
                                }}
                            >
                                {group}
                            </p>
                            {sections.map((item) => (
                                <button
                                    key={item.key}
                                    type='button'
                                    onClick={() => setActiveSection(item.key)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.42rem 0.6rem',
                                        borderRadius: 'var(--pg-radius-sm)',
                                        border: 'none',
                                        fontSize: '0.78rem',
                                        fontWeight: item.key === activeSection ? 600 : 500,
                                        color:
                                            item.key === activeSection
                                                ? 'var(--pg-accent-text)'
                                                : 'var(--pg-text-muted)',
                                        background: item.key === activeSection ? 'var(--pg-accent-500)' : 'transparent',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Preview */}
                <section
                    style={{
                        flex: 1,
                        minWidth: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'transparent',
                    }}
                >
                    <ThemePreview />
                </section>

                {/* Editor */}
                <aside
                    style={{
                        width: '21rem',
                        flex: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: '1px solid var(--pg-border)',
                        background: 'rgb(var(--pg-n-700) / 0.45)',
                    }}
                >
                    <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid var(--pg-border)' }}>
                        <p
                            style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                                color: 'var(--pg-text)',
                            }}
                        >
                            {section.label}
                        </p>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--pg-text-faint)' }}>
                            {theme.meta.name} · edits apply to the preview instantly
                        </p>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <SectionEditor />
                    </div>
                </aside>
            </div>

            {/* Dropdown panels */}
            {panel === 'presets' && (
                <div style={{ ...menuStyle, position: 'fixed', top: '3.6rem', right: '1rem', zIndex: 70 }}>
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type='button'
                            style={menuItemStyle}
                            onClick={() => {
                                applyPreset(preset);
                                setPanel(null);
                            }}
                        >
                            <span>
                                <span style={{ display: 'block', fontWeight: 600 }}>{preset.name}</span>
                                <span
                                    style={{
                                        display: 'block',
                                        fontSize: '0.68rem',
                                        color: 'var(--pg-text-faint)',
                                        fontWeight: 400,
                                    }}
                                >
                                    {preset.description}
                                </span>
                            </span>
                            <span style={{ display: 'flex', gap: '0.15rem', flex: 'none' }}>
                                {preset.swatch.map((color) => (
                                    <span
                                        key={color}
                                        style={{
                                            width: '0.7rem',
                                            height: '0.7rem',
                                            borderRadius: '50%',
                                            background: color,
                                            border: '1px solid var(--pg-border)',
                                        }}
                                    />
                                ))}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {panel === 'versions' && (
                <div style={{ ...menuStyle, position: 'fixed', top: '3.6rem', right: '8.5rem', zIndex: 70 }}>
                    <div style={{ padding: '0.3rem 0.4rem 0.5rem', borderBottom: '1px solid var(--pg-border)' }}>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <input
                                type='text'
                                value={versionName}
                                placeholder='Version name…'
                                onChange={(event) => setVersionName(event.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: '0.35rem 0.5rem',
                                    fontSize: '0.75rem',
                                    borderRadius: 'var(--pg-radius-sm)',
                                    border: '1px solid var(--pg-border)',
                                    background: 'rgb(var(--pg-n-600) / 0.6)',
                                    color: 'var(--pg-text)',
                                    outline: 'none',
                                }}
                            />
                            <button type='button' style={topbarButtonStyle} onClick={handleSaveVersion}>
                                Save
                            </button>
                        </div>
                    </div>
                    {versions.length === 0 && (
                        <p style={{ margin: '0.6rem 0.5rem', fontSize: '0.75rem', color: 'var(--pg-text-faint)' }}>
                            No saved versions yet.
                        </p>
                    )}
                    {versions.map((version) => (
                        <div key={version.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <button
                                type='button'
                                style={{ ...menuItemStyle, flex: 1 }}
                                onClick={() => {
                                    restoreVersion(version);
                                    setPanel(null);
                                }}
                            >
                                <span>
                                    <span style={{ display: 'block', fontWeight: 600 }}>{version.name}</span>
                                    <span
                                        style={{
                                            display: 'block',
                                            fontSize: '0.66rem',
                                            color: 'var(--pg-text-faint)',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {new Date(version.createdAt).toLocaleString()}
                                    </span>
                                </span>
                            </button>
                            <button
                                type='button'
                                aria-label='Delete version'
                                onClick={() => removeVersion(version.id)}
                                style={{ ...iconBtn, color: 'var(--pg-danger)' }}
                            >
                                <FontAwesomeIcon icon={faTrash} css={{ width: '0.7rem' }} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {panel === 'more' && (
                <div style={{ ...menuStyle, position: 'fixed', top: '3.6rem', right: '16rem', zIndex: 70 }}>
                    <button type='button' style={menuItemStyle} onClick={handleExport}>
                        <span>
                            <FontAwesomeIcon icon={faDownload} css={{ width: '0.75rem', marginRight: '0.5rem' }} />
                            Export theme
                        </span>
                    </button>
                    <button type='button' style={menuItemStyle} onClick={() => importRef.current?.click()}>
                        <span>
                            <FontAwesomeIcon icon={faFileImport} css={{ width: '0.75rem', marginRight: '0.5rem' }} />
                            Import theme
                        </span>
                    </button>
                    <button
                        type='button'
                        style={menuItemStyle}
                        onClick={() => {
                            resetToDefault();
                            setPanel(null);
                        }}
                    >
                        <span>
                            <FontAwesomeIcon icon={faEraser} css={{ width: '0.75rem', marginRight: '0.5rem' }} />
                            Reset to default
                        </span>
                    </button>
                    <button
                        type='button'
                        style={menuItemStyle}
                        onClick={() => {
                            resetToPublished();
                            setPanel(null);
                        }}
                    >
                        <span>
                            <FontAwesomeIcon icon={faTimes} css={{ width: '0.75rem', marginRight: '0.5rem' }} />
                            Discard draft
                        </span>
                    </button>
                    {published && (
                        <button
                            type='button'
                            style={{ ...menuItemStyle, color: 'var(--pg-danger)' }}
                            onClick={() => {
                                setPanel(null);
                                handleResetPublished();
                            }}
                        >
                            <span>
                                <FontAwesomeIcon icon={faTrash} css={{ width: '0.75rem', marginRight: '0.5rem' }} />
                                Reset published theme
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThemeStudioContainer;
