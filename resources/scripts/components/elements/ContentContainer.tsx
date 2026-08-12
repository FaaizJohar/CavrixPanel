import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import tw from 'twin.macro';

const ContentContainer = styled.div`
    ${tw`px-4 sm:px-6 lg:px-8 py-4 sm:py-6`};

    ${breakpoint('xl')`
        ${tw`mx-auto max-w-screen-2xl`};
    `};
`;
ContentContainer.displayName = 'ContentContainer';
ContentContainer.defaultProps = {
    className: 'content-container',
};

export default ContentContainer;
