-- Initialize an empty PDF bucket; no existing files or records are copied.
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ebook-manual', 'ebook-manual', true, 4194304, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Application tables are accessed by the backend PostgreSQL connection only.
DO $$
DECLARE item record;
BEGIN
  FOR item IN SELECT tablename FROM pg_tables WHERE schemaname = 'ebookfelipelopes' LOOP
    EXECUTE format('ALTER TABLE ebookfelipelopes.%I ENABLE ROW LEVEL SECURITY', item.tablename);
  END LOOP;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA ebookfelipelopes FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA ebookfelipelopes FROM anon, authenticated;
