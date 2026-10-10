import { readFileSync } from "node:fs";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

const project = JSON.parse(
  readFileSync(resolve(__dirname, "../../supabase/project.json"), "utf8"),
) as { publishableKey: string };

// The user's root .env works both with tsx and with the compiled API.
loadEnv({ path: resolve(__dirname, "../../.env") });
loadEnv();

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
  ADMIN_USERNAME: optionalString,
  ADMIN_PASSWORD: optionalString,
  ADMIN_PASSWORD_HASH: optionalString,
  MP_ACCESS_TOKEN: optionalString,
  MP_PUBLIC_KEY: optionalString,
  SITE_URL: optionalUrl,
  // Email (Resend)
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: z.string().default("Manual do Empregador <noreply@manualempregador.com.br>"),
  // Supabase: private credentials belong exclusively to the backend.
  SUPABASE_URL: z.string().url().default("https://heusjcoijobbsgzyfupm.supabase.co"),
  SUPABASE_PROJECT_REF: z.literal("heusjcoijobbsgzyfupm").default("heusjcoijobbsgzyfupm"),
  SUPABASE_SECRET_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1).default(project.publishableKey),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("ebook-manual"),
  DATABASE_SSL_CA: optionalString,
  CRON_SECRET: optionalString,
});

const parsed = envSchema.safeParse({
  ...process.env,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? process.env.login_admin,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? process.env.Password,
});

if (!parsed.success) {
  console.error("[config] Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (new URL(parsed.data.SUPABASE_URL).hostname !== parsed.data.SUPABASE_PROJECT_REF + ".supabase.co") {
  throw new Error("SUPABASE_URL must point to the connected Supabase project.");
}

if (parsed.data.DATABASE_URL) {
  const database = new URL(parsed.data.DATABASE_URL);
  const ref = parsed.data.SUPABASE_PROJECT_REF;
  const direct = database.hostname === "db." + ref + ".supabase.co";
  const pooled = database.hostname.endsWith(".pooler.supabase.com")
    && decodeURIComponent(database.username) === "postgres." + ref;
  if (!["postgres:", "postgresql:"].includes(database.protocol) || (!direct && !pooled)) {
    throw new Error("DATABASE_URL must point to the connected Supabase project (direct or Supavisor pooler).");
  }
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

export const config = {
  ...parsed.data,
  SITE_URL: siteUrl,
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
