# Manual do Empregador — Backend API

Small Express + TypeScript service that owns the Postgres connection and proxies
the Mercado Pago preference creation. Replaces the old Supabase setup.

Production: **https://api-manual.converseia.com** (Dokku app `manual-empregador-api` on VPS 157).

## Endpoints

| Method | Path                  | Auth          | Purpose                              |
| ------ | --------------------- | ------------- | ------------------------------------ |
| GET    | `/api/live`           | —             | Liveness check for Dokku/Nginx       |
| GET    | `/api/health`         | —             | Readiness check with DB ping         |
| POST   | `/api/leads`          | —             | Insert a lead from the CTA form      |
| POST   | `/api/events`         | —             | Insert an analytics event            |
| POST   | `/api/admin/auth/request-code` | —     | Send login code to an allowed admin e-mail |
| POST   | `/api/admin/auth/verify-code`  | —     | Exchange login code for an admin session   |
| GET    | `/api/admin/leads`    | Admin session | Paginated leads (admin panel)        |
| GET    | `/api/admin/events`   | Admin session | Paginated events (admin panel)       |
| POST   | `/api/mp/preference`  | —             | Create a Mercado Pago preference     |

Admin auth uses a 6-digit code sent by Resend. Protected routes expect
`Authorization: Bearer <session-token>` returned by `/api/admin/auth/verify-code`.

## Postgres tables

The server reads/writes `manual_leads` and `manual_events` (already created on the
VPS). Schema definition lives in [migrations/001_init.sql](migrations/001_init.sql)
for reference and for fresh installs — production runs use the pre-existing tables.

## Local dev

```bash
cd server
cp .env.example .env     # fill in RESEND_API_KEY, point DATABASE_URL at a local pg
npm install
npm run dev              # tsx watch
```

Visit http://localhost:3000/api/live to confirm the process is up.
Use http://localhost:3000/api/health to confirm the database is reachable.

## Deploying via Dokku (GitHub push flow)

The app is already created on Dokku as `manual-empregador-api`, with SSL and
env vars configured. To deploy:

1. Ensure Dokku knows the code lives in `server/` (not repo root):
   ```bash
   # On the VPS, once per app:
   dokku builder-dockerfile:set manual-empregador-api build-dir server
   # Or, for the buildpacks flow:
   dokku git:set manual-empregador-api source-dir server
   ```

2. Push `main` — Dokku picks up [Procfile](Procfile) and the Node buildpack
   runs `npm install → npm run build → npm start`.

3. Verify:
   ```bash
   curl https://manualdoempregador.com.br/api/live
   # → {"ok":true}
   curl https://manualdoempregador.com.br/api/health
   # → {"ok":true,"db":"up"}
   ```

### Env vars expected on Dokku

```bash
dokku config:set ebookfelipelopesadv \
  NODE_ENV=production \
  PORT=5000 \
  DATABASE_URL=postgresql://postgres:<password>@evolution-postgres:5432/postgres \
  CORS_ORIGIN=https://manualdoempregador.com.br \
  ADMIN_AUTH_SECRET=<strong-random-secret> \
  MP_ACCESS_TOKEN=<mercado-pago-access-token> \
  MP_PUBLIC_KEY=<mercado-pago-public-key> \
  SITE_URL=https://manualdoempregador.com.br \
  RESEND_API_KEY=<resend-api-key> \
  "EMAIL_FROM=Manual do Empregador <noreply@manualempregador.com.br>" \
  MINIO_ENDPOINT=http://157.173.118.98:9003 \
  MINIO_ACCESS_KEY=<minio-access-key> \
  MINIO_SECRET_KEY=<minio-secret-key> \
  MINIO_REGION=us-east-1
```

See [.env.example](.env.example) for the full list.

## Security notes

- Postgres password never reaches the browser.
- MP Access Token lives only in this server's Dokku env.
- Admin sessions are checked on every protected `/api/admin/*` request.
- Body limit is 64KB.
- All input validated with zod.
