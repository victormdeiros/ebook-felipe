import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { config } from "../config";
import { pool } from "../db";

const router = Router();

const preferenceSchema = z.object({
  product: z.enum(["ebook", "event"]).default("ebook"),
  origin: z.string().url().optional(),
});

// ── POST /api/mp/preference ──────────────────────────────────
// Cria preferência de pagamento para ebook ou evento.
router.post("/preference", async (req, res, next) => {
  try {
    if (!config.MP_ACCESS_TOKEN) {
      return res.status(503).json({ error: "Mercado Pago não configurado no servidor." });
    }

    const { product, origin } = preferenceSchema.parse(req.body ?? {});
    const siteUrl = (origin ?? config.SITE_URL ?? "http://localhost:8081").replace(/\/$/, "");

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
      metadata: { product },
      back_urls: {
        success: `${siteUrl}/obrigado`,
        failure: `${siteUrl}`,
        pending: `${siteUrl}`,
      },
      auto_return: "approved",
      statement_descriptor: "MANUEL EMPREGADOR",
      notification_url: `${config.SITE_URL?.replace("localhost", "").replace("http://", "https://")}/api/mp/webhook`,
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
      return res.status(502).json({ error: "Mercado Pago rejeitou a preferência." });
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
    await pool.query(
      `INSERT INTO manual_orders
         (mp_payment_id, mp_preference_id, product, status, amount, payer_email, payer_name, payment_method, raw_webhook)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (mp_payment_id) DO UPDATE
         SET status = EXCLUDED.status,
             raw_webhook = EXCLUDED.raw_webhook,
             updated_at = now()`,
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
