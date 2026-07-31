import { getSectores, getServicios, getTecnologias } from '@/lib/api/resources/catalogos'
import { mediaUrl } from '@/lib/media'

/**
 * Página de verificación del andamiaje: confirma que el login, el token, el
 * fetch autenticado y el proxy de imágenes funcionan de punta a punta.
 * Se borra cuando el sitio real esté armado.
 */
export default async function DebugPage() {
  const [sectores, servicios, tecnologias] = await Promise.all([
    getSectores(),
    getServicios(),
    getTecnologias(),
  ])

  return (
    <main className="mx-auto max-w-3xl space-y-10 p-10 font-mono text-sm">
      <header>
        <h1 className="text-2xl font-bold">Verificación de la conexión con la API</h1>
        <p className="mt-1 opacity-60">
          Si ves los tres sectores y la imagen carga, el flujo completo anda.
        </p>
      </header>

      <section>
        <h2 className="mb-2 font-bold">Sectores ({sectores.length})</h2>
        <ul className="space-y-2">
          {sectores.map((sector) => {
            const src = mediaUrl(sector.imageFileName)
            return (
              <li key={sector._id} className="flex items-center gap-3">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="size-10 rounded object-cover" />
                ) : (
                  <span className="grid size-10 place-items-center rounded border opacity-40">
                    —
                  </span>
                )}
                <span>
                  {sector.orden}. {sector.nombre}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Servicios ({servicios.length})</h2>
        <ul className="space-y-1">
          {servicios.map((servicio) => (
            <li key={servicio._id}>
              {servicio.orden}. {servicio.nombre}
              {servicio.subservicios?.length ? (
                <span className="opacity-60">
                  {' '}
                  — {servicio.subservicios.map((s) => s.nombre).join(' · ')}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Tecnologías ({tecnologias.length})</h2>
        <p className="opacity-60">{tecnologias.map((t) => t.nombre).join(' · ')}</p>
      </section>
    </main>
  )
}
