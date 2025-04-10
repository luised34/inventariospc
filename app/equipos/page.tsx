import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Database, FileText, PenToolIcon as Tool, Laptop } from "lucide-react"

export default function EquiposPage() {
  const equiposOptions = [
    {
      title: "Base de Datos Equipos",
      description: "Gestión de inventario de equipos",
      icon: Database,
      href: "/equipos/base-datos",
    },
    {
      title: "Fichas Técnicas",
      description: "Información detallada de cada equipo",
      icon: FileText,
      href: "/equipos/fichas-tecnicas",
    },
    {
      title: "Mantenimientos",
      description: "Programación y seguimiento de mantenimientos",
      icon: Tool,
      href: "/equipos/mantenimientos",
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Equipos de Cómputo</h1>
      <p className="text-muted-foreground mb-8">
        Administre el inventario, fichas técnicas y mantenimientos de los equipos de cómputo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equiposOptions.map((option) => (
          <Link key={option.title} href={option.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Haga clic para acceder a la gestión de {option.title.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Equipos</CardTitle>
            <CardDescription>Estadísticas generales del inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <Laptop className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-2xl font-bold">124</h3>
                <p className="text-sm text-muted-foreground">Total Equipos</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <Tool className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-2xl font-bold">8</h3>
                <p className="text-sm text-muted-foreground">Mantenimientos Pendientes</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-2xl font-bold">98%</h3>
                <p className="text-sm text-muted-foreground">Fichas Completas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
