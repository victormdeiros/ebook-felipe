import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";
import { uploadEbook } from "../storage";

const router = Router();
router.use(requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Apenas arquivos PDF são aceitos."));
  },
});

const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(500).default(100),
  offset: z.coerce.number().int().nonnegative().default(0),
});

// ── GET /api/admin/leads ─────────────────────────────────────
// Suporta filtro por ?tag=carrinho_abandonado
router.get("/leads", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);
    const tagFilter = z.string().optional().parse(req.query.tag);

    const whereClause = tagFilter ? "WHERE $3 = ANY(tags)" : "";
    const params: (number | string)[] = [limit, offset];
    if (tagFilter) params.push(tagFilter);

    const { rows } = await pool.query(
      `SELECT id, name, email, whatsapp, tags, created_at
       FROM manual_leads
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_leads ${whereClause}`,
      tagFilter ? [tagFilter] : [],
    );

    res.json({
      total: Number(countRows[0].count),
      limit,
      offset,
      items: rows,
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/ebook-upload ──────────────────────────────
router.post("/ebook-upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

    const url = await uploadEbook(req.file.buffer, req.file.originalname);

    // Persiste a URL no banco para o webhook usar ao enviar e-mails
    await pool.query(
      `INSERT INTO manual_config (key, value, updated_at)
       VALUES ('ebook_download_url', $1, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [url],
    );

    res.json({ url });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/ebook-url ──────────────────────────────────
router.get("/ebook-url", async (_req, res, next) => {
  try {
    const { rows } = await pool.query<{ value: string }>(
      `SELECT value FROM manual_config WHERE key = 'ebook_download_url'`,
    );
    res.json({ url: rows[0]?.value ?? "" });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/inscricoes ────────────────────────────────
// Inscrições no evento: leads com tag inscricao_evento + pedidos aprovados product=event
router.get("/inscricoes", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);

    // Leads que iniciaram checkout do evento (incluindo não pagos)
    const { rows: leads } = await pool.query(
      `SELECT l.id, l.name, l.email, l.whatsapp, l.tags, l.created_at,
              o.status AS order_status, o.amount, o.mp_payment_id, o.created_at AS paid_at
       FROM manual_leads l
       LEFT JOIN manual_orders o
         ON o.payer_email = l.email AND o.product = 'event'
       WHERE 'inscricao_evento' = ANY(l.tags)
       ORDER BY l.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_leads WHERE 'inscricao_evento' = ANY(tags)`,
    );

    res.json({ total: Number(countRows[0].count), limit, offset, items: leads });
  } catch (err) {
    next(err);
  }
});


// ── GET /api/admin/orders ────────────────────────────────────
router.get("/orders", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);
    const statusFilter = z.string().optional().parse(req.query.status);

    const whereClause = statusFilter ? "WHERE status = $3" : "";
    const params: (number | string)[] = [limit, offset];
    if (statusFilter) params.push(statusFilter);

    const { rows } = await pool.query(
      `SELECT id, mp_payment_id, mp_preference_id, product, status,
              amount, payer_email, payer_name, payment_method, created_at
       FROM manual_orders
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_orders ${whereClause}`,
      statusFilter ? [statusFilter] : [],
    );

    res.json({
      total: Number(countRows[0].count),
      limit,
      offset,
      items: rows,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/stats ─────────────────────────────────────
router.get("/stats", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM manual_dashboard_stats`);

    // Leads por dia (últimos 30 dias)
    const { rows: leadsByDay } = await pool.query<{ date: string; count: string }>(
      `SELECT created_at::date::text AS date, COUNT(*)::text AS count
       FROM manual_leads
       WHERE created_at >= now() - INTERVAL '30 days'
       GROUP BY date ORDER BY date ASC`,
    );

    // Pedidos aprovados por dia (últimos 30 dias)
    const { rows: ordersByDay } = await pool.query<{
      date: string; count: string; revenue: string;
    }>(
      `SELECT created_at::date::text AS date,
              COUNT(*)::text AS count,
              COALESCE(SUM(amount),0)::text AS revenue
       FROM manual_orders
       WHERE status = 'approved' AND created_at >= now() - INTERVAL '30 days'
       GROUP BY date ORDER BY date ASC`,
    );

    res.json({
      ...rows[0],
      leads_by_day: leadsByDay.map((r) => ({ date: r.date.slice(5), count: Number(r.count) })),
      orders_by_day: ordersByDay.map((r) => ({
        date: r.date.slice(5),
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/events ─────────────────────────────────────
router.get("/events", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);

    const { rows } = await pool.query(
      `SELECT id, name, payload, occurred_at
       FROM manual_events
       ORDER BY occurred_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    res.json({ limit, offset, items: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
