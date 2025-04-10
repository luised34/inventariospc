import Link from "next/link"
import {
  Building,
  CreditCard,
  FileText,
  Landmark,
  LayoutGrid,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AjustesPage() {
  const opciones = [
    {
      titulo: "Empresa",
      descripcion: "Gestiona la información de la empresa",
      icono: <Building className="h-8 w-8" />,
      ruta: "/ajustes/empresa",
    },
    {
      titulo: "Personal",
      descripcion: "Gestiona el personal de la empresa",
      icono: <Users className="h-8 w-8" />,
      ruta: "/ajustes/personal",
    },
    {
      titulo: "Usuarios",
      descripcion: "Gestiona los usuarios del sistema",
      icono: <ShieldCheck className="h-8 w-8" />,
      ruta: "/ajustes/usuarios",
    },
    {
      titulo: "Cargos",
      descripcion: "Gestiona los cargos del personal",
      icono: <User className="h-8 w-8" />,
      ruta: "/ajustes/cargos",
    },
    {
      titulo: "Tipos de Identificaciones",
      descripcion: "Gestiona los tipos de identificaciones",
      icono: <FileText className="h-8 w-8" />,
      ruta: "/ajustes/tipos-identificaciones",
    },
    {
      titulo: "Tipos de Equipos",
      descripcion: "Gestiona los tipos de equipos",
      icono: <Package className="h-8 w-8" />,
      ruta: "/ajustes/tipos-equipos",
    },
    {
      titulo: "Distribuidores",
      descripcion: "Gestiona los distribuidores",
      icono: <Tag className="h-8 w-8" />,
      ruta: "/ajustes/distribuidores",
    },
    {
      titulo: "Números de Solicitud",
      descripcion: "Gestiona los números de solicitud",
      icono: <CreditCard className="h-8 w-8" />,
      ruta: "/ajustes/numeros-solicitud",
    },
    {
      titulo: "Centros de Costos",
      descripcion: "Gestiona los centros de costos",
      icono: <Landmark className="h-8 w-8" />,
      ruta: "/ajustes/centros-costos",
    },
    {
      titulo: "Áreas",
      descripcion: "Gestiona las áreas de la empresa",
      icono: <LayoutGrid className="h-8 w-8" />,
      ruta: "/ajustes/areas",
    },
    {
      titulo: "Sedes",
      descripcion: "Gestiona las sedes de la empresa",
      icono: <MapPin className="h-8 w-8" />,
      ruta: "/ajustes/sedes",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Ajustes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opciones.map((opcion) => (
          <Card key={opcion.titulo} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{opcion.titulo}</CardTitle>
              <CardDescription>{opcion.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>{opcion.icono}</CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={opcion.ruta}>Gestionar</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
