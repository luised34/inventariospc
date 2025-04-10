"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PlusCircle, Trash2, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import type { Personal } from "@/lib/database-types"
import { getPersonal } from "@/lib/services/personal"
import { createUsuario, deleteUsuario, getUsuarios, updateUsuario } from "@/lib/services/usuarios"

interface Usuario {
  id: string
  email: string
  personal_id: number | null
  role: "admin" | "user"
  personal?: Personal | null
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [personal, setPersonal] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    personal_id: "",
    role: "user" as "admin" | "user",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [usuariosData, personalData] = await Promise.all([getUsuarios(), getPersonal()])
        setUsuarios(usuariosData)
        setPersonal(personalData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intente de nuevo.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      personal_id: "",
      role: "user",
    })
    setSelectedUsuario(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (selectedUsuario) {
        // Actualizar usuario existente
        await updateUsuario(selectedUsuario.id, {
          personal_id: formData.personal_id ? Number.parseInt(formData.personal_id) : null,
          role: formData.role,
        })

        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado correctamente.",
        })
      } else {
        // Crear nuevo usuario
        await createUsuario(
          formData.email,
          formData.password,
          formData.personal_id ? Number.parseInt(formData.personal_id) : null,
          formData.role,
        )

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado correctamente.",
        })
      }

      // Recargar la lista de usuarios
      const usuariosData = await getUsuarios()
      setUsuarios(usuariosData)
      setOpenDialog(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setFormData({
      email: usuario.email,
      password: "", // No mostramos la contraseña actual
      personal_id: usuario.personal_id?.toString() || "",
      role: usuario.role,
    })
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    if (!selectedUsuario) return

    setLoading(true)
    try {
      await deleteUsuario(selectedUsuario.id)

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })

      // Recargar la lista de usuarios
      const usuariosData = await getUsuarios()
      setUsuarios(usuariosData)
      setOpenDeleteDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el usuario.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUsuario ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
              <DialogDescription>
                {selectedUsuario
                  ? "Actualice los datos del usuario seleccionado."
                  : "Complete el formulario para crear un nuevo usuario."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                    readOnly={!!selectedUsuario}
                  />
                </div>
                {!selectedUsuario && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="col-span-3"
                      required={!selectedUsuario}
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="personal_id" className="text-right">
                    Personal
                  </Label>
                  <Select
                    value={formData.personal_id}
                    onValueChange={(value) => handleSelectChange("personal_id", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione una persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ninguno</SelectItem>
                      {personal.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nombres} {p.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rol
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value as "admin" | "user")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Personal</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  {loading ? "Cargando usuarios..." : "No hay usuarios registrados"}
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    {usuario.personal ? `${usuario.personal.nombres} ${usuario.personal.apellidos}` : "No asignado"}
                  </TableCell>
                  <TableCell>{usuario.role === "admin" ? "Administrador" : "Usuario"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(usuario)} title="Editar usuario">
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUsuario(usuario)
                        setOpenDeleteDialog(true)
                      }}
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
