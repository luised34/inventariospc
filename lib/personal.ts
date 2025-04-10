import { supabase } from "../supabase"
import type { Personal, PersonalWithRelations } from "@/types/database"

export async function getPersonal() {
  const { data, error } = await supabase
    .from("personal")
    .select("*, tipo_identificacion:tipos_identificacion(*), cargo:cargos(*)")
    .order("apellidos")

  if (error) {
    console.error("Error fetching personal:", error)
    throw error
  }

  return data as PersonalWithRelations[]
}

export async function getPersonaById(id: number) {
  const { data, error } = await supabase
    .from("personal")
    .select("*, tipo_identificacion:tipos_identificacion(*), cargo:cargos(*)")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching persona with id ${id}:`, error)
    throw error
  }

  return data as PersonalWithRelations
}

export async function createPersona(persona: Omit<Personal, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("personal").insert([persona]).select()

  if (error) {
    console.error("Error creating persona:", error)
    throw error
  }

  return data[0] as Personal
}

export async function updatePersona(id: number, persona: Partial<Omit<Personal, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase
    .from("personal")
    .update({ ...persona, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating persona with id ${id}:`, error)
    throw error
  }

  return data[0] as Personal
}

export async function deletePersona(id: number) {
  const { error } = await supabase.from("personal").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting persona with id ${id}:`, error)
    throw error
  }

  return true
}
