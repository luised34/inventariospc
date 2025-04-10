"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { BookOpen, Bot, Command, Frame, LifeBuoy, Send, Settings2, Laptop } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Equipos de Computo",
        url: "/equipos",
        icon: Laptop,
        isActive: pathname === "/" || pathname === "/equipos" || pathname.startsWith("/equipos"),
        items: [
          {
            title: "Base de Datos Equipos",
            url: "/equipos/base-datos",
          },
          {
            title: "Fichas Técnicas",
            url: "/equipos/fichas-tecnicas",
          },
          {
            title: "Mantenimientos",
            url: "/equipos/mantenimientos",
          },
        ],
      },
      {
        title: "Models",
        url: "/models",
        icon: Bot,
        isActive: pathname.startsWith("/models"),
        items: [
          {
            title: "Genesis",
            url: "/models/genesis",
          },
          {
            title: "Explorer",
            url: "/models/explorer",
          },
          {
            title: "Quantum",
            url: "/models/quantum",
          },
        ],
      },
      {
        title: "Documentation",
        url: "/docs",
        icon: BookOpen,
        isActive: pathname.startsWith("/docs"),
        items: [
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
          {
            title: "Get Started",
            url: "/docs/get-started",
          },
          {
            title: "Tutorials",
            url: "/docs/tutorials",
          },
          {
            title: "Changelog",
            url: "/docs/changelog",
          },
        ],
      },
      {
        title: "Ajustes",
        url: "/ajustes",
        icon: Settings2,
        isActive: pathname.startsWith("/ajustes"),
        items: [
          {
            title: "Empresa",
            url: "/ajustes/empresa",
          },
          {
            title: "Personal",
            url: "/ajustes/personal",
          },
          {
            title: "Cargos",
            url: "/ajustes/cargos",
          },
          {
            title: "Tipos de Identificaciones",
            url: "/ajustes/tipos-identificaciones",
          },
          {
            title: "Tipos de Equipos",
            url: "/ajustes/tipos-equipos",
          },
          {
            title: "Distribuidores",
            url: "/ajustes/distribuidores",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Reportes",
        url: "/projects/reportes",
        icon: Frame,
      },
    ],
  }

  return (
    <Sidebar className="top-[--header-height] !h-[calc(100svh-var(--header-height))]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
