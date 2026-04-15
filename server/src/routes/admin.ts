import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);

const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(500).default(100),
  offset: z.coerce.number().int().nonnegative().default(0),
});

// ── GET /api/admin/leads ─────────────────────────────────────
router.get("/leads", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);

    const { rows } = await pool.query(
      `SELECT id, name, email, whatsapp, created_at
       FROM manual_leads
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_leads`,
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
