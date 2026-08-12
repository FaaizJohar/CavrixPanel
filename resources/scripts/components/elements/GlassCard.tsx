import React from 'react';
import classNames from 'classnames';

interface Props {
    glass?: boolean;
    hoverable?: boolean;
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const GlassCard: React.FC<Props> = ({ glass = true, hoverable = false, className, children, style }) => (
    <div
        style={style}
        className={classNames(glass ? 'pg-card-glass' : 'pg-panel', hoverable && 'pg-panel-hover', className)}
    >
        {children}
    </div>
);

export default GlassCard;
