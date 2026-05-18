import "dotenv/config";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => value === "" ? undefined : value;
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: optionalString,
  CORS_ORIGIN: z.string().default(""),
  ADMIN_TOKEN: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
  ADMIN_AUTH_SECRET: optionalString,
  MP_ACCESS_TOKEN: optionalString,
  MP_PUBLIC_KEY: optionalString,
  SITE_URL: optionalUrl,
  // Email (Resend)
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: z.string().default("Manual do Empregador <noreply@manualempregador.com.br>"),
  // MinIO / S3
  MINIO_ENDPOINT: optionalUrl,
  MINIO_ACCESS_KEY: z.string().default("minio"),
  MINIO_SECRET_KEY: z.string().default("minio1234"),
  MINIO_REGION: z.string().default("us-east-1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("[config] Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const corsOrigins = parsed.data.CORS_ORIGIN.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const siteUrl = parsed.data.SITE_URL
  ?? corsOrigins.find((origin) => origin.startsWith("http"))
  ?? "https://manualdoempregador.com.br";

if (!parsed.data.DATABASE_URL) {
  console.warn("[config] DATABASE_URL is not set; DB-backed API routes will be unavailable.");
}

if (!parsed.data.ADMIN_AUTH_SECRET && !parsed.data.ADMIN_TOKEN && !parsed.data.RESEND_API_KEY) {
  console.warn("[config] ADMIN_AUTH_SECRET is not set; using a weak fallback for admin code hashing.");
}

export const config = {
  ...parsed.data,
  SITE_URL: siteUrl,
  MINIO_ENDPOINT: parsed.data.MINIO_ENDPOINT ?? "http://157.173.118.98:9003",
  corsOrigins,

  // Produtos — preços em BRL
  products: {
    ebook: {
      id: "manual-do-empregador",
      title: "Manual do Empregador — E-book",
      description: "Guia prático para gestão trabalhista segura do início ao fim da relação de trabalho.",
      price: 47.0,
    },
    event: {
      id: "seguranca-juridica-360",
      title: "Segurança Jurídica 360 — Inscrição",
      description: "Evento presencial com especialistas em Direito Trabalhista, IA e Marketing para empresários.",
      price: 67.0,
    },
  },
};
