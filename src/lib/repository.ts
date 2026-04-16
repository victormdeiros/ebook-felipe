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
  ebook_orders: number;
  event_orders: number;
  leads_last_30d: number;
  orders_last_30d: number;
  leads_by_day: { date: string; count: number }[];
  orders_by_day: { date: string; count: number; revenue: number }[];
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
}

export const getInscricoes = async (): Promise<Inscricao[]> => {
  if (!API_URL || !ADMIN_TOKEN) return [];
  try {
    const res = await fetch(`${API_URL}/api/admin/inscricoes?limit=500`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (!res.ok) return [];
    const { items } = await res.json() as { items: Inscricao[] };
    return items;
  } catch { return []; }
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
