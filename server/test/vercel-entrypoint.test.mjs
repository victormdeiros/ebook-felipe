import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { createRequire } from "node:module";
import { randomUUID, scryptSync } from "node:crypto";
import ts from "../../node_modules/typescript/lib/typescript.js";

const require = createRequire(import.meta.url);
const fixturePassword = "fixture-password-only";
const fixtureSalt = "aabbccddeeff00112233445566778899";

test("Vercel ESM entrypoint loads the CommonJS API and handles password login", async (t) => {
  process.env.VERCEL = "1";
  process.env.ADMIN_USERNAME = "admin-fixture@example.com";
  process.env.ADMIN_PASSWORD_HASH = fixtureSalt + ":" + scryptSync(fixturePassword, fixtureSalt, 64).toString("hex");
  process.env.ADMIN_AUTH_SECRET = "fixture-auth-secret-not-production";
  process.env.SUPABASE_URL = "https://heusjcoijobbsgzyfupm.supabase.co";
  process.env.SUPABASE_PROJECT_REF = "heusjcoijobbsgzyfupm";
  process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fixture";
  delete process.env.ADMIN_PASSWORD;
  delete process.env.DATABASE_URL;
  delete process.env.RESEND_API_KEY;

  const apiDir = new URL("../../api/", import.meta.url);
  const output = new URL(".entrypoint-test-" + randomUUID() + ".mjs", apiDir);
  const source = await readFile(new URL("index.ts", apiDir), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;

  await writeFile(output, compiled);
  let listener;
  let pool;
  const originalFetch = globalThis.fetch;
  try {
    let allowLogin = true;
    const writes = [];
    globalThis.fetch = async (url, init) => {
      const href = String(url);
      if (href.includes("manual_admin_login_attempt")) {
        return new Response(allowLogin ? "true" : "false", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (href.includes("manual_runtime_config_read")) return new Response("null", { status: 200 });
      if (href.includes("manual_runtime_config_write")) {
        writes.push(String(init?.body ?? ""));
        return new Response("null", { status: 200 });
      }
      return originalFetch(url, init);
    };

    const { default: app } = await import(output.href);
    const { config } = require("../dist/config.js");
    ({ pool } = require("../dist/db.js"));
    listener = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => listener.once("listening", resolve));
    const base = "http://127.0.0.1:" + listener.address().port;
    const login = (body) => originalFetch(base + "/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    try {
      await t.test("API starts without FUNCTION_INVOCATION_FAILED", async () => {
        const response = await originalFetch(base + "/api/live");
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { ok: true });
      });

      await t.test("missing admin configuration returns an actionable error", async () => {
        const username = config.ADMIN_USERNAME;
        config.ADMIN_USERNAME = undefined;
        const response = await login({ username: "admin-fixture@example.com", password: fixturePassword });
        config.ADMIN_USERNAME = username;
        assert.equal(response.status, 503);
        assert.match((await response.json()).error, /não configurados/);
      });

      await t.test("wrong password is rejected and never echoed", async () => {
        const response = await login({ username: "admin-fixture@example.com", password: "wrong-password" });
        const body = await response.json();
        assert.equal(response.status, 401);
        assert.equal(JSON.stringify(body).includes("wrong-password"), false);
      });

      await t.test("repeated failures are rate limited", async () => {
        allowLogin = false;
        const response = await login({ username: "admin-fixture@example.com", password: fixturePassword });
        allowLogin = true;
        assert.equal(response.status, 429);
        assert.match((await response.json()).error, /15 minutos/);
      });

      let token = "";
      await t.test("valid password creates a session without returning the password", async () => {
        const response = await login({ username: "admin-fixture@example.com", password: fixturePassword });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.ok, true);
        assert.equal(body.email, "admin-fixture@example.com");
        assert.equal(typeof body.token, "string");
        assert.equal(JSON.stringify(body).includes(fixturePassword), false);
        token = body.token;
      });

      await t.test("session and credential status stay behind the admin token", async () => {
        const headers = { Authorization: "Bearer " + token };
        const session = await originalFetch(base + "/api/admin/auth/session", { headers });
        assert.equal(session.status, 200);
        assert.equal((await session.json()).email, "admin-fixture@example.com");
        const status = await originalFetch(base + "/api/admin/runtime-config", { headers });
        const body = await status.json();
        assert.equal(status.status, 200);
        assert.equal(body.configured.RESEND_API_KEY, false);
        assert.equal(JSON.stringify(body).includes("sb_secret"), false);
      });

      await t.test("credential updates reject the wrong database and an invalid Resend key", async () => {
        const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
        const database = await originalFetch(base + "/api/admin/runtime-config", {
          method: "PUT",
          headers,
          body: JSON.stringify({ DATABASE_URL: "postgresql://postgres:secret@db.other.supabase.co:5432/postgres" }),
        });
        assert.equal(database.status, 400);
        const resend = await originalFetch(base + "/api/admin/runtime-config", {
          method: "PUT",
          headers,
          body: JSON.stringify({ RESEND_API_KEY: "not-a-key" }),
        });
        assert.equal(resend.status, 400);
      });

      await t.test("a valid Resend key is stored encrypted and is not returned", async () => {
        const response = await originalFetch(base + "/api/admin/runtime-config", {
          method: "PUT",
          headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
          body: JSON.stringify({ RESEND_API_KEY: "re_fixture" }),
        });
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.configured.RESEND_API_KEY, true);
        assert.equal(JSON.stringify(body).includes("re_fixture"), false);
        assert.equal(writes.some((value) => value.includes("re_fixture")), false);
        assert.equal(writes.length > 0, true);
      });
    } finally {
      /* listeners and pool closed below */
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (listener) await new Promise((resolve) => listener.close(resolve));
    if (pool) await pool.end();
    await unlink(output);
  }
});
