import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import Spinner from '@/components/elements/Spinner';
import isEqual from 'react-fast-compare';
import { StatusPill } from '@/components/pigeon/primitives';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const ResourceBar: React.FC<{
    label: string;
    value: string;
    percent: number | null;
    alarm: boolean;
    icon: React.ReactNode;
}> = ({ label, value, percent, alarm, icon }) => (
    <div css={{ minWidth: 0 }}>
        <div
            css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                marginBottom: '0.35rem',
            }}
        >
            <span
                css={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    color: 'var(--pg-text-muted)',
                }}
            >
                {icon}
                {label}
            </span>
            <span
                css={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: alarm ? 'var(--pg-danger)' : 'var(--pg-text)',
                    whiteSpace: 'nowrap',
                }}
            >
                {value}
            </span>
        </div>
        <div className={'pg-progress'}>
            {percent !== null ? (
                <div
                    className={'pg-progress-fill'}
                    data-tone={alarm ? 'danger' : percent >= 0.9 ? 'warn' : undefined}
                    css={{ width: `${Math.min(100, Math.max(2, percent))}%` }}
                />
            ) : (
                <div
                    css={{
                        height: '100%',
                        width: '100%',
                        borderRadius: 'var(--pg-radius-full)',
                        background: 'transparent',
                    }}
                />
            )}
        </div>
    </div>
);

type Timer = ReturnType<typeof setInterval>;

const ServerRow: React.FC<{ server: Server; className?: string }> = ({ server, className }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended || server.isNodeUnderMaintenance) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended, server.isNodeUnderMaintenance]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const cpuPercent = stats
        ? server.limits.cpu === 0
            ? Math.min(100, stats.cpuUsagePercent)
            : (stats.cpuUsagePercent / server.limits.cpu) * 100
        : null;
    const memoryPercent = stats
        ? server.limits.memory === 0
            ? null
            : (stats.memoryUsageInBytes / mbToBytes(server.limits.memory)) * 100
        : null;
    const diskPercent = stats
        ? server.limits.disk === 0
            ? null
            : (stats.diskUsageInBytes / mbToBytes(server.limits.disk)) * 100
        : null;

    const defaultAllocation = server.allocations.find((allocation) => allocation.isDefault);

    const busy =
        isSuspended ||
        server.isNodeUnderMaintenance ||
        server.isTransferring ||
        server.status === 'installing' ||
        server.status === 'restoring_backup';

    return (
        <Link
            to={`/server/${server.id}`}
            className={className}
            css={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.1rem',
                background: 'var(--pg-surface)',
                border: '1px solid var(--pg-border)',
                borderRadius: 'var(--pg-radius)',
                boxShadow: 'var(--pg-shadow-sm)',
                color: 'var(--pg-text)',
                textDecoration: 'none',
                transition:
                    'border-color 150ms var(--pg-ease), transform 150ms var(--pg-ease), box-shadow 150ms var(--pg-ease)',
                '&:hover': {
                    borderColor: 'var(--pg-border-strong)',
                    boxShadow: 'var(--pg-shadow)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <div css={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                    css={{
                        flex: 'none',
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: 'calc(var(--pg-radius) - 4px)',
                        background: 'linear-gradient(135deg, var(--pg-accent-600), var(--pg-accent-400))',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px color-mix(in srgb, var(--pg-accent-500) 35%, transparent)',
                    }}
                    aria-hidden='true'
                >
                    <FontAwesomeIcon icon={faServer} css={{ width: '1.1rem' }} />
                </div>
                <div css={{ flex: 1, minWidth: 0 }}>
                    <p
                        css={{
                            margin: 0,
                            fontSize: '0.95rem',
                            fontWeight: 650,
                            letterSpacing: '-0.01em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {server.name}
                    </p>
                    {server.description && (
                        <p
                            css={{
                                margin: '0.15rem 0 0',
                                fontSize: '0.78rem',
                                color: 'var(--pg-text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {server.description}
                        </p>
                    )}
                </div>
                <StatusPill
                    status={stats?.status || server.status || 'unknown'}
                    extra={
                        server.isNodeUnderMaintenance
                            ? 'maintenance'
                            : server.isTransferring
                            ? 'transferring'
                            : undefined
                    }
                    css={{ flex: 'none', marginTop: '0.1rem' }}
                />
            </div>

            {!busy ? (
                <div css={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem' }}>
                    <ResourceBar
                        label={'CPU'}
                        value={stats ? `${stats.cpuUsagePercent.toFixed(0)}%` : '—'}
                        percent={stats ? cpuPercent : null}
                        alarm={alarms.cpu}
                        icon={<FontAwesomeIcon icon={faMicrochip} css={{ width: '0.75rem' }} />}
                    />
                    <ResourceBar
                        label={'RAM'}
                        value={stats ? bytesToString(stats.memoryUsageInBytes) : '—'}
                        percent={stats ? memoryPercent : null}
                        alarm={alarms.memory}
                        icon={<FontAwesomeIcon icon={faMemory} css={{ width: '0.75rem' }} />}
                    />
                    <ResourceBar
                        label={'Disk'}
                        value={stats ? bytesToString(stats.diskUsageInBytes) : '—'}
                        percent={stats ? diskPercent : null}
                        alarm={alarms.disk}
                        icon={<FontAwesomeIcon icon={faHdd} css={{ width: '0.75rem' }} />}
                    />
                </div>
            ) : (
                <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '2.4rem' }}>
                    {stats ? (
                        <span css={{ fontSize: '0.78rem', color: 'var(--pg-text-muted)' }}>
                            Resource usage unavailable for this server state.
                        </span>
                    ) : (
                        <Spinner size={'small'} />
                    )}
                </div>
            )}

            <div
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginTop: 'auto',
                }}
            >
                <span
                    css={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.75rem',
                        color: 'var(--pg-text-faint)',
                        minWidth: 0,
                    }}
                >
                    <FontAwesomeIcon icon={faEthernet} css={{ width: '0.8rem', flex: 'none' }} />
                    {defaultAllocation ? (
                        <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {defaultAllocation.alias || ip(defaultAllocation.ip)}:{defaultAllocation.port}
                        </span>
                    ) : (
                        'No allocation'
                    )}
                </span>
                <span
                    css={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: 'var(--pg-radius-sm)',
                        background: 'var(--pg-hover-bg)',
                        color: 'var(--pg-text)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        flex: 'none',
                        transition: 'background 120ms ease, color 120ms ease',
                    }}
                >
                    <FontAwesomeIcon icon={faTerminal} css={{ width: '0.75rem' }} />
                    Console
                </span>
            </div>
        </Link>
    );
};

export default memo(ServerRow, isEqual);
