import { supabase } from "./supabase-client"
import type { TipoIdentificacion, Cargo, Personal } from "./database-types"

// Tipos de Identificación
export async function getTiposIdentificacion(): Promise<TipoIdentificacion[]> {
  const { data, error } = await supabase.from("tipos_identificacion").select("*").order("codigo")

  if (error) {
    console.error("Error fetching tipos de identificación:", error)
    throw error
  }

  return data || []
}

export async function getTipoIdentificacionById(id: number): Promise<TipoIdentificacion | null> {
  const { data, error } = await supabase.from("tipos_identificacion").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching tipo de identificación with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createTipoIdentificacion(
  tipoIdentificacion: Omit<TipoIdentificacion, "id" | "created_at" | "updated_at">,
): Promise<TipoIdentificacion> {
  const { data, error } = await supabase.from("tipos_identificacion").insert([tipoIdentificacion]).select().single()

  if (error) {
    console.error("Error creating tipo de identificación:", error)
    throw error
  }

  return data
}

export async function updateTipoIdentificacion(
  id: number,
  tipoIdentificacion: Partial<Omit<TipoIdentificacion, "id" | "created_at" | "updated_at">>,
): Promise<TipoIdentificacion> {
  const { data, error } = await supabase
    .from("tipos_identificacion")
    .update(tipoIdentificacion)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating tipo de identificación with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteTipoIdentificacion(id: number): Promise<void> {
  const { error } = await supabase.from("tipos_identificacion").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting tipo de identificación with id ${id}:`, error)
    throw error
  }
}

// Cargos
export async function getCargos(): Promise<Cargo[]> {
  const { data, error } = await supabase.from("cargos").select("*").order("nombre")

  if (error) {
    console.error("Error fetching cargos:", error)
    throw error
  }

  return data || []
}

export async function getCargoById(id: number): Promise<Cargo | null> {
  const { data, error } = await supabase.from("cargos").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching cargo with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createCargo(cargo: Omit<Cargo, "id" | "created_at" | "updated_at">): Promise<Cargo> {
  const { data, error } = await supabase.from("cargos").insert([cargo]).select().single()

  if (error) {
    console.error("Error creating cargo:", error)
    throw error
  }

  return data
}

export async function updateCargo(
  id: number,
  cargo: Partial<Omit<Cargo, "id" | "created_at" | "updated_at">>,
): Promise<Cargo> {
  const { data, error } = await supabase.from("cargos").update(cargo).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating cargo with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteCargo(id: number): Promise<void> {
  const { error } = await supabase.from("cargos").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cargo with id ${id}:`, error)
    throw error
  }
}

// Personal
export async function getPersonal(): Promise<Personal[]> {
  const { data, error } = await supabase.from("personal").select("*").order("apellidos")

  if (error) {
    console.error("Error fetching personal:", error)
    throw error
  }

  return data || []
}

export async function getPersonalById(id: number): Promise<Personal | null> {
  const { data, error } = await supabase.from("personal").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching personal with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createPersonal(personal: Omit<Personal, "id" | "created_at" | "updated_at">): Promise<Personal> {
  const { data, error } = await supabase.from("personal").insert([personal]).select().single()

  if (error) {
    console.error("Error creating personal:", error)
    throw error
  }

  return data
}

export async function updatePersonal(
  id: number,
  personal: Partial<Omit<Personal, "id" | "created_at" | "updated_at">>,
): Promise<Personal> {
  const { data, error } = await supabase.from("personal").update(personal).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating personal with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deletePersonal(id: number): Promise<void> {
  const { error } = await supabase.from("personal").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting personal with id ${id}:`, error)
    throw error
  }
}

// Exportamos todas las funciones para las demás entidades...
// (Para mantener el código conciso, no incluyo todas las funciones para todas las entidades)
