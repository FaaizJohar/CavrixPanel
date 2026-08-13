#!/usr/bin/env bash
# Pigeon Panel - Cloudflare Tunnel installer
#
# Compatibility shim. The single-file installer (install.sh) supports both
# direct and Cloudflare Tunnel modes; this just delegates with --tunnel.
#
#   sudo bash install-cloudflare.sh --domain panel.example.com \
#       --email admin@example.com --cf-token <api-token>

exec bash "$(dirname "$0")/install.sh" --tunnel "$@"
