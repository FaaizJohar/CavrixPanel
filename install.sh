#!/usr/bin/env bash
# =============================================================================
#  Pigeon Panel - All-in-one installer
#  Tested on Ubuntu 22.04 / 24.04 and Debian 12.
#
#  Handles: system deps, PHP 8.3, Nginx, MariaDB, Redis, Composer, panel
#  install, database, SSL (Let's Encrypt), cron, queue worker, admin user.
#
#  Usage:
#    bash install.sh --domain panel.example.com --email admin@example.com
#
#  Optional flags:
#    --zip <file|url>    Path or URL to pigeon-panel-deploy.zip
#                        (default: looks for ./pigeon-panel-deploy.zip)
#    --db-password <pw>  MariaDB password (random if omitted)
#    --admin-username    Default: admin
#    --admin-password    Default: random
#    --admin-name        Default: Pigeon Admin
#    --timezone          Default: UTC
#    --no-ssl            Skip Let's Encrypt (HTTP only)
#    --no-admin          Skip creating an admin user
#    --help              Show this help
# =============================================================================

set -Eeuo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[i]${NC} $*"; }
ok()    { echo -e "${GREEN}[ok]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
err()   { echo -e "${RED}[x]${NC} $*" >&2; }
die()   { err "$*"; exit 1; }

INSTALL_DIR="/var/www/pterodactyl"
ZIP=""
DOMAIN=""
EMAIL=""
DB_PASSWORD=""
ADMIN_USERNAME="admin"
ADMIN_PASSWORD=""
ADMIN_NAME="Pigeon Admin"
TIMEZONE="UTC"
DO_SSL=1
DO_ADMIN=1
PANEL_USER="www-data"

usage() { sed -n '2,35p' "$0"; exit 0; }

# ---- argument parsing -------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        --zip)            ZIP="$2"; shift 2 ;;
        --domain)         DOMAIN="$2"; shift 2 ;;
        --email)          EMAIL="$2"; shift 2 ;;
        --db-password)    DB_PASSWORD="$2"; shift 2 ;;
        --admin-username) ADMIN_USERNAME="$2"; shift 2 ;;
        --admin-password) ADMIN_PASSWORD="$2"; shift 2 ;;
        --admin-name)     ADMIN_NAME="$2"; shift 2 ;;
        --timezone)       TIMEZONE="$2"; shift 2 ;;
        --no-ssl)         DO_SSL=0; shift ;;
        --no-admin)       DO_ADMIN=0; shift ;;
        --help|-h)        usage ;;
        *) die "Unknown argument: $1 (see --help)" ;;
    esac
done

[[ $EUID -eq 0 ]] || die "Please run as root: sudo bash install.sh $*"

# ---- zip source -------------------------------------------------------------
if [[ -z "$ZIP" ]]; then
    if [[ -f "$(dirname "$0")/pigeon-panel-deploy.zip" ]]; then
        ZIP="$(dirname "$0")/pigeon-panel-deploy.zip"
    else
        die "No zip found. Pass one with --zip <file|url> or place pigeon-panel-deploy.zip next to this script."
    fi
fi

# ---- prompt for required values --------------------------------------------
[[ -n "$DOMAIN" ]] || read -r -p "Enter the panel domain (e.g. panel.example.com): " DOMAIN
[[ -n "$DOMAIN" ]] || die "A domain is required."
[[ "$DO_SSL" -eq 1 ]] && { [[ -n "$EMAIL" ]] || read -r -p "Enter your email (for Let's Encrypt + admin user): " EMAIL; }
[[ -n "$DB_PASSWORD" ]] || DB_PASSWORD="$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 20)"
[[ "$DB_PASSWORD" =~ ^[A-Za-z0-9]+$ ]] || die "DB password must be alphanumeric only (no special characters)."
[[ "$ADMIN_USERNAME" =~ ^[A-Za-z0-9_.-]+$ ]] || die "Admin username may only contain A-Z, 0-9, . _ -"
[[ -n "$ADMIN_PASSWORD" ]] || ADMIN_PASSWORD="$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 16)"
[[ -n "$ADMIN_NAME" ]] && ADMIN_NAME_FIRST="${ADMIN_NAME%% *}" && ADMIN_NAME_LAST="${ADMIN_NAME#* }"

# ---- detect distro ----------------------------------------------------------
. /etc/os-release
if [[ "$ID" == "ubuntu" ]]; then
    case "$VERSION_ID" in
        22.04|24.04) DISTRO="ubuntu" ;;
        *) warn "Ubuntu $VERSION_ID not explicitly supported; attempting anyway (22.04/24.04 recommended)." ;;
    esac
elif [[ "$ID" == "debian" ]]; then
    [[ "$VERSION_ID" == "12" ]] || warn "Debian $VERSION_ID not explicitly supported; attempting anyway (12 recommended)."
    DISTRO="debian"
else
    die "Unsupported OS: $ID. Installer targets Ubuntu/Debian."
fi

export DEBIAN_FRONTEND=noninteractive

# ---- apt packages -----------------------------------------------------------
info "Installing system packages..."
apt-get update -qq
apt-get install -y -qq curl wget git unzip zip cron nginx mariadb-server redis-server certbot python3-certbot-nginx software-properties-common ca-certificates lsb-release gnupg2 >/dev/null

if [[ "$DISTRO" == "ubuntu" ]]; then
    add-apt-repository -y ppa:ondrej/php >/dev/null 2>&1
else
    curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg
    echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list
fi

apt-get update -qq
apt-get install -y -qq \
    php8.3-cli php8.3-common php8.3-gd php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-redis php8.3-fpm >/dev/null
ok "System packages installed"

# ---- composer ---------------------------------------------------------------
if ! command -v composer >/dev/null 2>&1; then
    info "Installing Composer..."
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --quiet
    chmod +x /usr/local/bin/composer
    ok "Composer installed"
fi

# ---- panel files ------------------------------------------------------------
if [[ -d "$INSTALL_DIR/app" ]]; then
    warn "$INSTALL_DIR already contains a panel."
    read -r -p "Overwrite it? [y/N]: " OVERWRITE
    [[ "$OVERWRITE" =~ ^[Yy]$ ]] || die "Aborted."
    rm -rf "$INSTALL_DIR"
fi

info "Extracting panel to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
if [[ "$ZIP" =~ ^https?:// ]]; then
    curl -fsSL "$ZIP" -o /tmp/pigeon-panel.zip
    ZIP=/tmp/pigeon-panel.zip
elif [[ ! -f "$ZIP" ]]; then
    die "Zip not found: $ZIP"
fi
unzip -q -o "$ZIP" -d "$INSTALL_DIR"
rm -f /tmp/pigeon-panel.zip
ok "Panel extracted"

# ---- PHP tuning -------------------------------------------------------------
cat > /etc/php/8.3/fpm/conf.d/99-pterodactyl.ini <<'EOF'
memory_limit = 512M
max_execution_time = 300
post_max_size = 200M
upload_max_filesize = 200M
EOF

# ---- services ---------------------------------------------------------------
for svc in nginx mariadb redis-server php8.3-fpm; do
    systemctl enable "$svc" >/dev/null 2>&1 || true
    systemctl restart "$svc"
done
ok "Services running (nginx, mariadb, redis, php-fpm)"

# ---- database ---------------------------------------------------------------
info "Creating database 'panel' and user 'pigeon'..."
if ! mysql -Nse "SELECT 1" >/dev/null 2>&1; then
    systemctl restart mariadb
    sleep 2
fi
mysql <<SQL
CREATE DATABASE IF NOT EXISTS panel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'pigeon'@'127.0.0.1' IDENTIFIED BY '${DB_PASSWORD}';
CREATE USER IF NOT EXISTS 'pigeon'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON panel.* TO 'pigeon'@'127.0.0.1';
GRANT ALL PRIVILEGES ON panel.* TO 'pigeon'@'localhost';
FLUSH PRIVILEGES;
SQL
ok "Database ready"

# ---- .env -------------------------------------------------------------------
info "Configuring .env..."
cd "$INSTALL_DIR"
cp .env.example .env
sed -i "s|^APP_URL=.*|APP_URL=http://${DOMAIN}|" .env
sed -i "s|^APP_TIMEZONE=.*|APP_TIMEZONE=${TIMEZONE}|" .env
sed -i "s|^DB_DATABASE=.*|DB_DATABASE=panel|" .env
sed -i "s|^DB_USERNAME=.*|DB_USERNAME=pigeon|" .env
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|" .env
sed -i "s|^HASHIDS_SALT=.*|HASHIDS_SALT=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 24)|" .env
ok ".env configured"

# ---- artisan (run as web user) ----------------------------------------------
run_artisan() { su -s /bin/bash "$PANEL_USER" -c "cd '$INSTALL_DIR' && php artisan $*"; }

info "Generating app key..."
run_artisan key:generate --force --no-interaction
ok "App key generated"

info "Running migrations & seeders..."
run_artisan migrate --force --seed --no-interaction
ok "Database migrated"

info "Linking storage..."
run_artisan storage:link
ok "Storage linked"

# ---- permissions ------------------------------------------------------------
chown -R "$PANEL_USER":"$PANEL_USER" "$INSTALL_DIR"
chmod -R 775 "$INSTALL_DIR/storage" "$INSTALL_DIR/bootstrap/cache"
ok "Permissions set"

# ---- nginx ------------------------------------------------------------------
info "Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default
cat > /etc/nginx/sites-available/pterodactyl.conf <<'NGINX'
server {
    listen 80;
    server_name _;

    root /var/www/pterodactyl/public;
    index index.html index.htm index.php;

    charset utf-8;

    client_max_body_size 200M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/pterodactyl.app-error.log error;

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf
nginx -t && systemctl reload nginx
ok "Nginx configured"

# ---- firewall ---------------------------------------------------------------
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
    ufw allow 'Nginx Full' >/dev/null
    ok "Firewall: opened 80/443"
fi

# ---- SSL --------------------------------------------------------------------
if [[ "$DO_SSL" -eq 1 && -n "$EMAIL" ]]; then
    info "Issuing Let's Encrypt certificate for $DOMAIN..."
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect >/dev/null
    ok "SSL configured (auto-renews via certbot)"
    sed -i "s|^APP_URL=.*|APP_URL=https://${DOMAIN}|" "$INSTALL_DIR/.env"
else
    warn "Skipping SSL. Panel will run on http://$DOMAIN"
fi

info "Caching config..."
run_artisan config:clear --no-interaction >/dev/null 2>&1 || true
run_artisan optimize --no-interaction >/dev/null 2>&1 || true
run_artisan view:cache --no-interaction >/dev/null 2>&1 || true
ok "Config cached"

# ---- cron -------------------------------------------------------------------
info "Installing cron (schedule:run every minute)..."
(crontab -u "$PANEL_USER" -l 2>/dev/null | grep -v 'artisan schedule:run'; \
 echo "* * * * * /usr/bin/php $INSTALL_DIR/artisan schedule:run >> /dev/null 2>&1") | crontab -u "$PANEL_USER" -
ok "Cron installed"

# ---- queue worker -----------------------------------------------------------
info "Installing queue worker (systemd)..."
cat > /etc/systemd/system/pterodactyl-worker.service <<EOF
[Unit]
Description=Pigeon Panel Queue Worker
After=redis-server.service
Wants=redis-server.service

[Service]
User=$PANEL_USER
Group=$PANEL_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/php $INSTALL_DIR/artisan queue:work redis --sleep=1 --tries=3 --max-time=3600
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable pterodactyl-worker >/dev/null 2>&1
systemctl restart pterodactyl-worker
ok "Queue worker running"

# ---- admin user -------------------------------------------------------------
if [[ "$DO_ADMIN" -eq 1 ]]; then
    info "Creating admin user..."
    run_artisan p:user:make \
        --admin=1 \
        --email="$EMAIL" \
        --username="$ADMIN_USERNAME" \
        --name-first="$ADMIN_NAME_FIRST" \
        --name-last="$ADMIN_NAME_LAST" \
        --password="$ADMIN_PASSWORD"
    ok "Admin user created"
fi

# ---- done -------------------------------------------------------------------
echo ""
echo "============================================================"
echo "  Pigeon Panel installed successfully!"
echo "============================================================"
echo "  URL:           http://$DOMAIN"
[[ "$DO_SSL" -eq 1 ]] && echo "  URL:           https://$DOMAIN"
echo "  Web root:      $INSTALL_DIR"
echo "  DB name/user:  panel / pigeon"
echo "  DB password:   $DB_PASSWORD"
if [[ "$DO_ADMIN" -eq 1 ]]; then
    echo "  Admin email:   $EMAIL"
    echo "  Admin user:    $ADMIN_USERNAME"
    echo "  Admin pass:    $ADMIN_PASSWORD"
fi
echo "============================================================"
echo "  Keep these credentials safe. To log in, visit your URL."
echo "============================================================"
