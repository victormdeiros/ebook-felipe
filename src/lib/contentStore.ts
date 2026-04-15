const CONTENT_KEY = "fl_content";
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "";

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
  // Event product
  eventPrice: string;
  eventCheckoutUrl: string;
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
  checkoutUrl: "",
  ebookDownloadUrl: "/manual-do-empregador.pdf",
  price: "49",
  priceOriginal: "97",
  whatsappNumber: "5581985900139",
  whatsappMsg: "Olá! Tenho interesse no Manual do Empregador.",
  eventPrice: "67",
  eventCheckoutUrl: "",
};

// DB row → ContentData (snake_case to camelCase)
function dbRowToContent(row: Record<string, string>): Partial<ContentData> {
  return {
    heroBadge:        row.hero_badge,
    heroHeadline:     row.hero_headline,
    heroSubheadline:  row.hero_subheadline,
    heroBody:         row.hero_body,
    heroCta:          row.hero_cta,
    ebookCoverUrl:    row.ebook_cover_url,
    checkoutUrl:      row.checkout_url,
    ebookDownloadUrl: row.ebook_download_url,
    price:            row.price_display,
    priceOriginal:    row.price_original,
    whatsappNumber:   row.whatsapp_number,
    whatsappMsg:      row.whatsapp_msg,
    eventPrice:       row.event_price_display,
    eventCheckoutUrl: row.event_checkout_url,
  };
}

// ContentData → DB fields (camelCase to snake_case)
function contentToDbFields(data: Partial<ContentData>): Record<string, string> {
  const map: Record<keyof ContentData, string> = {
    heroBadge:        "hero_badge",
    heroHeadline:     "hero_headline",
    heroSubheadline:  "hero_subheadline",
    heroBody:         "hero_body",
    heroCta:          "hero_cta",
    ebookCoverUrl:    "ebook_cover_url",
    checkoutUrl:      "checkout_url",
    ebookDownloadUrl: "ebook_download_url",
    price:            "price_display",
    priceOriginal:    "price_original",
    whatsappNumber:   "whatsapp_number",
    whatsappMsg:      "whatsapp_msg",
    eventPrice:       "event_price_display",
    eventCheckoutUrl: "event_checkout_url",
  };
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    const dbKey = map[k as keyof ContentData];
    if (dbKey && v !== undefined) result[dbKey] = v as string;
  }
  return result;
}

// Fetch content from API; falls back to localStorage / defaults.
export const fetchContent = async (): Promise<ContentData> => {
  try {
    const res = await fetch(`${API_URL}/api/content`);
    if (res.ok) {
      const row = await res.json() as Record<string, string>;
      const fromDb = { ...CONTENT_DEFAULTS, ...dbRowToContent(row) };
      // keep local cache in sync
      try { localStorage.setItem(CONTENT_KEY, JSON.stringify(fromDb)); } catch { /* ignore */ }
      return fromDb;
    }
  } catch { /* offline — fall through */ }
  return getContent();
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
  // 1. Persist locally
  try {
    const current = getContent();
    localStorage.setItem(CONTENT_KEY, JSON.stringify({ ...current, ...updates }));
  } catch { /* ignore */ }

  // 2. Sync to DB (fire-and-forget)
  if (API_URL && ADMIN_TOKEN) {
    const dbFields = contentToDbFields(updates);
    fetch(`${API_URL}/api/content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(dbFields),
    }).catch((err) => console.warn("[contentStore] API sync error:", err));
  }
};

export const resetContent = (): void => {
  try {
    localStorage.removeItem(CONTENT_KEY);
  } catch { /* ignore */ }
};
