#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# Dokku one-time setup — run this ONCE on the VPS as the "converseia" user.
# Usage: bash server/dokku-setup.sh
# ──────────────────────────────────────────────────────────────────────────────

APP=${APP:-ebookfelipelopesadv}
SITE_URL=${SITE_URL:-https://manualdoempregador.com.br}
CORS_ORIGIN=${CORS_ORIGIN:-$SITE_URL}
DEFAULT_EMAIL_FROM="Manual do Empregador <contato@manualdoempregador.com.br>"
EMAIL_FROM=${EMAIL_FROM:-$DEFAULT_EMAIL_FROM}
MINIO_ENDPOINT=${MINIO_ENDPOINT:-http://157.173.118.98:9003}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-minio}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-}
MINIO_REGION=${MINIO_REGION:-us-east-1}
ADMIN_AUTH_SECRET=${ADMIN_AUTH_SECRET:-${ADMIN_TOKEN:-}}

: "${DATABASE_URL:?Set DATABASE_URL before running this setup script.}"
: "${ADMIN_AUTH_SECRET:?Set ADMIN_AUTH_SECRET before running this setup script.}"
: "${MP_ACCESS_TOKEN:?Set MP_ACCESS_TOKEN before running this setup script.}"
: "${MP_PUBLIC_KEY:?Set MP_PUBLIC_KEY before running this setup script.}"

# ── 1. Create app (safe to re-run) ───────────────────────────────────────────
dokku apps:create $APP 2>/dev/null || echo "App already exists, continuing..."

# ── 2. Set buildpacks ────────────────────────────────────────────────────────
# Heroku Node.js buildpack handles npm install + npm run build
dokku buildpacks:set $APP https://github.com/heroku/heroku-buildpack-nodejs

# ── 3. Configure environment variables ───────────────────────────────────────
# Export the required values in your shell before running this script.
# Attach to docker_default network so the app can reach the evolution-postgres container
dokku network:set $APP attach-post-deploy docker_default

dokku config:set $APP \
  NODE_ENV=production \
  DATABASE_URL="$DATABASE_URL" \
  ADMIN_AUTH_SECRET="$ADMIN_AUTH_SECRET" \
  MP_ACCESS_TOKEN="$MP_ACCESS_TOKEN" \
  MP_PUBLIC_KEY="$MP_PUBLIC_KEY" \
  SITE_URL="$SITE_URL" \
  CORS_ORIGIN="$CORS_ORIGIN" \
  RESEND_API_KEY="${RESEND_API_KEY:-}" \
  EMAIL_FROM="$EMAIL_FROM" \
  MINIO_ENDPOINT="$MINIO_ENDPOINT" \
  MINIO_ACCESS_KEY="$MINIO_ACCESS_KEY" \
  MINIO_SECRET_KEY="$MINIO_SECRET_KEY" \
  MINIO_REGION="$MINIO_REGION" \
  VITE_API_URL="" \
  VITE_MP_PUBLIC_KEY="$MP_PUBLIC_KEY" \
  VITE_MP_SANDBOX="false"

# ── 4. Port mapping ───────────────────────────────────────────────────────────
# Dokku injects $PORT at runtime; Express listens on config.PORT (defaults 5000)
dokku ports:set $APP http:80:5000

# ── 5. Custom domain (optional — configure if you have a real domain) ─────────
# dokku domains:set $APP manualdoempregador.com.br
# dokku letsencrypt:enable $APP

echo ""
echo "✅  Setup done. Push to master to trigger the first deploy."
echo "    After first deploy, the postdeploy hook runs migrations automatically."
