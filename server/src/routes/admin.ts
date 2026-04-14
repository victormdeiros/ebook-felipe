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
