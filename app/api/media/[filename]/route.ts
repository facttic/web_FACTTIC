import {
  API_URL,
  getServiceToken,
  invalidateServiceToken,
} from "@/lib/api/tokens";
import { hasAllowedExtension } from "@/lib/media";

/**
 * Proxy de archivos.
 *
 * Los archivos se piden **sin credencial**: `GET /api/files/{filename}` es
 * público desde que el backend abrió las lecturas, igual que el resto de los
 * GET. Si alguno respondiera 401 se reintenta una vez con el token de servicio,
 * así el sitio sigue en pie si el backend vuelve a cerrarlos.
 *
 * Que el proxy siga existiendo no es por la autenticación: normaliza los nombres
 * de archivo que la base guarda de tres formas distintas, filtra extensiones y
 * agrega el `Cache-Control` que la API no manda.
 *
 * (Ojo: la ruta real de la API es `/api/files/...`; el OpenAPI la documenta como
 * `/files/...`, que responde 404.)
 */

/** Un año: los nombres de archivo de la API incluyen timestamp o son estables. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/media/[filename]">,
) {
  const { filename } = await ctx.params;

  if (!hasAllowedExtension(filename)) {
    return new Response("Extensión no permitida", { status: 400 });
  }

  // Evita que un filename con `../` o `/` se escape del endpoint de archivos.
  if (
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return new Response("Nombre de archivo inválido", { status: 400 });
  }

  const target = `${API_URL}/api/files/${encodeURIComponent(filename)}`;

  const pedir = async (token?: string) =>
    fetch(target, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

  let upstream = await pedir();

  if (upstream.status === 401) {
    /*
     * El backend volvió a cerrar los archivos. Se reintenta con la credencial
     * de servicio, que puede no estar configurada —el sitio anda sin ella—, así
     * que el fallo se traga y queda el 401 original.
     */
    try {
      invalidateServiceToken();
      upstream = await pedir(await getServiceToken());
    } catch {
      // Sin credencial no hay segundo intento.
    }
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Archivo no encontrado", {
      status: upstream.status === 404 ? 404 : 502,
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
