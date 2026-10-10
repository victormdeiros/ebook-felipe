import { createHash, createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { config } from "./config";

const signingKey = () => {
  if (!config.ADMIN_AUTH_SECRET) throw new Error("Configure ADMIN_AUTH_SECRET no backend.");
  return config.ADMIN_AUTH_SECRET;
};
const fingerprint = () => createHmac("sha256", signingKey())
  .update(config.ADMIN_USERNAME + ":" + (config.ADMIN_PASSWORD_HASH || config.ADMIN_PASSWORD || ""))
  .digest("hex");
const same = (a: string, b: string) => timingSafeEqual(
  createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest(),
);

export function verifyAdminPassword(username: string, password: string): boolean {
  let correct = false;
  if (config.ADMIN_PASSWORD_HASH) {
    const [salt, expected] = config.ADMIN_PASSWORD_HASH.split(":");
    if (salt && expected) correct = same(scryptSync(password, salt, 64).toString("hex"), expected);
  } else if (config.ADMIN_PASSWORD) {
    correct = same(password, config.ADMIN_PASSWORD);
  }
  return same(username, config.ADMIN_USERNAME ?? "") && correct;
}

export function issueAdminSession() {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: config.ADMIN_USERNAME, exp: expiresAt.getTime(), version: fingerprint(), id: randomUUID(),
  })).toString("base64url");
  const signature = createHmac("sha256", signingKey()).update(payload).digest("base64url");
  return { token: payload + "." + signature, email: config.ADMIN_USERNAME!, expiresAt: expiresAt.toISOString() };
}

export function verifyAdminSession(token: string): string | null {
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", signingKey()).update(payload).digest("base64url");
    if (!same(signature, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.sub !== config.ADMIN_USERNAME || !Number.isFinite(data.exp)
      || data.exp <= Date.now() || data.version !== fingerprint()) return null;
    return data.sub;
  } catch { return null; }
}
