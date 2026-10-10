import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config";
import { pool, closePool, refreshPool } from "./db";
import { configRpc, hydrateRuntimeConfiguration } from "./runtimeConfiguration";

const directory = join(__dirname, "..", "migrations");
export async function runMigrations(deploy = false): Promise<void> {
  // Production Git builds migrate; previews and local frontend builds do not.
  if (deploy && process.env.VERCEL_ENV !== "production") {
    console.log("[migrate] Skipping non-production deployment.");
    return;
  }
  await hydrateRuntimeConfiguration();
  await refreshPool();
  const files = readdirSync(directory).filter(file => file.endsWith(".sql")).sort();
  if (!config.DATABASE_URL) {
    // Initial structure can be provisioned through MCP before the first deploy,
    // allowing the admin to sign in and supply PostgreSQL credentials.
    const ready = await configRpc("manual_runtime_migrations_ready", { p_names: files });
    if (!ready) throw new Error("Pending migrations: configure DATABASE_URL in the admin panel before deploying.");
    console.log("[migrate] Structure already provisioned. Configure PostgreSQL in the admin panel for future migrations.");
    return;
  }
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(711428014)");
    await client.query("CREATE SCHEMA IF NOT EXISTS ebookfelipelopes");
    await client.query("CREATE TABLE IF NOT EXISTS ebookfelipelopes._migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const { rows } = await client.query<{ name: string }>("SELECT name FROM ebookfelipelopes._migrations");
    const applied = new Set(rows.map(row => row.name));
    for (const file of files) {
      if (applied.has(file)) continue;
      console.log("[migrate] Applying " + file);
      await client.query("BEGIN");
      try {
        await client.query("SET LOCAL search_path TO ebookfelipelopes, public");
        await client.query(readFileSync(join(directory, file), "utf8"));
        await client.query("INSERT INTO ebookfelipelopes._migrations(name) VALUES($1)", [file]);
        await client.query("COMMIT");
      } catch (err) { await client.query("ROLLBACK"); throw err; }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(711428014)").catch(() => {});
    client.release();
  }
  console.log("[migrate] All migrations applied.");
}
if (require.main === module) {
  runMigrations(process.argv.includes("--deploy")).catch(() => {
    console.error("[migrate] Failed. Check the Supabase configuration; production deploy aborted.");
    process.exitCode = 1;
  }).finally(() => closePool());
}
