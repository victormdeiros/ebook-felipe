/**
 * Repository — data access layer.
 * Calls the Express backend API; falls back to localStorage when API is unavailable.
 */
import { CONFIG } from "@/config";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "";

export interface Lead {
  id?: string;
  name: string;
  email: string;
  whatsapp: string;
  tags?: string[];
  data: string; // ISO timestamp
}

export interface Order {
  id: string;
  mp_payment_id: string | null;
  product: "ebook" | "event";
  status: "pending" | "approved" | "rejected" | "refunded" | "in_process";
  amount: number;
  payer_email: string | null;
  payer_name: string | null;
  payment_method: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_leads: number;
  total_orders: number;
  total_revenue: number;
  revenue_last_30d: number;
  ebook_orders: number;
  event_orders: number;
  leads_last_30d: number;
  orders_last_30d: number;
  leads_by_day: { date: string; count: number }[];
  orders_by_day: { date: string; count: number; revenue: number }[];
  payment_methods: { method: string; count: number; revenue: number }[];
  product_breakdown: { product: string; count: number; revenue: number }[];
  leads_by_tag: { tag: string; count: number }[];
  email_stats: Record<string, number>;
}

// Leads

export const saveLead = async (lead: Lead): Promise<void> => {
  try {
    const leads: Lead[] = JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
    leads.push(lead);
    localStorage.setItem(CONFIG.LEAD_STORAGE, JSON.stringify(leads));
  } catch { /* ignore */ }

  if (API_URL) {
    fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, email: lead.email, whatsapp: lead.whatsapp }),
    }).catch((err) => console.warn("[repo] lead save error:", err));
  }
};

export const getLeads = async (tag?: string): Promise<Lead[]> => {
  if (API_URL && ADMIN_TOKEN) {
    try {
      const url = `${API_URL}/api/admin/leads?limit=500${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.ok) {
        const { items } = await res.json() as { items: { id: string; name: string; email: string; whatsapp: string; tags: string[]; created_at: string }[] };
        return items.map((r) => ({ id: r.id, name: r.name, email: r.email, whatsapp: r.whatsapp, tags: r.tags, data: r.created_at }));
      }
    } catch (err) {
      console.warn("[repo] getLeads API error, using localStorage:", err);
    }
  }
  try {
    return JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
  } catch {
    return [];
  }
};

// Orders

export const getOrders = async (): Promise<Order[]> => {
  if (!API_URL || !ADMIN_TOKEN) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/orders?limit=500`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return [];
    const { items } = await res.json() as { items: Order[] };
    return items;
  } catch {
    return [];
  }
};

// Stats

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  if (!API_URL || !ADMIN_TOKEN) return null;
  try {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return null;
    return res.json() as Promise<DashboardStats>;
  } catch {
    return null;
  }
};

// Products

export interface Product {
  id: string;
  mp_item_id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  checkout_type: "ebook" | "event" | "event_ebook";
}

export const getProducts = async (): Promise<Product[]> => {
  if (!API_URL) throw new Error("VITE_API_URL não definida");
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Product[]>;
};

export const createProduct = async (
  data: Omit<Product, "active"> & { active?: boolean },
): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao criar produto");
  }
  return res.json() as Promise<Product>;
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>,
): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao atualizar produto");
  }
  return res.json() as Promise<Product>;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao deletar produto");
  }
};

// Inscricoes no evento

export interface Inscricao {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  tags: string[];
  created_at: string;
  order_status: string | null;
  amount: number | null;
  mp_payment_id: string | null;
  paid_at: string | null;
  attended: boolean;
  order_id: string | null;
}

export const getInscricoes = async (): Promise<Inscricao[]> => {
  if (!API_URL || !ADMIN_TOKEN) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/inscricoes?limit=500`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return [];
    const { items } = await res.json() as { items: (Inscricao & { order_id?: string })[] };
    return items.map((i) => ({ ...i, attended: i.attended ?? false, order_id: i.order_id ?? null }));
  } catch { return []; }
};

export const markAttended = async (orderId: string, attended: boolean): Promise<void> => {
  if (!API_URL || !ADMIN_TOKEN) return;
  await fetch(`${API_URL}/api/admin/inscricoes/${encodeURIComponent(orderId)}/attended`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({ attended }),
  });
};

// Ebook upload & URL

export const uploadEbookFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/admin/ebook-upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao fazer upload");
  }
  const { url } = await res.json() as { url: string };
  return url;
};

export const getEbookUrl = async (): Promise<string> => {
  if (!API_URL || !ADMIN_TOKEN) return "";
  try {
    const res = await fetch(`${API_URL}/api/admin/ebook-url`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return "";
    const { url } = await res.json() as { url: string };
    return url;
  } catch { return ""; }
};


// Events tracking

type EventName = "page_view" | "form_start" | "purchase";

export const trackEvent = (name: EventName, payload?: Record<string, unknown>): void => {
  if (!API_URL) return;
  fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, payload: payload ?? null }),
  }).catch(() => { /* fire-and-forget */ });
};

// Email templates

export interface EmailTemplate {
  id: string;
  name: string;
  trigger_desc: string;
  subject: string;
  active: boolean;
  updated_at: string;
  pending_count: number;
  sent_count: number;
  failed_count: number;
  cancelled_count: number;
}

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  if (!API_URL || !ADMIN_TOKEN) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/email-templates`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return [];
    return res.json() as Promise<EmailTemplate[]>;
  } catch { return []; }
};

export const updateEmailTemplate = async (
  id: string,
  data: { subject?: string; active?: boolean },
): Promise<EmailTemplate> => {
  const res = await fetch(`${API_URL}/api/admin/email-templates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao atualizar template");
  }
  return res.json() as Promise<EmailTemplate>;
};

export interface EmailQueueItem {
  id: string;
  email: string;
  lead_name: string;
  template_id: string;
  template_name: string;
  scheduled_at: string;
  sent_at: string | null;
  status: "pending" | "sent" | "failed" | "cancelled";
  error: string | null;
  created_at: string;
}

export const getEmailQueue = async (limit = 20): Promise<EmailQueueItem[]> => {
  if (!API_URL || !ADMIN_TOKEN) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/email-queue?limit=${limit}`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return [];
    const data = await res.json() as { items: EmailQueueItem[] };
    return data.items;
  } catch { return []; }
};

export const processEmailQueue = async (): Promise<void> => {
  await fetch(`${API_URL}/api/admin/email-queue/process`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  });
};

export const testSendCartEmails = async (email: string, name: string): Promise<{ sent: number; failed: number }> => {
  const res = await fetch(`${API_URL}/api/admin/email-queue/test-send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({ email, name }),
  });
  const data = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; sent?: number; failed?: number };
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Erro ao disparar e-mail de teste");
  }
  return { sent: data.sent ?? 0, failed: data.failed ?? 0 };
};

export interface CTAConfig {
  ctaAcessoProductId: string;
  ctaVagaProductId: string;
}

export const getCTAConfig = async (): Promise<CTAConfig> => {
  if (!API_URL || !ADMIN_TOKEN) return { ctaAcessoProductId: "ebook", ctaVagaProductId: "event" };
  try {
    const res = await fetch(`${API_URL}/api/admin/cta-config`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return { ctaAcessoProductId: "ebook", ctaVagaProductId: "event" };
    const data = await res.json() as { cta_acesso_product_id: string; cta_vaga_product_id: string };
    return {
      ctaAcessoProductId: data.cta_acesso_product_id || "ebook",
      ctaVagaProductId: data.cta_vaga_product_id || "event",
    };
  } catch { return { ctaAcessoProductId: "ebook", ctaVagaProductId: "event" }; }
};

export const saveCTAConfig = async (config: Partial<CTAConfig>): Promise<void> => {
  const res = await fetch(`${API_URL}/api/admin/cta-config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({
      cta_acesso_product_id: config.ctaAcessoProductId,
      cta_vaga_product_id: config.ctaVagaProductId,
    }),
  });
  if (!res.ok) throw new Error("Erro ao salvar configuração de CTAs");
};

