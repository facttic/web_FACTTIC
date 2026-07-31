/**
 * Tipos de la API de FACTTIC.
 *
 * Escritos a partir de las respuestas reales de la API, no del OpenAPI: el spec
 * publicado en /api/public/oas.json diverge de la implementación en varios
 * puntos (declara `security` solo en algunos endpoints, documenta la ruta de
 * archivos como /files/{filename} cuando la real es /api/files/{filename}, y
 * omite campos que la API sí devuelve, como `verticales` en cooperativa).
 *
 * Los campos de auditoría (`createdBy`, `updatedBy`) se descartan en el cliente
 * antes de que los datos lleguen al browser, así que no aparecen acá.
 */

/**
 * Una relación puede venir como ObjectId o como el objeto entero, según el
 * endpoint: el listado de proyectos llega populado, pero los objetos anidados
 * dentro de él traen las suyas como ids.
 */
export type Ref<T> = string | T

export function isPopulated<T>(ref: Ref<T> | undefined | null): ref is T {
  return typeof ref === 'object' && ref !== null
}

export interface Subservicio {
  nombre: string
  descripcion?: string
}

export interface Servicio {
  _id: string
  nombre: string
  descripcion?: string
  orden?: number
  subservicios?: Subservicio[]
  createdAt?: string
  updatedAt?: string
}

export interface Sector {
  _id: string
  nombre: string
  descripcion?: string
  orden?: number
  /** Nombre de archivo servido por /api/files — resolver con `mediaUrl()`. */
  imageFileName?: string
  /** Animación Lottie (JSON), también en /api/files. */
  lottieFileName?: string
  createdAt?: string
  updatedAt?: string
}

export interface Tecnologia {
  _id: string
  nombre: string
  /**
   * La base guarda el logo de forma inconsistente: unas veces en `fileName`
   * como nombre suelto, otras como URL absoluta, y en algún caso en `logo` con
   * una ruta rota. `mediaUrl()` normaliza los tres casos.
   */
  fileName?: string
  logo?: string
  createdAt?: string
}

export interface Ubicacion {
  lat: number
  lng: number
}

export interface Cooperativa {
  _id: string
  nombre: string
  asociados?: number
  /** Hoy ninguna cooperativa la tiene cargada; sin esto no hay mapa federal. */
  ubicacion?: Ubicacion
  servicios?: Ref<Servicio>[]
  sectores?: Ref<Sector>[]
  /** No documentado en el spec, pero presente en los datos. */
  verticales?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Cliente {
  _id: string
  nombre: string
  logo?: string
  fileName?: string
  createdAt?: string
}

export interface Organizacion {
  _id: string
  nombre: string
  logo?: string
  fileName?: string
  createdAt?: string
}

export interface Consejo {
  _id: string
  nombre: string
  cargo: string
  cooperativa?: Ref<Cooperativa>
  createdAt?: string
}

export interface Proyecto {
  _id: string
  nombre: string
  sector?: Ref<Sector>
  cliente?: Ref<Cliente>
  servicios?: Ref<Servicio>[]
  tecnologias?: Ref<Tecnologia>[]
  cooperativas?: Ref<Cooperativa>[]
  desafio?: string
  solucion?: string
  resultado?: string
  esDestacado?: boolean
  imageFileNames?: string[]
  videoFileNames?: string[]
  createdAt?: string
  updatedAt?: string
}

/**
 * Forma unificada de paginación. La API tiene dos convenciones distintas
 * (`{items, total, page, limit, pages}` en proyectos y `{items, totalCount}` en
 * el resto); el cliente las normaliza a esta.
 */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  pages: number
}

/** Filtros de GET /api/proyectos — cubren los de la maqueta de Proyectos. */
export interface ProyectoFilters {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  nombre?: string
  sector?: string
  cooperativa?: string
  cliente?: string
  servicio?: string
  tecnologia?: string
  destacado?: boolean
  fechaDesde?: string
  fechaHasta?: string
}

/** Filtros del resto de los recursos, que usan otra convención. */
export interface ListFilters {
  page?: number
  perPage?: number
  sort?: string
  order?: 'ASC' | 'DESC'
  search?: string
}
