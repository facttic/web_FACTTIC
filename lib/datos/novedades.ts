import "server-only";

import { apiFetch, normalizePage } from "@/lib/api/client";
import type * as Api from "@/lib/api/esquema";
import { aNovedad } from "@/lib/dominio/adaptadores";
import type * as Dominio from "@/lib/dominio/tipos";
import { TTL, cached } from "./cache";

/**
 * Novedades: comunicados, noticias y actividades.
 *
 * Viven en un solo recurso y se distinguen por `tipo`. La API no ofrece
 * filtrarlas por ese campo, así que se traen y se filtran acá; son pocas y
 * conviene menos ir y volver por cada solapa. Cuando el backend acepte
 * `?tipo=`, se pasa el filtro en `params` y se borra el `filter`.
 */

const POR_PAGINA = 6;

async function traerNovedades(
  cantidad: number,
): Promise<Dominio.Pagina<Dominio.Novedad>> {
  const raw = await apiFetch<Api.Paginated<Api.Novedad>>("/api/novedades", {
    params: { perPage: cantidad, page: 1, sort: "fecha", order: "DESC" },
  });
  const pagina = normalizePage<Api.Novedad>(raw, cantidad);

  return {
    items: pagina.items.map(aNovedad),
    total: pagina.total,
    pagina: pagina.page,
    porPagina: pagina.perPage,
    paginas: pagina.pages,
  };
}

export function getNovedades(
  cantidad = POR_PAGINA,
): Promise<Dominio.Pagina<Dominio.Novedad>> {
  return cached(traerNovedades, ["novedades", String(cantidad)], {
    revalidate: TTL.contenido,
    tags: ["novedades"],
  })(cantidad);
}

/** Una novedad por su identificador de URL, que hoy es el id. */
export function getNovedad(slug: string): Promise<Dominio.Novedad | null> {
  return cached(
    async (id: string) => {
      try {
        return aNovedad(await apiFetch<Api.Novedad>(`/api/novedades/${id}`));
      } catch {
        return null;
      }
    },
    ["novedad", slug],
    { revalidate: TTL.contenido, tags: ["novedades", `novedad:${slug}`] },
  )(slug);
}
