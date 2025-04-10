import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database-types"

// Asegurarse de que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Crear un singleton para el cliente de Supabase
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    // Crear el cliente de Supabase
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    })
  }
  return supabaseInstance
}

// Para compatibilidad con código existente
export const supabase = getSupabase()
