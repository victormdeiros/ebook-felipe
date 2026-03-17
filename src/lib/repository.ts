/**
 * Repository — data access layer.
 * Uses Supabase when configured; degrades to localStorage otherwise.
 */
import { supabase } from "./supabase";
import { CONFIG } from "@/config";

export interface Lead {
  name: string;
  email: string;
  whatsapp: string;
  data: string; // ISO timestamp
}

// ─── Leads ────────────────────────────────────────────────────

export const saveLead = async (lead: Lead): Promise<void> => {
  // Always persist locally as backup
  try {
    const leads: Lead[] = JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
    leads.push(lead);
    localStorage.setItem(CONFIG.LEAD_STORAGE, JSON.stringify(leads));
  } catch {
    // ignore storage errors
  }

  // Attempt Supabase insert (fire-and-forget; errors don't block the UX)
  if (supabase) {
    supabase
      .from("leads")
      .insert({
        name: lead.name,
        email: lead.email,
        whatsapp: lead.whatsapp,
        created_at: lead.data,
      })
      .then(({ error }) => {
        if (error) console.warn("[repo] supabase lead insert:", error.message);
      });
  }
};

export const getLeads = async (): Promise<Lead[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("name, email, whatsapp, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((r) => ({
        name: r.name,
        email: r.email,
        whatsapp: r.whatsapp,
        data: r.created_at,
      }));
    }
    console.warn("[repo] supabase getLeads fallback:", error?.message);
  }

  // Fallback: localStorage
  try {
    return JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
  } catch {
    return [];
  }
};

// ─── Events (page_view, form_start, purchase) ─────────────────

type EventName = "page_view" | "form_start" | "purchase";

export const trackEvent = (name: EventName, payload?: Record<string, unknown>): void => {
  if (!supabase) return;
  supabase
    .from("events")
    .insert({ name, payload: payload ?? null, occurred_at: new Date().toISOString() })
    .then(({ error }) => {
      if (error) console.warn("[repo] supabase event insert:", error.message);
    });
};
