import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";
import { config } from "./config";

export const credentialKeys = [
  "DATABASE_URL", "DATABASE_SSL_CA", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY", "EMAIL_FROM", "MP_ACCESS_TOKEN", "MP_PUBLIC_KEY", "SITE_URL",
] as const;
export type CredentialKey = typeof credentialKeys[number];
export type Credentials = Partial<Record<CredentialKey, string>>;
const defaults = Object.fromEntries(credentialKeys.map(key => [key, config[key]])) as Credentials;
const key = () => {
  if (!config.ADMIN_AUTH_SECRET) throw new Error("Configure ADMIN_AUTH_SECRET.");
  return createHash("sha256").update("runtime-config-encryption:" + config.ADMIN_AUTH_SECRET).digest();
};
const accessToken = () => createHmac("sha256", config.ADMIN_AUTH_SECRET!)
  .update("runtime-config-access").digest("hex");

export async function configRpc(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  if (!config.ADMIN_AUTH_SECRET || !config.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Configuração inicial do Supabase indisponível no backend.");
  }
  const response = await fetch(config.SUPABASE_URL + "/rest/v1/rpc/" + name, {
    method: "POST",
    headers: { apikey: config.SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ p_token: accessToken(), ...args }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Não foi possível acessar a configuração protegida no Supabase.");
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function encryptCredentials(values: Credentials) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(values), "utf8"), cipher.final()]);
  return { iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), ciphertext: ciphertext.toString("base64") };
}

export function decryptCredentials(payload: unknown): Credentials {
  if (!payload) return {};
  const value = payload as { iv: string; tag: string; ciphertext: string };
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(value.iv, "base64"));
  decipher.setAuthTag(Buffer.from(value.tag, "base64"));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(value.ciphertext, "base64")), decipher.final(),
  ]).toString("utf8"));
}

let cache: { values: Credentials; expires: number } | undefined;
let pending: Promise<Credentials> | undefined;
export async function readCredentials(): Promise<Credentials> {
  if (cache && cache.expires > Date.now()) return { ...cache.values };
  if (!pending) pending = configRpc("manual_runtime_config_read")
    .then(payload => {
      const values = decryptCredentials(payload);
      cache = { values, expires: Date.now() + 15000 };
      return values;
    }).finally(() => { pending = undefined; });
  return { ...await pending };
}

export async function saveCredentials(changes: Credentials): Promise<void> {
  const current = await readCredentials();
  for (const key of credentialKeys) {
    if (changes[key] !== undefined) current[key] = changes[key];
  }
  await configRpc("manual_runtime_config_write", { p_payload: encryptCredentials(current) });
  cache = { values: current, expires: Date.now() + 15000 };
  await hydrateRuntimeConfiguration();
}

export async function hydrateRuntimeConfiguration(): Promise<void> {
  if (!config.ADMIN_AUTH_SECRET || !config.SUPABASE_PUBLISHABLE_KEY) return;
  const values = { ...defaults, ...await readCredentials() };
  for (const key of credentialKeys) {
    (config as unknown as Record<string, unknown>)[key] = values[key] || defaults[key];
  }
}

export async function credentialStatus() {
  const values = { ...defaults, ...await readCredentials() };
  return {
    configured: Object.fromEntries(credentialKeys.map(key => [key, !!values[key]])),
    EMAIL_FROM: values.EMAIL_FROM ?? "",
    SITE_URL: values.SITE_URL ?? "",
  };
}
