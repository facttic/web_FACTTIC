import { requerirSesion } from "@/lib/api/guardia";
import { getCooperativas } from "@/lib/datos/catalogos";
import { provinciaDe } from "@/lib/mapa/provincias";
import { cn } from "@/lib/cn";

export const metadata = { title: "Cooperativas" };

/**
 * Listado de cooperativas.
 *
 * Muestra de un vistazo qué le falta a cada una, que es lo que hoy tiene el
 * sitio a medio cargar: sin ubicación no aparece en el mapa federal, sin logo
 * la tarjeta muestra el nombre, y sin servicios ni sectores el panel de
 * provincia queda flojo.
 */
export default async function CooperativasPage() {
  await requerirSesion();
  const cooperativas = await getCooperativas();

  const conProvincia = cooperativas.map((coop) => ({
    ...coop,
    provincia: coop.ubicacion
      ? provinciaDe(coop.ubicacion.lat, coop.ubicacion.lng)
      : null,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h2">Cooperativas</h1>
          <p className="text-p2 mt-2 text-blanco/60">
            {cooperativas.length} cargadas
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-borde">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-borde bg-superficie">
            <tr className="text-eyebrow text-blanco/40">
              <th className="px-4 py-3 font-normal">Nombre</th>
              <th className="px-4 py-3 font-normal">Provincia</th>
              <th className="px-4 py-3 font-normal">Asociadxs</th>
              <th className="px-4 py-3 font-normal">Servicios</th>
              <th className="px-4 py-3 font-normal">Logo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {conProvincia.map((coop) => (
              <tr
                key={coop.id}
                className="transition-colors hover:bg-superficie"
              >
                <td className="text-p2 px-4 py-3">{coop.nombre}</td>
                <td className="text-p3 px-4 py-3">
                  <Dato hay={!!coop.provincia}>
                    {coop.provincia ?? "sin ubicación"}
                  </Dato>
                </td>
                <td className="text-p3 px-4 py-3">
                  <Dato hay={coop.asociados > 0}>{coop.asociados || "—"}</Dato>
                </td>
                <td className="text-p3 px-4 py-3">
                  <Dato hay={coop.servicios.length > 0}>
                    {coop.servicios.length || "—"}
                  </Dato>
                </td>
                <td className="text-p3 px-4 py-3">
                  <Dato hay={!!coop.logo}>{coop.logo ? "sí" : "falta"}</Dato>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-p3 mt-4 text-blanco/40">
        La edición se agrega en el próximo paso; por ahora esta pantalla sirve
        para ver qué falta cargar.
      </p>
    </div>
  );
}

/** Lo que falta se ve apagado, para que la tabla se lea de un vistazo. */
function Dato({ hay, children }: { hay: boolean; children: React.ReactNode }) {
  return (
    <span className={cn(hay ? "text-blanco/70" : "text-blanco/25")}>
      {children}
    </span>
  );
}
