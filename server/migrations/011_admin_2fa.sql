-- Migration 011: Admin access via email code (2FA-style login)

SET search_path TO ebookfelipelopes;

CREATE TABLE IF NOT EXISTS manual_admin_allowed_emails (
  email       TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manual_admin_login_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL REFERENCES manual_admin_allowed_emails(email) ON DELETE CASCADE,
  code_hash     TEXT NOT NULL,
  attempts      INTEGER NOT NULL DEFAULT 0,
  expires_at    TIMESTAMPTZ NOT NULL,
  consumed_at   TIMESTAMPTZ,
  requested_ip  TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_codes_email_created_idx
  ON manual_admin_login_codes (email, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_login_codes_expires_idx
  ON manual_admin_login_codes (expires_at);

CREATE TABLE IF NOT EXISTS manual_admin_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL REFERENCES manual_admin_allowed_emails(email) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS admin_sessions_token_hash_idx
  ON manual_admin_sessions (token_hash);

CREATE INDEX IF NOT EXISTS admin_sessions_email_idx
  ON manual_admin_sessions (email);

INSERT INTO manual_admin_allowed_emails (email)
VALUES ('victor@converseia.com.br')
ON CONFLICT (email) DO NOTHING;
