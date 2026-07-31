import { API_URL, getServiceToken, invalidateServiceToken } from '@/lib/api/tokens'
import { hasAllowedExtension } from '@/lib/media'

/**
 * Proxy autenticado de archivos.
 *
 * `GET /api/files/{filename}` de la API exige JWT, así que las imágenes no se
 * pueden poner en un `<img src>`. Este handler las pide con el token de servicio
 * y las devuelve al browser, que nunca ve la credencial.
 *
 * (Ojo: la ruta real de la API es `/api/files/...`; el OpenAPI la documenta como
 * `/files/...`, que responde 404.)
 */

/** Un año: los nombres de archivo de la API incluyen timestamp o son estables. */
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

export async function GET(_request: Request, ctx: RouteContext<'/api/media/[filename]'>) {
  const { filename } = await ctx.params

  if (!hasAllowedExtension(filename)) {
    return new Response('Extensión no permitida', { status: 400 })
  }

  // Evita que un filename con `../` o `/` se escape del endpoint de archivos.
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return new Response('Nombre de archivo inválido', { status: 400 })
  }

  const target = `${API_URL}/api/files/${encodeURIComponent(filename)}`

  const request = async (token: string) =>
    fetch(target, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })

  let token = await getServiceToken()
  let upstream = await request(token)

  if (upstream.status === 401) {
    invalidateServiceToken()
    token = await getServiceToken()
    upstream = await request(token)
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Archivo no encontrado', { status: upstream.status === 404 ? 404 : 502 })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
      'Cache-Control': CACHE_CONTROL,
    },
  })
}
