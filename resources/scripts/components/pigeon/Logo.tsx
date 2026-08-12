import React from 'react';
import logo from '@/assets/pigeon-logo.png';

interface LogoProps {
    size?: number;
    className?: string;
}

/**
 * Pigeon Panel brand mark.
 */
export const PigeonLogo: React.FC<LogoProps> = ({ size = 28, className }) => (
    <img src={logo} width={size} height={size} alt='Pigeon Panel' className={className} />
);

export default PigeonLogo;
