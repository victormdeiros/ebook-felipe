import { pool } from "./db";
import { sendEbookPurchaseEmail, sendEventConfirmationEmail } from "./email";

export type ConfirmationEmailKind = "ebook" | "event" | "event_ebook";
export type ConfirmationEmailSource = "auto" | "manual";

interface SendAndRecordInput {
  orderId?: string | null;
  email: string;
  name: string;
  kind: ConfirmationEmailKind;
  source: ConfirmationEmailSource;
  ebookUrl?: string;
  metadata?: Record<string, unknown>;
}

const errorMessage = (err: unknown): string =>
  (err instanceof Error ? err.message : String(err)).slice(0, 700);

export const sendAndRecordConfirmationEmail = async ({
  orderId,
  email,
  name,
  kind,
  source,
  ebookUrl,
  metadata,
}: SendAndRecordInput): Promise<void> => {
  let recordId: string | null = null;

  try {
    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO manual_confirmation_emails
       (order_id, email, lead_name, kind, source, status, metadata)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING id`,
      [orderId ?? null, email, name, kind, source, metadata ? JSON.stringify(metadata) : null],
    );
    recordId = rows[0]?.id ?? null;
  } catch (err) {
    console.error("[confirmation-email] status insert error:", err);
  }

  try {
    if (kind === "ebook") {
      await sendEbookPurchaseEmail(email, name, ebookUrl ?? "");
    } else if (kind === "event") {
      await sendEventConfirmationEmail(email, name, false, undefined);
    } else {
      await sendEventConfirmationEmail(email, name, true, ebookUrl);
    }

    if (recordId) {
      await pool.query(
        `UPDATE manual_confirmation_emails
         SET status = 'sent', sent_at = now(), error = NULL, updated_at = now()
         WHERE id = $1`,
        [recordId],
      );
    }
  } catch (err) {
    if (recordId) {
      await pool.query(
        `UPDATE manual_confirmation_emails
         SET status = 'failed', error = $2, updated_at = now()
         WHERE id = $1`,
        [recordId, errorMessage(err)],
      ).catch((updateErr) => {
        console.error("[confirmation-email] status update error:", updateErr);
      });
    }
    throw err;
  }
};
