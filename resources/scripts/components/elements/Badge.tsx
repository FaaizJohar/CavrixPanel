import React from 'react';
import classNames from 'classnames';

export type BadgeTone = 'default' | 'success' | 'danger' | 'warning' | 'info';

interface Props {
    tone?: BadgeTone;
    dot?: boolean;
    dotTone?: string;
    className?: string;
    children: React.ReactNode;
}

const Badge: React.FC<Props> = ({ tone = 'default', dot, dotTone, className, children }) => (
    <span
        className={classNames(
            'pg-badge',
            tone === 'success' && 'pg-badge-success',
            tone === 'danger' && 'pg-badge-danger',
            tone === 'warning' && 'pg-badge-warning',
            tone === 'info' && 'pg-badge-info',
            className
        )}
    >
        {dot && <span className={classNames('pg-status', dotTone && `pg-status-${dotTone}`)} />}
        {children}
    </span>
);

export default Badge;
