-- Manual do Empregador — migration 007
-- Adiciona coluna updated_at e constraint UNIQUE em email para manual_leads
-- (permite upsert idempotente ao salvar lead no checkout)

ALTER TABLE ebookfelipelopes.manual_leads
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Deduplica emails existentes antes de criar o índice único
-- Mantém o registro mais antigo (menor created_at) de cada email
DELETE FROM ebookfelipelopes.manual_leads
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) AS rn
    FROM ebookfelipelopes.manual_leads
  ) sub
  WHERE rn > 1
);

-- Cria índice único em email (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes'
      AND tablename  = 'manual_leads'
      AND indexname  = 'manual_leads_email_unique'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX manual_leads_email_unique ON ebookfelipelopes.manual_leads (email)';
  END IF;
END $$;
