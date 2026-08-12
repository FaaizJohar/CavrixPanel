# Pigeon Panel

Pigeon Panel is a free, open-source game server management panel built on [Pterodactyl](https://pterodactyl.io) with a modern, clean interface. It adds a full open-registration system, a redesigned authentication experience, and a built-in Theme Studio — all in a single deployable package.

## Features

- **Open registration** — users can create accounts with a username, email, and password (reCAPTCHA-protected), with automatic login after sign-up.
- **New authentication UI** — split-screen login/register layout, glass-style forms, show/hide password, and mobile-responsive branding.
- **Theme Studio** — customize colors, gradients, backgrounds, and branding live from the admin area.
- **Deploy-ready** — a production build of the frontend is shipped alongside the source, with one-command installers for both a plain VPS and a Cloudflare Tunnel setup.

## Installation

### Option A — One-click installer (recommended)

Upload `pigeon-panel-deploy.zip` and `install.sh` to a fresh **Ubuntu 22.04/24.04 or Debian 12** server, then run as root:

```bash
sudo bash install.sh --domain panel.example.com --email admin@example.com
```

The script installs PHP 8.3, Nginx, MariaDB, Redis, and Composer; sets up the database; writes `.env`; runs migrations; configures SSL via Let's Encrypt; and creates an admin user. See `./install.sh --help` for all options.

### Option B — Cloudflare Tunnel (no open ports)

If you want to host behind a **custom domain via Cloudflare Tunnel** (nothing exposed to the internet, TLS handled at the edge):

```bash
sudo bash install-cloudflare.sh \
    --domain panel.example.com \
    --email admin@example.com \
    --cf-token <cloudflare-api-token>
```

Your domain must be on Cloudflare, and the token needs `Cloudflare Tunnel: Edit` (Account) plus `Zone: Read` and `DNS: Edit` (Zone) permissions.

### Manual deployment

Extract `pigeon-panel-deploy.zip` so that `artisan`, `app/`, and `public/` land at your web root, point your web server at `public/`, then:

```bash
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
```

## Development

```bash
npm install          # install frontend dependencies
npm run build        # development build to public/assets
npm run build:production  # minified production build
npm run watch        # watch mode
```

Requirements: Node 22+, PHP 8.2+, Composer, and a MySQL/MariaDB server.

## Tech Stack

- **Frontend:** React, Tailwind CSS, styled-components, Formik
- **Backend:** Laravel 11, MySQL/MariaDB, Redis
- **Infrastructure:** Nginx + PHP-FPM, Cloudflare Tunnel (optional)

## License

Pigeon Panel is a fork of Pterodactyl. Pterodactyl® Copyright © 2015 - 2023 Dane Everitt and contributors, released under the [MIT License](./LICENSE.md). Modifications released under the same [MIT License](./LICENSE.md).
