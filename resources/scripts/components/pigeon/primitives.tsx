import React from 'react';
import classNames from 'classnames';
import styled, { CSSObject } from 'styled-components/macro';

interface KbdProps {
    className?: string;
    children: React.ReactNode;
}

export const Kbd: React.FC<KbdProps> = ({ className, children }) => (
    <kbd className={classNames('pg-kbd', className)}>{children}</kbd>
);

interface SectionTitleProps {
    className?: string;
    children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ className, children }) => (
    <h2 className={classNames('pg-title', className)}>{children}</h2>
);

interface StatusDotProps {
    tone: 'online' | 'offline' | 'starting' | 'stopping' | 'installing' | 'restoring' | 'suspended';
    className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ tone, className }) => (
    <span
        className={classNames('pg-status', tone !== 'offline' && `pg-status-${tone}`, className)}
        aria-hidden='true'
    />
);

interface PageHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, className }) => (
    <div
        className={className}
        css={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
        }}
    >
        <div css={{ minWidth: 0 }}>
            <h1
                css={{
                    margin: 0,
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    color: 'var(--pg-text)',
                }}
            >
                {title}
            </h1>
            {subtitle && (
                <p css={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--pg-text-muted)', maxWidth: '56ch' }}>
                    {subtitle}
                </p>
            )}
        </div>
        {actions && <div css={{ flex: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{actions}</div>}
    </div>
);

type StatCardAccent = 'accent' | 'ok' | 'danger' | 'warn';

interface StatCardProps {
    label: string;
    value: React.ReactNode;
    accent?: StatCardAccent;
    icon?: React.ReactNode;
    hint?: React.ReactNode;
    className?: string;
}

const STAT_CARD_TONES: Record<StatCardAccent, { color: string; background: string }> = {
    accent: {
        color: 'var(--pg-accent-400)',
        background: 'color-mix(in srgb, var(--pg-accent-500) 12%, transparent)',
    },
    ok: { color: 'rgb(74 222 128)', background: 'rgb(34 197 94 / 0.12)' },
    danger: { color: 'rgb(248 113 113)', background: 'rgb(239 68 68 / 0.12)' },
    warn: { color: 'rgb(251 191 36)', background: 'rgb(245 158 11 / 0.12)' },
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, accent = 'accent', icon, hint, className }) => {
    const tone = STAT_CARD_TONES[accent] || STAT_CARD_TONES.accent;

    return (
        <div
            className={classNames('pg-card-glass', className)}
            css={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem' }}
        >
            {icon && (
                <span
                    css={{
                        flex: 'none',
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: 'calc(var(--pg-radius) - 2px)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tone.color,
                        background: tone.background,
                    }}
                >
                    {icon}
                </span>
            )}
            <div css={{ minWidth: 0 }}>
                <p
                    css={{
                        margin: 0,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--pg-text-muted)',
                    }}
                >
                    {label}
                </p>
                <p
                    css={{
                        margin: '0.15rem 0 0',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: 'var(--pg-text)',
                    }}
                >
                    {value}
                </p>
                {hint && (
                    <p css={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--pg-text-faint)' }}>{hint}</p>
                )}
            </div>
        </div>
    );
};

type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'default';

interface StatusMeta {
    label: string;
    tone: StatusTone;
    dot: string;
}

const STATUS_META: Record<string, StatusMeta> = {
    running: { label: 'Running', tone: 'success', dot: 'online' },
    offline: { label: 'Offline', tone: 'default', dot: 'offline' },
    starting: { label: 'Starting', tone: 'warning', dot: 'starting' },
    stopping: { label: 'Stopping', tone: 'warning', dot: 'stopping' },
    installing: { label: 'Installing', tone: 'info', dot: 'installing' },
    restoring_backup: { label: 'Restoring', tone: 'info', dot: 'restoring' },
    suspended: { label: 'Suspended', tone: 'danger', dot: 'suspended' },
};

const metaFor = (status: string, extra?: string): StatusMeta => {
    if (extra === 'maintenance') return { label: 'Maintenance', tone: 'warning', dot: 'offline' };
    if (extra === 'transferring') return { label: 'Transferring', tone: 'info', dot: 'starting' };
    return (
        STATUS_META[status] || {
            label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
            tone: 'default',
            dot: 'offline',
        }
    );
};

const TONE_STYLES: Record<StatusTone, { color: string; background: string; border: string }> = {
    success: { color: 'rgb(74 222 128)', background: 'rgb(34 197 94 / 0.12)', border: 'rgb(34 197 94 / 0.3)' },
    danger: { color: 'rgb(248 113 113)', background: 'rgb(239 68 68 / 0.12)', border: 'rgb(239 68 68 / 0.3)' },
    warning: { color: 'rgb(251 191 36)', background: 'rgb(245 158 11 / 0.12)', border: 'rgb(245 158 11 / 0.3)' },
    info: {
        color: 'var(--pg-accent-400)',
        background: 'color-mix(in srgb, var(--pg-accent-500) 12%, transparent)',
        border: 'color-mix(in srgb, var(--pg-accent-500) 30%, transparent)',
    },
    default: { color: 'var(--pg-text-muted)', background: 'var(--pg-surface-2)', border: 'var(--pg-border)' },
};

const DOT_STYLES: Record<string, { color: string; pulse: boolean }> = {
    online: { color: 'rgb(74 222 128)', pulse: false },
    offline: { color: 'rgb(161 161 170)', pulse: false },
    starting: { color: 'rgb(251 191 36)', pulse: true },
    stopping: { color: 'rgb(251 191 36)', pulse: true },
    installing: { color: 'var(--pg-accent-400)', pulse: true },
    restoring: { color: 'var(--pg-accent-400)', pulse: true },
    suspended: { color: 'rgb(248 113 113)', pulse: false },
};

interface StatusPillProps {
    status: string;
    extra?: string;
    className?: string;
    css?: CSSObject;
}

const StatusPillBase = styled.span<{ tone: StatusTone; dot: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.22rem 0.6rem;
    border-radius: var(--pg-radius-full);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    color: ${(props: { tone: StatusTone }) => TONE_STYLES[props.tone].color};
    background: ${(props: { tone: StatusTone }) => TONE_STYLES[props.tone].background};
    border: 1px solid ${(props: { tone: StatusTone }) => TONE_STYLES[props.tone].border};

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        background: ${(props: { dot: string }) => (DOT_STYLES[props.dot] || DOT_STYLES.offline).color};
        animation: ${(props: { dot: string }) =>
            (DOT_STYLES[props.dot] || DOT_STYLES.offline).pulse ? 'pg-pulse 1.6s ease-in-out infinite' : 'none'};
    }
`;

export const StatusPill: React.FC<StatusPillProps> = ({ status, extra, className, css }) => {
    const meta = metaFor(status, extra);

    return (
        <StatusPillBase className={className} css={css} tone={meta.tone} dot={meta.dot}>
            {meta.label}
        </StatusPillBase>
    );
};
