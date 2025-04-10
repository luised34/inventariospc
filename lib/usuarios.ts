import { supabase } from "@/lib/supabase"
import type { Usuario } from "@/lib/database-types"

export async function getUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      personal:personal_id (
        id,
        nombres,
        apellidos,
        numero_id,
        email,
        telefono
      )
    `)
    .order("email")

  if (error) {
    console.error("Error al obtener usuarios:", error)
    throw error
  }

  return data || []
}

export async function getUsuarioByEmail(email: string) {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      personal:personal_id (
        id,
        nombres,
        apellidos,
        numero_id,
        email,
        telefono
      )
    `)
    .eq("email", email)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No se encontró el usuario
      return null
    }
    console.error("Error al obtener usuario por email:", error)
    throw error
  }

  return data
}

export async function createUsuario(
  email: string,
  password: string,
  personalId: number | null,
  role: "admin" | "user",
) {
  // Primero creamos el usuario en auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    console.error("Error al crear usuario en auth:", authError)
    throw authError
  }

  // Luego creamos el registro en la tabla usuarios
  const { data, error } = await supabase.from("usuarios").insert({
    id: authData.user.id,
    email,
    personal_id: personalId,
    role,
  })

  if (error) {
    console.error("Error al crear usuario en la tabla usuarios:", error)
    // Intentamos eliminar el usuario de auth para no dejar registros huérfanos
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw error
  }

  return authData.user
}

export async function updateUsuario(id: string, updates: Partial<Omit<Usuario, "id" | "created_at" | "updated_at">>) {
  const { data, error } = await supabase.from("usuarios").update(updates).eq("id", id)

  if (error) {
    console.error("Error al actualizar usuario:", error)
    throw error
  }

  return data
}

export async function deleteUsuario(id: string) {
  // Eliminamos el usuario de auth, lo que también eliminará el registro en usuarios por la restricción ON DELETE CASCADE
  const { error } = await supabase.auth.admin.deleteUser(id)

  if (error) {
    console.error("Error al eliminar usuario:", error)
    throw error
  }

  return true
}
