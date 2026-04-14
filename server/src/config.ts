import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  ADMIN_TOKEN: z.string().min(16, "ADMIN_TOKEN must be at least 16 chars"),
  MP_ACCESS_TOKEN: z.string().min(1, "MP_ACCESS_TOKEN is required"),
  SITE_URL: z.string().url("SITE_URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("[config] Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
