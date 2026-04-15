import { Pool } from "pg";
import { config } from "./config";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Set schema search path for every new connection so all unqualified table
// references resolve to ebookfelipelopes (falls back to public for _migrations).
pool.on("connect", (client) => {
  client
    .query("SET search_path TO ebookfelipelopes, public")
    .catch((err) => console.error("[db] Failed to set search_path:", err));
});

pool.on("error", (err) => {
  console.error("[db] Unexpected pool error:", err);
});

export const closePool = async () => {
  await pool.end();
};
