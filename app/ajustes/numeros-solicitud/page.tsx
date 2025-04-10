"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo
const INITIAL_CONSECUTIVOS = [
  {
    id: 1,
    año: 2023,
    prefijo: "MTO",
    inicioConsecutivo: 1,
    finConsecutivo: 999,
    ultimoConsecutivo: 125,
    activo: true,
  },
  {
    id: 2,
    año: 2024,
    prefijo: "MTO",
    inicioConsecutivo: 1,
    finConsecutivo: 999,
    ultimoConsecutivo: 45,
    activo: true,
  },
]

interface Consecutivo {
  id: number
  año: number
  prefijo: string
  inicioConsecutivo: number
  finConsecutivo: number
  ultimoConsecutivo: number
  activo: boolean
}

export default function NumerosSolicitudPage() {
  const [consecutivos, setConsecutivos] = useState<Consecutivo[]>(INITIAL_CONSECUTIVOS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentConsecutivo, setCurrentConsecutivo] = useState<Omit<Consecutivo, "id">>({
    año: new Date().getFullYear(),
    prefijo: "MTO",
    inicioConsecutivo: 1,
    finConsecutivo: 999,
    ultimoConsecutivo: 0,
    activo: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setCurrentConsecutivo((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    } else {
      setCurrentConsecutivo((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddConsecutivo = () => {
    setCurrentConsecutivo({
      año: new Date().getFullYear(),
      prefijo: "MTO",
      inicioConsecutivo: 1,
      finConsecutivo: 999,
      ultimoConsecutivo: 0,
      activo: true,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar si ya existe un consecutivo para el año seleccionado
    const existingConsecutivo = consecutivos.find((c) => c.año === currentConsecutivo.año)

    if (existingConsecutivo) {
      toast({
        title: "Error",
        description: `Ya existe un consecutivo para el año ${currentConsecutivo.año}`,
        variant: "destructive",
      })
      return
    }

    // Verificar que el inicio sea menor que el fin
    if (currentConsecutivo.inicioConsecutivo >= currentConsecutivo.finConsecutivo) {
      toast({
        title: "Error",
        description: "El inicio del consecutivo debe ser menor que el fin",
        variant: "destructive",
      })
      return
    }

    // Verificar que el último consecutivo esté dentro del rango
    if (
      currentConsecutivo.ultimoConsecutivo < currentConsecutivo.inicioConsecutivo ||
      currentConsecutivo.ultimoConsecutivo > currentConsecutivo.finConsecutivo
    ) {
      toast({
        title: "Error",
        description: "El último consecutivo debe estar dentro del rango de inicio y fin",
        variant: "destructive",
      })
      return
    }

    const id = consecutivos.length > 0 ? Math.max(...consecutivos.map((c) => c.id)) + 1 : 1
    setConsecutivos([...consecutivos, { ...currentConsecutivo, id }])
    setIsDialogOpen(false)

    toast({
      title: "Consecutivo creado",
      description: `Se ha creado el consecutivo para el año ${currentConsecutivo.año}`,
    })
  }

  const handleUpdateConsecutivo = (id: number, newValue: number) => {
    const consecutivo = consecutivos.find((c) => c.id === id)

    if (!consecutivo) return

    // Verificar que el nuevo valor esté dentro del rango
    if (newValue < consecutivo.inicioConsecutivo || newValue > consecutivo.finConsecutivo) {
      toast({
        title: "Error",
        description: `El valor debe estar entre ${consecutivo.inicioConsecutivo} y ${consecutivo.finConsecutivo}`,
        variant: "destructive",
      })
      return
    }

    setConsecutivos(consecutivos.map((c) => (c.id === id ? { ...c, ultimoConsecutivo: newValue } : c)))

    toast({
      title: "Consecutivo actualizado",
      description: "Se ha actualizado el valor del consecutivo",
    })
  }

  const handleDeleteConsecutivo = (id: number) => {
    if (confirm("¿Está seguro de eliminar este consecutivo?")) {
      setConsecutivos(consecutivos.filter((c) => c.id !== id))

      toast({
        title: "Consecutivo eliminado",
        description: "Se ha eliminado el consecutivo seleccionado",
      })
    }
  }

  const toggleActivoConsecutivo = (id: number) => {
    setConsecutivos(consecutivos.map((c) => (c.id === id ? { ...c, activo: !c.activo } : c)))

    const consecutivo = consecutivos.find((c) => c.id === id)
    const nuevoEstado = !consecutivo?.activo

    toast({
      title: nuevoEstado ? "Consecutivo activado" : "Consecutivo desactivado",
      description: `Se ha ${nuevoEstado ? "activado" : "desactivado"} el consecutivo seleccionado`,
    })
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Números de Solicitud</h1>
        <Button onClick={handleAddConsecutivo}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Consecutivo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consecutivos de Solicitudes</CardTitle>
          <CardDescription>Administre los consecutivos para los números de solicitud de mantenimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Año</TableHead>
                  <TableHead>Prefijo</TableHead>
                  <TableHead>Rango</TableHead>
                  <TableHead>Último Consecutivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consecutivos.map((consecutivo) => (
                  <TableRow key={consecutivo.id}>
                    <TableCell className="font-medium">{consecutivo.año}</TableCell>
                    <TableCell>{consecutivo.prefijo}</TableCell>
                    <TableCell>
                      {consecutivo.inicioConsecutivo} - {consecutivo.finConsecutivo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={consecutivo.ultimoConsecutivo}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0
                            if (value >= 0) {
                              const updatedConsecutivos = consecutivos.map((c) =>
                                c.id === consecutivo.id ? { ...c, ultimoConsecutivo: value } : c,
                              )
                              setConsecutivos(updatedConsecutivos)
                            }
                          }}
                          className="w-24"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateConsecutivo(consecutivo.id, consecutivo.ultimoConsecutivo)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={consecutivo.activo ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleActivoConsecutivo(consecutivo.id)}
                      >
                        {consecutivo.activo ? "Activo" : "Inactivo"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteConsecutivo(consecutivo.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {consecutivos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay consecutivos registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para crear nuevo consecutivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nuevo Consecutivo</DialogTitle>
              <DialogDescription>
                Cree un nuevo consecutivo para los números de solicitud de mantenimiento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="año">Año</Label>
                  <Input
                    id="año"
                    name="año"
                    type="number"
                    value={currentConsecutivo.año}
                    onChange={handleInputChange}
                    min={2000}
                    max={2100}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prefijo">Prefijo</Label>
                  <Input
                    id="prefijo"
                    name="prefijo"
                    value={currentConsecutivo.prefijo}
                    onChange={handleInputChange}
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="inicioConsecutivo">Inicio Consecutivo</Label>
                  <Input
                    id="inicioConsecutivo"
                    name="inicioConsecutivo"
                    type="number"
                    value={currentConsecutivo.inicioConsecutivo}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finConsecutivo">Fin Consecutivo</Label>
                  <Input
                    id="finConsecutivo"
                    name="finConsecutivo"
                    type="number"
                    value={currentConsecutivo.finConsecutivo}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ultimoConsecutivo">Último Consecutivo Usado</Label>
                <Input
                  id="ultimoConsecutivo"
                  name="ultimoConsecutivo"
                  type="number"
                  value={currentConsecutivo.ultimoConsecutivo}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  El próximo consecutivo a usar será {currentConsecutivo.ultimoConsecutivo + 1}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Consecutivo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
