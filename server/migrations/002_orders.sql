-- Manual do Empregador — migration 002
-- Tabela de pedidos (ebook + inscrição no evento)
-- Populada pelo webhook do Mercado Pago (/api/mp/webhook)

CREATE TABLE IF NOT EXISTS manual_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mp_payment_id   TEXT UNIQUE,          -- ID do pagamento no MP
  mp_preference_id TEXT,                -- ID da preferência
  product         TEXT NOT NULL CHECK (product IN ('ebook', 'event')),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'refunded', 'in_process')),
  amount          NUMERIC(10,2) NOT NULL,
  payer_email     TEXT,
  payer_name      TEXT,
  payment_method  TEXT,                 -- 'credit_card', 'pix', 'boleto', ...
  raw_webhook     JSONB,                -- payload bruto do MP (auditoria)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_orders_status_idx     ON manual_orders (status);
CREATE INDEX IF NOT EXISTS manual_orders_product_idx    ON manual_orders (product);
CREATE INDEX IF NOT EXISTS manual_orders_created_at_idx ON manual_orders (created_at DESC);

-- Função que atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manual_orders_updated_at
  BEFORE UPDATE ON manual_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- View para métricas rápidas no painel admin
CREATE OR REPLACE VIEW manual_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM manual_leads)                                AS total_leads,
  (SELECT COUNT(*) FROM manual_orders WHERE status = 'approved')     AS total_orders,
  (SELECT COALESCE(SUM(amount), 0)
   FROM manual_orders WHERE status = 'approved')                     AS total_revenue,
  (SELECT COUNT(*) FROM manual_orders
   WHERE status = 'approved' AND product = 'ebook')                  AS ebook_orders,
  (SELECT COUNT(*) FROM manual_orders
   WHERE status = 'approved' AND product = 'event')                  AS event_orders,
  (SELECT COUNT(*) FROM manual_leads
   WHERE created_at >= now() - INTERVAL '30 days')                   AS leads_last_30d,
  (SELECT COUNT(*) FROM manual_orders
   WHERE status = 'approved'
     AND created_at >= now() - INTERVAL '30 days')                   AS orders_last_30d;
