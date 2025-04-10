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
import {
  getTiposIdentificacion,
  createTipoIdentificacion,
  updateTipoIdentificacion,
  deleteTipoIdentificacion,
} from "@/lib/database-service"
import type { TipoIdentificacion } from "@/lib/database-types"

export default function TiposIdentificacionesPage() {
  const [idTypes, setIdTypes] = useState<TipoIdentificacion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIdType, setCurrentIdType] = useState<Partial<TipoIdentificacion>>({
    codigo: "",
    nombre: "",
    descripcion: "",
  })

  useEffect(() => {
    async function loadTiposIdentificacion() {
      try {
        const data = await getTiposIdentificacion()
        setIdTypes(data)
      } catch (error) {
        console.error("Error loading tipos de identificación:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de identificación",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTiposIdentificacion()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentIdType((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddIdType = () => {
    setIsEditing(false)
    setCurrentIdType({
      codigo: "",
      nombre: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditIdType = (idType: TipoIdentificacion) => {
    setIsEditing(true)
    setCurrentIdType(idType)
    setIsDialogOpen(true)
  }

  const handleDeleteIdType = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este tipo de identificación?")) {
      try {
        await deleteTipoIdentificacion(id)
        setIdTypes(idTypes.filter((t) => t.id !== id))
        toast({
          title: "Tipo de identificación eliminado",
          description: "El tipo de identificación ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting tipo de identificación:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el tipo de identificación",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentIdType.id) {
        const { id, created_at, updated_at, ...updateData } = currentIdType
        const updatedIdType = await updateTipoIdentificacion(id, updateData)
        setIdTypes(idTypes.map((t) => (t.id === id ? updatedIdType : t)))
        toast({
          title: "Tipo de identificación actualizado",
          description: "El tipo de identificación ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentIdType
        const newIdType = await createTipoIdentificacion(
          createData as Omit<TipoIdentificacion, "id" | "created_at" | "updated_at">,
        )
        setIdTypes([...idTypes, newIdType])
        toast({
          title: "Tipo de identificación creado",
          description: "El tipo de identificación ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving tipo de identificación:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el tipo de identificación",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tipos de Identificaciones</h1>
        <Button onClick={handleAddIdType}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Tipo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Identificación Registrados</CardTitle>
          <CardDescription>Lista de tipos de documentos de identidad disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
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
                    Cargando tipos de identificación...
                  </TableCell>
                </TableRow>
              ) : idTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hay tipos de identificación registrados.
                  </TableCell>
                </TableRow>
              ) : (
                idTypes.map((idType) => (
                  <TableRow key={idType.id}>
                    <TableCell className="font-medium">{idType.codigo}</TableCell>
                    <TableCell>{idType.nombre}</TableCell>
                    <TableCell>{idType.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditIdType(idType)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteIdType(idType.id)}>
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
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Tipo de Identificación" : "Agregar Nuevo Tipo de Identificación"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique los datos del tipo de identificación seleccionado."
                  : "Complete los datos del nuevo tipo de identificación."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={currentIdType.codigo}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" value={currentIdType.nombre} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={currentIdType.descripcion || ""}
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
