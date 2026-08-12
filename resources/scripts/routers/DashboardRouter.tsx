import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { faCogs, faGlobe, faHome, faServer, faSitemap, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import Sidebar, { SidebarSection } from '@/components/Sidebar';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const ThemeStudioContainer = lazy(
    () => import(/* webpackChunkName: "theme-studio" */ '@/theme-studio/ThemeStudioContainer')
);

export default () => {
    const location = useLocation();
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);

    const sections: SidebarSection[] = [
        {
            links: [
                { to: '/', name: 'Overview', icon: faHome, exact: true },
                { to: '/', name: 'All Servers', icon: faServer, exact: true },
            ],
        },
    ];

    if (location.pathname.startsWith('/account')) {
        sections.push({
            label: 'Account',
            defaultOpen: true,
            links: routes.account
                .filter((route) => !!route.name)
                .map(({ path, name, exact = false, iconProp }) => ({
                    to: `/account/${path}`.replace('//', '/'),
                    name: name!,
                    icon: iconProp as IconProp,
                    exact,
                })),
        });
    }

    if (rootAdmin) {
        sections.push({
            label: 'Administration',
            defaultOpen: false,
            links: [
                { to: '/theme-studio', name: 'Theme Studio', icon: faPalette, exact: true },
                { href: '/admin/users', name: 'Users', icon: faUsers, external: true, target: '_blank' },
                { href: '/admin/nodes', name: 'Nodes', icon: faSitemap, external: true, target: '_blank' },
                { href: '/admin/locations', name: 'Locations', icon: faGlobe, external: true, target: '_blank' },
                { href: '/admin/settings', name: 'Settings', icon: faCogs, external: true, target: '_blank' },
            ],
        });
    }

    return (
        <div className={'pg-app'}>
            <NavigationBar />
            <div className={'pg-shell'}>
                <Sidebar sections={sections} />

                <main className={'pg-content'}>
                    <TransitionRouter>
                        <React.Suspense fallback={<Spinner centered />}>
                            <Switch location={location}>
                                <Route path={'/theme-studio'} exact>
                                    {rootAdmin ? (
                                        <React.Suspense fallback={<Spinner centered />}>
                                            <ThemeStudioContainer />
                                        </React.Suspense>
                                    ) : (
                                        <NotFound />
                                    )}
                                </Route>
                                <Route path={'/'} exact>
                                    <DashboardContainer />
                                </Route>
                                {routes.account.map(({ path, component: Component }) => (
                                    <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                        <Component />
                                    </Route>
                                ))}
                                <Route path={'*'}>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </TransitionRouter>
                </main>
            </div>
        </div>
    );
};
