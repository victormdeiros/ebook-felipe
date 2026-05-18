/**
 * Email service — Resend
 * Dispara e-mails transacionais após pagamento confirmado.
 */
import { Resend } from "resend";
import { config } from "./config";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    if (!config.RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurado.");
    resend = new Resend(config.RESEND_API_KEY);
  }
  return resend;
}

// ── Template: confirmação de compra do e-book ─────────────────
function ebookEmailHtml(name: string, downloadUrl: string) {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0a0b;font-family:'Segoe UI',Arial,sans-serif;color:#f3ece8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0a0b;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1114;border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,0.15);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1e0e10 0%,#2a0f13 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;color:#c9a84c;text-transform:uppercase;font-weight:600;">Manual do Empregador</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">Compra confirmada</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#ffffff;">${firstName}</strong>!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Obrigado pela sua compra do <strong style="color:#f3ece8;">Manual do Empregador</strong>. Seu pagamento foi aprovado com sucesso.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Clique no botão abaixo para baixar o seu e-book:
          </p>
          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
            <tr><td style="background:#2d7a4f;border-radius:8px;text-align:center;">
              <a href="${downloadUrl}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.04em;">
                BAIXAR E-BOOK
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:12px;color:#a79797;line-height:1.6;">
            Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
          </p>
          <p style="margin:0 0 28px;font-size:11px;color:#c9a84c;word-break:break-all;">${downloadUrl}</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;">
          <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
            Em caso de dúvidas, responda este e-mail ou entre em contato pelo WhatsApp.<br>
            Atenciosamente,<br><strong style="color:#f3ece8;">Equipe Manual do Empregador</strong>
          </p>
        </td></tr>
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

// ── Template: confirmação de inscrição no evento ──────────────
function eventEmailHtml(name: string, hasEbook: boolean, downloadUrl?: string) {
  const firstName = name.split(" ")[0];

  // Calendar links — event: 2026-06-10 16:00-18:00 BRT = 19:00-21:00 UTC
  const evTitle = encodeURIComponent("Segurança Jurídica 360");
  const evDesc  = encodeURIComponent("Evento de lançamento exclusivo | Manual do Empregador");
  const evLoc   = encodeURIComponent("Recife, Pernambuco, PE");
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${evTitle}&dates=20260610T190000Z%2F20260610T210000Z&details=${evDesc}&location=${evLoc}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?rru=addevent&startdt=2026-06-10T19%3A00%3A00Z&enddt=2026-06-10T21%3A00%3A00Z&subject=${evTitle}&location=${evLoc}&body=${evDesc}`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0a0b;font-family:'Segoe UI',Arial,sans-serif;color:#f3ece8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0a0b;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1114;border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,0.15);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1e0e10 0%,#2a0f13 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;color:#c9a84c;text-transform:uppercase;font-weight:600;">Segurança Jurídica 360</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">Inscrição confirmada</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#ffffff;">${firstName}</strong>!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Sua inscrição no evento <strong style="color:#f3ece8;">Segurança Jurídica 360</strong> foi confirmada com sucesso!
          </p>
          <!-- Ingresso digital -->
          <div style="background:rgba(201,168,76,0.06);border:2px dashed rgba(201,168,76,0.3);border-radius:12px;padding:24px;margin:0 0 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;color:#c9a84c;text-transform:uppercase;font-weight:700;">INGRESSO DIGITAL</p>
            <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#ffffff;">${name}</p>
            <p style="margin:0 0 16px;font-size:12px;color:#a79797;">Segurança Jurídica 360 · Evento</p>
            <div style="border-top:1px dashed rgba(201,168,76,0.2);padding-top:14px;">
              <p style="margin:0;font-size:12px;color:#c8bfbf;font-style:italic;">Apresente este e-mail na entrada do evento</p>
            </div>
          </div>
          <div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px 24px;margin:0 0 28px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#c9a84c;letter-spacing:0.05em;text-transform:uppercase;">Próximos passos</p>
            <p style="margin:0;font-size:14px;color:#c8bfbf;line-height:1.7;">
              Em breve você receberá as informações completas sobre local, data e horário do evento. Fique atento à sua caixa de entrada.
            </p>
          </div>
          <!-- Salvar na agenda -->
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px 24px;margin:0 0 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;color:#c9a84c;text-transform:uppercase;font-weight:700;">SALVAR NA AGENDA</p>
            <p style="margin:0 0 16px;font-size:13px;color:#c8bfbf;">10 de Junho de 2026 · 16h às 18h · Recife, PE</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding:0 6px;">
                  <a href="${gcalUrl}" target="_blank" style="display:inline-block;background:#1a73e8;border-radius:6px;padding:10px 18px;font-size:12px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.03em;">
                    Google Calendar
                  </a>
                </td>
                <td style="padding:0 6px;">
                  <a href="${outlookUrl}" target="_blank" style="display:inline-block;background:#0078d4;border-radius:6px;padding:10px 18px;font-size:12px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.03em;">
                    Outlook / Hotmail
                  </a>
                </td>
              </tr>
            </table>
          </div>
          ${hasEbook && downloadUrl ? `
          <p style="margin:0 0 16px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Você também adquiriu o <strong style="color:#f3ece8;">Manual do Empregador</strong>. Clique abaixo para baixar:
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
            <tr><td style="background:#2d7a4f;border-radius:8px;text-align:center;">
              <a href="${downloadUrl}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.04em;">
                📥 BAIXAR E-BOOK
              </a>
            </td></tr>
          </table>` : ""}
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;">
          <p style="margin:0;font-size:13px;color:#a79797;line-height:1.6;">
            Em caso de dúvidas, entre em contato pelo WhatsApp.<br>
            Atenciosamente,<br><strong style="color:#f3ece8;">Equipe Manual do Empregador</strong>
          </p>
        </td></tr>
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

// ── Funções públicas ──────────────────────────────────────────

function adminLoginCodeHtml(code: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0a0b;font-family:'Segoe UI',Arial,sans-serif;color:#f3ece8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0a0b;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1a1114;border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,0.15);">
        <tr><td style="background:linear-gradient(135deg,#1e0e10 0%,#2a0f13 100%);padding:28px 36px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;color:#c9a84c;text-transform:uppercase;font-weight:600;">Manual do Empregador</p>
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff;line-height:1.2;">Codigo de acesso</h1>
        </td></tr>
        <tr><td style="padding:34px 36px;text-align:center;">
          <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Use o codigo abaixo para entrar no painel administrativo. Ele expira em 10 minutos.
          </p>
          <p style="display:inline-block;margin:0 0 24px;padding:14px 24px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.28);border-radius:10px;font-size:30px;line-height:1;letter-spacing:0.22em;color:#fff;font-weight:700;">${code}</p>
          <p style="margin:0;font-size:12px;color:#a79797;line-height:1.6;">
            Se voce nao pediu este acesso, ignore este e-mail.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendAdminLoginCodeEmail(
  to: string,
  code: string,
): Promise<void> {
  const r = getResend();
  await r.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject: "Codigo de acesso ao painel admin",
    html: adminLoginCodeHtml(code),
  });
}

export async function sendEbookPurchaseEmail(
  to: string,
  name: string,
  downloadUrl: string,
): Promise<void> {
  const r = getResend();
  await r.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject: "Seu Manual do Empregador está pronto para download",
    html: ebookEmailHtml(name, downloadUrl),
  });
}

export async function sendEventConfirmationEmail(
  to: string,
  name: string,
  hasEbook: boolean,
  downloadUrl?: string,
): Promise<void> {
  const r = getResend();
  await r.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject: "Inscrição confirmada — Segurança Jurídica 360",
    html: eventEmailHtml(name, hasEbook, downloadUrl),
  });
}
