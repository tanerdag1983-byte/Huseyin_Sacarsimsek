import { createClient } from "@supabase/supabase-js";

// Retrieve the Supabase credentials from standard Vite environment variables,
// with safe fallbacks to the provided project details to ensure immediate functionality.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://jghvkukrptpstsofuiqp.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaHZrdWtycHRwc3Rzb2Z1aXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDg0NzUsImV4cCI6MjA5NjUyNDQ3NX0.5mkXeU8cIl8rL0H82eRYXzMDB6cGShYPcc3KWWbtcJ4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
