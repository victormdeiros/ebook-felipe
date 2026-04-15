/**
 * Repository — data access layer.
 * Calls the Express backend API; falls back to localStorage when API is unavailable.
 */
import { CONFIG } from "@/config";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "";

export interface Lead {
  name: string;
  email: string;
  whatsapp: string;
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

export const getLeads = async (): Promise<Lead[]> => {
  if (API_URL && ADMIN_TOKEN) {
    try {
      const res = await fetch(`${API_URL}/api/admin/leads?limit=500`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.ok) {
        const { items } = await res.json() as { items: { name: string; email: string; whatsapp: string; created_at: string }[] };
        return items.map((r) => ({ name: r.name, email: r.email, whatsapp: r.whatsapp, data: r.created_at }));
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
