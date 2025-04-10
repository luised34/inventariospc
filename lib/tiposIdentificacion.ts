import { supabase } from "../supabase"
import type { TipoIdentificacion } from "@/types/database"

export async function getTiposIdentificacion() {
  const { data, error } = await supabase.from("tipos_identificacion").select("*").order("nombre")

  if (error) {
    console.error("Error fetching tipos_identificacion:", error)
    throw error
  }

  return data as TipoIdentificacion[]
}

export async function getTipoIdentificacion(id: number) {
  const { data, error } = await supabase.from("tipos_identificacion").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching tipo_identificacion with id ${id}:`, error)
    throw error
  }

  return data as TipoIdentificacion
}

export async function createTipoIdentificacion(
  tipoIdentificacion: Omit<TipoIdentificacion, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase.from("tipos_identificacion").insert([tipoIdentificacion]).select()

  if (error) {
    console.error("Error creating tipo_identificacion:", error)
    throw error
  }

  return data[0] as TipoIdentificacion
}

export async function updateTipoIdentificacion(
  id: number,
  tipoIdentificacion: Partial<Omit<TipoIdentificacion, "id" | "created_at" | "updated_at">>,
) {
  const { data, error } = await supabase
    .from("tipos_identificacion")
    .update({ ...tipoIdentificacion, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating tipo_identificacion with id ${id}:`, error)
    throw error
  }

  return data[0] as TipoIdentificacion
}

export async function deleteTipoIdentificacion(id: number) {
  const { error } = await supabase.from("tipos_identificacion").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting tipo_identificacion with id ${id}:`, error)
    throw error
  }

  return true
}
