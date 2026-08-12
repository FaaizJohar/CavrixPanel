import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faCogs, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useStoreState } from 'easy-peasy';
import routes from '@/routers/routes';
import { history } from '@/components/history';
import { ApplicationStore } from '@/state';
import { Kbd } from '@/components/pigeon/primitives';

interface PaletteEntry {
    id: string;
    name: string;
    icon: IconProp;
    section: string;
    to?: string;
    href?: string;
    keywords?: string;
}

interface CommandPaletteContextValue {
    openPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({ openPalette: () => undefined });

export const useCommandPalette = () => useContext(CommandPaletteContext);

const buildEntries = (rootAdmin: boolean): PaletteEntry[] => {
    const entries: PaletteEntry[] = [
        {
            id: 'overview',
            name: 'Overview',
            icon: faHome,
            section: 'Dashboard',
            to: '/',
            keywords: 'home dashboard servers',
        },
        ...routes.account
            .filter((route) => !!route.name)
            .map((route) => ({
                id: `account-${route.path}`,
                name: route.name!,
                icon: route.iconProp as IconProp,
                section: 'Account',
                to: `/account/${route.path}`.replace('//', '/'),
            })),
    ];

    if (rootAdmin) {
        entries.push(
            {
                id: 'admin',
                name: 'Administration',
                icon: faCogs,
                section: 'Administration',
                href: '/admin',
                keywords: 'admin panel',
            },
            {
                id: 'admin-servers',
                name: 'Servers',
                icon: faBoxes,
                section: 'Administration',
                href: '/admin/servers',
            },
            {
                id: 'admin-nodes',
                name: 'Nodes',
                icon: faBoxes,
                section: 'Administration',
                href: '/admin/nodes',
            },
            {
                id: 'admin-users',
                name: 'Users',
                icon: faBoxes,
                section: 'Administration',
                href: '/admin/users',
            },
            {
                id: 'admin-settings',
                name: 'Settings',
                icon: faCogs,
                section: 'Administration',
                href: '/admin/settings',
            }
        );
    }

    return entries;
};

const CommandPalette: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const entries = useMemo(() => buildEntries(rootAdmin), [rootAdmin]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = q
            ? entries.filter((entry) => `${entry.name} ${entry.keywords || ''}`.toLowerCase().includes(q))
            : entries;
        return filtered;
    }, [entries, query]);

    const grouped = useMemo(() => {
        const sections: { name: string; items: PaletteEntry[] }[] = [];
        results.forEach((entry) => {
            const existing = sections.find((section) => section.name === entry.section);
            if (existing) {
                existing.items.push(entry);
            } else {
                sections.push({ name: entry.section, items: [entry] });
            }
        });
        return sections;
    }, [results]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const select = (entry: PaletteEntry) => {
        onClose();
        if (entry.to) {
            history.push(entry.to);
        } else if (entry.href) {
            window.location.href = entry.href;
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const entry = results[activeIndex];
            if (entry) {
                select(entry);
            }
        }
    };

    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '12vh',
                background: 'rgb(0 0 0 / 0.55)',
                WebkitBackdropFilter: 'blur(4px)',
                backdropFilter: 'blur(4px)',
            }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role='dialog'
            aria-modal='true'
            aria-label='Command palette'
        >
            <div className='pg-command' style={{ width: 'min(560px, calc(100vw - 32px))' }}>
                <div className='pg-command-input'>
                    <FontAwesomeIcon
                        icon={faSearch}
                        css={{ width: '1rem', height: '1rem' }}
                        color='var(--pg-text-faint)'
                    />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder='Search the panel…'
                        aria-label='Search the panel'
                    />
                    <Kbd>ESC</Kbd>
                </div>
                <div className='pg-scrollbar-thin' style={{ maxHeight: 'min(420px, 60vh)', overflowY: 'auto' }}>
                    {results.length === 0 && <div className='pg-command-empty'>No matching pages found.</div>}
                    {grouped.map((section) => (
                        <div key={section.name}>
                            <div className='pg-command-group-label'>{section.name}</div>
                            {section.items.map((entry) => {
                                const flatIndex = results.indexOf(entry);
                                return (
                                    <button
                                        key={entry.id}
                                        type='button'
                                        className='pg-command-item'
                                        data-active={flatIndex === activeIndex}
                                        onMouseEnter={() => setActiveIndex(flatIndex)}
                                        onClick={() => select(entry)}
                                    >
                                        <FontAwesomeIcon
                                            icon={entry.icon}
                                            css={{ width: '0.9rem', height: '0.9rem' }}
                                            color='var(--pg-text-faint)'
                                        />
                                        <span>{entry.name}</span>
                                        {entry.href && <span className='pg-caption'>admin</span>}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className='pg-command-input' style={{ borderTop: '1px solid var(--pg-border)', borderBottom: 0 }}>
                    <span className='pg-caption'>Navigate with ↑↓</span>
                    <span className='pg-caption' style={{ marginLeft: 'auto' }}>
                        <Kbd>Enter</Kbd> select
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((value) => !value);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const value = useMemo(() => ({ openPalette: () => setOpen(true) }), []);

    return (
        <CommandPaletteContext.Provider value={value}>
            {children}
            {open && <CommandPalette onClose={() => setOpen(false)} />}
        </CommandPaletteContext.Provider>
    );
};
