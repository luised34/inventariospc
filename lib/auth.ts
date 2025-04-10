import { supabase } from "@/lib/supabase"

// No podemos verificar directamente si un usuario existe sin intentar iniciar sesión
// Así que vamos a usar un enfoque diferente
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
