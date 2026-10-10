import { createClient, SupabaseClient } from "@supabase/supabase-js";
import project from "../../supabase/project.json";

const url = import.meta.env.VITE_SUPABASE_URL || project.url;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || project.publishableKey;

/**
 * Public Supabase client. Private credentials belong exclusively to the API.
 * Application data continues to use the authenticated backend API.
 */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
