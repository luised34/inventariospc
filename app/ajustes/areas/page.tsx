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
import type { Area } from "@/lib/database-types"

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentArea, setCurrentArea] = useState<Partial<Area>>({
    nombre: "",
    codigo: "",
    descripcion: "",
  })

  useEffect(() => {
    loadAreas()
  }, [])

  async function loadAreas() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("areas").select("*").order("nombre")

      if (error) throw error

      setAreas(data || [])
    } catch (error) {
      console.error("Error loading areas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las áreas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentArea((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddArea = () => {
    setIsEditing(false)
    setCurrentArea({
      nombre: "",
      codigo: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditArea = (area: Area) => {
    setIsEditing(true)
    setCurrentArea(area)
    setIsDialogOpen(true)
  }

  const handleDeleteArea = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta área?")) {
      try {
        const { error } = await supabase.from("areas").delete().eq("id", id)

        if (error) throw error

        setAreas(areas.filter((a) => a.id !== id))

        toast({
          title: "Área eliminada",
          description: "El área ha sido eliminada correctamente",
        })
      } catch (error) {
        console.error("Error deleting area:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el área",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentArea.id) {
        const { id, created_at, updated_at, ...updateData } = currentArea

        const { data, error } = await supabase.from("areas").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setAreas(areas.map((a) => (a.id === id ? data : a)))

        toast({
          title: "Área actualizada",
          description: "El área ha sido actualizada correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentArea

        const { data, error } = await supabase.from("areas").insert([createData]).select().single()

        if (error) throw error

        setAreas([...areas, data])

        toast({
          title: "Área creada",
          description: "El área ha sido creada correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving area:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el área",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Áreas</h1>
          <p className="text-muted-foreground">Gestione las áreas de la empresa</p>
        </div>
        <Button onClick={handleAddArea}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Área
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Áreas</CardTitle>
          <CardDescription>Áreas registradas en el sistema</CardDescription>
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
                      Cargando áreas...
                    </TableCell>
                  </TableRow>
                ) : areas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No hay áreas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  areas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.codigo}</TableCell>
                      <TableCell>{area.nombre}</TableCell>
                      <TableCell>{area.descripcion}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditArea(area)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteArea(area.id)}>
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
              <DialogTitle>{isEditing ? "Editar Área" : "Agregar Área"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los datos del área seleccionada." : "Complete los datos de la nueva área."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={currentArea.codigo || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={currentArea.nombre || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={currentArea.descripcion || ""}
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
