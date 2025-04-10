import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/forgot-password"]

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!session && !publicRoutes.includes(request.nextUrl.pathname)) {
    console.log("Usuario no autenticado, redirigiendo a login")
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si el usuario está autenticado y está en una página pública, redirigir a dashboard
  if (session && publicRoutes.includes(request.nextUrl.pathname)) {
    console.log("Usuario autenticado, redirigiendo a dashboard")
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
