"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Intentando iniciar sesión con:", formData.email)

      // Intentamos iniciar sesión directamente con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error("Error de autenticación:", error)

        // Mostramos un mensaje de error específico
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Credenciales incorrectas. El usuario no existe o la contraseña es incorrecta.")
        } else {
          setErrorMessage(error.message || "Error al iniciar sesión")
        }

        setShowErrorDialog(true)
        setIsLoading(false)
        return
      }

      console.log("Inicio de sesión exitoso:", data)

      // Si llegamos aquí, la autenticación fue exitosa
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema",
      })

      // Redirigimos al dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Error inesperado:", error)

      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      })

      setIsLoading(false)
    }
  }

  const createTestUser = async () => {
    setIsCreatingTestUser(true)
    try {
      // Crear un usuario de prueba
      const testEmail = "admin@example.com"
      const testPassword = "password123"

      // Primero verificamos si el usuario ya existe
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (!checkError) {
        // El usuario ya existe
        toast({
          title: "Usuario de prueba ya existe",
          description: `Email: ${testEmail}, Contraseña: ${testPassword}`,
        })
        setFormData({
          email: testEmail,
          password: testPassword,
        })
        setIsCreatingTestUser(false)
        return
      }

      // Crear el usuario
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        throw error
      }

      // Actualizar el rol del usuario a admin (esto requiere una función RPC o un trigger en Supabase)
      // Esta parte depende de tu configuración específica

      toast({
        title: "Usuario de prueba creado",
        description: `Email: ${testEmail}, Contraseña: ${testPassword}`,
      })

      // Llenar automáticamente el formulario con las credenciales del usuario de prueba
      setFormData({
        email: testEmail,
        password: testPassword,
      })
    } catch (error: any) {
      console.error("Error al crear usuario de prueba:", error)
      toast({
        title: "Error al crear usuario de prueba",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTestUser(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="text-gray-500">Ingrese sus credenciales para acceder al sistema</p>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Información importante</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Para usar el sistema, necesita tener un usuario registrado en Supabase Auth.
            <Button
              variant="link"
              className="p-0 h-auto text-yellow-700 font-semibold hover:text-yellow-900"
              onClick={createTestUser}
              disabled={isCreatingTestUser}
            >
              {isCreatingTestUser ? "Creando usuario..." : "Crear usuario de prueba"}
            </Button>
          </AlertDescription>
        </Alert>

        <div className="mt-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
          <div className="text-center text-sm">
            ¿No tiene una cuenta?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Contacte al administrador
            </Link>
          </div>
        </div>
      </div>

      {/* Diálogo de error para usuario no registrado */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error de inicio de sesión</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
