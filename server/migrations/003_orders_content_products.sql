-- ──────────────────────────────────────────────────────────────────────────────
-- Migration 003 — Orders, Dashboard Stats View, Content, Products
-- ──────────────────────────────────────────────────────────────────────────────

-- ── 1. manual_orders ──────────────────────────────────────────────────────────
-- Stores every payment received via Mercado Pago webhook.
CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_orders (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mp_payment_id     TEXT        NOT NULL,
  mp_preference_id  TEXT,
  product           TEXT        NOT NULL DEFAULT 'ebook',  -- 'ebook' | 'event'
  status            TEXT        NOT NULL DEFAULT 'pending', -- MP payment status
  amount            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payer_email       TEXT,
  payer_name        TEXT,
  payment_method    TEXT,
  raw_webhook       JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- mp_payment_id must be unique (webhook can fire multiple times for same payment)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes'
      AND tablename  = 'manual_orders'
      AND indexname  = 'manual_orders_mp_payment_id_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX manual_orders_mp_payment_id_key
             ON ebookfelipelopes.manual_orders (mp_payment_id)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes'
      AND tablename  = 'manual_orders'
      AND indexname  = 'manual_orders_status_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_orders_status_idx
             ON ebookfelipelopes.manual_orders (status)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'ebookfelipelopes'
      AND tablename  = 'manual_orders'
      AND indexname  = 'manual_orders_created_at_idx'
  ) THEN
    EXECUTE 'CREATE INDEX manual_orders_created_at_idx
             ON ebookfelipelopes.manual_orders (created_at DESC)';
  END IF;
END $$;

-- ── 2. manual_dashboard_stats (VIEW) ─────────────────────────────────────────
-- Aggregates KPIs consumed by GET /api/admin/stats.
CREATE OR REPLACE VIEW ebookfelipelopes.manual_dashboard_stats AS
SELECT
  -- Leads
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_leads)                          AS total_leads,
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_leads
   WHERE created_at >= now() - INTERVAL '30 days')                              AS leads_last_30d,

  -- Orders (approved only)
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_orders WHERE status = 'approved')  AS total_orders,
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_orders
   WHERE status = 'approved' AND created_at >= now() - INTERVAL '30 days')      AS orders_last_30d,
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_orders
   WHERE status = 'approved' AND product = 'ebook')                              AS ebook_orders,
  (SELECT COUNT(*) FROM ebookfelipelopes.manual_orders
   WHERE status = 'approved' AND product = 'event')                              AS event_orders,

  -- Revenue
  (SELECT COALESCE(SUM(amount), 0) FROM ebookfelipelopes.manual_orders
   WHERE status = 'approved')                                                    AS total_revenue,
  (SELECT COALESCE(SUM(amount), 0) FROM ebookfelipelopes.manual_orders
   WHERE status = 'approved' AND created_at >= now() - INTERVAL '30 days')      AS revenue_last_30d;

-- ── 3. manual_products ────────────────────────────────────────────────────────
-- Stores configurable product info and prices.
-- The MP preference creation reads from this table at runtime.
CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_products (
  id               TEXT        PRIMARY KEY,         -- 'ebook' | 'event'
  mp_item_id       TEXT        NOT NULL,            -- ID sent to MP items array
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL DEFAULT '',
  price            NUMERIC(10, 2) NOT NULL,
  active           BOOLEAN     NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed / upsert the two products
INSERT INTO ebookfelipelopes.manual_products (id, mp_item_id, title, description, price)
VALUES
  (
    'ebook',
    'manual-do-empregador',
    'Manual do Empregador — E-book',
    'Guia prático para gestão trabalhista segura do início ao fim da relação de trabalho.',
    47.00
  ),
  (
    'event',
    'seguranca-juridica-360',
    'Segurança Jurídica 360 — Inscrição',
    'Evento presencial com especialistas em Direito Trabalhista, IA e Marketing para empresários.',
    67.00
  )
ON CONFLICT (id) DO NOTHING;

-- ── 4. manual_content ─────────────────────────────────────────────────────────
-- Single-row table (id = 'default') that holds all editable landing page copy.
CREATE TABLE IF NOT EXISTS ebookfelipelopes.manual_content (
  id                   TEXT        PRIMARY KEY DEFAULT 'default',
  hero_badge           TEXT        NOT NULL DEFAULT 'Guia Prático para Empresários',
  hero_headline        TEXT        NOT NULL DEFAULT 'Manual do Empregador',
  hero_subheadline     TEXT        NOT NULL DEFAULT 'Da contratação à rescisão: como estruturar relações de trabalho com precaução e estratégia para sua empresa.',
  hero_body            TEXT        NOT NULL DEFAULT 'Um guia prático criado por especialistas para ajudar empresários a entender e aplicar corretamente as principais regras da legislação trabalhista no dia a dia da empresa.',
  hero_cta             TEXT        NOT NULL DEFAULT 'QUERO ADQUIRIR O E-BOOK',
  ebook_cover_url      TEXT        NOT NULL DEFAULT '',
  checkout_url         TEXT        NOT NULL DEFAULT '',
  ebook_download_url   TEXT        NOT NULL DEFAULT '/manual-do-empregador.pdf',
  price_display        TEXT        NOT NULL DEFAULT '49',
  price_original       TEXT        NOT NULL DEFAULT '97',
  whatsapp_number      TEXT        NOT NULL DEFAULT '5581985900139',
  whatsapp_msg         TEXT        NOT NULL DEFAULT 'Olá! Tenho interesse no Manual do Empregador.',
  event_price_display  TEXT        NOT NULL DEFAULT '67',
  event_checkout_url   TEXT        NOT NULL DEFAULT '',
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default row
INSERT INTO ebookfelipelopes.manual_content (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;
