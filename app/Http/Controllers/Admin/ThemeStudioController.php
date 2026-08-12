<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

class ThemeStudioController extends Controller
{
    public const SETTINGS_KEY = 'pigeon:theme';

    /**
     * Allowed mime types and their file extensions for theme media uploads.
     */
    private const MEDIA_TYPES = [
        'image/png' => 'png',
        'image/jpeg' => 'jpg',
        'image/webp' => 'webp',
        'image/avif' => 'avif',
        'image/svg+xml' => 'svg',
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
    ];

    /**
     * The maximum size (in bytes) of an uploaded media file.
     */
    private const MAX_MEDIA_SIZE = 15728640;

    /**
     * ThemeStudioController constructor.
     */
    public function __construct(private SettingsRepositoryInterface $settings)
    {
    }

    /**
     * Redirect the admin sidebar entry to the client-side Theme Studio.
     */
    public function index(): RedirectResponse
    {
        return redirect('/theme-studio');
    }

    /**
     * Store an uploaded background image or video and return its public URL.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360'],
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('file');
        $extension = self::MEDIA_TYPES[$file->getMimeType()] ?? null;

        if (is_null($extension)) {
            return response()->json(['success' => false, 'error' => 'Unsupported file type.'], 422);
        }

        if ($file->getSize() > self::MAX_MEDIA_SIZE) {
            return response()->json(['success' => false, 'error' => 'File is too large (15MB maximum).'], 422);
        }

        $path = 'uploads/theme/' . Str::random(24) . '.' . $extension;
        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        return response()->json(['success' => true, 'url' => Storage::disk('public')->url($path)]);
    }

    /**
     * Publish a theme configuration for all panel users.
     *
     * Any data-URL media embedded in the payload is persisted as a static file
     * so the stored configuration remains small enough for the settings table.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    public function publish(Request $request): JsonResponse
    {
        $request->validate([
            'theme' => 'required|array',
            'theme.meta.schema' => 'required|string|in:pigeon-theme',
        ]);

        $theme = $request->input('theme');
        $theme = $this->persistEmbeddedMedia($theme);

        $this->settings->set(self::SETTINGS_KEY, json_encode($theme));

        return response()->json(['success' => true]);
    }

    /**
     * Clear the published theme so the panel falls back to its default design.
     */
    public function reset(Request $request): JsonResponse
    {
        $this->settings->forget(self::SETTINGS_KEY);

        return response()->json(['success' => true]);
    }

    /**
     * Recursively replace data-URL media with stored static file URLs.
     */
    private function persistEmbeddedMedia(array $theme): array
    {
        $paths = [
            'branding.favicon',
            'branding.loginLogo',
            'branding.sidebarLogo',
            'branding.loadingLogo',
            'branding.logoLight',
            'branding.logoDark',
            'background.image.data',
            'background.video.data',
            'background.video.poster',
            'background.video.fallbackImage',
            'login.backgroundImage',
            'login.backgroundVideo',
        ];

        foreach ($paths as $path) {
            $value = data_get($theme, $path);
            if (!is_string($value) || !str_starts_with($value, 'data:')) {
                continue;
            }

            $url = $this->storeDataUrl($value);
            if (!is_null($url)) {
                data_set($theme, $path, $url);
            }
        }

        return $theme;
    }

    /**
     * Decode a data URL and store it as a public file, returning the URL.
     */
    private function storeDataUrl(string $dataUrl): ?string
    {
        if (!preg_match('#^data:([^;,]+);base64,(.*)$#s', $dataUrl, $matches)) {
            return null;
        }

        $mime = strtolower($matches[1]);
        $extension = self::MEDIA_TYPES[$mime] ?? null;
        if (is_null($extension)) {
            return null;
        }

        $decoded = base64_decode($matches[2], true);
        if ($decoded === false || strlen($decoded) > self::MAX_MEDIA_SIZE) {
            return null;
        }

        $path = 'uploads/theme/' . Str::random(24) . '.' . $extension;
        Storage::disk('public')->put($path, $decoded);

        return Storage::disk('public')->url($path);
    }
}
