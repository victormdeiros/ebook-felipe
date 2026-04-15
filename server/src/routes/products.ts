import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// ── GET /api/products ─────────────────────────────────────────────────────────
// Public — MP preference creation and frontend read product info here.
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

// ── PATCH /api/products/:id (admin) ───────────────────────────────────────────
// Protected — update price, title, description of a product.
const productUpdateSchema = z.object({
  title:       z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  price:       z.number().positive().optional(),
  active:      z.boolean().optional(),
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = productUpdateSchema.parse(req.body);

    const fields = Object.keys(data) as (keyof typeof data)[];
    if (!fields.length) return res.status(400).json({ error: "No fields to update" });

    const setClause = fields
      .map((k, i) => `${k} = $${i + 1}`)
      .join(", ");
    const values = fields.map((k) => data[k]);
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

export default router;
