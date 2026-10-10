-- Encrypted backend configuration. Never expose tables to anonymous clients.
CREATE SCHEMA IF NOT EXISTS ebookfelipelopes;
CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_runtime_access (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  token_hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_runtime_credentials (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ebookfelipelopes.manual_runtime_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebookfelipelopes.manual_runtime_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ebookfelipelopes.manual_runtime_access FROM anon, authenticated;
REVOKE ALL ON ebookfelipelopes.manual_runtime_credentials FROM anon, authenticated;

-- The token is a separate 256-bit backend secret, never the browser session.
CREATE OR REPLACE FUNCTION public.manual_runtime_config_read(p_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ebookfelipelopes.manual_runtime_access
    WHERE token_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex')
  ) THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  RETURN (SELECT payload FROM ebookfelipelopes.manual_runtime_credentials WHERE id = true);
END $$;
CREATE OR REPLACE FUNCTION public.manual_runtime_config_write(p_token text, p_payload jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ebookfelipelopes.manual_runtime_access
    WHERE token_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex')
  ) THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  IF pg_catalog.jsonb_typeof(p_payload) <> 'object' OR pg_catalog.pg_column_size(p_payload) > 65536
    THEN RAISE EXCEPTION 'Invalid payload'; END IF;
  INSERT INTO ebookfelipelopes.manual_runtime_credentials (id, payload)
    VALUES (true, p_payload)
    ON CONFLICT (id) DO UPDATE SET payload = excluded.payload, updated_at = now();
END $$;
REVOKE ALL ON FUNCTION public.manual_runtime_config_read(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.manual_runtime_config_write(text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.manual_runtime_config_read(text) TO anon;
GRANT EXECUTE ON FUNCTION public.manual_runtime_config_write(text,jsonb) TO anon;

CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_admin_login_attempts (
  key text PRIMARY KEY,
  failures integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ebookfelipelopes.manual_admin_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ebookfelipelopes.manual_admin_login_attempts FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.manual_admin_login_attempt(p_token text, p_key text, p_success boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE attempt ebookfelipelopes.manual_admin_login_attempts%ROWTYPE;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ebookfelipelopes.manual_runtime_access
    WHERE token_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex')
  ) THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  INSERT INTO ebookfelipelopes.manual_admin_login_attempts(key) VALUES(p_key) ON CONFLICT DO NOTHING;
  SELECT * INTO attempt FROM ebookfelipelopes.manual_admin_login_attempts WHERE key = p_key FOR UPDATE;
  IF attempt.window_start < now() - interval '15 minutes' THEN
    UPDATE ebookfelipelopes.manual_admin_login_attempts SET failures = 0, window_start = now() WHERE key = p_key;
    attempt.failures := 0;
  END IF;
  IF attempt.failures >= 10 THEN RETURN false; END IF;
  UPDATE ebookfelipelopes.manual_admin_login_attempts
    SET failures = CASE WHEN p_success THEN 0 ELSE failures + 1 END WHERE key = p_key;
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.manual_admin_login_attempt(text,text,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.manual_admin_login_attempt(text,text,boolean) TO anon;

CREATE OR REPLACE FUNCTION public.manual_runtime_migrations_ready(p_token text, p_names text[])
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ebookfelipelopes.manual_runtime_access
    WHERE token_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex')
  ) THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  RETURN NOT EXISTS (
    SELECT 1 FROM pg_catalog.unnest(p_names) AS requested(name)
    WHERE NOT EXISTS (SELECT 1 FROM ebookfelipelopes._migrations m WHERE m.name = requested.name)
  );
END $$;
REVOKE ALL ON FUNCTION public.manual_runtime_migrations_ready(text,text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.manual_runtime_migrations_ready(text,text[]) TO anon;
