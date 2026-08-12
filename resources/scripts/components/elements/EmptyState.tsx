import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    icon?: IconProp;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    compact?: boolean;
}

const EmptyState: React.FC<Props> = ({ icon, title, description, children, compact }) => (
    <div className='pg-empty' style={compact ? { padding: '28px 16px' } : undefined}>
        {icon && (
            <div className='pg-empty-icon'>
                <FontAwesomeIcon icon={icon} className='w-6 h-6' fixedWidth />
            </div>
        )}
        {title && <div className='pg-empty-title'>{title}</div>}
        {description && <div className='pg-empty-description'>{description}</div>}
        {children}
    </div>
);

export default EmptyState;
