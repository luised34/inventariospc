"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { Equipo, TipoEquipo, Personal, Distribuidor, CentroCosto, Area, Sede } from "@/lib/database-types"

export default function BaseDatosEquiposPage() {
  const [equipments, setEquipments] = useState<Equipo[]>([])
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [personal, setPersonal] = useState<Personal[]>([])
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([])
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const [currentEquipment, setCurrentEquipment] = useState<Partial<Equipo>>({
    numero_inventario: "",
    tipo_id: undefined,
    marca: "",
    modelo: "",
    serial: "",
    procesador: "",
    memoria_ram: "",
    capacidad_disco: "",
    estado: "Activo",
    responsable_id: undefined,
    centro_costo_id: undefined,
    area_id: undefined,
    ubicacion: "",
    sede_id: undefined,
    fecha_compra: "",
    valor_compra: 0,
    distribuidor_id: undefined,
    garantia: "",
    criticidad: "Media",
    vida_util: 0,
    unidad_tiempo: "años",
    frecuencia_mantenimiento: 6,
    unidad_mantenimiento: "meses",
    proximo_mantenimiento: "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Cargar todos los datos necesarios en paralelo
        const [
          { data: equiposData, error: equiposError },
          { data: tiposData, error: tiposError },
          { data: personalData, error: personalError },
          { data: distribuidoresData, error: distribuidoresError },
          { data: centrosData, error: centrosError },
          { data: areasData, error: areasError },
          { data: sedesData, error: sedesError },
        ] = await Promise.all([
          supabase.from("equipos").select("*").order("numero_inventario"),
          supabase.from("tipos_equipo").select("*").order("nombre"),
          supabase.from("personal").select("*").order("apellidos"),
          supabase.from("distribuidores").select("*").order("nombre"),
          supabase.from("centros_costo").select("*").order("nombre"),
          supabase.from("areas").select("*").order("nombre"),
          supabase.from("sedes").select("*").order("nombre"),
        ])

        if (equiposError) throw equiposError
        if (tiposError) throw tiposError
        if (personalError) throw personalError
        if (distribuidoresError) throw distribuidoresError
        if (centrosError) throw centrosError
        if (areasError) throw areasError
        if (sedesError) throw sedesError

        setEquipments(equiposData || [])
        setTiposEquipo(tiposData || [])
        setPersonal(personalData || [])
        setDistribuidores(distribuidoresData || [])
        setCentrosCosto(centrosData || [])
        setAreas(areasData || [])
        setSedes(sedesData || [])
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

  // Efecto para actualizar la vida útil cuando se selecciona un tipo de equipo
  useEffect(() => {
    if (currentEquipment.tipo_id) {
      const selectedType = tiposEquipo.find((type) => type.id === currentEquipment.tipo_id)
      if (selectedType) {
        setCurrentEquipment((prev) => ({
          ...prev,
          vida_util: selectedType.vida_util,
          unidad_tiempo: selectedType.unidad_tiempo,
        }))
      }
    }
  }, [currentEquipment.tipo_id, tiposEquipo])

  // Efecto para calcular la fecha del próximo mantenimiento
  useEffect(() => {
    if (
      currentEquipment.fecha_compra &&
      currentEquipment.frecuencia_mantenimiento &&
      currentEquipment.frecuencia_mantenimiento > 0
    ) {
      const fechaCompra = new Date(currentEquipment.fecha_compra)
      const proximoMantenimiento = new Date(fechaCompra)

      if (currentEquipment.unidad_mantenimiento === "meses") {
        proximoMantenimiento.setMonth(
          proximoMantenimiento.getMonth() + (currentEquipment.frecuencia_mantenimiento || 0),
        )
      } else if (currentEquipment.unidad_mantenimiento === "años") {
        proximoMantenimiento.setFullYear(
          proximoMantenimiento.getFullYear() + (currentEquipment.frecuencia_mantenimiento || 0),
        )
      }

      setCurrentEquipment((prev) => ({
        ...prev,
        proximo_mantenimiento: format(proximoMantenimiento, "yyyy-MM-dd"),
      }))
    }
  }, [currentEquipment.fecha_compra, currentEquipment.frecuencia_mantenimiento, currentEquipment.unidad_mantenimiento])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentEquipment((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentEquipment((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setCurrentEquipment((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCurrentEquipment((prev) => ({ ...prev, fecha_compra: format(date, "yyyy-MM-dd") }))
    }
  }

  const handleAddEquipment = () => {
    setIsEditing(false)
    setCurrentEquipment({
      numero_inventario: "",
      tipo_id: undefined,
      marca: "",
      modelo: "",
      serial: "",
      procesador: "",
      memoria_ram: "",
      capacidad_disco: "",
      estado: "Activo",
      responsable_id: undefined,
      centro_costo_id: undefined,
      area_id: undefined,
      ubicacion: "",
      sede_id: undefined,
      fecha_compra: "",
      valor_compra: 0,
      distribuidor_id: undefined,
      garantia: "",
      criticidad: "Media",
      vida_util: 0,
      unidad_tiempo: "años",
      frecuencia_mantenimiento: 6,
      unidad_mantenimiento: "meses",
      proximo_mantenimiento: "",
    })
    setSelectedDate(undefined)
    setIsDialogOpen(true)
  }

  const handleEditEquipment = (equipment: Equipo) => {
    setIsEditing(true)
    setCurrentEquipment(equipment)
    setSelectedDate(equipment.fecha_compra ? new Date(equipment.fecha_compra) : undefined)
    setIsDialogOpen(true)
  }

  const handleDeleteEquipment = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este equipo?")) {
      try {
        const { error } = await supabase.from("equipos").delete().eq("id", id)

        if (error) throw error

        setEquipments(equipments.filter((e) => e.id !== id))

        toast({
          title: "Equipo eliminado",
          description: "El equipo ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error deleting equipment:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el equipo",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentEquipment.id) {
        const { id, created_at, updated_at, ...updateData } = currentEquipment

        const { data, error } = await supabase.from("equipos").update(updateData).eq("id", id).select().single()

        if (error) throw error

        setEquipments(equipments.map((e) => (e.id === id ? data : e)))

        toast({
          title: "Equipo actualizado",
          description: "El equipo ha sido actualizado correctamente",
        })
      } else {
        const { id, created_at, updated_at, ...createData } = currentEquipment

        const { data, error } = await supabase.from("equipos").insert([createData]).select().single()

        if (error) throw error

        setEquipments([...equipments, data])

        toast({
          title: "Equipo creado",
          description: "El equipo ha sido creado correctamente",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving equipment:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el equipo",
        variant: "destructive",
      })
    }
  }

  const filteredEquipments = equipments.filter(
    (equipment) =>
      equipment.numero_inventario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serial?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPersonName = (id: number | undefined) => {
    if (!id) return "No asignado"
    const person = personal.find((p) => p.id === id)
    return person ? `${person.nombres} ${person.apellidos}` : "No asignado"
  }

  const getTipoEquipoName = (id: number | undefined) => {
    if (!id) return ""
    const tipo = tiposEquipo.find((t) => t.id === id)
    return tipo ? tipo.nombre : ""
  }

  const getDistributorName = (id: number | undefined) => {
    if (!id) return "No asignado"
    const distributor = distribuidores.find((d) => d.id === id)
    return distributor ? distributor.nombre : "No asignado"
  }

  // Obtener el año actual y restar 20 años para el fromYear
  const currentYear = new Date().getFullYear()
  const fromYear = currentYear - 20

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Base de Datos de Equipos</h1>
        <Button onClick={handleAddEquipment}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Equipo
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Equipos</CardTitle>
          <CardDescription>Busque por número de inventario, marca, modelo o serial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipo..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventario de Equipos</CardTitle>
          <CardDescription>Lista de equipos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Inventario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Cargando equipos...
                    </TableCell>
                  </TableRow>
                ) : filteredEquipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron equipos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium">{equipment.numero_inventario}</TableCell>
                      <TableCell>{getTipoEquipoName(equipment.tipo_id)}</TableCell>
                      <TableCell>{equipment.marca}</TableCell>
                      <TableCell>{equipment.modelo}</TableCell>
                      <TableCell>{equipment.serial}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            equipment.estado === "Activo"
                              ? "bg-green-100 text-green-800"
                              : equipment.estado === "En reparación"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {equipment.estado}
                        </span>
                      </TableCell>
                      <TableCell>{getPersonName(equipment.responsable_id)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditEquipment(equipment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEquipment(equipment.id)}>
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
        <DialogContent className="sm:max-w-[800px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Equipo" : "Agregar Nuevo Equipo"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los datos del equipo seleccionado." : "Complete los datos del nuevo equipo."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numero_inventario">Número de Inventario</Label>
                  <Input
                    id="numero_inventario"
                    name="numero_inventario"
                    value={currentEquipment.numero_inventario}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serial">Número de Serial</Label>
                  <Input id="serial" name="serial" value={currentEquipment.serial} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo_id">Tipo de Equipo</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("tipo_id", Number.parseInt(value))}
                    value={currentEquipment.tipo_id?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEquipo.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("estado", value)}
                    value={currentEquipment.estado || "Activo"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="En reparación">En reparación</SelectItem>
                      <SelectItem value="Dado de baja">Dado de baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input id="marca" name="marca" value={currentEquipment.marca} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input id="modelo" name="modelo" value={currentEquipment.modelo} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="centro_costo_id">Centro de Costos</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("centro_costo_id", Number.parseInt(value))}
                    value={currentEquipment.centro_costo_id?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {centrosCosto.map((centro) => (
                        <SelectItem key={centro.id} value={centro.id.toString()}>
                          {centro.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area_id">Área</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("area_id", Number.parseInt(value))}
                    value={currentEquipment.area_id?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    name="ubicacion"
                    value={currentEquipment.ubicacion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sede_id">Sede</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("sede_id", Number.parseInt(value))}
                    value={currentEquipment.sede_id?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id} value={sede.id.toString()}>
                          {sede.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="responsable_id">Persona a Cargo</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("responsable_id", Number.parseInt(value))}
                  value={currentEquipment.responsable_id?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {personal.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id.toString()}>
                        {persona.nombres} {persona.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha_compra">Fecha de Compra</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha...</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date > new Date()} // Solo deshabilita fechas futuras
                        captionLayout="dropdown-buttons"
                        fromYear={1990}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor_compra">Valor de Compra</Label>
                  <Input
                    id="valor_compra"
                    name="valor_compra"
                    type="number"
                    value={currentEquipment.valor_compra}
                    onChange={handleNumberInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="distribuidor_id">Distribuidor</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("distribuidor_id", Number.parseInt(value))}
                    value={currentEquipment.distribuidor_id?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {distribuidores.map((distribuidor) => (
                        <SelectItem key={distribuidor.id} value={distribuidor.id.toString()}>
                          {distribuidor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="garantia">Garantía</Label>
                  <Input
                    id="garantia"
                    name="garantia"
                    value={currentEquipment.garantia}
                    onChange={handleInputChange}
                    placeholder="Ej: 3 años"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="criticidad">Criticidad</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("criticidad", value)}
                    value={currentEquipment.criticidad || "Media"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Vida Útil (según tipo de equipo)</Label>
                  <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
                    {currentEquipment.vida_util} {currentEquipment.unidad_tiempo}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="procesador">Procesador</Label>
                  <Input
                    id="procesador"
                    name="procesador"
                    value={currentEquipment.procesador}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memoria_ram">Memoria RAM</Label>
                  <Input
                    id="memoria_ram"
                    name="memoria_ram"
                    value={currentEquipment.memoria_ram}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacidad_disco">Almacenamiento</Label>
                  <Input
                    id="capacidad_disco"
                    name="capacidad_disco"
                    value={currentEquipment.capacidad_disco}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Programación de Mantenimientos</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      id="frecuencia_mantenimiento"
                      name="frecuencia_mantenimiento"
                      type="number"
                      min="1"
                      value={currentEquipment.frecuencia_mantenimiento}
                      onChange={handleNumberInputChange}
                    />
                    <RadioGroup
                      value={currentEquipment.unidad_mantenimiento || "meses"}
                      onValueChange={(value) => handleSelectChange("unidad_mantenimiento", value)}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="meses" id="meses" />
                        <Label htmlFor="meses">Meses</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="años" id="años" />
                        <Label htmlFor="años">Años</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>Próximo Mantenimiento</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
                      {currentEquipment.proximo_mantenimiento
                        ? format(new Date(currentEquipment.proximo_mantenimiento), "PPP", { locale: es })
                        : "No programado"}
                    </div>
                  </div>
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
