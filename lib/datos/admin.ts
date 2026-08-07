import "server-only";

import { apiFetch, normalizePage, sanitize } from "@/lib/api/client";
import type * as Api from "@/lib/api/esquema";
import { mediaUrl } from "@/lib/media";
import type { RegistroSimple } from "@/components/admin/abm-simple";

/**
 * Lectura para el panel, sin cache.
 *
 * El sitio público cachea una hora, pero el panel tiene que mostrar lo que
 * acaba de guardarse: si leyera de la misma cache, alguien cargaría algo y no
 * lo vería en la lista.
 */
export async function traerSimples(recurso: string): Promise<RegistroSimple[]> {
  const raw = await apiFetch<Api.Paginated<Record<string, unknown>>>(
    `/api/${recurso}`,
    { params: { perPage: 200, page: 1 } },
  );
  const { items } = normalizePage<Record<string, unknown>>(raw, 200);

  return sanitize(items).map((item) => ({
    id: String(item._id),
    nombre: String(item.nombre ?? "").trim(),
    logo: mediaUrl((item.fileName as string) ?? (item.logo as string) ?? null),
  }));
}

export async function traerSimple(
  recurso: string,
  id: string,
): Promise<RegistroSimple | null> {
  try {
    const item = sanitize(
      await apiFetch<Record<string, unknown>>(`/api/${recurso}/${id}`),
    );
    return {
      id: String(item._id),
      nombre: String(item.nombre ?? "").trim(),
      logo: mediaUrl(
        (item.fileName as string) ?? (item.logo as string) ?? null,
      ),
    };
  } catch {
    return null;
  }
}
