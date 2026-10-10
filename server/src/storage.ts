/**
 * Supabase Storage: ebook-manual bucket and ebook/ prefix.
 * No files are copied and no buckets are created by this module.
 */
import { config } from "./config";

function storageHeaders(): Record<string, string> {
  const key = config.SUPABASE_SECRET_KEY || config.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Configure SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY on the backend for Storage.");
  return {
    apikey: key,
    ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }),
  };
}

function objectPath(key: string): string {
  return encodeURIComponent(config.SUPABASE_STORAGE_BUCKET)
    + "/" + key.split("/").map(encodeURIComponent).join("/");
}

async function storageRequest(endpoint: string, init: RequestInit): Promise<Response> {
  const response = await fetch(config.SUPABASE_URL + "/storage/v1/" + endpoint, {
    ...init,
    headers: { ...storageHeaders(), ...init.headers },
  });
  if (!response.ok) {
    throw new Error(`Supabase Storage request failed (HTTP ${response.status}). Check the bucket and backend credentials.`);
  }
  return response;
}

export async function checkStorageConnection(): Promise<void> {
  const bucket = await storageRequest(
    "bucket/" + encodeURIComponent(config.SUPABASE_STORAGE_BUCKET),
    { method: "GET" },
  ).then((response) => response.json()) as { public: boolean };
  if (!bucket.public) throw new Error("The ebook bucket must be public to store permanent download URLs.");
}

/** Upload new PDFs. The configured bucket must already exist and be public. */
export async function uploadEbook(buffer: Buffer, originalName: string): Promise<string> {
  const key = `ebook/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await checkStorageConnection();
  await storageRequest("object/" + objectPath(key), {
    method: "POST",
    headers: { "Content-Type": "application/pdf", "x-upsert": "false" },
    body: new Uint8Array(buffer),
  });
  return config.SUPABASE_URL + "/storage/v1/object/public/" + objectPath(key);
}

/** Generate a seven-day download URL for an object key in the configured bucket. */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const response = await storageRequest("object/sign/" + objectPath(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 7 }),
  });
  const result = await response.json() as { signedURL: string };
  // Supabase returns paths relative to /storage/v1.
  return config.SUPABASE_URL + "/storage/v1" + result.signedURL;
}
