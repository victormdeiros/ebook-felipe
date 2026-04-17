-- Manual do Empregador — migration 005
-- Adiciona controle de presença no evento

ALTER TABLE ebookfelipelopes.manual_orders
  ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT FALSE;
