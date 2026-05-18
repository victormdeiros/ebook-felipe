-- Migration 012: Track purchase/material confirmation e-mails

SET search_path TO ebookfelipelopes;

CREATE TABLE IF NOT EXISTS manual_confirmation_emails (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES manual_orders(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,
  lead_name   TEXT NOT NULL DEFAULT '',
  kind        TEXT NOT NULL DEFAULT 'ebook'
              CHECK (kind IN ('ebook', 'event', 'event_ebook')),
  source      TEXT NOT NULL DEFAULT 'auto'
              CHECK (source IN ('auto', 'manual')),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'sent', 'failed')),
  error       TEXT,
  metadata    JSONB,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS confirmation_emails_order_idx
  ON manual_confirmation_emails (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS confirmation_emails_email_idx
  ON manual_confirmation_emails (email, created_at DESC);

CREATE INDEX IF NOT EXISTS confirmation_emails_status_idx
  ON manual_confirmation_emails (status);
