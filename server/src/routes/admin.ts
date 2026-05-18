import { Router } from "express";
import { createHmac, randomBytes, randomInt } from "node:crypto";
import { z } from "zod";
import multer from "multer";
import { pool } from "../db";
import { config } from "../config";
import { sendAdminLoginCodeEmail, sendEbookPurchaseEmail, sendEventConfirmationEmail } from "../email";
import { type AdminRequest, hashAdminToken, requireAdmin } from "../middleware/auth";
import { uploadEbook } from "../storage";
import { processQueue, scheduleCartEmails } from "../emailScheduler";

const router = Router();

const ADMIN_CODE_TTL_MINUTES = 10;
const ADMIN_SESSION_TTL_DAYS = 7;
const adminAuthSecret = config.ADMIN_AUTH_SECRET
  ?? config.ADMIN_TOKEN
  ?? config.RESEND_API_KEY
  ?? "manual-admin-auth";

const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const verifyCodeSchema = emailOnlySchema.extend({
  code: z.string().trim().regex(/^\d{6}$/),
});

const hashAdminCode = (email: string, code: string) =>
  createHmac("sha256", adminAuthSecret).update(`${email}:${code}`).digest("hex");

// Public auth: request a one-time login code for an allowed admin e-mail.
router.post("/auth/request-code", async (req, res, next) => {
  try {
    if (!config.RESEND_API_KEY) {
      return res.status(503).json({ error: "RESEND_API_KEY nao configurado no servidor." });
    }

    const { email } = emailOnlySchema.parse(req.body);
    const { rows } = await pool.query<{ email: string }>(
      `SELECT email FROM manual_admin_allowed_emails WHERE email = $1`,
      [email],
    );

    // Keep the response neutral so the allowed list is not exposed.
    if (!rows.length) {
      console.warn(`[admin-auth] code requested for non-allowed email: ${email}`);
      return res.json({ ok: true });
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const codeHash = hashAdminCode(email, code);

    await pool.query(
      `UPDATE manual_admin_login_codes
       SET consumed_at = now()
       WHERE email = $1 AND consumed_at IS NULL`,
      [email],
    );

    await pool.query(
      `INSERT INTO manual_admin_login_codes
       (email, code_hash, expires_at, requested_ip, user_agent)
       VALUES ($1, $2, now() + ($3::text || ' minutes')::interval, $4, $5)`,
      [
        email,
        codeHash,
        ADMIN_CODE_TTL_MINUTES,
        req.ip ?? null,
        req.header("user-agent") ?? null,
      ],
    );

    await sendAdminLoginCodeEmail(email, code);
    res.json({ ok: true, expiresInMinutes: ADMIN_CODE_TTL_MINUTES });
  } catch (err) {
    next(err);
  }
});

// Public auth: exchange the one-time code for a short-lived admin session.
router.post("/auth/verify-code", async (req, res, next) => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body);
    const { rows } = await pool.query<{
      id: string;
      code_hash: string;
      attempts: number;
      expires_at: string;
    }>(
      `SELECT id, code_hash, attempts, expires_at
       FROM manual_admin_login_codes
       WHERE email = $1 AND consumed_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [email],
    );

    const challenge = rows[0];
    if (!challenge || new Date(challenge.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ error: "Codigo expirado. Solicite um novo acesso." });
    }

    if (challenge.attempts >= 5) {
      return res.status(429).json({ error: "Muitas tentativas. Solicite um novo codigo." });
    }

    if (challenge.code_hash !== hashAdminCode(email, code)) {
      await pool.query(
        `UPDATE manual_admin_login_codes SET attempts = attempts + 1 WHERE id = $1`,
        [challenge.id],
      );
      return res.status(400).json({ error: "Codigo invalido." });
    }

    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashAdminToken(token);
    const { rows: sessionRows } = await pool.query<{ expires_at: string }>(
      `WITH consumed AS (
         UPDATE manual_admin_login_codes
         SET consumed_at = now()
         WHERE id = $1
       )
       INSERT INTO manual_admin_sessions (email, token_hash, expires_at)
       VALUES ($2, $3, now() + ($4::text || ' days')::interval)
       RETURNING expires_at`,
      [challenge.id, email, tokenHash, ADMIN_SESSION_TTL_DAYS],
    );

    res.json({
      ok: true,
      token,
      email,
      expiresAt: sessionRows[0].expires_at,
    });
  } catch (err) {
    next(err);
  }
});

router.use(requireAdmin);

router.get("/auth/session", (req, res) => {
  const adminReq = req as AdminRequest;
  res.json({ ok: true, email: adminReq.adminEmail });
});

router.delete("/auth/session", async (req, res, next) => {
  try {
    const adminReq = req as AdminRequest;
    if (adminReq.adminSessionId) {
      await pool.query(
        `UPDATE manual_admin_sessions SET revoked_at = now() WHERE id = $1`,
        [adminReq.adminSessionId],
      );
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/allowed-emails", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT email, created_at
       FROM manual_admin_allowed_emails
       ORDER BY created_at ASC, email ASC`,
    );
    res.json({ items: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/allowed-emails", async (req, res, next) => {
  try {
    const { email } = emailOnlySchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO manual_admin_allowed_emails (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING email, created_at`,
      [email],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/allowed-emails/:email", async (req, res, next) => {
  try {
    const email = z.string().trim().toLowerCase().email().parse(req.params.email);
    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_admin_allowed_emails`,
    );

    if (Number(countRows[0].count) <= 1) {
      return res.status(400).json({ error: "Mantenha pelo menos um e-mail permitido." });
    }

    const { rowCount } = await pool.query(
      `DELETE FROM manual_admin_allowed_emails WHERE email = $1`,
      [email],
    );

    if (!rowCount) return res.status(404).json({ error: "E-mail nao encontrado." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Apenas arquivos PDF são aceitos."));
  },
});

const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(500).default(100),
  offset: z.coerce.number().int().nonnegative().default(0),
});

const manualMaterialEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(1).max(200).default("Cliente"),
  kind: z.enum(["ebook", "event", "event_ebook"]).default("ebook"),
  note: z.string().trim().max(300).optional(),
});

const absoluteUrl = (url: string): string => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${config.SITE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

const getEbookDownloadUrl = async (): Promise<string> => {
  const { rows: cfgRows } = await pool.query<{ value: string }>(
    `SELECT value FROM manual_config WHERE key = 'ebook_download_url'`,
  );
  if (cfgRows[0]?.value) return absoluteUrl(cfgRows[0].value);

  const { rows: contentRows } = await pool.query<{ ebook_download_url: string }>(
    `SELECT ebook_download_url FROM manual_content WHERE id = 'default'`,
  );
  return absoluteUrl(contentRows[0]?.ebook_download_url ?? "");
};

// ── GET /api/admin/leads ─────────────────────────────────────
// Suporta filtro por ?tag=carrinho_abandonado
router.get("/leads", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);
    const tagFilter = z.string().optional().parse(req.query.tag);

    const whereClause = tagFilter ? "WHERE $3 = ANY(tags)" : "";
    const params: (number | string)[] = [limit, offset];
    if (tagFilter) params.push(tagFilter);

    const { rows } = await pool.query(
      `SELECT id, name, email, whatsapp, tags, created_at
       FROM manual_leads
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_leads ${whereClause}`,
      tagFilter ? [tagFilter] : [],
    );

    res.json({
      total: Number(countRows[0].count),
      limit,
      offset,
      items: rows,
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/ebook-upload ──────────────────────────────
router.post("/ebook-upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

    const url = await uploadEbook(req.file.buffer, req.file.originalname);

    // Persiste a URL no banco para o webhook usar ao enviar e-mails
    await pool.query(
      `INSERT INTO manual_config (key, value, updated_at)
       VALUES ('ebook_download_url', $1, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [url],
    );

    res.json({ url });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/ebook-url ──────────────────────────────────
router.get("/ebook-url", async (_req, res, next) => {
  try {
    const { rows } = await pool.query<{ value: string }>(
      `SELECT value FROM manual_config WHERE key = 'ebook_download_url'`,
    );
    res.json({ url: rows[0]?.value ?? "" });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/cta-config ─────────────────────────────────
router.get("/cta-config", requireAdmin, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<{ key: string; value: string }>(
      `SELECT key, value FROM manual_config WHERE key IN ('cta_acesso_product_id', 'cta_vaga_product_id')`,
    );
    const cfg: Record<string, string> = { cta_acesso_product_id: "ebook", cta_vaga_product_id: "event" };
    for (const row of rows) cfg[row.key] = row.value;
    res.json(cfg);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/admin/cta-config ─────────────────────────────────
router.put("/cta-config", requireAdmin, async (req, res, next) => {
  try {
    const { cta_acesso_product_id, cta_vaga_product_id } = req.body as {
      cta_acesso_product_id?: string;
      cta_vaga_product_id?: string;
    };
    const entries: [string, string][] = [];
    if (cta_acesso_product_id) entries.push(["cta_acesso_product_id", cta_acesso_product_id]);
    if (cta_vaga_product_id) entries.push(["cta_vaga_product_id", cta_vaga_product_id]);
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO manual_config (key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value],
      );
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/gtm-events ─────────────────────────────────
// Returns the GTM custom events catalog stored in manual_config
router.get("/gtm-events", requireAdmin, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<{ value: string }>(
      `SELECT value FROM manual_config WHERE key = 'gtm_events_catalog'`,
    );
    const events = rows[0]?.value ? JSON.parse(rows[0].value) : [];
    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/admin/gtm-events ─────────────────────────────────
// Replaces the entire GTM events catalog
router.put("/gtm-events", requireAdmin, async (req, res, next) => {
  try {
    const { events } = z.object({
      events: z.array(z.object({
        id: z.string(),
        event: z.string().min(1).max(100),
        description: z.string().max(300),
        payload: z.record(z.unknown()),
        enabled: z.boolean(),
        created_at: z.string(),
      })),
    }).parse(req.body);

    await pool.query(
      `INSERT INTO manual_config (key, value, updated_at)
       VALUES ('gtm_events_catalog', $1, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [JSON.stringify(events)],
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/inscricoes ────────────────────────────────
// Inscrições no evento: leads com tag inscricao_evento OU pedidos aprovados de evento
// Branch 1 usa LATERAL join para não perder pagamentos quando o produto foi deletado
router.get("/inscricoes", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);

    const { rows } = await pool.query(
      `WITH combined AS (
         -- 1) Leads com tag inscricao_evento + seu pedido mais recente (aprovado primeiro)
         --    LATERAL evita perder o pagamento caso o produto tenha sido removido da tabela
         SELECT
           l.id::text AS id,
           l.name, l.email, l.whatsapp, l.tags, l.created_at,
           o.id             AS order_id,
           o.status         AS order_status,
           o.amount,
           o.mp_payment_id,
           o.attended,
           o.payment_method,
           o.courtesy_by,
           o.created_at     AS paid_at
         FROM manual_leads l
         LEFT JOIN LATERAL (
           SELECT * FROM manual_orders o2
           WHERE o2.payer_email = l.email
           ORDER BY
             CASE WHEN o2.status = 'approved' THEN 0 ELSE 1 END,
             o2.created_at DESC
           LIMIT 1
         ) o ON true
         WHERE 'inscricao_evento' = ANY(l.tags)

         UNION ALL

         -- 2) Pedidos de evento cujo pagador não tem lead com a tag (compra direta)
         SELECT
           o.id::text AS id,
           COALESCE(o.payer_name, o.payer_email, 'Comprador') AS name,
           o.payer_email AS email,
           NULL          AS whatsapp,
           ARRAY[]::text[] AS tags,
           o.created_at,
           o.id             AS order_id,
           o.status         AS order_status,
           o.amount,
           o.mp_payment_id,
           o.attended,
           o.payment_method,
           o.courtesy_by,
           o.created_at     AS paid_at
         FROM manual_orders o
         WHERE (
           o.product IN (
             SELECT id FROM manual_products WHERE checkout_type IN ('event','event_ebook')
           )
           OR o.product = 'event'
           OR o.payment_method = 'courtesy'
         )
         AND (
           o.payer_email IS NULL
           OR NOT EXISTS (
             SELECT 1 FROM manual_leads l2
             WHERE l2.email = o.payer_email
               AND 'inscricao_evento' = ANY(l2.tags)
           )
         )
       )
       SELECT * FROM combined
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `WITH combined AS (
         SELECT l.id FROM manual_leads l WHERE 'inscricao_evento' = ANY(l.tags)
         UNION ALL
         SELECT o.id FROM manual_orders o
         WHERE (
           o.product IN (SELECT id FROM manual_products WHERE checkout_type IN ('event','event_ebook'))
           OR o.product = 'event'
           OR o.payment_method = 'courtesy'
         )
         AND (o.payer_email IS NULL OR NOT EXISTS (
           SELECT 1 FROM manual_leads l2
           WHERE l2.email = o.payer_email AND 'inscricao_evento' = ANY(l2.tags)
         ))
       )
       SELECT COUNT(*)::text AS count FROM combined`,
    );

    res.json({ total: Number(countRows[0].count), limit, offset, items: rows });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/inscricoes ───────────────────────────────
// Cria inscrição manual (cortesia)
router.post("/inscricoes", async (req, res, next) => {
  try {
    const { name, email, whatsapp, courtesy_by } = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      whatsapp: z.string().optional(),
      courtesy_by: z.string().min(1),
    }).parse(req.body);

    // Upsert lead com tag inscricao_evento
    const { rows: leadRows } = await pool.query<{ id: string }>(
      `INSERT INTO manual_leads (name, email, whatsapp, tags)
       VALUES ($1, $2, $3, ARRAY['inscricao_evento'])
       ON CONFLICT (email) DO UPDATE
         SET name      = EXCLUDED.name,
             whatsapp  = COALESCE(EXCLUDED.whatsapp, manual_leads.whatsapp),
             tags      = array_append(
               array_remove(manual_leads.tags, 'inscricao_evento'),
               'inscricao_evento'
             )
       RETURNING id`,
      [name, email, whatsapp ?? null],
    );

    // Cria pedido aprovado como cortesia
    const mpId = `courtesy_${Date.now()}_${leadRows[0].id}`;
    const { rows: orderRows } = await pool.query<{ id: string }>(
      `INSERT INTO manual_orders
         (mp_payment_id, product, status, amount, payer_email, payer_name, payment_method, courtesy_by)
       VALUES ($1, 'event', 'approved', 0, $2, $3, 'courtesy', $4)
       RETURNING id`,
      [mpId, email, name, courtesy_by],
    );

    res.status(201).json({ lead_id: leadRows[0].id, order_id: orderRows[0].id });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/inscricoes/:orderId/attended ────────────
// Marca presença no evento
router.patch("/inscricoes/:orderId/attended", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { attended } = z.object({ attended: z.boolean() }).parse(req.body);

    const { rows } = await pool.query<{ id: string; attended: boolean }>(
      `UPDATE manual_orders
       SET attended = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, attended`,
      [attended, orderId]
    );

    if (!rows.length) return res.status(404).json({ error: "Pedido não encontrado." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


// ── GET /api/admin/orders ────────────────────────────────────
router.get("/orders", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);
    const statusFilter = z.string().optional().parse(req.query.status);

    const whereClause = statusFilter ? "WHERE status = $3" : "";
    const params: (number | string)[] = [limit, offset];
    if (statusFilter) params.push(statusFilter);

    const { rows } = await pool.query(
      `SELECT id, mp_payment_id, mp_preference_id, product, status,
              amount, payer_email, payer_name, payment_method, created_at
       FROM manual_orders
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );

    const { rows: countRows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM manual_orders ${whereClause}`,
      statusFilter ? [statusFilter] : [],
    );

    res.json({
      total: Number(countRows[0].count),
      limit,
      offset,
      items: rows,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/stats ─────────────────────────────────────
router.get("/stats", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM manual_dashboard_stats`);

    // Leads por dia (últimos 30 dias)
    const { rows: leadsByDay } = await pool.query<{ date: string; count: string }>(
      `SELECT created_at::date::text AS date, COUNT(*)::text AS count
       FROM manual_leads
       WHERE created_at >= now() - INTERVAL '30 days'
       GROUP BY date ORDER BY date ASC`,
    );

    // Pedidos aprovados por dia (últimos 30 dias)
    const { rows: ordersByDay } = await pool.query<{
      date: string; count: string; revenue: string;
    }>(
      `SELECT created_at::date::text AS date,
              COUNT(*)::text AS count,
              COALESCE(SUM(amount),0)::text AS revenue
       FROM manual_orders
       WHERE status = 'approved' AND created_at >= now() - INTERVAL '30 days'
       GROUP BY date ORDER BY date ASC`,
    );

    // Breakdown por método de pagamento
    const { rows: paymentMethods } = await pool.query<{ method: string; count: string; revenue: string }>(
      `SELECT COALESCE(payment_method, 'unknown') AS method,
              COUNT(*)::text AS count,
              COALESCE(SUM(amount),0)::text AS revenue
       FROM manual_orders
       WHERE status = 'approved'
       GROUP BY method ORDER BY count DESC`,
    );

    // Breakdown por produto
    const { rows: productBreakdown } = await pool.query<{ product: string; count: string; revenue: string }>(
      `SELECT product,
              COUNT(*)::text AS count,
              COALESCE(SUM(amount),0)::text AS revenue
       FROM manual_orders
       WHERE status = 'approved'
       GROUP BY product ORDER BY count DESC`,
    );

    // Leads por tag
    const { rows: leadsByTag } = await pool.query<{ tag: string; count: string }>(
      `SELECT unnest(tags) AS tag, COUNT(*)::text AS count
       FROM manual_leads
       GROUP BY tag ORDER BY count DESC`,
    );

    // Fila de e-mails
    const { rows: emailStats } = await pool.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*)::text AS count
       FROM manual_email_queue
       GROUP BY status`,
    );

    res.json({
      ...rows[0],
      leads_by_day: leadsByDay.map((r) => ({ date: r.date.slice(5), count: Number(r.count) })),
      orders_by_day: ordersByDay.map((r) => ({
        date: r.date.slice(5),
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      payment_methods: paymentMethods.map((r) => ({
        method: r.method,
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      product_breakdown: productBreakdown.map((r) => ({
        product: r.product,
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      leads_by_tag: leadsByTag.map((r) => ({ tag: r.tag, count: Number(r.count) })),
      email_stats: Object.fromEntries(
        emailStats.map((r) => [r.status, Number(r.count)])
      ) as Record<string, number>,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/events ─────────────────────────────────────
router.get("/events", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);

    const { rows } = await pool.query(
      `SELECT id, name, payload, occurred_at
       FROM manual_events
       ORDER BY occurred_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    res.json({ limit, offset, items: rows });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/email-templates ────────────────────────────
router.get("/email-templates", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.name, t.trigger_desc, t.subject, t.active, t.updated_at,
              COUNT(q.id) FILTER (WHERE q.status = 'pending')   AS pending_count,
              COUNT(q.id) FILTER (WHERE q.status = 'sent')      AS sent_count,
              COUNT(q.id) FILTER (WHERE q.status = 'failed')    AS failed_count,
              COUNT(q.id) FILTER (WHERE q.status = 'cancelled') AS cancelled_count
       FROM manual_email_templates t
       LEFT JOIN manual_email_queue q ON q.template_id = t.id
       GROUP BY t.id, t.name, t.trigger_desc, t.subject, t.active, t.updated_at
       ORDER BY t.id`,
    );
    res.json(rows.map((r) => ({
      ...r,
      pending_count:   Number(r.pending_count),
      sent_count:      Number(r.sent_count),
      failed_count:    Number(r.failed_count),
      cancelled_count: Number(r.cancelled_count),
    })));
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/admin/email-templates/:id ──────────────────────
const templateUpdateSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  active:  z.boolean().optional(),
});

router.patch("/email-templates/:id", async (req, res, next) => {
  try {
    const id = z.string().min(1).max(60).parse(req.params.id);
    const updates = templateUpdateSchema.parse(req.body);

    const setClauses: string[] = ["updated_at = now()"];
    const params: (string | boolean)[] = [];
    let paramIdx = 1;

    if (updates.subject !== undefined) {
      setClauses.push(`subject = $${paramIdx++}`);
      params.push(updates.subject);
    }
    if (updates.active !== undefined) {
      setClauses.push(`active = $${paramIdx++}`);
      params.push(updates.active);
    }

    params.push(id);
    const { rows } = await pool.query(
      `UPDATE manual_email_templates SET ${setClauses.join(", ")} WHERE id = $${paramIdx} RETURNING *`,
      params,
    );

    if (!rows.length) return res.status(404).json({ error: "Template not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/email-queue ────────────────────────────────
router.get("/email-queue", async (req, res, next) => {
  try {
    const { limit, offset } = paginationSchema.parse(req.query);
    const statusFilter = z.string().optional().parse(req.query.status);

    const where = statusFilter ? "WHERE q.status = $3" : "";
    const params: (number | string)[] = [limit, offset];
    if (statusFilter) params.push(statusFilter);

    const { rows } = await pool.query(
      `SELECT q.id, q.email, q.lead_name, q.template_id, q.scheduled_at,
              q.sent_at, q.status, q.error, q.created_at,
              t.name AS template_name
       FROM manual_email_queue q
       JOIN manual_email_templates t ON t.id = q.template_id
       ${where}
       ORDER BY q.created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );
    res.json({ limit, offset, items: rows });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/email-queue/process ──────────────────────
// Dispara manualmente o processamento da fila (útil para testes).
// Envia manualmente o e-mail de confirmacao/material para um destinatario.
router.post("/send-material-email", async (req, res, next) => {
  try {
    if (!config.RESEND_API_KEY) {
      return res.status(503).json({ ok: false, error: "RESEND_API_KEY nao configurado no servidor." });
    }

    const { email, name, kind, note } = manualMaterialEmailSchema.parse(req.body);
    const ebookUrl = kind === "event" ? undefined : await getEbookDownloadUrl();

    if (kind === "ebook") {
      await sendEbookPurchaseEmail(email, name, ebookUrl ?? "");
    } else if (kind === "event") {
      await sendEventConfirmationEmail(email, name, false, undefined);
    } else {
      await sendEventConfirmationEmail(email, name, true, ebookUrl);
    }

    const adminReq = req as AdminRequest;
    pool.query(
      `INSERT INTO manual_events (name, payload)
       VALUES ($1, $2)`,
      [
        "manual_material_email_sent",
        JSON.stringify({
          email,
          lead_name: name,
          kind,
          note: note ?? null,
          admin_email: adminReq.adminEmail ?? null,
        }),
      ],
    ).catch(() => {});

    res.json({ ok: true, email, kind });
  } catch (err) {
    next(err);
  }
});

router.post("/email-queue/process", async (_req, res, next) => {
  try {
    const stats = await processQueue();
    res.json({ ok: true, ...stats, message: `Fila processada: ${stats.sent} enviados, ${stats.failed} falhas.` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(503).json({ ok: false, error: msg });
  }
});

// ── POST /api/admin/email-queue/test-send ────────────────────
// Agenda um envio imediato de teste para um e-mail específico,
// cancelando deduplicação (para não bloquear repetição em testes).
router.post("/email-queue/test-send", async (req, res, next) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(503).json({ ok: false, error: "RESEND_API_KEY não configurado no servidor. Adicione ao arquivo server/.env" });
    }

    const { email, name } = z.object({
      email: z.string().email(),
      name: z.string().min(1).default("Teste"),
    }).parse(req.body);

    // Cancel any existing pending cart emails for this email so dedup doesn't block
    await pool.query(
      `UPDATE manual_email_queue
       SET status = 'cancelled'
       WHERE email = $1 AND template_id LIKE 'cart_%' AND status = 'pending'`,
      [email],
    );

    await scheduleCartEmails(email, name);

    // Ensure the test address exists as a lead with carrinho_abandonado tag
    // so processQueue doesn't cancel these emails immediately.
    await pool.query(
      `INSERT INTO manual_leads (name, email, whatsapp, tags)
       VALUES ($1, $2, '', ARRAY['carrinho_abandonado'::text])
       ON CONFLICT (email) DO UPDATE
         SET tags = array_append(
           array_remove(manual_leads.tags, 'carrinho_abandonado'),
           'carrinho_abandonado'
         )`,
      [name, email],
    );

    const stats = await processQueue();

    res.json({ ok: true, ...stats, message: `E-mails disparados para ${email}: ${stats.sent} enviados, ${stats.failed} falhas.` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: msg });
  }
});

export default router;
