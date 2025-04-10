"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { CentroCosto } from "@/lib/database-types"

export default function CentrosCostosPage() {
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentCentroCosto, setCurrentCentroCosto] = useState<Partial<CentroCosto>>({
    nombre: "",
    codigo: "",
    descripcion: "",
  })

  useEffect(() => {
    loadCentrosCosto()
  }, [])

  async function loadCentrosCosto() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("centros_costo").select("*").order("nombre")

      if (error) throw error

      setCentrosCosto(data || [])
    } catch (error) {
      console.error("Error loading centros de costo:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los centros de costo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentCentroCosto((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCentroCosto = () => {
    setIsEditing(false)
    setCurrentCentroCosto({
      nombre: "",
      codigo: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditCentroCosto = (centroCosto: CentroCosto) => {
    setIsEditing(true)
    setCurrentCentroCosto(centroCosto)
    setIsDialogOpen(true)
  }

  const handleDeleteCentroCosto = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este centro de costo?")) {
      try {
        const { error } = await supabase.from("centros_costo").delete().eq("id", id)

        if (error) throw error

        setCentrosCosto(centrosCosto.filter((c) => c.id !== id))

        toast({
          title: "Centro de costo eliminado",
          description: "El centro de costo ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting centro de costo:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el centro de costo",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentCentroCosto.id) {
        const { id, created_at, updated_at, ...updateData } = currentCentroCosto

        const { data, error } = await supabase.from("centros_costo").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setCentrosCosto(centrosCosto.map((c) => (c.id === id ? data : c)))

        toast({
          title: "Centro de costo actualizado",
          description: "El centro de costo ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentCentroCosto

        const { data, error } = await supabase.from("centros_costo").insert([createData]).select().single()

        if (error) throw error

        setCentrosCosto([...centrosCosto, data])

        toast({
          title: "Centro de costo creado",
          description: "El centro de costo ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving centro de costo:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el centro de costo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Centros de Costos</h1>
          <p className="text-muted-foreground">Gestione los centros de costos de la empresa</p>
        </div>
        <Button onClick={handleAddCentroCosto}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Centro de Costo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Centros de Costos</CardTitle>
          <CardDescription>Centros de costos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Cargando centros de costo...
                    </TableCell>
                  </TableRow>
                ) : centrosCosto.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No hay centros de costo registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  centrosCosto.map((centroCosto) => (
                    <TableRow key={centroCosto.id}>
                      <TableCell className="font-medium">{centroCosto.codigo}</TableCell>
                      <TableCell>{centroCosto.nombre}</TableCell>
                      <TableCell>{centroCosto.descripcion}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCentroCosto(centroCosto)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCentroCosto(centroCosto.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Centro de Costo" : "Agregar Centro de Costo"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique los datos del centro de costo seleccionado."
                  : "Complete los datos del nuevo centro de costo."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={currentCentroCosto.codigo || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={currentCentroCosto.nombre || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={currentCentroCosto.descripcion || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEditing ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
