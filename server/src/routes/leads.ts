import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";

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
       RETURNING id, created_at`,
      [data.name, data.email, data.whatsapp, tags],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
