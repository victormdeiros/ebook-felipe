/**
 * Read-only deployment preflight. Never creates tables, buckets or objects.
 */
import { config } from "./config";
import { pool, closePool } from "./db";
import { checkStorageConnection } from "./storage";

async function check(): Promise<void> {
  if (!config.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const tables = [
    "manual_leads", "manual_events", "manual_orders", "manual_content",
    "manual_products", "manual_config", "manual_email_queue",
    "manual_email_templates", "manual_admin_allowed_emails",
    "manual_admin_login_codes", "manual_admin_sessions", "manual_confirmation_emails",
  ];
  const { rows } = await pool.query<{ name: string; exists: boolean }>(
    "SELECT name, to_regclass('ebookfelipelopes.' || name) IS NOT NULL AS exists FROM unnest($1::text[]) AS name",
    [tables],
  );
  const missing = rows.filter((row) => !row.exists).map((row) => row.name);
  if (missing.length) throw new Error("Missing application tables: " + missing.join(", "));
  await checkStorageConnection();
  console.log("[supabase] Database and Storage verified; no data changed.");
}

check().catch((err: unknown) => {
  // Connection errors can contain credentials; only print our validation errors.
  console.error("[supabase] Preflight failed.", err instanceof Error && !("code" in err)
    ? err.message : "Check database connectivity and credentials.");
  process.exitCode = 1;
}).finally(() => closePool());
