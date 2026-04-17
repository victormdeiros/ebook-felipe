-- Manual do Empregador — migration 006
-- Adiciona checkout_type a manual_products e sincroniza preços na content table

ALTER TABLE ebookfelipelopes.manual_products
  ADD COLUMN IF NOT EXISTS checkout_type TEXT NOT NULL DEFAULT 'ebook'
    CHECK (checkout_type IN ('ebook', 'event', 'event_ebook'));

-- Atualiza produtos já existentes com base no id
UPDATE ebookfelipelopes.manual_products SET checkout_type = 'event' WHERE id = 'event' AND checkout_type = 'ebook';
