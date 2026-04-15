import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// ── GET /api/content ──────────────────────────────────────────────────────────
// Public — landing page fetches this on load.
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM manual_content WHERE id = 'default'`,
    );
    if (!rows.length) return res.status(404).json({ error: "Content not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/content (admin) ──────────────────────────────────────────────────
// Protected — admin panel saves edits.
const contentSchema = z.object({
  hero_badge:           z.string().max(120).optional(),
  hero_headline:        z.string().max(120).optional(),
  hero_subheadline:     z.string().max(500).optional(),
  hero_body:            z.string().max(1000).optional(),
  hero_cta:             z.string().max(80).optional(),
  ebook_cover_url:      z.string().url().or(z.literal("")).optional(),
  checkout_url:         z.string().url().or(z.literal("")).optional(),
  ebook_download_url:   z.string().optional(),
  price_display:        z.string().max(20).optional(),
  price_original:       z.string().max(20).optional(),
  whatsapp_number:      z.string().max(20).optional(),
  whatsapp_msg:         z.string().max(300).optional(),
  event_price_display:  z.string().max(20).optional(),
  event_checkout_url:   z.string().url().or(z.literal("")).optional(),
});

router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const data = contentSchema.parse(req.body);

    const fields = Object.keys(data) as (keyof typeof data)[];
    if (!fields.length) return res.json({ ok: true });

    const setClause = fields
      .map((k, i) => `${k} = $${i + 1}`)
      .join(", ");
    const values = fields.map((k) => data[k]);

    await pool.query(
      `UPDATE manual_content SET ${setClause}, updated_at = now() WHERE id = 'default'`,
      values,
    );

    const { rows } = await pool.query(
      `SELECT * FROM manual_content WHERE id = 'default'`,
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
