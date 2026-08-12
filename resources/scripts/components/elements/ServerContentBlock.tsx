import PageContentBlock, { PageContentBlockProps } from '@/components/elements/PageContentBlock';
import React from 'react';
import { Link } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { StatusPill } from '@/components/pigeon/primitives';
import { ip } from '@/lib/formatters';

interface Props extends PageContentBlockProps {
    title: string;
}

const ServerContentBlock: React.FC<Props> = ({ title, children, ...props }) => {
    const server = ServerContext.useStoreState((state) => state.server.data!);
    const name = server.name;

    const defaultAllocation = server.allocations.find((allocation) => allocation.isDefault);

    return (
        <PageContentBlock title={`${name} | ${title}`} {...props}>
            <header
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                }}
            >
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
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
                        <FontAwesomeIcon icon={faTerminal} css={{ width: '1.1rem' }} />
                    </div>
                    <div css={{ minWidth: 0 }}>
                        <h1
                            css={{
                                margin: 0,
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--pg-text)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {name}
                        </h1>
                        <div
                            css={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                marginTop: '0.25rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <StatusPill
                                status={server.status || 'unknown'}
                                extra={
                                    server.isNodeUnderMaintenance
                                        ? 'maintenance'
                                        : server.isTransferring
                                        ? 'transferring'
                                        : undefined
                                }
                            />
                            {defaultAllocation && (
                                <span css={{ fontSize: '0.78rem', color: 'var(--pg-text-muted)' }}>
                                    {defaultAllocation.alias || ip(defaultAllocation.ip)}:{defaultAllocation.port}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 'none' }}>
                    <Link
                        to={`/server/${server.id}/console`}
                        css={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.9rem',
                            borderRadius: 'var(--pg-radius-sm)',
                            background: 'var(--pg-accent-600)',
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'background-color 150ms var(--pg-ease)',
                            '&:hover': { background: 'var(--pg-accent-500)' },
                        }}
                    >
                        <FontAwesomeIcon icon={faTerminal} css={{ width: '0.85rem' }} />
                        Open Console
                    </Link>
                </div>
            </header>
            {children}
        </PageContentBlock>
    );
};

export default ServerContentBlock;
