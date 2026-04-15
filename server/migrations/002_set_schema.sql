-- ──────────────────────────────────────────────────────────────────────────────
-- Migration 002 — Move tables to the "ebookfelipelopes" schema
--
-- Safe to run on:
--   • existing databases  → moves tables from public to ebookfelipelopes
--   • fresh databases     → tables were just created in public by 001; moves them
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. Ensure the target schema exists
CREATE SCHEMA IF NOT EXISTS ebookfelipelopes;

-- 2. Move manual_leads (only if it's still in public)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'manual_leads'
  ) THEN
    ALTER TABLE public.manual_leads SET SCHEMA ebookfelipelopes;
    RAISE NOTICE 'manual_leads moved to ebookfelipelopes';
  ELSE
    RAISE NOTICE 'manual_leads not in public, skipping move';
  END IF;
END $$;

-- 3. Move manual_events (only if it's still in public)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'manual_events'
  ) THEN
    ALTER TABLE public.manual_events SET SCHEMA ebookfelipelopes;
    RAISE NOTICE 'manual_events moved to ebookfelipelopes';
  ELSE
    RAISE NOTICE 'manual_events not in public, skipping move';
  END IF;
END $$;

-- 4. Idempotent safety: create tables in ebookfelipelopes if they somehow don't exist
--    (indexes follow the table automatically on SET SCHEMA, so we only recreate
--    them with IF NOT EXISTS for fresh-install edge cases)

CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_leads_email_idx
  ON ebookfelipelopes.manual_leads (email);

CREATE INDEX IF NOT EXISTS manual_leads_created_at_idx
  ON ebookfelipelopes.manual_leads (created_at DESC);

CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  payload      JSONB,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_events_name_idx
  ON ebookfelipelopes.manual_events (name);

CREATE INDEX IF NOT EXISTS manual_events_time_idx
  ON ebookfelipelopes.manual_events (occurred_at DESC);
