import { Pool } from "pg";
import { config } from "./config";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("[db] Unexpected pool error:", err);
});

export const closePool = async () => {
  await pool.end();
};
