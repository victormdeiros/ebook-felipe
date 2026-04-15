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

-- Ensure required columns exist (defensive for tables moved from an older schema)
ALTER TABLE ebookfelipelopes.manual_leads
  ADD COLUMN IF NOT EXISTS name      TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS email     TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp  TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  payload      JSONB,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure required columns exist (defensive for tables moved from an older schema)
ALTER TABLE ebookfelipelopes.manual_events
  ADD COLUMN IF NOT EXISTS name        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payload     JSONB,
  ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Indexes — created only if the target column actually exists
DO $$
BEGIN
  -- manual_leads: email index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'ebookfelipelopes' AND table_name = 'manual_leads' AND column_name = 'email'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes' AND tablename = 'manual_leads' AND indexname = 'manual_leads_email_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_leads_email_idx ON ebookfelipelopes.manual_leads (email)';
  END IF;

  -- manual_leads: created_at index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'ebookfelipelopes' AND table_name = 'manual_leads' AND column_name = 'created_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes' AND tablename = 'manual_leads' AND indexname = 'manual_leads_created_at_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_leads_created_at_idx ON ebookfelipelopes.manual_leads (created_at DESC)';
  END IF;

  -- manual_events: name index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'ebookfelipelopes' AND table_name = 'manual_events' AND column_name = 'name'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes' AND tablename = 'manual_events' AND indexname = 'manual_events_name_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_events_name_idx ON ebookfelipelopes.manual_events (name)';
  END IF;

  -- manual_events: occurred_at index
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'ebookfelipelopes' AND table_name = 'manual_events' AND column_name = 'occurred_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes' AND tablename = 'manual_events' AND indexname = 'manual_events_time_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_events_time_idx ON ebookfelipelopes.manual_events (occurred_at DESC)';
  END IF;
END $$;
