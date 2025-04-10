"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Check, Clock, Edit, Plus, Search, AlertTriangle, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { MaintenancePDFViewer } from "@/components/maintenance-pdf"
import { toast } from "@/components/ui/use-toast"

// Sample data for demonstration
const EQUIPMENTS = [
  {
    id: 1,
    numeroInventario: "INV-001",
    tipo: "Laptop",
    marca: "Dell",
    modelo: "Latitude 5420",
    proximoMantenimiento: "2023-11-15",
    serial: "ABC123456",
    procesador: "Intel Core i5-1135G7",
    memoriaRam: "8GB DDR4",
    discoDuro: "256GB SSD",
    responsable: "Juan Pérez",
    cargo: "Gerente de Operaciones",
    ubicacion: "Oficina Principal",
    sistemaOperativo: "Windows 10 Pro",
    ofimatica: "Microsoft Office 365",
  },
  {
    id: 2,
    numeroInventario: "INV-002",
    tipo: "Desktop",
    marca: "HP",
    modelo: "ProDesk 600 G6",
    proximoMantenimiento: "2023-11-10",
    serial: "XYZ789012",
    procesador: "Intel Core i7-10700",
    memoriaRam: "16GB DDR4",
    discoDuro: "512GB SSD",
    responsable: "María Rodríguez",
    cargo: "Analista de Datos",
    ubicacion: "Sala de Servidores",
    sistemaOperativo: "Windows 11 Pro",
    ofimatica: "Microsoft Office 2019",
  },
  {
    id: 3,
    numeroInventario: "INV-003",
    tipo: "Monitor",
    marca: "LG",
    modelo: "24MK430H",
    serial: "MNO345678",
    proximoMantenimiento: "2023-12-22",
    responsable: "Carlos Gómez",
    cargo: "Diseñador Gráfico",
    ubicacion: "Departamento de Marketing",
  },
  {
    id: 4,
    numeroInventario: "INV-004",
    tipo: "Impresora",
    marca: "Epson",
    modelo: "L3150",
    serial: "PQR901234",
    proximoMantenimiento: "2024-01-05",
    responsable: "Ana Martínez",
    cargo: "Asistente Administrativa",
    ubicacion: "Recepción",
  },
  {
    id: 5,
    numeroInventario: "INV-005",
    tipo: "Laptop",
    marca: "Lenovo",
    modelo: "ThinkPad T14",
    serial: "STU567890",
    proximoMantenimiento: "2024-02-15",
    procesador: "AMD Ryzen 7 PRO 4750U",
    memoriaRam: "16GB DDR4",
    discoDuro: "1TB SSD",
    responsable: "Pedro Sánchez",
    cargo: "Gerente de Ventas",
    ubicacion: "Oficina de Ventas",
    sistemaOperativo: "Windows 10 Pro",
    ofimatica: "Microsoft Office 365",
  },
]

const TECNICOS = [
  { id: 1, nombre: "Carlos Técnico", cargo: "Técnico de Soporte" },
  { id: 2, nombre: "Pedro Soporte", cargo: "Técnico de Soporte" },
  { id: 3, nombre: "Ana Sistemas", cargo: "Técnico de Sistemas" },
  { id: 4, nombre: "Luis Mantenimiento", cargo: "Técnico de Mantenimiento" },
]

// Datos de ejemplo para los consecutivos
const CONSECUTIVOS = [
  {
    id: 1,
    año: 2023,
    prefijo: "MTO",
    inicioConsecutivo: 1,
    finConsecutivo: 999,
    ultimoConsecutivo: 125,
    activo: true,
  },
  {
    id: 2,
    año: 2024,
    prefijo: "MTO",
    inicioConsecutivo: 1,
    finConsecutivo: 999,
    ultimoConsecutivo: 45,
    activo: true,
  },
]

const INITIAL_MAINTENANCES = [
  {
    id: 1,
    equipoId: 1,
    numeroInventario: "INV-001",
    equipo: "Dell Latitude 5420",
    fecha: "2023-12-15",
    tecnicoId: 1,
    tecnico: "Carlos Técnico",
    tipo: "Preventivo",
    descripcion: "Limpieza general y actualización de software",
    estado: "Finalizado",
    observaciones: "Se realizó limpieza de ventiladores y actualización de Windows",
    numeroSolicitud: "125-2023",
    requiereRepuesto: false,
    requiereFormateo: false,
  },
  {
    id: 2,
    equipoId: 2,
    numeroInventario: "INV-002",
    equipo: "HP ProDesk 600 G6",
    fecha: "2024-01-20",
    tecnicoId: 2,
    tecnico: "Pedro Soporte",
    tipo: "Correctivo",
    descripcion: "Reemplazo de fuente de poder",
    estado: "Iniciado",
    observaciones: "Se detectó falla en la fuente de poder, se está reemplazando",
    numeroSolicitud: "001-2024",
    requiereRepuesto: true,
    requiereFormateo: false,
  },
  {
    id: 3,
    equipoId: 3,
    numeroInventario: "INV-003",
    equipo: "LG 24MK430H",
    fecha: "2024-02-05",
    tecnicoId: 3,
    tecnico: "Ana Sistemas",
    tipo: "Preventivo",
    descripcion: "Revisión de conexiones y limpieza",
    estado: "Programado",
    observaciones: "",
    numeroSolicitud: "002-2024",
    requiereRepuesto: false,
    requiereFormateo: false,
  },
]

interface Maintenance {
  id: number
  equipoId: number
  numeroInventario: string
  equipo: string
  fecha: string
  tecnicoId: number
  tecnico: string
  tipo: string
  descripcion: string
  estado: string
  observaciones: string
  numeroSolicitud: string
  requiereRepuesto: boolean
  requiereFormateo: boolean
}

export default function MantenimientosPage() {
  const [activeTab, setActiveTab] = useState("historial")
  const [maintenances, setMaintenances] = useState<Maintenance[]>(INITIAL_MAINTENANCES)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState("")
  const [filteredEquipments, setFilteredEquipments] = useState(EQUIPMENTS)
  const [currentMaintenance, setCurrentMaintenance] = useState<
    Omit<Maintenance, "id" | "equipo" | "tecnico" | "numeroSolicitud">
  >({
    equipoId: 0,
    numeroInventario: "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    tecnicoId: 0,
    tipo: "",
    descripcion: "",
    estado: "Programado", // Estado por defecto
    observaciones: "",
    requiereRepuesto: false,
    requiereFormateo: false,
  })
  const [maintenanceToFinish, setMaintenanceToFinish] = useState<Maintenance | null>(null)
  const [finishObservations, setFinishObservations] = useState("")
  const [requiereRepuesto, setRequiereRepuesto] = useState(false)
  const [requiereFormateo, setRequiereFormateo] = useState(false)
  const [proximosMantenimientos, setProximosMantenimientos] = useState<typeof EQUIPMENTS>([])
  const [selectedMaintenanceForPdf, setSelectedMaintenanceForPdf] = useState<Maintenance | null>(null)

  useEffect(() => {
    // Filtrar equipos con mantenimientos próximos (en los próximos 30 días)
    const today = new Date()
    const thirtyDaysFromNow = addDays(today, 30)

    const proximos = EQUIPMENTS.filter((equipment) => {
      const fechaMantenimiento = new Date(equipment.proximoMantenimiento)
      return isBefore(fechaMantenimiento, thirtyDaysFromNow) && isBefore(today, fechaMantenimiento)
    }).sort((a, b) => {
      return new Date(a.proximoMantenimiento).getTime() - new Date(b.proximoMantenimiento).getTime()
    })

    setProximosMantenimientos(proximos)
  }, [])

  useEffect(() => {
    const filtered = EQUIPMENTS.filter(
      (equipment) =>
        equipment.numeroInventario.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
        equipment.marca.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
        equipment.modelo.toLowerCase().includes(equipmentSearchTerm.toLowerCase()),
    )
    setFilteredEquipments(filtered)
  }, [equipmentSearchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentMaintenance((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setCurrentMaintenance((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCurrentMaintenance((prev) => ({ ...prev, fecha: format(date, "yyyy-MM-dd") }))
    }
  }

  const handleSelectEquipment = (equipment: (typeof EQUIPMENTS)[0]) => {
    setCurrentMaintenance((prev) => ({
      ...prev,
      equipoId: equipment.id,
      numeroInventario: equipment.numeroInventario,
    }))
    setEquipmentSearchTerm("")
  }

  const handleAddMaintenance = () => {
    setIsEditing(false)
    setCurrentMaintenance({
      equipoId: 0,
      numeroInventario: "",
      fecha: format(new Date(), "yyyy-MM-dd"),
      tecnicoId: 0,
      tipo: "",
      descripcion: "",
      estado: "Programado", // Estado por defecto siempre es "Programado"
      observaciones: "",
      requiereRepuesto: false,
      requiereFormateo: false,
    })
    setSelectedDate(undefined)
    setIsDialogOpen(true)
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setIsEditing(true)
    setCurrentMaintenance({
      equipoId: maintenance.equipoId,
      numeroInventario: maintenance.numeroInventario,
      fecha: maintenance.fecha,
      tecnicoId: maintenance.tecnicoId,
      tipo: maintenance.tipo,
      descripcion: maintenance.descripcion,
      estado: maintenance.estado,
      observaciones: maintenance.observaciones,
      requiereRepuesto: maintenance.requiereRepuesto,
      requiereFormateo: maintenance.requiereFormateo,
    })
    setSelectedDate(new Date(maintenance.fecha))
    setIsDialogOpen(true)
  }

  // Generar número de solicitud
  const generateNumeroSolicitud = () => {
    const currentYear = new Date().getFullYear()
    const consecutivo = CONSECUTIVOS.find((c) => c.año === currentYear && c.activo)

    if (!consecutivo) {
      return `SIN-CONSECUTIVO-${Date.now()}`
    }

    // Verificar si se ha alcanzado el límite de consecutivos
    if (consecutivo.ultimoConsecutivo >= consecutivo.finConsecutivo) {
      toast({
        title: "Error",
        description: `Se ha alcanzado el límite de consecutivos para el año ${currentYear}`,
        variant: "destructive",
      })
      return `${consecutivo.finConsecutivo}-${currentYear}`
    }

    const newConsecutivo = consecutivo.ultimoConsecutivo + 1
    const numeroFormateado = newConsecutivo.toString().padStart(3, "0")

    // Actualizar el último consecutivo usado
    const updatedConsecutivos = CONSECUTIVOS.map((c) =>
      c.id === consecutivo.id ? { ...c, ultimoConsecutivo: newConsecutivo } : c,
    )

    // En una aplicación real, aquí se guardaría el consecutivo actualizado en la base de datos

    return `${numeroFormateado}-${currentYear}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedEquipment = EQUIPMENTS.find((e) => e.id === currentMaintenance.equipoId)
    const selectedTecnico = TECNICOS.find((t) => t.id === currentMaintenance.tecnicoId)

    if (!selectedEquipment || !selectedTecnico) {
      toast({
        title: "Error",
        description: "Por favor seleccione un equipo y un técnico",
        variant: "destructive",
      })
      return
    }

    const newMaintenance = {
      ...currentMaintenance,
      equipo: `${selectedEquipment.marca} ${selectedEquipment.modelo}`,
      tecnico: selectedTecnico.nombre,
    }

    if (isEditing) {
      setMaintenances(
        maintenances.map((m) =>
          m.id === (currentMaintenance as Maintenance).id
            ? { ...newMaintenance, id: m.id, numeroSolicitud: (currentMaintenance as Maintenance).numeroSolicitud }
            : m,
        ),
      )

      toast({
        title: "Mantenimiento actualizado",
        description: "Se ha actualizado el mantenimiento correctamente",
      })
    } else {
      const id = maintenances.length > 0 ? Math.max(...maintenances.map((m) => m.id)) + 1 : 1
      const numeroSolicitud = generateNumeroSolicitud()
      setMaintenances([...maintenances, { ...newMaintenance, id, numeroSolicitud }])

      toast({
        title: "Mantenimiento programado",
        description: `Se ha programado el mantenimiento con número de solicitud ${numeroSolicitud}`,
      })
    }

    setIsDialogOpen(false)
  }

  // Iniciar mantenimiento
  const handleStartMaintenance = (maintenance: Maintenance) => {
    setMaintenances(maintenances.map((m) => (m.id === maintenance.id ? { ...m, estado: "Iniciado" } : m)))

    toast({
      title: "Mantenimiento iniciado",
      description: `Se ha iniciado el mantenimiento ${maintenance.numeroSolicitud}`,
    })
  }

  // Abrir diálogo para finalizar mantenimiento
  const handleOpenFinishDialog = (maintenance: Maintenance) => {
    setMaintenanceToFinish(maintenance)
    setFinishObservations("")
    setRequiereRepuesto(maintenance.requiereRepuesto)
    setRequiereFormateo(maintenance.requiereFormateo)
    setIsFinishDialogOpen(true)
  }

  // Finalizar mantenimiento
  const handleFinishMaintenance = () => {
    if (!maintenanceToFinish) return

    const updatedMaintenance = {
      ...maintenanceToFinish,
      estado: "Finalizado",
      observaciones: finishObservations,
      requiereRepuesto,
      requiereFormateo,
    }

    setMaintenances(maintenances.map((m) => (m.id === maintenanceToFinish.id ? updatedMaintenance : m)))

    setIsFinishDialogOpen(false)

    // Automáticamente mostrar el PDF al finalizar el mantenimiento
    setSelectedMaintenanceForPdf(updatedMaintenance)
    setIsPdfDialogOpen(true)

    toast({
      title: "Mantenimiento finalizado",
      description: "Se ha finalizado el mantenimiento y generado el formato PDF",
    })
  }

  // Generar PDF para un mantenimiento
  const handleGeneratePdf = (maintenance: Maintenance) => {
    setSelectedMaintenanceForPdf(maintenance)
    setIsPdfDialogOpen(true)
  }

  const filteredMaintenances = maintenances.filter(
    (maintenance) =>
      maintenance.numeroInventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.numeroSolicitud.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Programado":
        return "bg-blue-100 text-blue-800"
      case "Iniciado":
        return "bg-yellow-100 text-yellow-800"
      case "Finalizado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mantenimientos de Equipos</h1>
        <Button onClick={handleAddMaintenance}>
          <Plus className="mr-2 h-4 w-4" />
          Programar Mantenimiento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="proximos">Próximos Mantenimientos</TabsTrigger>
          <TabsTrigger value="historial">Historial de Mantenimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Equipos con Mantenimiento Próximo
              </CardTitle>
              <CardDescription>Equipos que requieren mantenimiento en los próximos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Inventario</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Fecha Mantenimiento</TableHead>
                      <TableHead className="w-[150px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proximosMantenimientos.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-medium">{equipment.numeroInventario}</TableCell>
                        <TableCell>{equipment.tipo}</TableCell>
                        <TableCell>
                          {equipment.marca} {equipment.modelo}
                        </TableCell>
                        <TableCell>{format(new Date(equipment.proximoMantenimiento), "PPP", { locale: es })}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentMaintenance({
                                equipoId: equipment.id,
                                numeroInventario: equipment.numeroInventario,
                                fecha: format(new Date(), "yyyy-MM-dd"),
                                tecnicoId: 0,
                                tipo: "Preventivo",
                                descripcion: `Mantenimiento programado para ${equipment.marca} ${equipment.modelo}`,
                                estado: "Programado",
                                observaciones: "",
                                requiereRepuesto: false,
                                requiereFormateo: false,
                              })
                              setSelectedDate(new Date())
                              setIsDialogOpen(true)
                            }}
                          >
                            <Calendar className="mr-1 h-4 w-4" />
                            Programar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {proximosMantenimientos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No hay equipos con mantenimientos próximos.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Buscar Mantenimientos</CardTitle>
              <CardDescription>
                Busque por número de inventario, equipo, técnico, estado o número de solicitud
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar mantenimiento..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Mantenimientos</CardTitle>
              <CardDescription>Lista de mantenimientos programados y realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Solicitud</TableHead>
                      <TableHead>Nº Inventario</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Técnico</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[150px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaintenances.map((maintenance) => (
                      <TableRow key={maintenance.id}>
                        <TableCell className="font-medium">{maintenance.numeroSolicitud}</TableCell>
                        <TableCell>{maintenance.numeroInventario}</TableCell>
                        <TableCell>{maintenance.equipo}</TableCell>
                        <TableCell>{maintenance.fecha}</TableCell>
                        <TableCell>{maintenance.tipo}</TableCell>
                        <TableCell>{maintenance.tecnico}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              maintenance.estado,
                            )}`}
                          >
                            {maintenance.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditMaintenance(maintenance)}>
                              <Edit className="h-4 w-4" />
                            </Button>

                            {maintenance.estado === "Programado" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartMaintenance(maintenance)}
                                className="flex items-center"
                              >
                                <Clock className="mr-1 h-4 w-4" />
                                Iniciar
                              </Button>
                            )}

                            {maintenance.estado === "Iniciado" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenFinishDialog(maintenance)}
                                className="flex items-center"
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Terminar
                              </Button>
                            )}

                            {maintenance.estado === "Finalizado" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGeneratePdf(maintenance)}
                                className="flex items-center"
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                PDF
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredMaintenances.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron mantenimientos.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para crear/editar mantenimiento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Mantenimiento" : "Programar Nuevo Mantenimiento"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique los datos del mantenimiento seleccionado."
                  : "Complete los datos para programar un nuevo mantenimiento."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="numeroInventario">Equipo (Número de Inventario)</Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {currentMaintenance.numeroInventario
                          ? currentMaintenance.numeroInventario
                          : "Seleccionar equipo..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <div className="p-2">
                        <Input
                          placeholder="Buscar equipo..."
                          value={equipmentSearchTerm}
                          onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredEquipments.length > 0 ? (
                          filteredEquipments.map((equipment) => (
                            <div
                              key={equipment.id}
                              className="cursor-pointer p-2 hover:bg-muted"
                              onClick={() => handleSelectEquipment(equipment)}
                            >
                              <div className="font-medium">{equipment.numeroInventario}</div>
                              <div className="text-sm text-muted-foreground">
                                {equipment.marca} {equipment.modelo}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No se encontraron equipos.
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha">Fecha de Mantenimiento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tecnicoId">Técnico Responsable</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("tecnicoId", Number.parseInt(value))}
                    value={currentMaintenance.tecnicoId.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar técnico..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TECNICOS.map((tecnico) => (
                        <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                          {tecnico.nombre} - {tecnico.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Mantenimiento</Label>
                <Select onValueChange={(value) => handleSelectChange("tipo", value)} value={currentMaintenance.tipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventivo">Preventivo</SelectItem>
                    <SelectItem value="Correctivo">Correctivo</SelectItem>
                    <SelectItem value="Predictivo">Predictivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción del Mantenimiento</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={currentMaintenance.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              {isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={currentMaintenance.observaciones}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">{isEditing ? "Actualizar" : "Programar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para finalizar mantenimiento */}
      <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Finalizar Mantenimiento</DialogTitle>
            <DialogDescription>
              Ingrese la descripción de las actividades realizadas durante el mantenimiento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="finishObservations">Descripción de lo Realizado</Label>
              <Textarea
                id="finishObservations"
                value={finishObservations}
                onChange={(e) => setFinishObservations(e.target.value)}
                rows={4}
                required
                placeholder="Describa las actividades realizadas, piezas reemplazadas, configuraciones, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiereRepuesto"
                  checked={requiereRepuesto}
                  onChange={(e) => setRequiereRepuesto(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="requiereRepuesto" className="text-sm font-normal">
                  Requirió repuestos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiereFormateo"
                  checked={requiereFormateo}
                  onChange={(e) => setRequiereFormateo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="requiereFormateo" className="text-sm font-normal">
                  Requirió formateo
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleFinishMaintenance}>Finalizar Mantenimiento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar el PDF */}
      <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90vh] h-[90vh]">
          {selectedMaintenanceForPdf && (
            <MaintenancePDFViewer
              maintenance={selectedMaintenanceForPdf}
              equipment={EQUIPMENTS.find((e) => e.id === selectedMaintenanceForPdf.equipoId) || EQUIPMENTS[0]}
              technician={TECNICOS.find((t) => t.id === selectedMaintenanceForPdf.tecnicoId) || TECNICOS[0]}
              onClose={() => setIsPdfDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
