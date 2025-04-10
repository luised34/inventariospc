import { supabase } from "../supabase"
import type { Cargo } from "@/types/database"

export async function getCargos() {
  const { data, error } = await supabase.from("cargos").select("*").order("nombre")

  if (error) {
    console.error("Error fetching cargos:", error)
    throw error
  }

  return data as Cargo[]
}

export async function getCargo(id: number) {
  const { data, error } = await supabase.from("cargos").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching cargo with id ${id}:`, error)
    throw error
  }

  return data as Cargo
}

export async function createCargo(cargo: Omit<Cargo, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("cargos").insert([cargo]).select()

  if (error) {
    console.error("Error creating cargo:", error)
    throw error
  }

  return data[0] as Cargo
}

export async function updateCargo(id: number, cargo: Partial<Omit<Cargo, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase
    .from("cargos")
    .update({ ...cargo, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating cargo with id ${id}:`, error)
    throw error
  }

  return data[0] as Cargo
}

export async function deleteCargo(id: number) {
  const { error } = await supabase.from("cargos").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cargo with id ${id}:`, error)
    throw error
  }

  return true
}
