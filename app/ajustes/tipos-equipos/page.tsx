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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { TipoEquipo } from "@/lib/database-types"

export default function TiposEquiposPage() {
  const [activeTab, setActiveTab] = useState("tipos")
  const [equipmentTypes, setEquipmentTypes] = useState<TipoEquipo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentEquipmentType, setCurrentEquipmentType] = useState<Partial<TipoEquipo>>({
    codigo: "",
    nombre: "",
    descripcion: "",
    vida_util: 0,
    unidad_tiempo: "años",
  })
  const [equipmentWithLifespan, setEquipmentWithLifespan] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      try {
        // Cargar tipos de equipo
        const { data: tiposEquipo, error: errorTipos } = await supabase.from("tipos_equipo").select("*").order("codigo")

        if (errorTipos) throw errorTipos
        setEquipmentTypes(tiposEquipo || [])

        // Cargar equipos para la pestaña de vida útil
        const { data: equipos, error: errorEquipos } = await supabase.from("equipos").select(`
          id,
          numero_inventario,
          tipo_id,
          marca,
          modelo,
          fecha_compra,
          estado,
          vida_util,
          unidad_tiempo
        `)

        if (errorEquipos) throw errorEquipos

        // Calcular vida útil para cada equipo
        if (equipos) {
          const today = new Date()
          const equipmentWithCalculations = equipos.map((equipment) => {
            const equipmentType = tiposEquipo?.find((type) => type.id === equipment.tipo_id)

            if (!equipmentType || !equipment.fecha_compra) {
              return {
                ...equipment,
                vidaUtilTotal: equipment.vida_util || 0,
                unidadTiempo: equipment.unidad_tiempo || "años",
                vidaUtilRestante: 0,
                porcentajeVidaUtil: 0,
              }
            }

            const purchaseDate = new Date(equipment.fecha_compra)
            const vidaUtilTotal = equipment.vida_util || equipmentType.vida_util
            const unidadTiempo = equipment.unidad_tiempo || equipmentType.unidad_tiempo

            // Calcular la diferencia en años
            const diffTime = today.getTime() - purchaseDate.getTime()
            const diffYears = diffTime / (1000 * 3600 * 24 * 365.25)

            // Calcular vida útil restante y porcentaje
            let vidaUtilRestante = vidaUtilTotal - diffYears
            vidaUtilRestante = vidaUtilRestante < 0 ? 0 : vidaUtilRestante

            const porcentajeVidaUtil = (vidaUtilRestante / vidaUtilTotal) * 100

            return {
              ...equipment,
              vidaUtilTotal,
              unidadTiempo,
              vidaUtilRestante: Number.parseFloat(vidaUtilRestante.toFixed(2)),
              porcentajeVidaUtil: Number.parseFloat(porcentajeVidaUtil.toFixed(2)),
            }
          })

          setEquipmentWithLifespan(equipmentWithCalculations)
        }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentEquipmentType((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentEquipmentType((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentEquipmentType((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEquipmentType = () => {
    setIsEditing(false)
    setCurrentEquipmentType({
      codigo: "",
      nombre: "",
      descripcion: "",
      vida_util: 0,
      unidad_tiempo: "años",
    })
    setIsDialogOpen(true)
  }

  const handleEditEquipmentType = (equipmentType: TipoEquipo) => {
    setIsEditing(true)
    setCurrentEquipmentType(equipmentType)
    setIsDialogOpen(true)
  }

  const handleDeleteEquipmentType = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este tipo de equipo?")) {
      try {
        const { error } = await supabase.from("tipos_equipo").delete().eq("id", id)

        if (error) throw error

        setEquipmentTypes(equipmentTypes.filter((t) => t.id !== id))

        toast({
          title: "Tipo de equipo eliminado",
          description: "El tipo de equipo ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting equipment type:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el tipo de equipo",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentEquipmentType.id) {
        const { id, created_at, updated_at, ...updateData } = currentEquipmentType

        const { data, error } = await supabase.from("tipos_equipo").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setEquipmentTypes(equipmentTypes.map((t) => (t.id === id ? data : t)))

        toast({
          title: "Tipo de equipo actualizado",
          description: "El tipo de equipo ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentEquipmentType

        const { data, error } = await supabase.from("tipos_equipo").insert([createData]).select().single()

        if (error) throw error

        setEquipmentTypes([...equipmentTypes, data])

        toast({
          title: "Tipo de equipo creado",
          description: "El tipo de equipo ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving equipment type:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el tipo de equipo",
        variant: "destructive",
      })
    }
  }

  // Filtrar equipos por tipo seleccionado
  const filteredEquipment =
    selectedType === "all"
      ? equipmentWithLifespan
      : equipmentWithLifespan.filter((equipment) => equipment.tipo_id === Number.parseInt(selectedType))

  // Obtener el estado de vida útil
  const getLifespanStatus = (percentage: number) => {
    if (percentage <= 0) return { label: "Obsoleto", color: "bg-red-100 text-red-800" }
    if (percentage < 25) return { label: "Crítico", color: "bg-red-100 text-red-800" }
    if (percentage < 50) return { label: "Advertencia", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Óptimo", color: "bg-green-100 text-green-800" }
  }

  // Obtener el color de la barra de progreso
  const getProgressColor = (percentage: number) => {
    if (percentage <= 0) return "bg-red-500"
    if (percentage < 25) return "bg-red-500"
    if (percentage < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tipos de Equipos</h1>
        <Button onClick={handleAddEquipmentType}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Tipo de Equipo
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tipos">Tipos de Equipos</TabsTrigger>
          <TabsTrigger value="vidaUtil">Vida Útil de Equipos</TabsTrigger>
        </TabsList>

        <TabsContent value="tipos">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Equipos Registrados</CardTitle>
              <CardDescription>Lista de tipos de equipos disponibles en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Vida Útil</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Cargando tipos de equipos...
                      </TableCell>
                    </TableRow>
                  ) : equipmentTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No hay tipos de equipos registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    equipmentTypes.map((equipmentType) => (
                      <TableRow key={equipmentType.id}>
                        <TableCell className="font-medium">{equipmentType.codigo}</TableCell>
                        <TableCell>{equipmentType.nombre}</TableCell>
                        <TableCell>{equipmentType.descripcion}</TableCell>
                        <TableCell>
                          {equipmentType.vida_util} {equipmentType.unidad_tiempo}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditEquipmentType(equipmentType)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEquipmentType(equipmentType.id)}
                            >
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
        </TabsContent>

        <TabsContent value="vidaUtil">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Vida Útil de Equipos</CardTitle>
              <CardDescription>Análisis de vida útil restante para los equipos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setSelectedType("all")}>
                    Todos
                  </TabsTrigger>
                  {equipmentTypes.map((type) => (
                    <TabsTrigger
                      key={type.id}
                      value={type.id.toString()}
                      onClick={() => setSelectedType(type.id.toString())}
                    >
                      {type.nombre}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Inventario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Fecha Compra</TableHead>
                    <TableHead>Vida Útil Total</TableHead>
                    <TableHead>Vida Útil Restante</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Cargando datos de equipos...
                      </TableCell>
                    </TableRow>
                  ) : filteredEquipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron equipos para el tipo seleccionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipment.map((equipment) => {
                      const status = getLifespanStatus(equipment.porcentajeVidaUtil)
                      const progressColor = getProgressColor(equipment.porcentajeVidaUtil)
                      const tipoEquipo = equipmentTypes.find((t) => t.id === equipment.tipo_id)

                      return (
                        <TableRow key={equipment.id}>
                          <TableCell className="font-medium">{equipment.numero_inventario}</TableCell>
                          <TableCell>{tipoEquipo?.nombre || "Desconocido"}</TableCell>
                          <TableCell>
                            {equipment.marca} {equipment.modelo}
                          </TableCell>
                          <TableCell>{equipment.fecha_compra}</TableCell>
                          <TableCell>
                            {equipment.vidaUtilTotal} {equipment.unidadTiempo}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>
                                  {equipment.vidaUtilRestante.toFixed(2)} {equipment.unidadTiempo}
                                </span>
                                <span>{equipment.porcentajeVidaUtil.toFixed(0)}%</span>
                              </div>
                              <Progress
                                value={equipment.porcentajeVidaUtil}
                                className={`h-2 [&>div]:${progressColor}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Tipo de Equipo" : "Agregar Nuevo Tipo de Equipo"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique los datos del tipo de equipo seleccionado."
                  : "Complete los datos del nuevo tipo de equipo."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    value={currentEquipmentType.codigo}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={currentEquipmentType.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={currentEquipmentType.descripcion || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vida_util">Vida Útil</Label>
                  <Input
                    id="vida_util"
                    name="vida_util"
                    type="number"
                    min="0"
                    value={currentEquipmentType.vida_util}
                    onChange={handleNumberInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unidad_tiempo">Unidad de Tiempo</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("unidad_tiempo", value)}
                    value={currentEquipmentType.unidad_tiempo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="años">Años</SelectItem>
                      <SelectItem value="meses">Meses</SelectItem>
                      <SelectItem value="días">Días</SelectItem>
                    </SelectContent>
                  </Select>
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
