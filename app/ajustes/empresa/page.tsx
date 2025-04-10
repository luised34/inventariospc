"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EmpresaPage() {
  const [logo, setLogo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    siglas: "",
    nit: "",
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log({ ...formData, logo })
    alert("Información de empresa guardada")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Configuración de Empresa</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>Configure los datos básicos de su empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <Image src={logo || "/placeholder.svg"} alt="Logo de la empresa" fill className="object-contain" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label htmlFor="logo" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary">Cargar logo</span>
                  <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </Label>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre de la Empresa</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Acme Corporation"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siglas">Siglas</Label>
                  <Input
                    id="siglas"
                    name="siglas"
                    placeholder="Ej: ACME"
                    value={formData.siglas}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nit">Número de NIT</Label>
                  <Input
                    id="nit"
                    name="nit"
                    placeholder="Ej: 900.123.456-7"
                    value={formData.nit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Guardar Cambios</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
