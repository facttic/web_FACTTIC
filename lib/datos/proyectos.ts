import 'server-only'

import { apiFetch, normalizePage } from '@/lib/api/client'
import type * as Api from '@/lib/api/esquema'
import { aPagina, aProyecto } from '@/lib/dominio/adaptadores'
import type * as Dominio from '@/lib/dominio/tipos'
import { TTL, cached } from './cache'

/**
 * Proyectos para las vistas.
 *
 * Los filtros se expresan en términos del sitio (`busqueda`, `porPagina`) y se
 * traducen acá a los nombres que espera la API (`nombre`, `limit`). Si el
 * backend los renombra o unifica la paginación, se cambia esta traducción y la
 * grilla de Proyectos no se entera.
 */

const POR_PAGINA = 12

/** Traduce los filtros del sitio a los query params de la API. */
function aQueryParams(filtros: Dominio.FiltrosProyectos) {
  return {
    page: filtros.pagina,
    limit: filtros.porPagina ?? POR_PAGINA,
    nombre: filtros.busqueda,
    sector: filtros.sector,
    servicio: filtros.servicio,
    tecnologia: filtros.tecnologia,
    cooperativa: filtros.cooperativa,
    destacado: filtros.destacado,
  }
}

async function traerProyectos(
  filtros: Dominio.FiltrosProyectos
): Promise<Dominio.Pagina<Dominio.Proyecto>> {
  const raw = await apiFetch<Api.Paginated<Api.Proyecto>>('/api/proyectos', {
    params: aQueryParams(filtros),
  })
  return aPagina(normalizePage<Api.Proyecto>(raw, filtros.porPagina ?? POR_PAGINA), aProyecto)
}

export function getProyectos(
  filtros: Dominio.FiltrosProyectos = {}
): Promise<Dominio.Pagina<Dominio.Proyecto>> {
  // Los filtros forman parte de la clave para que cada combinación se cachee aparte.
  return cached(traerProyectos, ['proyectos', JSON.stringify(filtros)], {
    revalidate: TTL.contenido,
    tags: ['proyectos'],
  })(filtros)
}

export function getProyectosDestacados(cantidad = 3): Promise<Dominio.Pagina<Dominio.Proyecto>> {
  return getProyectos({ destacado: true, porPagina: cantidad })
}

/**
 * Busca un proyecto por su identificador de URL. Hoy ese identificador es el
 * ObjectId; cuando la API exponga `slug`, esta función pasa a resolverlo por
 * slug sin que cambie la ruta `/proyectos/[slug]`.
 */
export function getProyecto(slug: string): Promise<Dominio.Proyecto | null> {
  return cached(
    async (identificador: string) => {
      try {
        const raw = await apiFetch<Api.Proyecto>(`/api/proyectos/${identificador}`)
        return aProyecto(raw)
      } catch {
        return null
      }
    },
    ['proyecto', slug],
    { revalidate: TTL.contenido, tags: ['proyectos', `proyecto:${slug}`] }
  )(slug)
}

/**
 * Proyectos relacionados: la API no tiene el endpoint, así que se emulan
 * buscando otros del mismo sector.
 */
export async function getProyectosRelacionados(
  proyecto: Dominio.Proyecto,
  cantidad = 3
): Promise<Dominio.Proyecto[]> {
  if (!proyecto.sector) return []

  const { items } = await getProyectos({
    sector: proyecto.sector.id,
    porPagina: cantidad + 1,
  })

  return items.filter((otro) => otro.id !== proyecto.id).slice(0, cantidad)
}
