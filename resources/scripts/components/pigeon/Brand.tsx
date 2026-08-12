import React from 'react';
import { PigeonLogo } from '@/components/pigeon/Logo';

interface BrandProps {
    compact?: boolean;
    className?: string;
    size?: number;
}

/**
 * Pigeon Panel wordmark lockup.
 */
export const PigeonBrand: React.FC<BrandProps> = ({ compact, className, size = 26 }) => {
    if (compact) {
        return <PigeonLogo size={size} className={className} />;
    }

    return (
        <span className={className} css={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <PigeonLogo size={size} />
            <span css={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span
                    css={{
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--pg-text)',
                    }}
                >
                    Pigeon
                </span>
                <span
                    css={{
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: 'var(--pg-text-muted)',
                    }}
                >
                    Panel
                </span>
            </span>
        </span>
    );
};

export default PigeonBrand;
