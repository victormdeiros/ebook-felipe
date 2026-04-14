import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { config } from "../config";

const router = Router();

const bodySchema = z.object({
  origin: z.string().url().optional(),
});

router.post("/preference", async (req, res, next) => {
  try {
    const { origin } = bodySchema.parse(req.body ?? {});
    const siteUrl = origin ?? config.SITE_URL;

    const preference = {
      items: [
        {
          id: "manual-do-empregador",
          title: "Manual do Empregador — E-book",
          description:
            "Material objetivo para consulta rápida na rotina de gestão e Departamento Pessoal.",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 47.0,
        },
      ],
      back_urls: {
        success: `${siteUrl}/obrigado`,
        failure: `${siteUrl}`,
        pending: `${siteUrl}`,
      },
      auto_return: "approved",
      statement_descriptor: "MANUAL EMPREGADOR",
    };

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": randomUUID(),
        },
        body: JSON.stringify(preference),
      },
    );

    if (!mpResponse.ok) {
      const text = await mpResponse.text();
      console.error("[mp] preference error", mpResponse.status, text);
      return res
        .status(502)
        .json({ error: "Mercado Pago rejected the preference." });
    }

    const { id, init_point, sandbox_init_point } = (await mpResponse.json()) as {
      id: string;
      init_point: string;
      sandbox_init_point: string;
    };

    res.json({ preference_id: id, init_point, sandbox_init_point });
  } catch (err) {
    next(err);
  }
});

export default router;
