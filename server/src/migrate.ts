import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool, closePool } from "./db";

const MIGRATIONS_DIR = join(__dirname, "..", "migrations");

const run = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const { rows: applied } = await pool.query<{ name: string }>(
    "SELECT name FROM _migrations",
  );
  const appliedSet = new Set(applied.map((r) => r.name));

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`[migrate] skip  ${file}`);
      continue;
    }

    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    console.log(`[migrate] apply ${file}`);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  console.log("[migrate] done");
};

run()
  .catch((err: unknown) => {
    const code = (err as { code?: string })?.code;
    // DB unreachable (network not ready yet) — warn but don't fail the deploy.
    // Migrations can be run manually with: node server/dist/migrate.js
    if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
      console.warn("[migrate] WARNING: DB not reachable — skipping migrations.");
      console.warn("[migrate] Run manually once DB is available: node server/dist/migrate.js");
    } else {
      console.error("[migrate] FAILED:", err);
      process.exitCode = 1;
    }
  })
  .finally(() => closePool());
