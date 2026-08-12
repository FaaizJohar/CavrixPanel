import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: number | string;
    height?: number | string;
    rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, width = '100%', height = 14, rounded = true }) => (
    <div
        className={`pg-skeleton ${rounded ? 'pg-skeleton-rounded' : ''} ${className || ''}`}
        style={{ width, height }}
        aria-hidden='true'
    />
);

export default Skeleton;
