-- Migration 008: Email templates + queue for scheduled sending

SET search_path TO ebookfelipelopes;

-- ── Email templates (editable from admin) ──────────────────────────────
CREATE TABLE IF NOT EXISTS manual_email_templates (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  trigger_desc     TEXT NOT NULL DEFAULT '',
  subject          TEXT NOT NULL,
  active           BOOLEAN NOT NULL DEFAULT true,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Email sending queue ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manual_email_queue (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL,
  lead_name    TEXT NOT NULL DEFAULT '',
  template_id  TEXT NOT NULL REFERENCES manual_email_templates(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at      TIMESTAMPTZ,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','sent','failed','cancelled')),
  error        TEXT,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_queue_status_idx
  ON manual_email_queue (status, scheduled_at);

CREATE INDEX IF NOT EXISTS email_queue_email_template_idx
  ON manual_email_queue (email, template_id, status);

-- ── Seed default templates ─────────────────────────────────────────────
INSERT INTO manual_email_templates (id, name, trigger_desc, subject, active) VALUES
  (
    'cart_immediate',
    'Carrinho abandonado — imediato',
    'Enviado imediatamente quando o usuário preenche o formulário mas não finaliza o pagamento.',
    'Você esqueceu algo, {{firstName}}… 👀',
    true
  ),
  (
    'cart_1h',
    'Carrinho abandonado — 1 hora depois',
    'Enviado 1 hora após o abandono, se o lead ainda não converteu.',
    '{{firstName}}, seu acesso ainda está disponível ⏳',
    true
  ),
  (
    'cart_1d',
    'Carrinho abandonado — 1 dia depois',
    'Enviado 24 horas após o abandono, se o lead ainda não converteu.',
    'Última chance, {{firstName}} — proteja sua empresa hoje 🔒',
    true
  ),
  (
    'event_1d',
    'Lembrete do evento — 1 dia antes',
    'Enviado 24h antes do evento para todos os inscritos com pagamento aprovado.',
    'Amanhã é o grande dia! Segurança Jurídica 360 🗓️',
    true
  ),
  (
    'event_3h',
    'Lembrete do evento — 3 horas antes',
    'Enviado 3 horas antes do evento para todos os inscritos confirmados.',
    'Começa em 3 horas! Tudo pronto para o SJ360? 🚀',
    true
  ),
  (
    'event_1h',
    'Lembrete do evento — 1 hora antes',
    'Enviado 1 hora antes do evento para todos os inscritos confirmados.',
    'O evento começa em 1 hora — estamos te esperando! 🎯',
    true
  )
ON CONFLICT (id) DO NOTHING;
