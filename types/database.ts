export interface TipoIdentificacion {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface Cargo {
  id: number
  nombre: string
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface Personal {
  id: number
  nombres: string
  apellidos: string
  tipo_id_id: number | null
  numero_id: string
  email: string | null
  telefono: string | null
  cargo_id: number | null
  created_at: string
  updated_at: string
}

export interface PersonalWithRelations extends Personal {
  tipo_identificacion: TipoIdentificacion | null
  cargo: Cargo | null
}

export interface Empresa {
  id: number
  nombre: string
  nit: string
  direccion: string | null
  telefono: string | null
  email: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Sede {
  id: number
  nombre: string
  direccion: string | null
  ciudad: string | null
  created_at: string
  updated_at: string
}

export interface CentroCosto {
  id: number
  nombre: string
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface Area {
  id: number
  nombre: string
  descripcion: string | null
  centro_costo_id: number | null
  created_at: string
  updated_at: string
}

export interface Distribuidor {
  id: number
  nombre: string
  nit: string
  direccion: string | null
  telefono: string | null
  email: string | null
  contacto: string | null
  observaciones: string | null
  created_at: string
  updated_at: string
}

export interface TipoEquipo {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  vida_util: number
  unidad_tiempo: string
  created_at: string
  updated_at: string
}

export interface Equipo {
  id: number
  numero_inventario: string
  serial: string | null
  tipo_id: number | null
  marca: string | null
  modelo: string | null
  centro_costo_id: number | null
  area_id: number | null
  ubicacion: string | null
  responsable_id: number | null
  sede_id: number | null
  fecha_compra: string | null
  valor_compra: number | null
  distribuidor_id: number | null
  garantia: string | null
  criticidad: string | null
  vida_util: number | null
  unidad_tiempo: string | null
  procesador: string | null
  memoria_ram: string | null
  capacidad_disco: string | null
  frecuencia_mantenimiento: number | null
  unidad_mantenimiento: string | null
  proximo_mantenimiento: string | null
  estado: string
  created_at: string
  updated_at: string
}

export interface NumeroSolicitud {
  id: number
  anio: number
  prefijo: string
  inicio_consecutivo: number
  fin_consecutivo: number
  ultimo_consecutivo: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Mantenimiento {
  id: number
  equipo_id: number | null
  fecha: string
  tecnico_id: number | null
  tipo: string
  descripcion: string
  estado: string
  observaciones: string | null
  numero_solicitud: string
  requiere_repuesto: boolean
  requiere_formateo: boolean
  created_at: string
  updated_at: string
}

export interface RepuestoMantenimiento {
  id: number
  mantenimiento_id: number | null
  descripcion: string
  serial: string | null
  observacion: string | null
  created_at: string
  updated_at: string
}
