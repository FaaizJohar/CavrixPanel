import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { faExternalLinkAlt, faHome, faServer } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from '@/components/NavigationBar';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import Sidebar, { SidebarSection } from '@/components/Sidebar';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverName = ServerContext.useStoreState((state) => state.server.data?.name);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    const sections: SidebarSection[] = [
        {
            links: [
                { to: to('/'), name: 'Overview', icon: faHome, exact: true },
                { to: to('/'), name: 'All Servers', icon: faServer, exact: true },
            ],
        },
        {
            label: 'Server',
            defaultOpen: true,
            links: routes.server
                .filter((route) => !!route.name)
                .map((route) => ({
                    to: to(route.path, true),
                    name: route.name!,
                    icon: route.iconProp as IconProp,
                    exact: route.exact,
                    permission: route.permission || undefined,
                })),
        },
    ];

    if (rootAdmin) {
        sections.push({
            label: 'Administration',
            defaultOpen: false,
            links: [
                {
                    href: `/admin/servers/view/${serverId}`,
                    name: 'Admin',
                    icon: faExternalLinkAlt,
                    external: true,
                    target: '_blank',
                },
            ],
        });
    }

    return (
        <React.Fragment key={'server-router'}>
            <div className={'pg-app'}>
                <NavigationBar serverName={serverName} />
                {!uuid || !id ? (
                    error ? (
                        <ServerError message={error} />
                    ) : (
                        <Spinner size={'large'} centered />
                    )
                ) : (
                    <>
                        <div className={'pg-shell'}>
                            <CSSTransition timeout={150} classNames={'fade'} appear in>
                                <Sidebar sections={sections} />
                            </CSSTransition>
                            <main className={'pg-content'}>
                                <InstallListener />
                                <TransferListener />
                                <WebsocketHandler />
                                {inConflictState &&
                                (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                    <ConflictStateRenderer />
                                ) : (
                                    <ErrorBoundary>
                                        <TransitionRouter>
                                            <Switch location={location}>
                                                {routes.server.map(({ path, permission, component: Component }) => (
                                                    <PermissionRoute
                                                        key={path}
                                                        permission={permission}
                                                        path={to(path)}
                                                        exact
                                                    >
                                                        <Spinner.Suspense>
                                                            <Component />
                                                        </Spinner.Suspense>
                                                    </PermissionRoute>
                                                ))}
                                                <Route path={'*'} component={NotFound} />
                                            </Switch>
                                        </TransitionRouter>
                                    </ErrorBoundary>
                                )}
                            </main>
                        </div>
                    </>
                )}
            </div>
        </React.Fragment>
    );
};
