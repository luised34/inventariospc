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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { Distribuidor } from "@/lib/database-types"

export default function DistribuidoresPage() {
  const [distributors, setDistributors] = useState<Distribuidor[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDistributor, setCurrentDistributor] = useState<Partial<Distribuidor>>({
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
    contacto: "",
    observaciones: "",
  })

  useEffect(() => {
    async function loadDistribuidores() {
      try {
        const { data, error } = await supabase.from("distribuidores").select("*").order("nombre")

        if (error) throw error

        setDistributors(data || [])
      } catch (error) {
        console.error("Error loading distribuidores:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los distribuidores",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDistribuidores()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentDistributor((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDistributor = () => {
    setIsEditing(false)
    setCurrentDistributor({
      nombre: "",
      nit: "",
      direccion: "",
      telefono: "",
      email: "",
      contacto: "",
      observaciones: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditDistributor = (distributor: Distribuidor) => {
    setIsEditing(true)
    setCurrentDistributor(distributor)
    setIsDialogOpen(true)
  }

  const handleDeleteDistributor = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este distribuidor?")) {
      try {
        const { error } = await supabase.from("distribuidores").delete().eq("id", id)

        if (error) throw error

        setDistributors(distributors.filter((d) => d.id !== id))

        toast({
          title: "Distribuidor eliminado",
          description: "El distribuidor ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting distribuidor:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el distribuidor",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentDistributor.id) {
        const { id, created_at, updated_at, ...updateData } = currentDistributor

        const { data, error } = await supabase.from("distribuidores").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setDistributors(distributors.map((d) => (d.id === id ? data : d)))

        toast({
          title: "Distribuidor actualizado",
          description: "El distribuidor ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentDistributor

        const { data, error } = await supabase.from("distribuidores").insert([createData]).select().single()

        if (error) throw error

        setDistributors([...distributors, data])

        toast({
          title: "Distribuidor creado",
          description: "El distribuidor ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving distribuidor:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el distribuidor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Distribuidores</h1>
        <Button onClick={handleAddDistributor}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Distribuidor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuidores Registrados</CardTitle>
          <CardDescription>Lista de distribuidores de equipos disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Cargando distribuidores...
                  </TableCell>
                </TableRow>
              ) : distributors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay distribuidores registrados.
                  </TableCell>
                </TableRow>
              ) : (
                distributors.map((distributor) => (
                  <TableRow key={distributor.id}>
                    <TableCell className="font-medium">{distributor.nombre}</TableCell>
                    <TableCell>{distributor.nit}</TableCell>
                    <TableCell>{distributor.contacto}</TableCell>
                    <TableCell>{distributor.telefono}</TableCell>
                    <TableCell>{distributor.email}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditDistributor(distributor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDistributor(distributor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Distribuidor" : "Agregar Nuevo Distribuidor"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique los datos del distribuidor seleccionado."
                  : "Complete los datos del nuevo distribuidor."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={currentDistributor.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nit">NIT</Label>
                  <Input id="nit" name="nit" value={currentDistributor.nit} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={currentDistributor.direccion || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={currentDistributor.telefono || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={currentDistributor.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contacto">Persona de Contacto</Label>
                <Input
                  id="contacto"
                  name="contacto"
                  value={currentDistributor.contacto || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={currentDistributor.observaciones || ""}
                  onChange={handleInputChange}
                  rows={3}
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
