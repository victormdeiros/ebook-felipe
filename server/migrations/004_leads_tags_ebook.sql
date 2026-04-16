-- Migration 004: tags em leads + ebook_url em config

-- Adiciona coluna tags (array de texto) na tabela de leads
ALTER TABLE manual_leads
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS manual_leads_tags_idx ON manual_leads USING GIN (tags);

-- Tabela para configurações persistidas (ex.: URL do ebook no MinIO)
CREATE TABLE IF NOT EXISTS manual_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insere valor padrão para a URL do ebook (vazio até o admin fazer upload)
INSERT INTO manual_config (key, value)
VALUES ('ebook_download_url', '')
ON CONFLICT (key) DO NOTHING;
