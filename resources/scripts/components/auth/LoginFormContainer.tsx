import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
};

const Container = styled.div`
    width: 100%;
    max-width: 440px;
`;

const Card = styled.div`
    position: relative;
    padding: 2.5rem 2rem 1.9rem;
    border-radius: 1.25rem;
    background: var(--pg-glass-bg);
    border: 1px solid var(--pg-glass-border);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.55);

    &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 14%;
        right: 14%;
        height: 2px;
        border-radius: 0 0 999px 999px;
        background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--pg-accent-500) 80%, transparent),
            transparent
        );
        pointer-events: none;
    }
`;

const Heading = styled.div`
    text-align: center;
    margin-bottom: 1.4rem;

    h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--pg-text);
    }

    p {
        margin: 0.4rem 0 0;
        font-size: 0.8rem;
        color: var(--pg-text-muted);
    }
`;

const Footer = styled.p`
    margin: 1.5rem 0 0;
    text-align: center;
    font-size: 0.7rem;
    color: var(--pg-text-faint);

    a {
        color: inherit;
        text-decoration: none;

        &:hover {
            color: var(--pg-text-muted);
        }
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <Container>
        <Card>
            {(title || subtitle) && (
                <Heading>
                    {title && <h2>{title}</h2>}
                    {subtitle && <p>{subtitle}</p>}
                </Heading>
            )}
            <FlashMessageRender css={tw`mb-2`} />
            <Form {...props} ref={ref}>
                {props.children}
            </Form>
        </Card>
        <Footer>&copy; 2015 - {new Date().getFullYear()} Pigeon Panel.</Footer>
    </Container>
));
