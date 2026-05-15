import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config";
import { pool, closePool } from "./db";
import leadsRouter from "./routes/leads";
import eventsRouter from "./routes/events";
import adminRouter from "./routes/admin";
import mpRouter from "./routes/mp";
import contentRouter from "./routes/content";
import productsRouter from "./routes/products";
import { errorHandler, notFound } from "./middleware/error";
import { startScheduler } from "./emailScheduler";

const app = express();

app.use(express.json({ limit: "64kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin & server-to-server
      if (!config.corsOrigins.length) return cb(null, true); // no list = allow all
      if (config.corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: false,
  }),
);

app.get("/api/health", async (_req, res) => {
  if (!config.DATABASE_URL) {
    return res.status(503).json({ ok: false, db: "not_configured" });
  }

  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "up" });
  } catch {
    res.status(503).json({ ok: false, db: "down" });
  }
});

app.get("/api/live", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/leads", leadsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/mp", mpRouter);
app.use("/api/content", contentRouter);
app.use("/api/products", productsRouter);

// ── Serve Vite frontend (production) ─────────────────────────
// When the dist/ folder exists (i.e. after `npm run build`),
// Express serves the static assets and falls back to index.html
// for client-side routes — so the React SPA works on direct URL access.
const staticDir = join(process.cwd(), "dist");
if (existsSync(staticDir)) {
  app.use(express.static(staticDir, { index: false }));
  // SPA fallback: non-API GET requests → index.html
  app.get(/^\/(?!api)/, (_req, res, next) => {
    const indexPath = join(staticDir, "index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`[server] listening on :${config.PORT} (${config.NODE_ENV})`);
  startScheduler();
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
