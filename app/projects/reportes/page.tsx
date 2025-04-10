"use client"

import { useEffect, useState } from "react"
import { Download, FileText, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import type { Equipo, Mantenimiento } from "@/lib/database-types"
import { supabase } from "@/lib/supabase"

export default function ReportesPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoReporte, setTipoReporte] = useState<string>("equipos")

  useEffect(() => {
    async function cargarDatos() {
      setLoading(true)
      try {
        if (tipoReporte === "equipos") {
          const { data, error } = await supabase
            .from("equipos")
            .select(`
              *,
              tipo_equipo:tipo_id (nombre),
              centro_costo:centro_costo_id (nombre),
              area:area_id (nombre),
              responsable:responsable_id (nombres, apellidos),
              sede:sede_id (nombre),
              distribuidor:distribuidor_id (nombre)
            `)
            .order("numero_inventario")

          if (error) throw error
          setEquipos(data || [])
        } else if (tipoReporte === "mantenimientos") {
          const { data, error } = await supabase
            .from("mantenimientos")
            .select(`
              *,
              equipo:equipo_id (numero_inventario, serial, marca, modelo),
              tecnico:tecnico_id (nombres, apellidos)
            `)
            .order("fecha", { ascending: false })

          if (error) throw error
          setMantenimientos(data || [])
        }
      } catch (error: any) {
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

    cargarDatos()
  }, [tipoReporte])

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    let csvContent = ""
    let filename = ""

    if (tipoReporte === "equipos") {
      // Cabeceras para equipos
      csvContent =
        "Inventario,Serial,Tipo,Marca,Modelo,Centro de Costo,Área,Ubicación,Responsable,Sede,Fecha Compra,Estado\n"

      // Datos de equipos
      equipos.forEach((equipo) => {
        csvContent += `"${equipo.numero_inventario}","${equipo.serial || ""}","${equipo.tipo_equipo?.nombre || ""}","${equipo.marca || ""}","${equipo.modelo || ""}","${equipo.centro_costo?.nombre || ""}","${equipo.area?.nombre || ""}","${equipo.ubicacion || ""}","${equipo.responsable ? `${equipo.responsable.nombres} ${equipo.responsable.apellidos}` : ""}","${equipo.sede?.nombre || ""}","${equipo.fecha_compra || ""}","${equipo.estado}"\n`
      })

      filename = "reporte-equipos.csv"
    } else if (tipoReporte === "mantenimientos") {
      // Cabeceras para mantenimientos
      csvContent = "Equipo,Serial,Fecha,Técnico,Tipo,Descripción,Estado,Número Solicitud\n"

      // Datos de mantenimientos
      mantenimientos.forEach((mant) => {
        csvContent += `"${mant.equipo?.numero_inventario || ""}","${mant.equipo?.serial || ""}","${mant.fecha}","${mant.tecnico ? `${mant.tecnico.nombres} ${mant.tecnico.apellidos}` : ""}","${mant.tipo}","${mant.descripcion}","${mant.estado}","${mant.numero_solicitud}"\n`
      })

      filename = "reporte-mantenimientos.csv"
    }

    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <div className="flex items-center gap-4">
          <Select value={tipoReporte} onValueChange={setTipoReporte}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipos">Equipos</SelectItem>
              <SelectItem value="mantenimientos">Mantenimientos</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="pb-2">
          <CardTitle>Reporte de {tipoReporte === "equipos" ? "Equipos" : "Mantenimientos"}</CardTitle>
          <CardDescription>
            {tipoReporte === "equipos"
              ? "Lista de todos los equipos registrados en el sistema"
              : "Lista de todos los mantenimientos registrados en el sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tipoReporte === "equipos" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Cargando equipos...
                      </TableCell>
                    </TableRow>
                  ) : equipos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay equipos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    equipos.map((equipo) => (
                      <TableRow key={equipo.id}>
                        <TableCell>{equipo.numero_inventario}</TableCell>
                        <TableCell>{equipo.tipo_equipo?.nombre || "N/A"}</TableCell>
                        <TableCell>
                          {equipo.marca} {equipo.modelo && `/ ${equipo.modelo}`}
                        </TableCell>
                        <TableCell>
                          {equipo.ubicacion || "N/A"}
                          {equipo.area?.nombre && ` - ${equipo.area.nombre}`}
                        </TableCell>
                        <TableCell>
                          {equipo.responsable ? `${equipo.responsable.nombres} ${equipo.responsable.apellidos}` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              equipo.estado === "Activo"
                                ? "bg-green-100 text-green-800"
                                : equipo.estado === "En mantenimiento"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {equipo.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Solicitud</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Cargando mantenimientos...
                      </TableCell>
                    </TableRow>
                  ) : mantenimientos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay mantenimientos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    mantenimientos.map((mant) => (
                      <TableRow key={mant.id}>
                        <TableCell>
                          {mant.equipo?.numero_inventario || "N/A"}
                          {mant.equipo?.serial && ` (${mant.equipo.serial})`}
                        </TableCell>
                        <TableCell>{new Date(mant.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {mant.tecnico ? `${mant.tecnico.nombres} ${mant.tecnico.apellidos}` : "N/A"}
                        </TableCell>
                        <TableCell>{mant.tipo}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              mant.estado === "Completado"
                                ? "bg-green-100 text-green-800"
                                : mant.estado === "En proceso"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {mant.estado}
                          </span>
                        </TableCell>
                        <TableCell>{mant.numero_solicitud}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {tipoReporte === "equipos" ? equipos.length : mantenimientos.length} registros
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">
              Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
