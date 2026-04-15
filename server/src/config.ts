import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().default(""),
  ADMIN_TOKEN: z.string().min(8, "ADMIN_TOKEN must be at least 8 chars"),
  MP_ACCESS_TOKEN: z.string().optional(),
  MP_PUBLIC_KEY: z.string().optional(),
  SITE_URL: z.string().url().optional().default("http://localhost:8081"),
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
