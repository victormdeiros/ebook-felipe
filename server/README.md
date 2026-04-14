# Manual do Empregador — Backend API

Small Express + TypeScript service that owns the Postgres connection and proxies
the Mercado Pago preference creation. Replaces the old Supabase setup.

Production: **https://api-manual.converseia.com** (Dokku app `manual-empregador-api` on VPS 157).

## Endpoints

| Method | Path                  | Auth          | Purpose                              |
| ------ | --------------------- | ------------- | ------------------------------------ |
| GET    | `/api/health`         | —             | Liveness + DB ping                   |
| POST   | `/api/leads`          | —             | Insert a lead from the CTA form      |
| POST   | `/api/events`         | —             | Insert an analytics event            |
| GET    | `/api/admin/leads`    | Bearer token  | Paginated leads (admin panel)        |
| GET    | `/api/admin/events`   | Bearer token  | Paginated events (admin panel)       |
| POST   | `/api/mp/preference`  | —             | Create a Mercado Pago preference     |

Admin auth: send `Authorization: Bearer <ADMIN_TOKEN>`.

## Postgres tables

The server reads/writes `manual_leads` and `manual_events` (already created on the
VPS). Schema definition lives in [migrations/001_init.sql](migrations/001_init.sql)
for reference and for fresh installs — production runs use the pre-existing tables.

## Local dev

```bash
cd server
cp .env.example .env     # fill in ADMIN_TOKEN, point DATABASE_URL at a local pg
npm install
npm run dev              # tsx watch
```

Visit http://localhost:3000/api/health to confirm it's up.

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
   curl https://api-manual.converseia.com/api/health
   # → {"ok":true,"db":"up"}
   ```

### Env vars expected on Dokku

```bash
dokku config:set manual-empregador-api \
  NODE_ENV=production \
  PORT=3000 \
  DATABASE_URL=postgres://postgres:difyai123456@localhost/postgres \
  CORS_ORIGIN=https://manual-empregador.vercel.app \
  ADMIN_TOKEN=<openssl rand -hex 32> \
  MP_ACCESS_TOKEN=APP_USR-... \
  SITE_URL=https://manualdoempregador.com.br
```

See [.env.example](.env.example) for the full list.

## Security notes

- Postgres password never reaches the browser.
- MP Access Token lives only in this server's Dokku env.
- Admin token is checked on every `/api/admin/*` request.
- Body limit is 64KB.
- All input validated with zod.
