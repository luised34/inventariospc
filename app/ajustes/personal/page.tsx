"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { getPersonal, createPersonal, getTiposIdentificacion, getCargos } from "@/lib/database-service"
import type { Personal, TipoIdentificacion, Cargo } from "@/lib/database-types"

export default function PersonalPage() {
  const [people, setPeople] = useState<Personal[]>([])
  const [tiposId, setTiposId] = useState<TipoIdentificacion[]>([])
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newPerson, setNewPerson] = useState<Omit<Personal, "id" | "created_at" | "updated_at">>({
    nombres: "",
    apellidos: "",
    tipo_id_id: 0,
    numero_id: "",
    email: "",
    telefono: "",
    cargo_id: 0,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [personalData, tiposIdData, cargosData] = await Promise.all([
          getPersonal(),
          getTiposIdentificacion(),
          getCargos(),
        ])
        setPeople(personalData)
        setTiposId(tiposIdData)
        setCargos(cargosData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPerson((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewPerson((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const createdPerson = await createPersonal(newPerson)
      setPeople([...people, createdPerson])

      setNewPerson({
        nombres: "",
        apellidos: "",
        tipo_id_id: 0,
        numero_id: "",
        email: "",
        telefono: "",
        cargo_id: 0,
      })

      setIsDialogOpen(false)

      toast({
        title: "Persona agregada",
        description: "La persona ha sido agregada correctamente",
      })
    } catch (error) {
      console.error("Error creating person:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar la persona",
        variant: "destructive",
      })
    }
  }

  const getTipoIdNombre = (id: number) => {
    const tipo = tiposId.find((t) => t.id === id)
    return tipo ? tipo.codigo : ""
  }

  const getCargoNombre = (id: number | undefined) => {
    if (!id) return ""
    const cargo = cargos.find((c) => c.id === id)
    return cargo ? cargo.nombre : ""
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Personal</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Persona
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Persona</DialogTitle>
                <DialogDescription>Complete los datos de la persona que desea agregar al sistema.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input
                      id="nombres"
                      name="nombres"
                      value={newPerson.nombres}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                      id="apellidos"
                      name="apellidos"
                      value={newPerson.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo_id_id">Tipo de Identificación</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("tipo_id_id", value)}
                      value={newPerson.tipo_id_id ? newPerson.tipo_id_id.toString() : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposId.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.codigo} - {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero_id">Número de Identificación</Label>
                    <Input
                      id="numero_id"
                      name="numero_id"
                      value={newPerson.numero_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newPerson.email || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Número de Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={newPerson.telefono || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cargo_id">Cargo</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("cargo_id", value)}
                      value={newPerson.cargo_id ? newPerson.cargo_id.toString() : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo.id} value={cargo.id.toString()}>
                            {cargo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Registrado</CardTitle>
          <CardDescription>Lista de personas registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Cargando personal...
                  </TableCell>
                </TableRow>
              ) : people.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay personal registrado.
                  </TableCell>
                </TableRow>
              ) : (
                people.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.nombres}</TableCell>
                    <TableCell>{person.apellidos}</TableCell>
                    <TableCell>
                      {getTipoIdNombre(person.tipo_id_id)} {person.numero_id}
                    </TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{person.telefono}</TableCell>
                    <TableCell>{getCargoNombre(person.cargo_id)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
