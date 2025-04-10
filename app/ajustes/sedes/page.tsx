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
import type { Sede } from "@/lib/database-types"

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSede, setCurrentSede] = useState<Partial<Sede>>({
    nombre: "",
    codigo: "",
    direccion: "",
    ciudad: "",
    telefono: "",
  })

  useEffect(() => {
    loadSedes()
  }, [])

  async function loadSedes() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("sedes").select("*").order("nombre")

      if (error) throw error

      setSedes(data || [])
    } catch (error) {
      console.error("Error loading sedes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las sedes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentSede((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSede = () => {
    setIsEditing(false)
    setCurrentSede({
      nombre: "",
      codigo: "",
      direccion: "",
      ciudad: "",
      telefono: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditSede = (sede: Sede) => {
    setIsEditing(true)
    setCurrentSede(sede)
    setIsDialogOpen(true)
  }

  const handleDeleteSede = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta sede?")) {
      try {
        const { error } = await supabase.from("sedes").delete().eq("id", id)

        if (error) throw error

        setSedes(sedes.filter((s) => s.id !== id))

        toast({
          title: "Sede eliminada",
          description: "La sede ha sido eliminada correctamente",
        })
      } catch (error) {
        console.error("Error deleting sede:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar la sede",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentSede.id) {
        const { id, created_at, updated_at, ...updateData } = currentSede

        const { data, error } = await supabase.from("sedes").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setSedes(sedes.map((s) => (s.id === id ? data : s)))

        toast({
          title: "Sede actualizada",
          description: "La sede ha sido actualizada correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentSede

        const { data, error } = await supabase.from("sedes").insert([createData]).select().single()

        if (error) throw error

        setSedes([...sedes, data])

        toast({
          title: "Sede creada",
          description: "La sede ha sido creada correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving sede:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la sede",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sedes</h1>
          <p className="text-muted-foreground">Gestione las sedes de la empresa</p>
        </div>
        <Button onClick={handleAddSede}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sede
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Sedes</CardTitle>
          <CardDescription>Sedes registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Cargando sedes...
                    </TableCell>
                  </TableRow>
                ) : sedes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay sedes registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  sedes.map((sede) => (
                    <TableRow key={sede.id}>
                      <TableCell className="font-medium">{sede.codigo}</TableCell>
                      <TableCell>{sede.nombre}</TableCell>
                      <TableCell>{sede.direccion}</TableCell>
                      <TableCell>{sede.ciudad}</TableCell>
                      <TableCell>{sede.telefono}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditSede(sede)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSede(sede.id)}>
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
              <DialogTitle>{isEditing ? "Editar Sede" : "Agregar Sede"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los datos de la sede seleccionada." : "Complete los datos de la nueva sede."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={currentSede.codigo || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={currentSede.nombre || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={currentSede.direccion || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" name="ciudad" value={currentSede.ciudad || ""} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={currentSede.telefono || ""}
                    onChange={handleInputChange}
                  />
                </div>
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
