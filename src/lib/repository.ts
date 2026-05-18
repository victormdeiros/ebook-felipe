/**
 * Repository — data access layer.
 * Calls the Express backend API; falls back to localStorage when API is unavailable.
 */
import { CONFIG } from "@/config";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const API_CONFIGURED = import.meta.env.VITE_API_URL !== undefined;
const ADMIN_SESSION_TOKEN_KEY = "fl_admin_session_token";
const ADMIN_SESSION_EMAIL_KEY = "fl_admin_session_email";

export const getAdminSessionToken = (): string => {
  try { return sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY) ?? ""; }
  catch { return ""; }
};

export const getAdminSessionEmail = (): string => {
  try { return sessionStorage.getItem(ADMIN_SESSION_EMAIL_KEY) ?? ""; }
  catch { return ""; }
};

export const setAdminSession = (token: string, email: string): void => {
  sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_SESSION_EMAIL_KEY, email);
};

export const clearAdminSession = (): void => {
  sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_EMAIL_KEY);
};

const hasAdminSession = () => API_CONFIGURED && !!getAdminSessionToken();

const adminHeaders = (json = false): HeadersInit => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${getAdminSessionToken()}`,
});

export const requestAdminLoginCode = async (email: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/admin/auth/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao enviar codigo de acesso");
  }
};

export const verifyAdminLoginCode = async (
  email: string,
  code: string,
): Promise<{ token: string; email: string; expiresAt: string }> => {
  const res = await fetch(`${API_URL}/api/admin/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json().catch(() => ({})) as {
    token?: string;
    email?: string;
    expiresAt?: string;
    error?: string;
  };
  if (!res.ok || !data.token || !data.email || !data.expiresAt) {
    throw new Error(data.error ?? "Codigo invalido");
  }
  setAdminSession(data.token, data.email);
  return { token: data.token, email: data.email, expiresAt: data.expiresAt };
};

export const logoutAdminSession = async (): Promise<void> => {
  const token = getAdminSessionToken();
  clearAdminSession();
  if (!API_CONFIGURED || !token) return;
  fetch(`${API_URL}/api/admin/auth/session`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
};

export interface AdminAllowedEmail {
  email: string;
  created_at: string;
}

export const getAdminAllowedEmails = async (): Promise<AdminAllowedEmail[]> => {
  if (!hasAdminSession()) return [];
  const res = await fetch(`${API_URL}/api/admin/allowed-emails`, {
    headers: adminHeaders(),
  });
  if (!res.ok) return [];
  const data = await res.json() as { items: AdminAllowedEmail[] };
  return data.items;
};

export const addAdminAllowedEmail = async (email: string): Promise<AdminAllowedEmail> => {
  const res = await fetch(`${API_URL}/api/admin/allowed-emails`, {
    method: "POST",
    headers: adminHeaders(true),
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({})) as AdminAllowedEmail & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Erro ao adicionar e-mail");
  return data;
};

export const deleteAdminAllowedEmail = async (email: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/admin/allowed-emails/${encodeURIComponent(email)}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? "Erro ao remover e-mail");
  }
};

export type ManualMaterialKind = "ebook" | "event" | "event_ebook";

export const sendManualMaterialEmail = async (data: {
  order_id?: string | null;
  email: string;
  name: string;
  kind: ManualMaterialKind;
  note?: string;
}): Promise<{ ok: true; email: string; kind: ManualMaterialKind }> => {
  const res = await fetch(`${API_URL}/api/admin/send-material-email`, {
    method: "POST",
    headers: adminHeaders(true),
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({})) as {
    ok?: boolean;
    email?: string;
    kind?: ManualMaterialKind;
    error?: string;
  };
  if (!res.ok || !body.ok) {
    throw new Error(body.error ?? "Erro ao enviar e-mail de confirmacao");
  }
  return { ok: true, email: body.email ?? data.email, kind: body.kind ?? data.kind };
};

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
  product: "ebook" | "event" | "event_ebook";
  status: "pending" | "approved" | "rejected" | "refunded" | "in_process";
  amount: number;
  payer_email: string | null;
  payer_name: string | null;
  payment_method: string | null;
  created_at: string;
  confirmation_email_status: "pending" | "sent" | "failed" | null;
  confirmation_email_sent_at: string | null;
  confirmation_email_error: string | null;
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
  site_access: {
    page_views: number;
    page_views_last_30d: number;
    unique_sessions: number;
    form_starts: number;
    purchases: number;
  };
  access_by_day: { date: string; count: number }[];
  event_breakdown: { name: string; count: number }[];
}

// Leads

export const saveLead = async (lead: Lead): Promise<void> => {
  try {
    const leads: Lead[] = JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
    leads.push(lead);
    localStorage.setItem(CONFIG.LEAD_STORAGE, JSON.stringify(leads));
  } catch { /* ignore */ }

  if (API_CONFIGURED) {
    fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lead.name, email: lead.email, whatsapp: lead.whatsapp }),
    }).catch((err) => console.warn("[repo] lead save error:", err));
  }
};

export const getLeads = async (tag?: string): Promise<Lead[]> => {
  if (hasAdminSession()) {
    try {
      const url = `${API_URL}/api/admin/leads?limit=500${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`;
      const res = await fetch(url, {
        headers: adminHeaders(),
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
  if (!hasAdminSession()) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/orders?limit=500`, {
      headers: adminHeaders(),
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
  if (!hasAdminSession()) return null;
  try {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: adminHeaders(),
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
  if (!API_CONFIGURED) throw new Error("VITE_API_URL não definida");
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Product[]>;
};

export const createProduct = async (
  data: Omit<Product, "active"> & { active?: boolean },
): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: adminHeaders(true),
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
    headers: adminHeaders(true),
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
    headers: adminHeaders(),
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
  payment_method: string | null;
  courtesy_by: string | null;
}

export const getInscricoes = async (): Promise<Inscricao[]> => {
  if (!hasAdminSession()) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/inscricoes?limit=500`, {
      headers: adminHeaders(),
    });
    if (!res.ok) return [];
    const { items } = await res.json() as { items: (Inscricao & { order_id?: string })[] };
    return items.map((i) => ({ ...i, attended: i.attended ?? false, order_id: i.order_id ?? null }));
  } catch { return []; }
};

export const markAttended = async (orderId: string, attended: boolean): Promise<void> => {
  if (!hasAdminSession()) return;
  await fetch(`${API_URL}/api/admin/inscricoes/${encodeURIComponent(orderId)}/attended`, {
    method: "PATCH",
    headers: adminHeaders(true),
    body: JSON.stringify({ attended }),
  });
};

export const createCortesiaInscricao = async (data: {
  name: string;
  email: string;
  whatsapp?: string;
  courtesy_by: string;
}): Promise<{ lead_id: string; order_id: string }> => {
  const res = await fetch(`${API_URL}/api/admin/inscricoes`, {
    method: "POST",
    headers: adminHeaders(true),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao criar inscrição");
  }
  return res.json() as Promise<{ lead_id: string; order_id: string }>;
};

// Ebook upload & URL

export const uploadEbookFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/admin/ebook-upload`, {
    method: "POST",
    headers: adminHeaders(),
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
  if (!hasAdminSession()) return "";
  try {
    const res = await fetch(`${API_URL}/api/admin/ebook-url`, {
      headers: adminHeaders(),
    });
    if (!res.ok) return "";
    const { url } = await res.json() as { url: string };
    return url;
  } catch { return ""; }
};


// Events tracking

type EventName = "page_view" | "form_start" | "purchase";

export const trackEvent = (name: EventName, payload?: Record<string, unknown>): void => {
  if (!API_CONFIGURED) return;
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
  if (!hasAdminSession()) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/email-templates`, {
      headers: adminHeaders(),
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
    headers: adminHeaders(true),
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
  if (!hasAdminSession()) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/email-queue?limit=${limit}`, {
      headers: adminHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json() as { items: EmailQueueItem[] };
    return data.items;
  } catch { return []; }
};

export const processEmailQueue = async (): Promise<void> => {
  await fetch(`${API_URL}/api/admin/email-queue/process`, {
    method: "POST",
    headers: adminHeaders(),
  });
};

export const testSendCartEmails = async (email: string, name: string): Promise<{ sent: number; failed: number }> => {
  const res = await fetch(`${API_URL}/api/admin/email-queue/test-send`, {
    method: "POST",
    headers: adminHeaders(true),
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
  if (!hasAdminSession()) return { ctaAcessoProductId: "ebook", ctaVagaProductId: "event" };
  try {
    const res = await fetch(`${API_URL}/api/admin/cta-config`, {
      headers: adminHeaders(),
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
    headers: adminHeaders(true),
    body: JSON.stringify({
      cta_acesso_product_id: config.ctaAcessoProductId,
      cta_vaga_product_id: config.ctaVagaProductId,
    }),
  });
  if (!res.ok) throw new Error("Erro ao salvar configuração de CTAs");
};

// GTM Events Catalog

export interface GtmEvent {
  id: string;
  event: string;
  description: string;
  payload: Record<string, unknown>;
  enabled: boolean;
  created_at: string;
}

export const getGtmEvents = async (): Promise<GtmEvent[]> => {
  if (!hasAdminSession()) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/gtm-events`, {
      headers: adminHeaders(),
    });
    if (!res.ok) return [];
    const { events } = await res.json() as { events: GtmEvent[] };
    return events;
  } catch { return []; }
};

export const saveGtmEvents = async (events: GtmEvent[]): Promise<void> => {
  if (!hasAdminSession()) return;
  const res = await fetch(`${API_URL}/api/admin/gtm-events`, {
    method: "PUT",
    headers: adminHeaders(true),
    body: JSON.stringify({ events }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Erro ao salvar eventos GTM");
  }
};
