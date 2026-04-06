/**
 * Supabase Edge Function — Mercado Pago Checkout Pro
 *
 * Cria uma preferência de pagamento no Mercado Pago e retorna
 * a URL de checkout (init_point) para redirecionar o usuário.
 *
 * Secrets necessários (configurar via Supabase Dashboard ou CLI):
 *   MP_ACCESS_TOKEN   → Access Token do Mercado Pago (produção ou sandbox)
 *   SITE_URL          → URL pública do site (ex: https://manualdoempregador.com.br)
 *
 * CLI: supabase secrets set MP_ACCESS_TOKEN=APP_USR-... SITE_URL=https://...
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

serve(async (req: Request) => {
  // Pre-flight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const accessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!accessToken) {
      console.error("[MP] MP_ACCESS_TOKEN não configurado");
      return json({ error: "Servidor não configurado. Contate o suporte." }, 500);
    }

    // Origin do site — enviado pelo frontend ou fallback para a variável de ambiente
    let origin = Deno.env.get("SITE_URL") || "https://manualdoempregador.com.br";
    try {
      const body = await req.json();
      if (body?.origin) origin = body.origin;
    } catch {
      // body vazio é OK
    }

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
        success: `${origin}/obrigado`,
        failure: `${origin}`,
        pending: `${origin}`,
      },
      auto_return: "approved",
      payment_methods: {
        // Habilita cartão, PIX e boleto — sem excluir nenhum método
        installments: 1,
      },
      statement_descriptor: "MANUAL EMPREGADOR",
      // Notificação webhook (opcional — configure a URL do seu endpoint):
      // notification_url: `${origin}/api/mp-webhook`,
    };

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(preference),
      }
    );

    if (!mpResponse.ok) {
      const mpError = await mpResponse.json();
      console.error("[MP] Erro ao criar preferência:", mpError);
      return json(
        { error: mpError.message || "Erro ao criar preferência de pagamento." },
        mpResponse.status
      );
    }

    const { id, init_point, sandbox_init_point } = await mpResponse.json();

    console.log(`[MP] Preferência criada: ${id}`);

    return json({ init_point, sandbox_init_point });
  } catch (err) {
    console.error("[MP] Erro inesperado:", err);
    return json({ error: "Erro interno. Tente novamente." }, 500);
  }
});
