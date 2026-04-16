import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// ── GET /api/products ─────────────────────────────────────────────────────────
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, mp_item_id, title, description, price, active
       FROM manual_products
       ORDER BY id`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/products (admin) ────────────────────────────────────────────────
const productCreateSchema = z.object({
  id:          z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/, "ID deve ser alfanumérico (a-z, 0-9, _ -)"),
  title:       z.string().min(1).max(200),
  description: z.string().max(500).optional().default(""),
  price:       z.number().positive(),
  mp_item_id:  z.string().min(1).max(200),
  active:      z.boolean().optional().default(true),
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const data = productCreateSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO manual_products (id, mp_item_id, title, description, price, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.id, data.mp_item_id, data.title, data.description, data.price, data.active],
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr?.code === "23505") {
      return res.status(409).json({ error: "ID de produto já existe" });
    }
    next(err);
  }
});

// ── PATCH /api/products/:id (admin) ───────────────────────────────────────────
const productUpdateSchema = z.object({
  title:       z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  price:       z.number().positive().optional(),
  active:      z.boolean().optional(),
  mp_item_id:  z.string().min(1).max(200).optional(),
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = productUpdateSchema.parse(req.body);

    const fields = Object.keys(data) as (keyof typeof data)[];
    if (!fields.length) return res.status(400).json({ error: "No fields to update" });

    const setClause = fields.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const values: unknown[] = fields.map((k) => data[k]);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE manual_products
       SET ${setClause}, updated_at = now()
       WHERE id = $${values.length}
       RETURNING *`,
      values,
    );

    if (!rows.length) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/products/:id (admin) ─────────────────────────────────────────
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM manual_products WHERE id = $1 RETURNING id`,
      [id],
    );
    if (!rows.length) return res.status(404).json({ error: "Product not found" });
    res.json({ deleted: rows[0].id });
  } catch (err) {
    next(err);
  }
});

export default router;
