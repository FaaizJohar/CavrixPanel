import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faCheck,
    faCloud,
    faCog,
    faDatabase,
    faHome,
    faServer,
    faTerminal,
    faTimes,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { PigeonLogo } from '@/components/pigeon/Logo';
import { useThemeStudio } from '@/theme-studio/ThemeStudio';
import { StatusPill } from '@/components/pigeon/primitives';

const shellStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'transparent',
};

const navbarStyle: React.CSSProperties = {
    height: 'var(--pg-topbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.1rem',
    background: 'var(--pg-glass-bg)',
    backdropFilter: 'blur(var(--pg-blur))',
    borderBottom: '1px solid var(--pg-border)',
    flex: 'none',
};

const iconBtnStyle: React.CSSProperties = {
    width: '2.1rem',
    height: '2.1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--pg-radius-sm)',
    color: 'var(--pg-text-muted)',
    border: '1px solid transparent',
    background: 'transparent',
    cursor: 'pointer',
};

const ThemePreview: React.FC = () => {
    const { theme } = useThemeStudio();
    const { branding, cards } = theme;

    return (
        <div style={shellStyle}>
            {/* Navbar */}
            <div style={navbarStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <PigeonLogo size={20} />
                    <span
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            color: 'var(--pg-text)',
                        }}
                    >
                        {branding.panelName}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button type='button' style={iconBtnStyle}>
                        <FontAwesomeIcon icon={faBell} css={{ width: '0.85rem' }} />
                    </button>
                    <button type='button' style={iconBtnStyle}>
                        <FontAwesomeIcon icon={faCog} css={{ width: '0.85rem' }} />
                    </button>
                    <div
                        style={{
                            width: '1.9rem',
                            height: '1.9rem',
                            borderRadius: 'var(--pg-radius-full)',
                            background: 'var(--pg-accent-500)',
                            color: 'var(--pg-accent-text)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            marginLeft: '0.35rem',
                        }}
                    >
                        FA
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: 'calc(var(--pg-sidebar-width) * 0.9)',
                        flex: 'none',
                        background: 'var(--pg-glass-bg)',
                        backdropFilter: 'blur(var(--pg-blur))',
                        borderRight: '1px solid var(--pg-border)',
                        padding: '0.8rem 0.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem',
                    }}
                >
                    {[
                        { icon: faHome, label: 'Overview', active: true },
                        { icon: faServer, label: 'All Servers', active: false },
                        { icon: faTerminal, label: 'Console', active: false },
                        { icon: faDatabase, label: 'Databases', active: false },
                        { icon: faUsers, label: 'Account', active: false },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={classNames({ active: item.active })}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.5rem 0.65rem',
                                borderRadius: 'var(--pg-radius-sm)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: item.active ? 'var(--pg-accent-text)' : 'var(--pg-text-muted)',
                                background: item.active ? 'var(--pg-accent-500)' : 'transparent',
                            }}
                        >
                            <FontAwesomeIcon icon={item.icon} css={{ width: '0.85rem' }} />
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '1rem 1.2rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    color: 'var(--pg-text)',
                                }}
                            >
                                Overview
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--pg-text-muted)' }}>
                                A live preview of your theme applied to the panel shell.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type='button'
                                style={{
                                    height: 'var(--pg-button-height)',
                                    padding: `0 ${cards.padding}px`,
                                    borderRadius: 'var(--pg-radius-button)',
                                    background: 'var(--pg-accent-500)',
                                    color: 'var(--pg-accent-text)',
                                    border: '1px solid var(--pg-accent-600)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Create Server
                            </button>
                            <button
                                type='button'
                                style={{
                                    height: 'var(--pg-button-height)',
                                    padding: '0 1rem',
                                    borderRadius: 'var(--pg-radius-button)',
                                    background: 'rgb(var(--pg-n-600) / 0.6)',
                                    color: 'var(--pg-text)',
                                    border: '1px solid var(--pg-border)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '0.8rem',
                            marginBottom: '1rem',
                        }}
                    >
                        {[
                            { label: 'Total Servers', value: '12' },
                            { label: 'Ready', value: '10' },
                            { label: 'Suspended', value: '1' },
                            { label: 'Maintenance', value: '1' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className='pg-card-glass'
                                style={{
                                    padding: 'calc(var(--pg-card-padding) * 0.8)',
                                    borderRadius: 'var(--pg-radius-card)',
                                    background: 'var(--pg-card-bg)',
                                    backdropFilter: 'blur(var(--pg-card-blur))',
                                    border: '1px solid var(--pg-card-border)',
                                    boxShadow: 'var(--pg-card-shadow)',
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: 'var(--pg-text-muted)',
                                    }}
                                >
                                    {stat.label}
                                </p>
                                <p
                                    style={{
                                        margin: '0.25rem 0 0',
                                        fontSize: '1.4rem',
                                        fontWeight: 700,
                                        color: 'var(--pg-text)',
                                    }}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Server rows */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.7rem',
                        }}
                    >
                        {[
                            { name: 'Cavrix Node', status: 'running', desc: 'Node 1 · 2048 MB' },
                            { name: 'Uplink', status: 'running', desc: 'Node 2 · 1024 MB' },
                            { name: 'Pigeon DNS', status: 'offline', desc: 'Node 1 · 512 MB' },
                        ].map((server) => (
                            <div
                                key={server.name}
                                className='pg-card-glass'
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.8rem',
                                    padding: 'calc(var(--pg-card-padding) * 0.8)',
                                    borderRadius: 'var(--pg-radius-card)',
                                    background: 'var(--pg-card-bg)',
                                    backdropFilter: 'blur(var(--pg-card-blur))',
                                    border: '1px solid var(--pg-card-border)',
                                    boxShadow: 'var(--pg-card-shadow)',
                                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                                    <span
                                        style={{
                                            width: '2.3rem',
                                            height: '2.3rem',
                                            flex: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 'var(--pg-radius-sm)',
                                            background: 'var(--pg-accent-500)',
                                            color: 'var(--pg-accent-text)',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faServer} css={{ width: '0.9rem' }} />
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                color: 'var(--pg-text)',
                                            }}
                                        >
                                            {server.name}
                                        </p>
                                        <p
                                            style={{
                                                margin: '0.1rem 0 0',
                                                fontSize: '0.72rem',
                                                color: 'var(--pg-text-muted)',
                                            }}
                                        >
                                            {server.desc}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 'none' }}>
                                    <StatusPill status={server.status} />
                                    <button
                                        type='button'
                                        style={{
                                            width: '2rem',
                                            height: '2rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 'var(--pg-radius-sm)',
                                            background: 'rgb(var(--pg-n-600) / 0.6)',
                                            border: '1px solid var(--pg-border)',
                                            color: 'var(--pg-text-muted)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCloud} css={{ width: '0.8rem' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input / badges demo */}
                    <div
                        className='pg-card-glass'
                        style={{
                            marginTop: '1rem',
                            padding: 'calc(var(--pg-card-padding) * 0.8)',
                            borderRadius: 'var(--pg-radius-card)',
                            background: 'var(--pg-card-bg)',
                            backdropFilter: 'blur(var(--pg-card-blur))',
                            border: '1px solid var(--pg-card-border)',
                            boxShadow: 'var(--pg-card-shadow)',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                            <span
                                style={{
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: 'var(--pg-radius-badge)',
                                    background: 'color-mix(in srgb, var(--pg-accent-500) 14%, transparent)',
                                    color: 'var(--pg-accent-400)',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                }}
                            >
                                ACTIVE
                            </span>
                            <span
                                style={{
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: 'var(--pg-radius-badge)',
                                    background: 'rgb(34 197 94 / 0.12)',
                                    color: 'rgb(74 222 128)',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                }}
                            >
                                ONLINE
                            </span>
                            <span
                                style={{
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: 'var(--pg-radius-badge)',
                                    background: 'rgb(239 68 68 / 0.12)',
                                    color: 'rgb(248 113 113)',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                }}
                            >
                                OFFLINE
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type='text'
                                placeholder='Search servers…'
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    height: 'var(--pg-input-height)',
                                    padding: `0 var(--pg-input-padding-x)`,
                                    borderRadius: 'var(--pg-radius-input)',
                                    background: 'var(--pg-input-bg)',
                                    border: '1px solid var(--pg-input-border)',
                                    color: 'var(--pg-text)',
                                    fontSize: '0.78rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type='button'
                                style={{
                                    height: 'var(--pg-input-height)',
                                    padding: '0 1rem',
                                    borderRadius: 'var(--pg-radius-input)',
                                    background: 'var(--pg-accent-500)',
                                    color: 'var(--pg-accent-text)',
                                    border: '1px solid var(--pg-accent-600)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    {/* Modal mock */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '1.2rem',
                            paddingBottom: '1rem',
                        }}
                    >
                        <div
                            style={{
                                width: 'min(360px, 90%)',
                                borderRadius: 'var(--pg-radius-modal)',
                                background: 'var(--pg-modal-bg)',
                                backdropFilter: 'blur(var(--pg-glass-modal-blur, 20px))',
                                border: '1px solid var(--pg-border)',
                                boxShadow: 'var(--pg-shadow-lg)',
                                padding: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.6rem',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--pg-text)' }}>
                                    Confirm action
                                </p>
                                <button type='button' style={{ ...iconBtnStyle, width: '1.6rem', height: '1.6rem' }}>
                                    <FontAwesomeIcon icon={faTimes} css={{ width: '0.8rem' }} />
                                </button>
                            </div>
                            <p style={{ margin: '0 0 0.8rem', fontSize: '0.78rem', color: 'var(--pg-text-muted)' }}>
                                This action will restart the selected servers. Continue?
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                    type='button'
                                    style={{
                                        height: 'var(--pg-button-height)',
                                        padding: '0 1rem',
                                        borderRadius: 'var(--pg-radius-button)',
                                        background: 'rgb(var(--pg-n-600) / 0.6)',
                                        border: '1px solid var(--pg-border)',
                                        color: 'var(--pg-text)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    style={{
                                        height: 'var(--pg-button-height)',
                                        padding: '0 1rem',
                                        borderRadius: 'var(--pg-radius-button)',
                                        background: 'var(--pg-danger)',
                                        border: '1px solid var(--pg-danger)',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck} css={{ width: '0.7rem', marginRight: '0.3rem' }} />
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemePreview;
