import { Pool } from "pg";
import { config } from "./config";

// Keep TLS certificate verification enabled even if the URL contains SSL options.
const connection = config.DATABASE_URL ? new URL(config.DATABASE_URL) : null;
for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) {
  connection?.searchParams.delete(option);
}

export const pool = new Pool({
  connectionString: connection?.toString(),
  // Missing configuration must never fall back to PostgreSQL on localhost.
  ...(!connection ? { host: "supabase-not-configured.invalid" } : {}),
  ssl: connection ? {
    rejectUnauthorized: true,
    ...(config.DATABASE_SSL_CA ? { ca: config.DATABASE_SSL_CA.replace(/\\n/g, "\n") } : {}),
  } : undefined,
  options: "-c search_path=ebookfelipelopes,public",
  max: process.env.VERCEL ? 3 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  allowExitOnIdle: true,
});


pool.on("error", (err) => {
  console.error("[db] Unexpected pool error:", err);
});

export const closePool = async () => {
  await pool.end();
};
