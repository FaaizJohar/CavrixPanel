import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPauseCircle, faServer, faTools } from '@fortawesome/free-solid-svg-icons';
import { PageHeader, StatCard } from '@/components/pigeon/primitives';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const username = useStoreState((state) => state.user.data!.username);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const items = servers?.items || [];

    const summary = {
        total: servers?.pagination.total || items.length,
        ready: items.filter(
            (server) =>
                server.status !== 'suspended' &&
                server.status !== 'installing' &&
                server.status !== 'restoring_backup' &&
                !server.isTransferring &&
                !server.isNodeUnderMaintenance
        ).length,
        suspended: items.filter((server) => server.status === 'suspended').length,
        maintenance: items.filter((server) => server.isNodeUnderMaintenance).length,
    };

    const firstName = username.split(' ')[0] || 'there';

    return (
        <PageContentBlock className='content-dashboard' title={'Dashboard'} showFlashKey={'dashboard'}>
            <PageHeader
                title={'Overview'}
                subtitle={`Welcome back, ${firstName}. Here is what is happening across your servers.`}
                actions={
                    rootAdmin ? (
                        <div css={tw`flex items-center gap-2`}>
                            <p css={tw`uppercase text-xs text-neutral-400 mr-1`}>
                                {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                            </p>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </div>
                    ) : undefined
                }
            />

            {servers && (
                <div
                    css={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.9rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <StatCard
                        label={'Total Servers'}
                        value={summary.total}
                        accent={'accent'}
                        icon={<FontAwesomeIcon icon={faServer} css={{ width: '1rem' }} />}
                        hint={'Across your account'}
                    />
                    <StatCard
                        label={'Ready'}
                        value={summary.ready}
                        accent={'ok'}
                        icon={<FontAwesomeIcon icon={faCheckCircle} css={{ width: '1rem' }} />}
                        hint={'Operational and responsive'}
                    />
                    <StatCard
                        label={'Suspended'}
                        value={summary.suspended}
                        accent={'danger'}
                        icon={<FontAwesomeIcon icon={faPauseCircle} css={{ width: '1rem' }} />}
                        hint={'Payment or policy holds'}
                    />
                    <StatCard
                        label={'Maintenance'}
                        value={summary.maintenance}
                        accent={'warn'}
                        icon={<FontAwesomeIcon icon={faTools} css={{ width: '1rem' }} />}
                        hint={'Nodes under maintenance'}
                    />
                </div>
            )}

            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div
                                css={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                                    gap: '1rem',
                                }}
                            >
                                {items.map((server) => (
                                    <ServerRow key={server.uuid} server={server} />
                                ))}
                            </div>
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-400 py-10`}>
                                {showOnlyAdmin
                                    ? 'There are no other servers to display.'
                                    : 'There are no servers associated with your account.'}
                            </p>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
