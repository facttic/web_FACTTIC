/**
 * Resolución de URLs de archivos.
 *
 * Las imágenes de la API viven en `/api/files/{filename}` y requieren token, así
 * que no se pueden linkear directo desde el browser: se sirven a través del
 * proxy en `/api/media/{filename}`.
 *
 * Además, la base guarda estas referencias de forma inconsistente. Hay al menos
 * tres formas conviviendo en el mismo campo:
 *
 *   - nombre suelto:  "organizaciones.png"
 *   - URL absoluta:   "http://facttic-web.it10.com.ar/files/red_marker.png"
 *   - ruta rota:      "http://facttic-web.it10.com.ar/files/undefined/logo.png"
 *
 * `mediaUrl()` normaliza los tres casos y devuelve null cuando no hay nada
 * usable, para que el consumidor decida el fallback.
 */

/** Extensiones que la API admite y que el proxy deja pasar. */
export const ALLOWED_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'svg',
  'mp4',
  'webm',
  'mov',
  'json',
] as const

export function hasAllowedExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return !!ext && (ALLOWED_EXTENSIONS as readonly string[]).includes(ext)
}

/**
 * Convierte lo que haya guardado la API en una URL servible por el sitio.
 * Devuelve null si el valor está vacío, roto o apunta a algo no permitido.
 */
export function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  let filename = trimmed

  // Si vino como URL, nos quedamos con el último segmento del path.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const { pathname } = new URL(trimmed)
      filename = pathname.split('/').filter(Boolean).pop() ?? ''
    } catch {
      return null
    }
  }

  // Descarta rutas que quedaron mal armadas del lado del backoffice.
  if (!filename || filename === 'undefined' || filename === 'null') return null
  if (!hasAllowedExtension(filename)) return null

  return `/api/media/${encodeURIComponent(filename)}`
}

/** Primera imagen utilizable de una lista, o null si ninguna sirve. */
export function firstMediaUrl(values: string[] | null | undefined): string | null {
  for (const value of values ?? []) {
    const url = mediaUrl(value)
    if (url) return url
  }
  return null
}
