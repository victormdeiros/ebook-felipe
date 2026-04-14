# Manual do Empregador — Backend API

Small Express + TypeScript service that owns the Postgres connection and proxies
the Mercado Pago preference creation. Replaces the old Supabase setup.

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

## Local dev

```bash
cd server
cp .env.example .env      # fill in ADMIN_TOKEN and, if needed, other vars
npm install
npm run migrate           # creates leads + events tables
npm run dev               # tsx watch
```

Visit http://localhost:3000/api/health to confirm it's up.

## Production — deploy on VPS 157

The server must run **inside the VPS** so it can reach Postgres on the private
Docker network (`evolution-postgres:5432`). No SSH tunnel, no public DB port.

1. Copy this folder to the VPS: `scp -r server/ user@157.173.118.98:/opt/manual-empregador-server`
2. SSH in, create `.env` from `.env.example`, set `ADMIN_TOKEN` (`openssl rand -hex 32`).
3. Merge [docker-compose.snippet.yml](docker-compose.snippet.yml) into your existing
   compose file so the service joins the same network as `evolution-postgres`.
4. Build, start, migrate:

```bash
docker compose build manual-empregador-server
docker compose up -d manual-empregador-server
docker compose exec manual-empregador-server npm run migrate
```

5. Put nginx/traefik in front to expose `https://api.manualdoempregador.com.br`
   (or reuse an existing proxy — just point it at port 3000).

## Environment variables

See [.env.example](.env.example). Notable ones:

- `DATABASE_URL` — inside the VPS use `postgresql://postgres:...@evolution-postgres:5432/postgres`.
  From outside (SSH tunnel) use `localhost:5432`.
- `CORS_ORIGIN` — comma-separated list of allowed frontend origins.
- `ADMIN_TOKEN` — long random string; gate for `/api/admin/*`.
- `MP_ACCESS_TOKEN` — Mercado Pago production token, kept only on the server.
- `SITE_URL` — default origin used for MP `back_urls` when the client doesn't send one.

## Security notes

- The Postgres password is never sent to the browser.
- The MP Access Token lives only in this server's env.
- Admin token is checked on every `/api/admin/*` request.
- Payload limit is 64KB to avoid abuse.
- Input is validated with zod on every route.
