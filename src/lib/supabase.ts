import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();
export const cloudEnabled = !!(url || key);
// A partial configuration must fail closed rather than expose the local dashboard.
function makeClient() {
  if (!cloudEnabled) return null;
  if (!url || !key)
    throw new Error("Completa la URL y la clave pública de Supabase.");
  if (key.startsWith("sb_secret_"))
    throw new Error("La clave del navegador debe ser pública.");
  if (key.split(".").length === 3) {
    try {
      if (
        JSON.parse(
          atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        ).role === "service_role"
      )
        throw new Error("PRIVATE_KEY");
    } catch (error) {
      if (error instanceof Error && error.message === "PRIVATE_KEY")
        throw new Error("No uses service_role en el navegador.");
    }
  }
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
let client: ReturnType<typeof makeClient> = null;
let configurationError = "";
try {
  client = makeClient();
} catch (error) {
  configurationError =
    error instanceof Error ? error.message : "Configuración inválida.";
}
export const supabase = client;
export function requireSupabase() {
  if (!supabase)
    throw new Error(
      configurationError || "Supabase todavía no está configurado.",
    );
  return supabase;
}
