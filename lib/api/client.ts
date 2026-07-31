import 'server-only'

import { API_URL, getServiceToken, invalidateServiceToken } from './tokens'
import type { Paginated } from './types'

/**
 * Cliente HTTP contra la API de FACTTIC.
 *
 * El fetch se hace siempre con `cache: 'no-store'` a propósito: el header
 * `Authorization` forma parte de la cache key de Next, y como el token se
 * renueva cada 15 minutos, cachear acá invalidaría todo el contenido en cada
 * renovación. El cacheo se hace una capa más arriba (ver `lib/api/resources`),
 * con claves explícitas que no incluyen el token.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type QueryValue = string | number | boolean | undefined | null

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, QueryValue>
  body?: BodyInit | null
  /** Token a usar en lugar del de servicio (el del usuario, en el backoffice). */
  token?: string
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, API_URL)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/**
 * Hace una request autenticada. Ante un 401 descarta el token y reintenta una
 * vez: cubre el caso de que el token venza entre que se lee de cache y llega al
 * servidor.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { params, token: explicitToken, headers, ...init } = options
  const url = buildUrl(path, params)

  const run = async (token: string): Promise<Response> =>
    fetch(url, {
      ...init,
      cache: 'no-store',
      headers: { ...headers, Authorization: `Bearer ${token}` },
    })

  let token = explicitToken ?? (await getServiceToken())
  let res = await run(token)

  if (res.status === 401 && !explicitToken) {
    invalidateServiceToken()
    token = await getServiceToken()
    res = await run(token)
  }

  if (!res.ok) {
    throw new ApiError(res.status, path, `${res.status} ${res.statusText} en ${path}`)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** Campos internos del backoffice que no deben llegar al browser. */
const INTERNAL_FIELDS = new Set(['createdBy', 'updatedBy', '__v'])

/**
 * Limpia la respuesta de la API: descarta los campos de auditoría y recorta los
 * nombres, porque hay registros cargados con espacios de más (por ejemplo el
 * servicio guardado como `" Capacitación y consultoría"`).
 */
export function sanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(sanitize) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (INTERNAL_FIELDS.has(key)) continue
      out[key] = key === 'nombre' && typeof val === 'string' ? val.trim() : sanitize(val)
    }
    return out as T
  }
  return value
}

/** Forma que devuelve `GET /api/proyectos`. */
interface ProyectosResponse<T> {
  items?: T[]
  total?: number
  page?: number
  limit?: number
  pages?: number
}

/** Forma que devuelve el resto de los recursos. */
interface ListResponse<T> {
  items?: T[]
  totalCount?: number
}

/**
 * Unifica las dos convenciones de paginación de la API en un único `Paginated`.
 * Proyectos responde `{items, total, page, limit, pages}` y el resto
 * `{items, totalCount}` sin datos de página.
 */
export function normalizePage<T>(
  raw: ProyectosResponse<T> & ListResponse<T>,
  fallbackPerPage: number
): Paginated<T> {
  const items = sanitize(raw.items ?? [])
  const total = raw.total ?? raw.totalCount ?? items.length
  const perPage = raw.limit ?? fallbackPerPage
  const pages = raw.pages ?? (perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1)

  return { items, total, page: raw.page ?? 1, perPage, pages }
}
