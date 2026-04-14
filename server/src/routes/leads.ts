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
});

router.post("/", async (req, res, next) => {
  try {
    const data = leadSchema.parse(req.body);

    const { rows } = await pool.query<{ id: string; created_at: string }>(
      `INSERT INTO leads (name, email, whatsapp)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [data.name, data.email, data.whatsapp],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
