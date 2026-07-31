import 'server-only'

import { apiFetch, normalizePage } from '../client'
import type { Sector, Servicio, Tecnologia, Cliente, Organizacion } from '../types'
import { TTL, cached } from './cache'

/**
 * Catálogos: sectores, servicios, tecnologías, clientes y organizaciones.
 *
 * Todos usan la convención de paginación `page/perPage` → `{items, totalCount}`.
 * Se piden con `perPage` alto porque son listas chicas que el sitio consume
 * enteras (tres sectores, cinco servicios, etc.).
 */

const ALL = 200

async function fetchAll<T>(path: string): Promise<T[]> {
  const raw = await apiFetch<{ items?: T[]; totalCount?: number }>(path, {
    params: { perPage: ALL },
  })
  return normalizePage<T>(raw, ALL).items
}

export const getSectores = cached(
  async (): Promise<Sector[]> => {
    const sectores = await fetchAll<Sector>('/api/sectores')
    return sectores.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
  },
  ['sectores'],
  { revalidate: TTL.catalogo, tags: ['sectores'] }
)

export const getServicios = cached(
  async (): Promise<Servicio[]> => {
    const servicios = await fetchAll<Servicio>('/api/servicios')
    return servicios.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
  },
  ['servicios'],
  { revalidate: TTL.catalogo, tags: ['servicios'] }
)

export const getTecnologias = cached(
  (): Promise<Tecnologia[]> => fetchAll<Tecnologia>('/api/tecnologias'),
  ['tecnologias'],
  { revalidate: TTL.catalogo, tags: ['tecnologias'] }
)

export const getClientes = cached(
  (): Promise<Cliente[]> => fetchAll<Cliente>('/api/clientes'),
  ['clientes'],
  { revalidate: TTL.catalogo, tags: ['clientes'] }
)

export const getOrganizaciones = cached(
  (): Promise<Organizacion[]> => fetchAll<Organizacion>('/api/organizaciones'),
  ['organizaciones'],
  { revalidate: TTL.catalogo, tags: ['organizaciones'] }
)
