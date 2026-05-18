import type { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import { pool } from "../db";

export type AdminRequest = Request & {
  adminEmail?: string;
  adminSessionId?: string;
};

export const hashAdminToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const requireAdmin = async (req: AdminRequest, res: Response, next: NextFunction) => {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ error: "Missing bearer token." });
  }

  try {
    const tokenHash = hashAdminToken(token);
    const { rows } = await pool.query<{ id: string; email: string }>(
      `SELECT id, email
       FROM manual_admin_sessions
       WHERE token_hash = $1
         AND revoked_at IS NULL
         AND expires_at > now()
       LIMIT 1`,
      [tokenHash],
    );

    if (!rows.length) {
      return res.status(403).json({ error: "Invalid admin session." });
    }

    req.adminSessionId = rows[0].id;
    req.adminEmail = rows[0].email;

    pool.query(
      `UPDATE manual_admin_sessions SET last_used_at = now() WHERE id = $1`,
      [rows[0].id],
    ).catch(() => {});

    next();
  } catch (err) {
    next(err);
  }
};
