-- Manual do Empregador — initial schema (Postgres, no RLS)
-- Run with:  npm run migrate

CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_email_idx      ON leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  payload      JSONB,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_name_idx ON events (name);
CREATE INDEX IF NOT EXISTS events_time_idx ON events (occurred_at DESC);
