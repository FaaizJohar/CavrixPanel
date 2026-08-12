import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBell,
    faCogs,
    faMoon,
    faSearch,
    faSignOutAlt,
    faSun,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import { usePigeonTheme } from '@/theme';
import { useCommandPalette } from '@/components/pigeon/CommandPalette';
import { Kbd } from '@/components/pigeon/primitives';

const onTriggerNavButton = () => {
    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.classList.toggle('active-nav');
    }
};

const breadcrumbFor = (pathname: string): string | null => {
    if (pathname === '/') {
        return 'Dashboard';
    }

    if (pathname.startsWith('/server/')) {
        const segments = pathname.split('/').filter(Boolean);
        return segments.length > 1 ? segments[segments.length - 1] : null;
    }

    if (pathname.startsWith('/account')) {
        const section = pathname.split('/')[2];
        if (!section) return 'Account';
        return section.charAt(0).toUpperCase() + section.slice(1);
    }

    return null;
};

interface Props {
    serverName?: string;
}

export default ({ serverName }: Props) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { mode, setMode, resolvedTheme } = usePigeonTheme();
    const { openPalette } = useCommandPalette();

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
                setAccountOpen(false);
            }
        };

        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const onToggleTheme = () => {
        if (mode === 'system') {
            setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
        } else {
            setMode(mode === 'dark' ? 'light' : 'dark');
        }
    };

    const breadcrumb = serverName ?? breadcrumbFor(location.pathname);

    const accountSection =
        location.pathname === '/' ||
        location.pathname.startsWith('/account') ||
        location.pathname.startsWith('/server');

    return (
        <div className={'pg-topbar'}>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'pg-topbar-inner'}>
                <div className={'pg-topbar-left'}>
                    {accountSection && (
                        <button
                            className={'pg-icon-btn pg-topbar-burger'}
                            onClick={onTriggerNavButton}
                            aria-label={'Toggle navigation'}
                        >
                            <FontAwesomeIcon icon={faBars} css={{ width: '1rem' }} />
                        </button>
                    )}

                    <div className={'pg-topbar-breadcrumb'}>
                        <Link to={'/'} className={'pg-topbar-crumb pg-topbar-home'}>
                            {name}
                        </Link>
                        {breadcrumb && (
                            <>
                                <span className={'pg-topbar-sep'}>/</span>
                                <span className={'pg-topbar-current'}>{breadcrumb}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className={'pg-topbar-actions'}>
                    <button className={'pg-topbar-search'} onClick={openPalette} aria-label={'Open command palette'}>
                        <FontAwesomeIcon icon={faSearch} css={{ width: '0.9rem' }} />
                        <span className={'pg-topbar-search-text'}>Search</span>
                        <span className={'pg-topbar-search-kbd'}>
                            <Kbd>⌘K</Kbd>
                        </span>
                    </button>

                    <Tooltip
                        placement={'bottom'}
                        content={mode === 'dark' || resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        <button className={'pg-icon-btn'} onClick={onToggleTheme} aria-label={'Toggle theme'}>
                            <FontAwesomeIcon icon={resolvedTheme === 'dark' ? faSun : faMoon} css={{ width: '1rem' }} />
                        </button>
                    </Tooltip>

                    <Tooltip placement={'bottom'} content={'Notifications'}>
                        <button className={'pg-icon-btn'} aria-label={'Notifications'}>
                            <span className={'pg-notif-dot'} aria-hidden='true' />
                            <FontAwesomeIcon icon={faBell} css={{ width: '1rem' }} />
                        </button>
                    </Tooltip>

                    <div ref={accountRef} className={'pg-account'}>
                        <button
                            className={'pg-account-trigger'}
                            onClick={() => setAccountOpen((state) => !state)}
                            aria-haspopup={'menu'}
                            aria-expanded={accountOpen}
                        >
                            <span className={'pg-account-avatar'}>
                                <Avatar.User />
                            </span>
                            <span className={'pg-account-caret'}>
                                <FontAwesomeIcon icon={faUser} css={{ width: '0.8rem' }} />
                            </span>
                        </button>

                        {accountOpen && (
                            <div className={'pg-account-menu'} role={'menu'}>
                                <div className={'pg-account-menu-head'}>
                                    <span className={'pg-account-menu-name'}>My Account</span>
                                </div>
                                <Link
                                    to={'/account'}
                                    role={'menuitem'}
                                    className={'pg-account-menu-item'}
                                    onClick={() => setAccountOpen(false)}
                                >
                                    <FontAwesomeIcon icon={faUser} css={{ width: '0.9rem' }} />
                                    Profile
                                </Link>
                                {rootAdmin && (
                                    <a
                                        href={'/admin'}
                                        role={'menuitem'}
                                        rel={'noreferrer'}
                                        className={'pg-account-menu-item'}
                                        onClick={() => setAccountOpen(false)}
                                    >
                                        <FontAwesomeIcon icon={faCogs} css={{ width: '0.9rem' }} />
                                        Administration
                                    </a>
                                )}
                                <div className={'pg-account-menu-divider'} />
                                <button
                                    role={'menuitem'}
                                    className={'pg-account-menu-item pg-account-menu-item--danger'}
                                    onClick={onTriggerLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} css={{ width: '0.9rem' }} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
