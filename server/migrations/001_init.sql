-- Manual do Empregador — initial schema (Postgres, no RLS)
-- Run with:  npm run migrate

CREATE TABLE IF NOT EXISTS manual_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_leads_email_idx      ON manual_leads (email);
CREATE INDEX IF NOT EXISTS manual_leads_created_at_idx ON manual_leads (created_at DESC);

CREATE TABLE IF NOT EXISTS manual_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  payload      JSONB,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_events_name_idx ON manual_events (name);
CREATE INDEX IF NOT EXISTS manual_events_time_idx ON manual_events (occurred_at DESC);
