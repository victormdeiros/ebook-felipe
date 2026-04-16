import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { config } from "../config";
import { pool } from "../db";
import { sendEbookPurchaseEmail, sendEventConfirmationEmail } from "../email";

const router = Router();

const preferenceSchema = z.object({
  product: z.enum(["ebook", "event"]).default("ebook"),
  origin: z.string().url().optional(),
  payer: z.object({
    name: z.string().trim().min(2).max(200),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim(),
  }).optional(),
});

// ── POST /api/mp/preference ──────────────────────────────────
// Cria preferência de pagamento para ebook ou evento.
router.post("/preference", async (req, res, next) => {
  try {
    if (!config.MP_ACCESS_TOKEN) {
      return res.status(503).json({ error: "Mercado Pago não configurado no servidor." });
    }

    const { product, origin, payer } = preferenceSchema.parse(req.body ?? {});
    const siteUrl = (origin ?? config.SITE_URL ?? "http://localhost:8081").replace(/\/$/, "");

    // Save lead for abandoned cart tracking (non-blocking), tag: carrinho_abandonado
    if (payer) {
      const cleanPhone = payer.phone.replace(/\D/g, "");
      const tag = product === "event" ? "inscricao_evento" : "carrinho_abandonado";
      pool.query(
        `INSERT INTO manual_leads (name, email, whatsapp, tags)
         VALUES ($1, $2, $3, ARRAY[$4::text])
         ON CONFLICT DO NOTHING`,
        [payer.name, payer.email, cleanPhone, tag]
      ).catch(() => { /* non-blocking */ });
    }

    // Read product info from DB (falls back to config if table not yet migrated)
    let item: { mp_item_id: string; title: string; description: string; price: number };
    try {
      const { rows } = await pool.query<{
        mp_item_id: string; title: string; description: string; price: string;
      }>(
        `SELECT mp_item_id, title, description, price FROM manual_products WHERE id = $1 AND active = true`,
        [product],
      );
      if (rows.length) {
        item = { ...rows[0], price: Number(rows[0].price) };
      } else {
        item = {
          mp_item_id:  config.products[product].id,
          title:       config.products[product].title,
          description: config.products[product].description,
          price:       config.products[product].price,
        };
      }
    } catch {
      // DB not yet migrated — use config fallback
      item = {
        mp_item_id:  config.products[product].id,
        title:       config.products[product].title,
        description: config.products[product].description,
        price:       config.products[product].price,
      };
    }

    const preference = {
      items: [
        {
          id: item.mp_item_id,
          title: item.title,
          description: item.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: item.price,
        },
      ],
      ...(payer ? {
        payer: {
          name: payer.name.split(" ")[0],
          surname: payer.name.split(" ").slice(1).join(" ") || undefined,
          email: payer.email,
          phone: {
            area_code: payer.phone.replace(/\D/g, "").slice(0, 2),
            number: payer.phone.replace(/\D/g, "").slice(2),
          },
        },
      } : {}),
      metadata: { product },
      back_urls: {
        success: `${siteUrl}/obrigado`,
        failure: `${siteUrl}`,
        pending: `${siteUrl}`,
      },
      ...(siteUrl.includes("localhost") ? {} : { auto_return: "approved" }),
      statement_descriptor: "MANUEL EMPREGADOR",
      ...(config.SITE_URL && !config.SITE_URL.includes("localhost") ? {
        notification_url: `${config.SITE_URL.replace(/\/$/, "")}/api/mp/webhook`,
      } : {}),
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const text = await mpRes.text();
      console.error("[mp] preference error", mpRes.status, text);
      let mpMessage = "Mercado Pago rejeitou a preferência.";
      try { mpMessage = JSON.stringify(JSON.parse(text)); } catch { mpMessage = text; }
      return res.status(502).json({ error: `MP ${mpRes.status}: ${mpMessage}` });
    }

    const { id, init_point, sandbox_init_point } = (await mpRes.json()) as {
      id: string;
      init_point: string;
      sandbox_init_point: string;
    };

    res.json({ preference_id: id, init_point, sandbox_init_point, product });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/mp/webhook ─────────────────────────────────────
// Recebe notificações do Mercado Pago e registra pedidos aprovados.
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body ?? {};

    // MP envia topic=payment para notificações de pagamento
    if (type !== "payment" || !data?.id) {
      return res.sendStatus(200);
    }

    if (!config.MP_ACCESS_TOKEN) {
      return res.sendStatus(200);
    }

    // Busca detalhes do pagamento na API do MP
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: { Authorization: `Bearer ${config.MP_ACCESS_TOKEN}` },
    });

    if (!paymentRes.ok) {
      console.error("[mp/webhook] payment fetch error", paymentRes.status);
      return res.sendStatus(200); // sempre 200 pro MP não retentar
    }

    const payment = (await paymentRes.json()) as {
      id: number;
      status: string;
      transaction_amount: number;
      payer: { email?: string; first_name?: string; last_name?: string };
      payment_type_id?: string;
      metadata?: { product?: string };
      preference_id?: string;
    };

    const product = payment.metadata?.product ?? "ebook";
    const payerName = [payment.payer?.first_name, payment.payer?.last_name]
      .filter(Boolean)
      .join(" ") || null;

    // Upsert — idempotente (pagamentos podem chegar mais de uma vez)
    const upsertResult = await pool.query<{ was_new: boolean }>(
      `INSERT INTO manual_orders
         (mp_payment_id, mp_preference_id, product, status, amount, payer_email, payer_name, payment_method, raw_webhook)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (mp_payment_id) DO UPDATE
         SET status = EXCLUDED.status,
             raw_webhook = EXCLUDED.raw_webhook,
             updated_at = now()
       RETURNING (xmax = 0) AS was_new`,
      [
        String(payment.id),
        payment.preference_id ?? null,
        product,
        payment.status,
        payment.transaction_amount,
        payment.payer?.email ?? null,
        payerName,
        payment.payment_type_id ?? null,
        JSON.stringify(payment),
      ]
    );

    console.log(`[mp/webhook] payment ${payment.id} → ${payment.status} (${product})`);

    // Disparar e-mail apenas em aprovação e somente na primeira vez (was_new)
    const isApproved = payment.status === "approved";
    const wasNew = upsertResult.rows[0]?.was_new ?? true;
    const payerEmail = payment.payer?.email;

    if (isApproved && payerEmail && config.RESEND_API_KEY) {
      const displayName = payerName ?? "Cliente";

      // Remove tag carrinho_abandonado do lead ao confirmar pagamento
      pool.query(
        `UPDATE manual_leads
         SET tags = array_remove(tags, 'carrinho_abandonado')
         WHERE email = $1`,
        [payerEmail]
      ).catch(() => {});

      if (wasNew) {
        // Busca URL do ebook no banco
        const { rows: cfgRows } = await pool.query<{ value: string }>(
          `SELECT value FROM manual_config WHERE key = 'ebook_download_url'`
        );
        const ebookUrl = cfgRows[0]?.value ?? "";

        if (product === "ebook") {
          sendEbookPurchaseEmail(payerEmail, displayName, ebookUrl).catch((e) =>
            console.error("[email] ebook send error:", e)
          );
        } else if (product === "event") {
          // Verifica se o cliente também comprou o ebook
          const { rows: ebookOrders } = await pool.query<{ count: string }>(
            `SELECT COUNT(*)::text AS count FROM manual_orders
             WHERE payer_email = $1 AND product = 'ebook' AND status = 'approved'`,
            [payerEmail]
          );
          const hasEbook = Number(ebookOrders[0]?.count) > 0;
          sendEventConfirmationEmail(
            payerEmail,
            displayName,
            hasEbook,
            hasEbook ? ebookUrl : undefined
          ).catch((e) => console.error("[email] event send error:", e));
        }
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("[mp/webhook] error:", err);
    return res.sendStatus(200); // sempre 200 pro MP
  }
});

// ── GET /api/mp/status ───────────────────────────────────────
// Verifica se o MP está configurado (sem expor o token).
router.get("/status", (_req, res) => {
  res.json({
    configured: !!config.MP_ACCESS_TOKEN,
    public_key: config.MP_PUBLIC_KEY ?? null,
    products: {
      ebook: { price: config.products.ebook.price },
      event: { price: config.products.event.price },
    },
  });
});

export default router;
