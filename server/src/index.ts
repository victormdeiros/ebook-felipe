import express from "express";
import cors from "cors";
import { config } from "./config";
import { pool, closePool } from "./db";
import leadsRouter from "./routes/leads";
import eventsRouter from "./routes/events";
import adminRouter from "./routes/admin";
import mpRouter from "./routes/mp";
import { errorHandler, notFound } from "./middleware/error";

const app = express();

app.use(express.json({ limit: "64kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (config.corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: false,
  }),
);

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "up" });
  } catch {
    res.status(503).json({ ok: false, db: "down" });
  }
});

app.use("/api/leads", leadsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/mp", mpRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`[server] listening on :${config.PORT} (${config.NODE_ENV})`);
});

const shutdown = (signal: string) => {
  console.log(`[server] ${signal} received, shutting down...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
