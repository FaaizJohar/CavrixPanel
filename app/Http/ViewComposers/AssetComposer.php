<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Controllers\Admin\ThemeStudioController;

class AssetComposer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(
        private AssetHashService $assetHashService,
        private SettingsRepositoryInterface $settings,
    ) {
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'theme' => $this->getPublishedTheme(),
        ]);
    }

    /**
     * Load the published theme configuration, if one exists.
     */
    private function getPublishedTheme(): ?array
    {
        try {
            $raw = $this->settings->get(ThemeStudioController::SETTINGS_KEY);
        } catch (\Throwable $exception) {
            return null;
        }

        if (empty($raw) || !is_string($raw)) {
            return null;
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded) || !isset($decoded['meta']) || ($decoded['meta']['schema'] ?? null) !== 'pigeon-theme') {
            return null;
        }

        return $decoded;
    }
}
