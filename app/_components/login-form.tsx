'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircleIcon, Eye, EyeOff, Loader2 } from "lucide-react"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useSupabaseBrowser } from "@/lib/supabase/client"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const supabase = useSupabaseBrowser()
  const [isLoading, setIsLoading] = useState(false)
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

    // Primero verificamos si el usuario existe en la tabla auth.users
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (!authError) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema " + (data.user.email ?? "usuario"),
      })
      setIsLoading(false)

      router.push("/dashboard")
      return
    }

    console.log({ authError })

    if (authError?.code === "invalid_credentials") {
      setErrorMessage("El correo o contraseña son inválidos")
      setShowErrorDialog(true)
    }

    toast({
      title: "Error al iniciar sesión",
      description: "Intentalo más tarde",
      variant: "destructive",
    })
    setIsLoading(false)
  }


  const signInAnonymously = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signInAnonymously()

    if (!error && data.session) {
      router.push("/dashboard")
      return
    }

    toast({
      title: "Error al iniciar sesión",
      description: "Intentalo más tarde",
      variant: "destructive",
    })

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="text-gray-500">Ingrese sus credenciales para acceder al sistema</p>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-700">
          <AlertCircleIcon className="h-4 w-4 stroke-yellow-700" />
          <AlertTitle className="text-yellow-800">Información importante</AlertTitle>
          <AlertDescription>
            Para usar el sistema, necesita tener un usuario registrado en la base de datos. Si no cuentas con uno, puedes
            {" "}
            <Button
              variant="link"
              className="p-0 h-auto text-yellow-700 font-semibold hover:text-yellow-900"
              onClick={signInAnonymously}
            >
              Iniciar sesión de forma anónima.
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
