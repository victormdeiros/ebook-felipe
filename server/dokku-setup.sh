#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# Dokku one-time setup — run this ONCE on the VPS as the "converseia" user.
# Usage: bash server/dokku-setup.sh
# ──────────────────────────────────────────────────────────────────────────────

APP=ebookfelipelopesadv

# ── 1. Create app (safe to re-run) ───────────────────────────────────────────
dokku apps:create $APP 2>/dev/null || echo "App already exists, continuing..."

# ── 2. Set buildpacks ────────────────────────────────────────────────────────
# Heroku Node.js buildpack handles npm install + npm run build
dokku buildpacks:set $APP https://github.com/heroku/heroku-buildpack-nodejs

# ── 3. Configure environment variables ───────────────────────────────────────
# Replace values below with your real credentials before running!
# Attach to docker_default network so the app can reach the evolution-postgres container
dokku network:set $APP attach-post-deploy docker_default

dokku config:set $APP \
  NODE_ENV=production \
  DATABASE_URL="postgresql://postgres:difyai123456@evolution-postgres:5432/postgres" \
  ADMIN_TOKEN="ManualEmpregador@2024" \
  MP_ACCESS_TOKEN="APP_USR-2783696014404921-040913-0ed54f2433d7cfaeeed31575daf942d8-3201432" \
  MP_PUBLIC_KEY="APP_USR-2b067151-d72c-4146-92d2-395d4980e015" \
  SITE_URL="https://ebookfelipelopesadv.157.173.118.98.nip.io" \
  CORS_ORIGIN="https://ebookfelipelopesadv.157.173.118.98.nip.io" \
  RESEND_API_KEY="re_Reg7L5VZ_gmNzi5KJJ9hqGRPfw5ZFpWyM" \
  EMAIL_FROM="Manual do Empregador <contato@manualdoempregador.com.br>" \
  MINIO_ENDPOINT="http://157.173.118.98:9003" \
  MINIO_ACCESS_KEY="minio" \
  MINIO_SECRET_KEY="minio1234" \
  MINIO_REGION="us-east-1" \
  VITE_API_URL="" \
  VITE_ADMIN_TOKEN="ManualEmpregador@2024" \
  VITE_MP_PUBLIC_KEY="APP_USR-2b067151-d72c-4146-92d2-395d4980e015" \
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
