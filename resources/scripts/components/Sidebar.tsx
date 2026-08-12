import React, { ReactNode, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Can from '@/components/elements/Can';
import { PigeonBrand } from '@/components/pigeon/Brand';

export interface SidebarLink {
    to?: string;
    href?: string;
    target?: string;
    name: string;
    icon: IconProp;
    exact?: boolean;
    permission?: string | string[];
    badge?: ReactNode;
    external?: boolean;
}

export interface SidebarSection {
    label?: string;
    links: SidebarLink[];
    defaultOpen?: boolean;
}

interface Props {
    sections: SidebarSection[];
}

const toggleMobile = (open: boolean) => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        if (open) {
            sidebar.classList.add('active-nav');
        } else {
            sidebar.classList.remove('active-nav');
        }
    }
};

const Sidebar: React.FC<Props> = ({ sections }) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        sections.forEach((section, index) => {
            if (section.label !== undefined) {
                initial[index] = section.defaultOpen ?? false;
            }
        });
        return initial;
    });

    useEffect(() => {
        document.body.classList.add('pg-has-sidebar');
        return () => {
            document.body.classList.remove('pg-has-sidebar');
        };
    }, []);

    useEffect(() => {
        setOpenSections((state) => {
            const next = { ...state };
            sections.forEach((section, index) => {
                if (section.label !== undefined && next[index] === undefined) {
                    next[index] = section.defaultOpen ?? false;
                }
            });
            return next;
        });
    }, [sections]);

    const renderLink = (link: SidebarLink) => {
        const linkElement = link.external ? (
            <a
                key={link.name}
                href={link.href}
                target={link.target}
                rel={link.target ? 'noreferrer noopener' : undefined}
                className='pg-nav-item'
                onClick={() => toggleMobile(false)}
            >
                <FontAwesomeIcon icon={link.icon} fixedWidth />
                <span className='pg-truncate'>{link.name}</span>
                {link.badge}
            </a>
        ) : (
            <NavLink
                key={link.name}
                to={link.to!}
                exact={link.exact}
                className='pg-nav-item'
                onClick={() => toggleMobile(false)}
                activeClassName='active'
            >
                <FontAwesomeIcon icon={link.icon} fixedWidth />
                <span className='pg-truncate'>{link.name}</span>
                {link.badge}
            </NavLink>
        );

        return link.permission ? (
            <Can key={link.name} action={link.permission} matchAny>
                {linkElement}
            </Can>
        ) : (
            linkElement
        );
    };

    return (
        <nav className='pg-sidebar' id='sidebar' aria-label='Primary navigation'>
            <div className='pg-sidebar-header'>
                <PigeonBrand size={22} />
                <button
                    type='button'
                    className='pg-icon-btn pg-sidebar-close'
                    aria-label='Close navigation'
                    onClick={() => toggleMobile(false)}
                >
                    <FontAwesomeIcon icon={faTimes} fixedWidth />
                </button>
            </div>
            <div className='pg-sidebar-scroll'>
                {sections.map((section, index) => {
                    if (section.label !== undefined) {
                        const isOpen = !!openSections[index];
                        return (
                            <div className='pg-nav-section' key={`section-${section.label}-${index}`}>
                                <button
                                    type='button'
                                    className='pg-nav-toggle'
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenSections((state) => ({ ...state, [index]: !state[index] }))}
                                >
                                    <span>{section.label}</span>
                                    <FontAwesomeIcon icon={faChevronRight} className='pg-nav-chevron' fixedWidth />
                                </button>
                                {isOpen && <div>{section.links.map(renderLink)}</div>}
                            </div>
                        );
                    }

                    return (
                        <div className='pg-nav-section' key={`section-${index}`}>
                            {section.links.map(renderLink)}
                        </div>
                    );
                })}
            </div>
            <div className='pg-sidebar-footer'>
                <span className='pg-sidebar-footer-brand'>Pigeon Panel</span>
            </div>
        </nav>
    );
};

export default Sidebar;
