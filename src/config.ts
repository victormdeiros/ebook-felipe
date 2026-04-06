export const CONFIG = {
  // ── Marca ─────────────────────────────────────────────────────
  BRAND_NAME: "MANUAL DO EMPREGADOR",

  // ── WhatsApp ──────────────────────────────────────────────────
  WHATSAPP_NUMBER: "5581986758036",
  WHATSAPP_MSG: "Olá! Tenho interesse no Manual do Empregador.",

  // ── Produto / Checkout ────────────────────────────────────────
  // Preço em BRL (usado no CartDrawer e na preferência MP)
  PRODUCT_PRICE: 47,
  PRODUCT_PRICE_ORIGINAL: 97,

  // URL de fallback se a Edge Function não estiver configurada.
  // Substitua por um link de pagamento gerado no painel do Mercado Pago:
  //   https://www.mercadopago.com.br/tools/create
  PAYMENT_URL: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=",

  // Após pagamento aprovado, o MP redireciona para esta rota
  REDIRECT_URL: "/obrigado",
  EBOOK_DOWNLOAD_URL: "#",

  // ── Storage ───────────────────────────────────────────────────
  LEAD_STORAGE: "localStorage" as const,
};
