// ============================================
//  CONFIGURAÇÃO DA LANDING PAGE
//  Altere os valores abaixo para personalizar
// ============================================

export const CONFIG = {
  // Pagamento
  STRIPE_PAYMENT_LINK: "#STRIPE_PAYMENT_LINK",
  EBOOK_DOWNLOAD_URL: "/manual-do-empregador.pdf",

  // Preço
  PRICE: "R$ 49",
  PRICE_ORIGINAL: "R$ 97",

  // WhatsApp
  WHATSAPP_NUMBER: "5581986758036",
  WHATSAPP_MSG: "Olá! Tenho interesse no Manual do Empregador.",

  // Dados da marca
  BRAND_NAME: "MANUAL DO EMPREGADOR",
} as const;

export const getWhatsAppUrl = (customMsg?: string) => {
  const msg = customMsg || CONFIG.WHATSAPP_MSG;
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};
