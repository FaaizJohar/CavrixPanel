import React from 'react';
import styled from 'styled-components/macro';
import { PigeonLogo } from '@/components/pigeon/Logo';
import { ShieldCheckIcon, ServerIcon, SparklesIcon } from '@heroicons/react/outline';

const Shell = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 3rem 1.25rem;
    overflow: hidden;
    background: var(--pg-canvas);

    &::before {
        content: '';
        position: fixed;
        top: -24rem;
        left: 50%;
        transform: translateX(-50%);
        width: 72rem;
        height: 72rem;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            color-mix(in srgb, var(--pg-accent-600) 18%, transparent) 0%,
            color-mix(in srgb, var(--pg-accent-700) 8%, transparent) 42%,
            transparent 68%
        );
        pointer-events: none;
    }

    &::after {
        content: '';
        position: fixed;
        bottom: -18rem;
        right: -12rem;
        width: 46rem;
        height: 46rem;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            color-mix(in srgb, var(--pg-accent-700) 12%, transparent) 0%,
            transparent 64%
        );
        pointer-events: none;
    }
`;

const Grid = styled.div`
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1040px;
    align-items: center;

    @media (min-width: 900px) {
        grid-template-columns: 1.05fr 1fr;
        gap: 3.5rem;
    }
`;

const Brand = styled.div`
    display: none;
    flex-direction: column;
    padding: 1rem 0;

    @media (min-width: 900px) {
        display: flex;
    }
`;

const BrandRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.9rem;
`;

const BrandLogo = styled.div`
    display: grid;
    place-items: center;
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 0.9rem;
    background: linear-gradient(135deg, var(--pg-accent-500), var(--pg-accent-700));
    box-shadow: 0 12px 32px -10px color-mix(in srgb, var(--pg-accent-600) 60%, transparent);

    img {
        width: 1.9rem;
        height: 1.9rem;
        filter: brightness(0) invert(1);
    }
`;

const BrandTitle = styled.div`
    color: var(--pg-text);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
`;

const BrandSub = styled.div`
    margin-top: 0.2rem;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--pg-text-muted);
`;

const Tagline = styled.p`
    margin: 1.6rem 0 0;
    max-width: 24rem;
    font-size: 1.05rem;
    line-height: 1.6;
    font-weight: 500;
    color: var(--pg-text);
`;

const Features = styled.ul`
    list-style: none;
    margin: 2rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Feature = styled.li`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.85rem;
    color: var(--pg-text-muted);

    svg {
        flex: none;
        width: 1.15rem;
        height: 1.15rem;
        color: var(--pg-accent-400);
    }
`;

const FormSide = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MobileBrand = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    img {
        width: 2.75rem;
        height: 2.75rem;
    }

    @media (min-width: 900px) {
        display: none;
    }
`;

const MobileTitle = styled.div`
    color: var(--pg-text);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
`;

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Shell>
        <Grid>
            <Brand>
                <BrandRow>
                    <BrandLogo>
                        <PigeonLogo size={30} />
                    </BrandLogo>
                    <div>
                        <BrandTitle>Pigeon Panel</BrandTitle>
                        <BrandSub>Server Control</BrandSub>
                    </div>
                </BrandRow>
                <Tagline>
                    Your servers, all in one place. A modern control panel built for speed, security, and total control.
                </Tagline>
                <Features>
                    <Feature>
                        <ServerIcon />
                        Manage every server from a single, unified dashboard.
                    </Feature>
                    <Feature>
                        <ShieldCheckIcon />
                        Role-based access, two-factor authentication, and full audit logging.
                    </Feature>
                    <Feature>
                        <SparklesIcon />A customizable interface that adapts to the way you work.
                    </Feature>
                </Features>
            </Brand>
            <FormSide>
                <MobileBrand>
                    <PigeonLogo size={44} />
                    <MobileTitle>Pigeon Panel</MobileTitle>
                </MobileBrand>
                {children}
            </FormSide>
        </Grid>
    </Shell>
);

export default AuthLayout;
