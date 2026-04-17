/**
 * Email Scheduler
 * Manages the scheduled email queue: cart abandonment sequences and event reminders.
 * Processes the queue every 5 minutes via setInterval.
 */
import { Resend } from "resend";
import { pool } from "./db";
import { config } from "./config";

// Event date: 29/04/2026 16:00 BRT (UTC-3)
const EVENT_DATE = new Date("2026-04-29T19:00:00.000Z"); // 16h BRT = 19h UTC

function getResend(): Resend | null {
  if (!config.RESEND_API_KEY) return null;
  return new Resend(config.RESEND_API_KEY);
}

// ── Email HTML bodies ──────────────────────────────────────────────────

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0a0b;font-family:'Segoe UI',Arial,sans-serif;color:#f3ece8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0a0b;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1114;border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,0.15);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1e0e10 0%,#2a0f13 100%);padding:28px 40px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;color:#c9a84c;text-transform:uppercase;font-weight:600;">Manual do Empregador</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">${content}</td></tr>
        <!-- Footer -->
        <tr><td style="background:#120b0d;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:11px;color:#6b5c5c;letter-spacing:0.05em;">
            © ${new Date().getFullYear()} Manual do Empregador. Todos os direitos reservados.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btnHtml(href: string, label: string, color = "#2d7a4f"): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
    <tr><td style="background:${color};border-radius:8px;text-align:center;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.04em;">${label}</a>
    </td></tr>
  </table>`;
}

const CHECKOUT_URL = (config.SITE_URL ?? "https://manualdoempregador.com.br") + "/#preco";

function cartImmediateHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#fff;">${firstName}</strong>.</p>
    <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Notamos que você iniciou o checkout do <strong style="color:#f3ece8;">Manual do Empregador</strong> mas não concluiu a compra.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Não se preocupe — seu acesso ainda está disponível. Finalize agora em menos de 2 minutos:
    </p>
    ${btnHtml(CHECKOUT_URL, "CONCLUIR MINHA COMPRA")}
    <div style="background:rgba(201,168,76,0.06);border-left:3px solid #c9a84c;border-radius:4px;padding:16px 20px;margin:0 0 24px;">
      <p style="margin:0;font-size:14px;color:#c8bfbf;line-height:1.7;">
        <strong style="color:#c9a84c;">O que você vai ter:</strong><br>
        Guia completo de contratação, gestão e rescisão<br>
        Modelos de documentos prontos para usar<br>
        Proteção jurídica com linguagem simples<br>
        Acesso vitalício e atualizações gratuitas
      </p>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;">
    <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
      Dúvidas? Responda este e-mail ou fale no WhatsApp.<br>
      <strong style="color:#f3ece8;">Equipe Manual do Empregador</strong>
    </p>
  `);
}

function cart1hHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;line-height:1.2;">Ainda dá tempo, ${firstName}</p>
    <p style="margin:0 0 24px;font-size:13px;color:#a79797;">Seu acesso está reservado</p>
    <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Faz uma hora que você quase finalizou a compra do <strong style="color:#f3ece8;">Manual do Empregador</strong>.
      Sabemos que a vida é corrida — por isso guardamos seu lugar.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Uma autuação trabalhista pode custar <strong style="color:#fff;">R$ 10.000 ou mais</strong>.
      O Manual custa muito menos — e te protege <em>agora</em>.
    </p>
    ${btnHtml(CHECKOUT_URL, "GARANTIR MEU ACESSO AGORA", "#8a2230")}
    <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
      Atenciosamente,<br><strong style="color:#f3ece8;">Felipe Lopes — Advogado Trabalhista</strong>
    </p>
  `);
}

function cart1dHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;line-height:1.2;">Última chance, ${firstName}</p>
    <p style="margin:0 0 24px;font-size:13px;color:#c9a84c;letter-spacing:0.05em;">PROTEJA SUA EMPRESA HOJE</p>
    <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Faz 24 horas que você visitou o <strong style="color:#f3ece8;">Manual do Empregador</strong>.
      Se você ainda não comprou, é porque ainda não sentiu a urgência — mas ela pode chegar de surpresa.
    </p>
    <div style="background:rgba(138,34,48,0.12);border:1px solid rgba(138,34,48,0.3);border-radius:8px;padding:20px;margin:0 0 28px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#e8a0a8;text-transform:uppercase;letter-spacing:0.1em;">O risco real sem proteção:</p>
      <p style="margin:0;font-size:14px;color:#c8bfbf;line-height:1.8;">
        Rescisão realizada incorretamente: multa de até 40% do FGTS<br>
        Contrato verbal: risco de vínculo empregatício não declarado<br>
        Ausência de registro correto: processo trabalhista sem defesa
      </p>
    </div>
    ${btnHtml(CHECKOUT_URL, "QUERO ME PROTEGER AGORA")}
    <p style="margin:0;font-size:12px;color:#6b5c5c;">
      Se não quiser receber mais e-mails, simplesmente ignore esta mensagem.
    </p>
  `);
}

function event1dHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#fff;">${firstName}</strong>.</p>
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;line-height:1.2;">Amanhã é o grande dia!</p>
    <p style="margin:0 0 28px;font-size:13px;color:#c9a84c;letter-spacing:0.05em;">SEGURANÇA JURÍDICA 360 — SEU INGRESSO ESTÁ CONFIRMADO</p>
    <div style="background:rgba(201,168,76,0.06);border:2px dashed rgba(201,168,76,0.3);border-radius:12px;padding:24px;margin:0 0 28px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;color:#c9a84c;text-transform:uppercase;font-weight:700;">DATA E HORÁRIO</p>
      <p style="margin:0 0 4px;font-size:24px;font-weight:700;color:#fff;">29 de Abril de 2026</p>
      <p style="margin:0 0 12px;font-size:16px;color:#c9a84c;font-weight:600;">16h às 18h</p>
      <p style="margin:0;font-size:13px;color:#a79797;">Rua Buenos Aires, 80 · Espinheiro · Recife/PE</p>
    </div>
    <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Prepare-se para um evento cheio de conteúdo prático sobre <strong style="color:#f3ece8;">proteção trabalhista, IA e gestão de pessoas</strong>.
      Separe seu bloco de notas — vai ter muita informação boa!
    </p>
    <p style="margin:0 0 28px;font-size:14px;color:#c8bfbf;line-height:1.7;">
      <strong style="color:#fff;">Lembretes:</strong><br>
      Apresente este e-mail como ingresso na entrada<br>
      Coffee break incluído — chegue com antecedência<br>
      Networking com empresários e gestores
    </p>
    <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
      Até amanhã!<br><strong style="color:#f3ece8;">Equipe Segurança Jurídica 360</strong>
    </p>
  `);
}

function event3hHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#fff;">${firstName}</strong>.</p>
    <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#fff;line-height:1.2;">Começa em 3 horas!</p>
    <p style="margin:0 0 28px;font-size:14px;color:#c9a84c;">O Segurança Jurídica 360 está prestes a começar</p>
    <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 8px;font-size:28px;font-weight:700;color:#c9a84c;">16h às 18h</p>
      <p style="margin:0;font-size:13px;color:#a79797;">Rua Buenos Aires, 80 · Espinheiro · Recife/PE</p>
    </div>
    <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
      Estamos te esperando! Aqui vai um lembrete rápido antes de você sair:
    </p>
    <p style="margin:0 0 28px;font-size:14px;color:#c8bfbf;line-height:1.8;">
      Traga documento com foto<br>
      Este e-mail serve como ingresso<br>
      Há estacionamento próximo ao local<br>
      Abertura dos portões: 15h30
    </p>
    <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
      Nos vemos em breve!<br><strong style="color:#f3ece8;">Equipe Segurança Jurídica 360</strong>
    </p>
  `);
}

function event1hHtml(firstName: string): string {
  return baseLayout(`
    <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#fff;text-align:center;line-height:1.2;">Começa em 1 hora</p>
    <p style="margin:0 0 28px;font-size:14px;color:#c9a84c;text-align:center;">Segurança Jurídica 360 · ${firstName}, chegou a hora!</p>
    <p style="margin:0 0 24px;font-size:15px;color:#c8bfbf;line-height:1.7;text-align:center;">
      O evento começa às <strong style="color:#fff;">16h</strong>.<br>
      Se ainda não saiu, agora é a hora!
    </p>
    <div style="background:rgba(138,34,48,0.12);border:1px solid rgba(138,34,48,0.25);border-radius:8px;padding:16px 20px;margin:0 0 28px;text-align:center;">
      <p style="margin:0;font-size:14px;color:#e8a0a8;font-weight:600;">Rua Buenos Aires, 80 · Espinheiro · Recife/PE</p>
      <p style="margin:8px 0 0;font-size:12px;color:#a79797;">Portões abertos desde 15h30</p>
    </div>
    <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;text-align:center;">
      Estamos te esperando com muito conteúdo!<br>
      <strong style="color:#f3ece8;">Equipe Segurança Jurídica 360</strong>
    </p>
  `);
}

const EMAIL_BODIES: Record<string, (firstName: string) => string> = {
  cart_immediate: cartImmediateHtml,
  cart_1h:        cart1hHtml,
  cart_1d:        cart1dHtml,
  event_1d:       event1dHtml,
  event_3h:       event3hHtml,
  event_1h:       event1hHtml,
};

// ── Schedule cart abandonment emails ──────────────────────────────────
export async function scheduleCartEmails(email: string, name: string): Promise<void> {
  const now = new Date();
  const delays: { templateId: string; delayMs: number }[] = [
    { templateId: "cart_immediate", delayMs: 0 },
    { templateId: "cart_1h",        delayMs: 60 * 60 * 1000 },
    { templateId: "cart_1d",        delayMs: 24 * 60 * 60 * 1000 },
  ];

  for (const { templateId, delayMs } of delays) {
    const scheduledAt = new Date(now.getTime() + delayMs);
    // Skip if already scheduled/sent for this email+template in the last 2 days
    await pool.query(
      `INSERT INTO manual_email_queue (email, lead_name, template_id, scheduled_at)
       SELECT $1, $2, $3, $4
       WHERE NOT EXISTS (
         SELECT 1 FROM manual_email_queue
         WHERE email = $1 AND template_id = $3
           AND status IN ('pending','sent')
           AND created_at > now() - INTERVAL '2 days'
       )`,
      [email, name, templateId, scheduledAt],
    );
  }
}

// ── Schedule event reminder emails ────────────────────────────────────
export async function scheduleEventReminders(email: string, name: string): Promise<void> {
  const offsets: { templateId: string; msBefore: number }[] = [
    { templateId: "event_1d", msBefore: 24 * 60 * 60 * 1000 },
    { templateId: "event_3h", msBefore:  3 * 60 * 60 * 1000 },
    { templateId: "event_1h", msBefore:      60 * 60 * 1000 },
  ];

  const now = new Date();
  for (const { templateId, msBefore } of offsets) {
    const scheduledAt = new Date(EVENT_DATE.getTime() - msBefore);
    if (scheduledAt <= now) continue; // already past

    await pool.query(
      `INSERT INTO manual_email_queue (email, lead_name, template_id, scheduled_at)
       SELECT $1, $2, $3, $4
       WHERE NOT EXISTS (
         SELECT 1 FROM manual_email_queue
         WHERE email = $1 AND template_id = $3
           AND status IN ('pending','sent')
       )`,
      [email, name, templateId, scheduledAt],
    );
  }
}

// ── Process the queue (called on interval) ────────────────────────────
export async function processQueue(): Promise<{ sent: number; failed: number; skipped: number }> {
  const resend = getResend();
  if (!resend) throw new Error("RESEND_API_KEY não configurado no servidor.");

  let sent = 0, failed = 0, skipped = 0;

  const { rows } = await pool.query<{
    id: string;
    email: string;
    lead_name: string;
    template_id: string;
  }>(`
SELECT q.id, q.email, q.lead_name, q.template_id
     FROM manual_email_queue q
     JOIN manual_email_templates t ON t.id = q.template_id
     WHERE q.status = 'pending'
       AND q.scheduled_at <= now()
       AND t.active = true
     ORDER BY q.scheduled_at ASC
     LIMIT 20`);

  for (const row of rows) {
    try {
      // For cart emails: cancel if lead already converted (no longer has tag)
      if (row.template_id.startsWith("cart_")) {
        const { rows: leadRows } = await pool.query<{ tags: string[] }>(
          `SELECT tags FROM manual_leads WHERE email = $1`,
          [row.email],
        );
        const tags: string[] = leadRows[0]?.tags ?? [];
        if (!tags.includes("carrinho_abandonado")) {
          await pool.query(
            `UPDATE manual_email_queue SET status = 'cancelled' WHERE id = $1`,
            [row.id],
          );
          skipped++;
          continue;
        }
      }

      // Get editable subject
      const { rows: tplRows } = await pool.query<{ subject: string }>(
        `SELECT subject FROM manual_email_templates WHERE id = $1`,
        [row.template_id],
      );
      const rawSubject = tplRows[0]?.subject ?? row.template_id;
      const firstName = row.lead_name.split(" ")[0] || "você";
      const subject = rawSubject.replace(/\{\{firstName\}\}/g, firstName);

      const bodyFn = EMAIL_BODIES[row.template_id];
      if (!bodyFn) {
        await pool.query(
          `UPDATE manual_email_queue SET status = 'failed', error = 'No body template' WHERE id = $1`,
          [row.id],
        );
        failed++;
        continue;
      }

      const html = bodyFn(firstName);
      const from = config.EMAIL_FROM;

      await resend.emails.send({ from, to: row.email, subject, html });

      await pool.query(
        `UPDATE manual_email_queue SET status = 'sent', sent_at = now() WHERE id = $1`,
        [row.id],
      );
      sent++;
      console.log(`[email-scheduler] sent ${row.template_id} → ${row.email}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[email-scheduler] failed ${row.template_id} → ${row.email}:`, msg);
      await pool.query(
        `UPDATE manual_email_queue SET status = 'failed', error = $1 WHERE id = $2`,
        [msg.slice(0, 500), row.id],
      );
      failed++;
    }
  }

  return { sent, failed, skipped };
}

// ── Start the scheduler ────────────────────────────────────────────────
export function startScheduler(): void {
  if (!config.RESEND_API_KEY) {
    console.log("[email-scheduler] RESEND_API_KEY not set — scheduler disabled");
    return;
  }

  // Initial run after server starts (small delay to ensure DB is ready)
  setTimeout(() => {
    processQueue().catch((e) => console.error("[email-scheduler]", e));
  }, 10_000);

  setInterval(() => {
    processQueue().catch((e) => console.error("[email-scheduler]", e));
  }, 5 * 60 * 1000);

  console.log("[email-scheduler] started — polling every 5 min");
}
