import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";

const router = Router();

const eventSchema = z.object({
  name: z.string().trim().min(1).max(80),
  payload: z.record(z.unknown()).nullable().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);

    await pool.query(
      `INSERT INTO manual_events (name, payload) VALUES ($1, $2)`,
      [data.name, data.payload ? JSON.stringify(data.payload) : null],
    );

    res.status(202).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
