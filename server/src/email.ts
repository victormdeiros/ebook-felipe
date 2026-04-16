/**
 * Email service — Resend
 * Dispara e-mails transacionais após pagamento confirmado.
 */
import { Resend } from "resend";
import { config } from "../config";

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
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">Compra confirmada! 🎉</h1>
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
                📥 BAIXAR E-BOOK
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
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">Inscrição confirmada! 🎉</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#e8dcd8;line-height:1.6;">Olá, <strong style="color:#ffffff;">${firstName}</strong>!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#c8bfbf;line-height:1.7;">
            Sua inscrição no evento <strong style="color:#f3ece8;">Segurança Jurídica 360</strong> foi confirmada com sucesso!
          </p>
          <div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px 24px;margin:0 0 28px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#c9a84c;letter-spacing:0.05em;text-transform:uppercase;">Próximos passos</p>
            <p style="margin:0;font-size:14px;color:#c8bfbf;line-height:1.7;">
              Em breve você receberá as informações completas sobre local, data e horário do evento. Fique atento à sua caixa de entrada.
            </p>
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

export async function sendEbookPurchaseEmail(
  to: string,
  name: string,
  downloadUrl: string,
): Promise<void> {
  const r = getResend();
  await r.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject: "📚 Seu Manual do Empregador está pronto para download!",
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
    subject: "✅ Inscrição confirmada — Segurança Jurídica 360",
    html: eventEmailHtml(name, hasEbook, downloadUrl),
  });
}
