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

  // Dados institucionais
  OFFICE_NAME: "FELIPE LOPES ADVOGADOS",
  OFFICE_EMAIL: "contatos@felipelopesadv.com.br",
  OFFICE_PHONE: "(81) 3132.3686",
  OFFICE_WHATSAPP_DISPLAY: "(81) 98675.8036",
  OFFICE_SITE: "https://felipelopesadv.com.br/",
  OFFICE_INSTAGRAM: "https://instagram.com/felipelopesadvogados",
  OFFICE_INSTAGRAM_HANDLE: "@felipelopesadvogados",

  // Endereços
  OFFICES: [
    { city: "Recife", address: "Av. Montevidéu, 172, 16º andar — Boa Vista", detail: "Edf. Des. Pedro Martiniano" },
    { city: "Natal", address: "Rua Angra dos Reis, 2934 — Potengui" },
    { city: "São Paulo", address: "Travessa Dona Paula, 13 — Higienópolis" },
    { city: "Brasília", address: "Quadra 516, Bloco B, 66 — Asa Sul" },
  ],
} as const;

export const getWhatsAppUrl = (customMsg?: string) => {
  const msg = customMsg || CONFIG.WHATSAPP_MSG;
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};
