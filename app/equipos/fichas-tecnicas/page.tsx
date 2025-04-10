"use client"

import { useState } from "react"
import { Download, FileText, Printer, Search } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demonstration
const EQUIPMENTS = [
  {
    id: 1,
    numeroInventario: "INV-001",
    tipo: "Laptop",
    marca: "Dell",
    modelo: "Latitude 5420",
    serial: "ABC123456",
    procesador: "Intel Core i5-1135G7 @ 2.40GHz",
    ram: "8GB DDR4 3200MHz",
    almacenamiento: "256GB SSD NVMe",
    tarjetaGrafica: "Intel Iris Xe Graphics",
    sistemaOperativo: "Windows 10 Pro 64-bit",
    direccionIP: "192.168.1.101",
    direccionMAC: "A1:B2:C3:D4:E5:F6",
    fechaCompra: "2022-03-15",
    garantia: "3 años (hasta 2025-03-15)",
    proveedor: "Dell Colombia",
    factura: "FAC-2022-0123",
    ubicacion: "Oficina Principal - Piso 2",
    departamento: "Desarrollo",
    asignado: "Juan Rodríguez",
    observaciones: "Equipo en excelentes condiciones",
    imagen: "/modern-workspace.png",
    historialMantenimientos: [
      {
        fecha: "2022-09-10",
        tipo: "Preventivo",
        descripcion: "Limpieza general y actualización de software",
        tecnico: "Carlos Técnico",
      },
      {
        fecha: "2023-03-22",
        tipo: "Correctivo",
        descripcion: "Reemplazo de batería",
        tecnico: "Pedro Soporte",
      },
    ],
  },
  {
    id: 2,
    numeroInventario: "INV-002",
    tipo: "Desktop",
    marca: "HP",
    modelo: "ProDesk 600 G6",
    serial: "XYZ789012",
    procesador: "Intel Core i7-10700 @ 2.90GHz",
    ram: "16GB DDR4 2933MHz",
    almacenamiento: "512GB SSD NVMe + 1TB HDD",
    tarjetaGrafica: "NVIDIA GeForce GTX 1650",
    sistemaOperativo: "Windows 11 Pro 64-bit",
    direccionIP: "192.168.1.102",
    direccionMAC: "G7:H8:I9:J0:K1:L2",
    fechaCompra: "2021-11-05",
    garantia: "3 años (hasta 2024-11-05)",
    proveedor: "HP Colombia",
    factura: "FAC-2021-0456",
    ubicacion: "Oficina Principal - Piso 1",
    departamento: "Diseño",
    asignado: "María Gómez",
    observaciones: "Equipo de alto rendimiento para diseño gráfico",
    imagen: "/modern-workspace.png",
    historialMantenimientos: [
      {
        fecha: "2022-05-18",
        tipo: "Preventivo",
        descripcion: "Limpieza de componentes internos y actualización de drivers",
        tecnico: "Carlos Técnico",
      },
      {
        fecha: "2023-01-10",
        tipo: "Correctivo",
        descripcion: "Reemplazo de fuente de poder",
        tecnico: "Pedro Soporte",
      },
    ],
  },
]

export default function FichasTecnicasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof EQUIPMENTS)[0] | null>(null)

  const filteredEquipments = EQUIPMENTS.filter(
    (equipment) =>
      equipment.numeroInventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.asignado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectEquipment = (equipment: (typeof EQUIPMENTS)[0]) => {
    setSelectedEquipment(equipment)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Fichas Técnicas de Equipos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Equipos</CardTitle>
              <CardDescription>Seleccione un equipo para ver su ficha técnica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar equipo..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredEquipments.map((equipment) => (
                    <div
                      key={equipment.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedEquipment?.id === equipment.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => handleSelectEquipment(equipment)}
                    >
                      <div className="font-medium">{equipment.numeroInventario}</div>
                      <div className="text-sm opacity-90">
                        {equipment.marca} {equipment.modelo}
                      </div>
                      <div className="text-xs opacity-75">Asignado a: {equipment.asignado}</div>
                    </div>
                  ))}

                  {filteredEquipments.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No se encontraron equipos.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedEquipment ? (
            <Card className="print:shadow-none">
              <CardHeader className="flex flex-row items-center justify-between print:pb-2">
                <div>
                  <CardTitle>Ficha Técnica: {selectedEquipment.numeroInventario}</CardTitle>
                  <CardDescription>
                    {selectedEquipment.marca} {selectedEquipment.modelo}
                  </CardDescription>
                </div>
                <div className="flex space-x-2 print:hidden">
                  <Button variant="outline" size="icon" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="print:hidden">
                    <TabsTrigger value="general">Información General</TabsTrigger>
                    <TabsTrigger value="technical">Especificaciones Técnicas</TabsTrigger>
                    <TabsTrigger value="network">Red</TabsTrigger>
                    <TabsTrigger value="administrative">Información Administrativa</TabsTrigger>
                    <TabsTrigger value="maintenance">Historial de Mantenimientos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Número de Inventario</Label>
                            <div className="font-medium">{selectedEquipment.numeroInventario}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Tipo de Equipo</Label>
                            <div className="font-medium">{selectedEquipment.tipo}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Marca</Label>
                            <div className="font-medium">{selectedEquipment.marca}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Modelo</Label>
                            <div className="font-medium">{selectedEquipment.modelo}</div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Número de Serial</Label>
                          <div className="font-medium">{selectedEquipment.serial}</div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Ubicación</Label>
                          <div className="font-medium">{selectedEquipment.ubicacion}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Departamento</Label>
                            <div className="font-medium">{selectedEquipment.departamento}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Asignado a</Label>
                            <div className="font-medium">{selectedEquipment.asignado}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex justify-center">
                        <div className="relative h-48 w-48 border rounded-md overflow-hidden">
                          <Image
                            src={selectedEquipment.imagen || "/placeholder.svg"}
                            alt={`${selectedEquipment.marca} ${selectedEquipment.modelo}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Procesador</Label>
                        <div className="font-medium">{selectedEquipment.procesador}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Memoria RAM</Label>
                        <div className="font-medium">{selectedEquipment.ram}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Almacenamiento</Label>
                        <div className="font-medium">{selectedEquipment.almacenamiento}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tarjeta Gráfica</Label>
                        <div className="font-medium">{selectedEquipment.tarjetaGrafica}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Sistema Operativo</Label>
                        <div className="font-medium">{selectedEquipment.sistemaOperativo}</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="network" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Dirección IP</Label>
                        <div className="font-medium">{selectedEquipment.direccionIP}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Dirección MAC</Label>
                        <div className="font-medium">{selectedEquipment.direccionMAC}</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="administrative" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Fecha de Compra</Label>
                        <div className="font-medium">{selectedEquipment.fechaCompra}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Garantía</Label>
                        <div className="font-medium">{selectedEquipment.garantia}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Proveedor</Label>
                        <div className="font-medium">{selectedEquipment.proveedor}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Factura</Label>
                        <div className="font-medium">{selectedEquipment.factura}</div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Observaciones</Label>
                      <div className="font-medium">{selectedEquipment.observaciones}</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="maintenance" className="mt-4">
                    <div className="space-y-4">
                      {selectedEquipment.historialMantenimientos.map((mantenimiento, index) => (
                        <Card key={index}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">Mantenimiento {mantenimiento.tipo}</CardTitle>
                              <span className="text-sm text-muted-foreground">{mantenimiento.fecha}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p>{mantenimiento.descripcion}</p>
                            <p className="text-sm text-muted-foreground mt-2">Técnico: {mantenimiento.tecnico}</p>
                          </CardContent>
                        </Card>
                      ))}

                      {selectedEquipment.historialMantenimientos.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          No hay registros de mantenimientos.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-10 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Seleccione un equipo</h3>
                <p className="text-muted-foreground">Seleccione un equipo de la lista para ver su ficha técnica.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
