import "server-only";

import { apiFetch, normalizePage } from "@/lib/api/client";
import type * as Api from "@/lib/api/esquema";
import {
  aAutoridad,
  aCooperativa,
  aOrganizacion,
  aSector,
  aServicio,
  aTecnologia,
} from "@/lib/dominio/adaptadores";
import type * as Dominio from "@/lib/dominio/tipos";
import { TTL, cached } from "./cache";

/**
 * Datos de catálogo para las vistas.
 *
 * Todo lo que sale de acá ya está en el modelo del sitio: las vistas no ven
 * `_id`, ni referencias sin resolver, ni nombres de archivo. Si cambia la API,
 * se ajusta el adaptador y estas firmas quedan igual.
 *
 * Son listas cortas —tres sectores, cinco servicios— así que se piden enteras.
 */

const TODOS = 200;
/** Tope de páginas a recorrer, por si el total que informa la API no baja. */
const MAX_PAGINAS = 20;

/**
 * Trae una colección completa.
 *
 * La API ya respeta `perPage`, así que normalmente alcanza con una llamada. El
 * recorrido de páginas queda igual como red: si alguna colección creciera más
 * que `TODOS`, o si un recurso volviera a ignorar el tamaño de página, la lista
 * sigue llegando entera en vez de cortarse en silencio —que fue lo que pasó
 * cuando las tecnologías pasaron de ocho a diecisiete y se veían diez—.
 */
async function traerTodos<T>(path: string): Promise<T[]> {
  const items: T[] = [];

  for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
    const raw = await apiFetch<Api.Paginated<T>>(path, {
      params: { perPage: TODOS, page: pagina },
    });
    const { items: tanda, total } = normalizePage<T>(raw, TODOS);
    items.push(...tanda);
    if (!tanda.length || items.length >= total) break;
  }

  return items;
}

function porOrden<T extends { orden: number }>(a: T, b: T): number {
  return a.orden - b.orden;
}

export const getSectores = cached(
  async (): Promise<Dominio.Sector[]> => {
    const sectores = await traerTodos<Api.Sector>("/api/sectores");
    return sectores.map(aSector).sort(porOrden);
  },
  ["sectores"],
  { revalidate: TTL.catalogo, tags: ["sectores"] },
);

export async function getSectorPorSlug(
  slug: string,
): Promise<Dominio.Sector | null> {
  const sectores = await getSectores();
  return sectores.find((sector) => sector.slug === slug) ?? null;
}

export const getServicios = cached(
  async (): Promise<Dominio.Servicio[]> => {
    const servicios = await traerTodos<Api.Servicio>("/api/servicios");
    return servicios.map(aServicio).sort(porOrden);
  },
  ["servicios"],
  { revalidate: TTL.catalogo, tags: ["servicios"] },
);

export const getTecnologias = cached(
  async (): Promise<Dominio.Tecnologia[]> => {
    const tecnologias = await traerTodos<Api.Tecnologia>("/api/tecnologias");
    return tecnologias.map(aTecnologia);
  },
  ["tecnologias"],
  { revalidate: TTL.catalogo, tags: ["tecnologias"] },
);

export const getCooperativas = cached(
  async (): Promise<Dominio.Cooperativa[]> => {
    const cooperativas = await traerTodos<Api.Cooperativa>("/api/cooperativas");
    return cooperativas
      .map(aCooperativa)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  },
  ["cooperativas"],
  { revalidate: TTL.contenido, tags: ["cooperativas"] },
);

export const getAutoridades = cached(
  async (): Promise<Dominio.Autoridad[]> => {
    const consejo = await traerTodos<Api.Consejo>("/api/consejo");
    return consejo.map(aAutoridad);
  },
  ["consejo"],
  { revalidate: TTL.contenido, tags: ["consejo"] },
);

export const getOrganizaciones = cached(
  async (): Promise<Dominio.Organizacion[]> => {
    const organizaciones = await traerTodos<Api.Organizacion>(
      "/api/organizaciones",
    );
    return organizaciones.map(aOrganizacion);
  },
  ["organizaciones"],
  { revalidate: TTL.catalogo, tags: ["organizaciones"] },
);

/**
 * Métricas de la red que muestra la Home (+500 profesionales, +30 cooperativas,
 * +10 provincias). No hay endpoint de estadísticas, así que se derivan del
 * listado de cooperativas; si el backend agrega uno, se cambia solo esta función.
 */
export async function getMetricasRed(): Promise<{
  profesionales: number;
  cooperativas: number;
  provincias: number;
}> {
  const cooperativas = await getCooperativas();
  const provincias = new Set(
    cooperativas.map((coop) => coop.provincia).filter((p): p is string => !!p),
  );

  return {
    profesionales: cooperativas.reduce(
      (total, coop) => total + coop.asociados,
      0,
    ),
    cooperativas: cooperativas.length,
    provincias: provincias.size,
  };
}
