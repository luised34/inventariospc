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
import { getCargos, createCargo, updateCargo, deleteCargo } from "@/lib/database-service"
import type { Cargo } from "@/lib/database-types"

export default function CargosPage() {
  const [positions, setPositions] = useState<Cargo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPosition, setCurrentPosition] = useState<Partial<Cargo>>({
    nombre: "",
    descripcion: "",
  })

  useEffect(() => {
    async function loadCargos() {
      try {
        const data = await getCargos()
        setPositions(data)
      } catch (error) {
        console.error("Error loading cargos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los cargos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCargos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentPosition((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPosition = () => {
    setIsEditing(false)
    setCurrentPosition({
      nombre: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditPosition = (position: Cargo) => {
    setIsEditing(true)
    setCurrentPosition(position)
    setIsDialogOpen(true)
  }

  const handleDeletePosition = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este cargo?")) {
      try {
        await deleteCargo(id)
        setPositions(positions.filter((p) => p.id !== id))
        toast({
          title: "Cargo eliminado",
          description: "El cargo ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting cargo:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el cargo",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentPosition.id) {
        const { id, created_at, updated_at, ...updateData } = currentPosition
        const updatedPosition = await updateCargo(id, updateData)
        setPositions(positions.map((p) => (p.id === id ? updatedPosition : p)))
        toast({
          title: "Cargo actualizado",
          description: "El cargo ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentPosition
        const newPosition = await createCargo(createData as Omit<Cargo, "id" | "created_at" | "updated_at">)
        setPositions([...positions, newPosition])
        toast({
          title: "Cargo creado",
          description: "El cargo ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving cargo:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cargo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Cargos</h1>
        <Button onClick={handleAddPosition}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cargo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cargos Registrados</CardTitle>
          <CardDescription>Lista de cargos disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Cargando cargos...
                  </TableCell>
                </TableRow>
              ) : positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No hay cargos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.nombre}</TableCell>
                    <TableCell>{position.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditPosition(position)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePosition(position.id)}>
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
              <DialogTitle>{isEditing ? "Editar Cargo" : "Agregar Nuevo Cargo"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los datos del cargo seleccionado." : "Complete los datos del nuevo cargo."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del Cargo</Label>
                <Input id="nombre" name="nombre" value={currentPosition.nombre} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={currentPosition.descripcion || ""}
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
