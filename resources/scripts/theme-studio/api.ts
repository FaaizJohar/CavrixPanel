import http from '@/api/http';
import { ThemeConfig } from '@/theme-studio/config';

export interface UploadResponse {
    success: boolean;
    url: string;
}

/**
 * Uploads a background image or video to the admin theme media store and
 * returns its public URL.
 */
export const uploadThemeMedia = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);

    const { data } = await http.post<UploadResponse>('/admin/theme-studio/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!data.success || !data.url) {
        throw new Error('Upload failed.');
    }

    return data.url;
};

/**
 * Publishes a theme configuration so every panel user sees it.
 */
export const publishTheme = async (theme: ThemeConfig): Promise<void> => {
    const { data } = await http.post('/admin/theme-studio/publish', { theme });

    if (!data?.success) {
        throw new Error('Publishing failed.');
    }
};

/**
 * Clears the published theme so the panel returns to its default design.
 */
export const resetTheme = async (): Promise<void> => {
    const { data } = await http.post('/admin/theme-studio/reset');

    if (!data?.success) {
        throw new Error('Reset failed.');
    }
};
