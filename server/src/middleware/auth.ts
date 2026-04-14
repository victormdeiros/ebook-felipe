import type { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ error: "Missing bearer token." });
  }

  if (token !== config.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Invalid admin token." });
  }

  next();
};
