import { Pool } from "pg";
import { config } from "./config";

function createPool(): Pool {
  const connection = config.DATABASE_URL ? new URL(config.DATABASE_URL) : null;
  for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) connection?.searchParams.delete(option);
  const instance = new Pool({
    connectionString: connection?.toString(),
    ...(!connection ? { host: "supabase-not-configured.invalid" } : {}),
    ssl: connection ? {
      rejectUnauthorized: true,
      ...(config.DATABASE_SSL_CA ? { ca: config.DATABASE_SSL_CA.replace(/\\n/g, "\n") } : {}),
    } : undefined,
    options: "-c search_path=ebookfelipelopes,public",
    max: process.env.VERCEL ? 3 : 10,
    idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000, allowExitOnIdle: true,
  });
  instance.on("error", () => console.error("[db] Database pool connection failed."));
  return instance;
}
let fingerprint = JSON.stringify([config.DATABASE_URL, config.DATABASE_SSL_CA]);
export let pool = createPool();
export async function refreshPool(): Promise<void> {
  const next = JSON.stringify([config.DATABASE_URL, config.DATABASE_SSL_CA]);
  if (next === fingerprint) return;
  const old = pool;
  pool = createPool();
  fingerprint = next;
  await old.end();
}
export const closePool = async () => { await pool.end(); };
