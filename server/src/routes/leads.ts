import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { scheduleCartEmails } from "../emailScheduler";

const router = Router();

const leadSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().toLowerCase().email().max(254),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 15, "Invalid phone length."),
  tags: z.array(z.string().max(80)).optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const data = leadSchema.parse(req.body);
    const tags = data.tags ?? ["entrar_em_contato"];

    const { rows } = await pool.query<{ id: string; created_at: string }>(
      `INSERT INTO manual_leads (name, email, whatsapp, tags)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
         SET tags = (
               SELECT array_agg(DISTINCT t) FROM unnest(
                 manual_leads.tags || EXCLUDED.tags
               ) AS t
             ),
             updated_at = now()
       RETURNING id, created_at`,
      [data.name, data.email, data.whatsapp, tags],
    );

    // Schedule cart abandonment emails if applicable
    const haCartTag = tags.includes("carrinho_abandonado");
    if (haCartTag) {
      scheduleCartEmails(data.email, data.name).catch((e) =>
        console.error("[leads] scheduleCartEmails error:", e)
      );
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
