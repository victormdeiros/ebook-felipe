const CONTENT_KEY = "fl_content";

export interface ContentData {
  heroHeadline: string;
  heroSubheadline: string;
  heroBody: string;
  heroCta: string;
  heroBadge: string;
  ebookCoverUrl: string;
  checkoutUrl: string;
  ebookDownloadUrl: string;
  price: string;
  priceOriginal: string;
  whatsappNumber: string;
  whatsappMsg: string;
}

export const CONTENT_DEFAULTS: ContentData = {
  heroHeadline: "Manual do Empregador",
  heroSubheadline:
    "Da contratação à rescisão: como estruturar relações de trabalho com precaução e estratégia para sua empresa.",
  heroBody:
    "Um guia prático criado por especialistas para ajudar empresários a entender e aplicar corretamente as principais regras da legislação trabalhista no dia a dia da empresa.",
  heroCta: "QUERO ADQUIRIR O E-BOOK",
  heroBadge: "Guia Prático para Empresários",
  ebookCoverUrl: "",
  checkoutUrl: "https://pay.hotmart.com/example",
  ebookDownloadUrl: "/manual-do-empregador.pdf",
  price: "49",
  priceOriginal: "97",
  whatsappNumber: "5581986758036",
  whatsappMsg: "Olá! Tenho interesse no Manual do Empregador.",
};

export const getContent = (): ContentData => {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return { ...CONTENT_DEFAULTS };
    return { ...CONTENT_DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...CONTENT_DEFAULTS };
  }
};

export const saveContent = (updates: Partial<ContentData>): void => {
  try {
    const current = getContent();
    localStorage.setItem(CONTENT_KEY, JSON.stringify({ ...current, ...updates }));
  } catch {
    // ignore storage errors
  }
};

export const resetContent = (): void => {
  try {
    localStorage.removeItem(CONTENT_KEY);
  } catch {
    // ignore
  }
};
