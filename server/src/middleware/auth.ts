import type { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import { verifyAdminSession } from "../adminSession";

export type AdminRequest = Request & { adminEmail?: string; adminSessionId?: string };
export const hashAdminToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const requireAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
  const [scheme, token] = (req.header("authorization") ?? "").split(" ");
  const username = scheme?.toLowerCase() === "bearer" && token ? verifyAdminSession(token) : null;
  if (!username) return res.status(401).json({ error: "Sessão inválida ou expirada. Entre novamente." });
  req.adminEmail = username;
  next();
};
