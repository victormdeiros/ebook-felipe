import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found." });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed.",
      issues: err.flatten().fieldErrors,
    });
  }

  console.error("[error]", err);

  const message = err instanceof Error ? err.message : "Internal server error.";
  res.status(500).json({ error: message });
};
