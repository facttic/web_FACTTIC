import "server-only";

import { API_URL, getServiceToken, invalidateServiceToken } from "./tokens";
import type { Paginated } from "./esquema";

/**
 * Cliente HTTP contra la API de FACTTIC.
 *
 * El fetch se hace siempre con `cache: 'no-store'` a propósito: el header
 * `Authorization` forma parte de la cache key de Next, y como el token se
 * renueva cada 15 minutos, cachear acá invalidaría todo el contenido en cada
 * renovación. El cacheo se hace una capa más arriba (ver `lib/datos`),
 * con claves explícitas que no incluyen el token.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryValue = string | number | boolean | undefined | null;

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, QueryValue>;
  body?: BodyInit | null;
  /** Token a usar en lugar del de servicio (el del usuario, en el backoffice). */
  token?: string;
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, API_URL);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Hace una request contra la API.
 *
 * Las lecturas van sin credencial: los GET son públicos desde que el backend
 * los abrió, y evitarse el login es lo que las vuelve rápidas —con token
 * tardaban casi cinco segundos y hacían fallar `next build`, que prerenderiza
 * con once workers en paralelo—. Si alguna respondiera 401, se reintenta una
 * vez con el token de servicio, así el sitio sigue en pie si el backend vuelve
 * a cerrar algún recurso.
 *
 * Las escrituras siguen autenticadas: el backoffice pasa el token de la
 * persona en `token` para que `createdBy` quede bien.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { params, token: explicitToken, headers, ...init } = options;
  const url = buildUrl(path, params);

  const metodo = (init.method ?? "GET").toUpperCase();
  const esLectura = metodo === "GET" || metodo === "HEAD";

  const run = async (token?: string): Promise<Response> =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: token
        ? { ...headers, Authorization: `Bearer ${token}` }
        : { ...headers },
    });

  // Lecturas sin credencial; escrituras con la que corresponda.
  let res = await run(
    esLectura && !explicitToken
      ? undefined
      : (explicitToken ?? (await getServiceToken())),
  );

  if (res.status === 401 && !explicitToken) {
    invalidateServiceToken();
    res = await run(await getServiceToken());
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      path,
      `${res.status} ${res.statusText} en ${path}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Campos internos del backoffice que no deben llegar al browser. */
const INTERNAL_FIELDS = new Set(["createdBy", "updatedBy", "__v"]);

/**
 * Limpia la respuesta de la API: descarta los campos de auditoría y recorta los
 * nombres, porque hay registros cargados con espacios de más (por ejemplo el
 * servicio guardado como `" Capacitación y consultoría"`).
 */
export function sanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(sanitize) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (INTERNAL_FIELDS.has(key)) continue;
      out[key] =
        key === "nombre" && typeof val === "string"
          ? val.trim()
          : sanitize(val);
    }
    return out as T;
  }
  return value;
}

/** Forma que devuelve `GET /api/proyectos`. */
interface ProyectosResponse<T> {
  items?: T[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}

/** Forma que devuelve el resto de los recursos. */
interface ListResponse<T> {
  items?: T[];
  totalCount?: number;
}

/**
 * Unifica las dos convenciones de paginación de la API en un único `Paginated`.
 * Proyectos responde `{items, total, page, limit, pages}` y el resto
 * `{items, totalCount}` sin datos de página.
 */
export function normalizePage<T>(
  raw: ProyectosResponse<T> & ListResponse<T>,
  fallbackPerPage: number,
): Paginated<T> {
  const items = sanitize(raw.items ?? []);
  const total = raw.total ?? raw.totalCount ?? items.length;
  const perPage = raw.limit ?? fallbackPerPage;
  const pages =
    raw.pages ?? (perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1);

  return { items, total, page: raw.page ?? 1, perPage, pages };
}
