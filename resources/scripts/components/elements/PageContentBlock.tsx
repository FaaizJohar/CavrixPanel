import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import FlashMessageRender from '@/components/FlashMessageRender';
import { PigeonLogo } from '@/components/pigeon/Logo';
import tw from 'twin.macro';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`min-h-[60vh]`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <div css={tw`px-4 sm:px-6 lg:px-8 pb-8`}>
                    <div css={tw`mx-auto max-w-screen-2xl`}>
                        <p css={tw`flex items-center justify-center gap-2 text-center text-xs text-neutral-500`}>
                            <span css={tw`inline-flex items-center`} aria-hidden='true'>
                                <PigeonLogo size={14} />
                            </span>
                            <a
                                rel={'noopener nofollow noreferrer'}
                                href={'/'}
                                css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
                            >
                                Pigeon Panel
                            </a>
                            <span aria-hidden='true'>&copy;</span> 2022 - {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
