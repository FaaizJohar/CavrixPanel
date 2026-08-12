import { createBreakpoint } from 'styled-components-breakpoint';

export const breakpoint = createBreakpoint({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
});

export * from '@/theme/tokens';
export { ThemeEngineProvider, usePigeonTheme } from '@/theme/ThemeEngine';
