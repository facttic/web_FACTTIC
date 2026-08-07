import { Animacion } from "@/components/ui/animacion";
import { Seccion } from "@/components/ui/seccion";
import { FONDOS } from "@/lib/animaciones";

/**
 * Página de diagnóstico, temporal.
 *
 * Firefox dibuja un rectángulo opaco dentro de las tarjetas de vidrio cuando
 * detrás pasa una forma de color, y no se reproduce en headless —hace falta la
 * GPU—, así que hay que mirarlo a ojo en el navegador. Cada tarjeta apaga una
 * capa distinta para ver cuál lo causa.
 *
 * Copia la pantalla de Contacto tal cual, con la tarjeta centrada: si no se
 * superpone con la esfera no hay nada que atravesar y la prueba no dice nada.
 * Se borra cuando esté resuelto.
 */
export const metadata = { title: "Prueba de vidrio", robots: { index: false } };

const CASOS = [
  { titulo: "A · como está hoy", clases: "borde-degradado textura-ruido" },
  { titulo: "B · sin el borde con degradado", clases: "textura-ruido" },
  { titulo: "C · sin la textura de ruido", clases: "borde-degradado" },
  { titulo: "D · sin borde ni textura", clases: "" },
];

/** El mismo vidrio de Contacto: fondo semitransparente y desenfoque detrás. */
const VIDRIO =
  "relative rounded-2xl bg-superficie/60 p-6 py-10 backdrop-blur-xl md:mx-auto md:w-[640px] md:p-12";

export default function PruebaVidrioPage() {
  return (
    <div className="pb-24">
      <p className="contenedor text-p2 pt-12 text-blanco/60">
        Cada bloque repite la tarjeta de Contacto con una capa menos. Mirá en
        cuál desaparece el rectángulo dentro de la tarjeta.
      </p>

      {CASOS.map((caso) => (
        <section key={caso.titulo} className="relative isolate overflow-hidden">
          <div className="contenedor pointer-events-none absolute inset-x-0 top-0 -z-10">
            <Animacion
              nombre={FONDOS.contacto}
              className="absolute top-0 -right-16 aspect-square w-[420px] animate-acercar md:top-4 md:w-[620px]"
            />
          </div>

          <Seccion className="py-10">
            <div className={`${caso.clases} ${VIDRIO}`}>
              <h2 className="text-h4">{caso.titulo}</h2>
              <p className="text-p3 mt-3 text-blanco/50">
                {caso.clases || "solo el vidrio"}
              </p>
              <div className="mt-8 h-40 rounded-lg border border-borde" />
            </div>
          </Seccion>
        </section>
      ))}

      {/* Sin backdrop-filter: si acá tampoco aparece, el filtro es el problema. */}
      <section className="relative isolate overflow-hidden">
        <div className="contenedor pointer-events-none absolute inset-x-0 top-0 -z-10">
          <Animacion
            nombre={FONDOS.contacto}
            className="absolute top-0 -right-16 aspect-square w-[420px] animate-acercar md:top-4 md:w-[620px]"
          />
        </div>
        <Seccion className="py-10">
          <div className="borde-degradado textura-ruido relative rounded-2xl bg-superficie/60 p-6 py-10 md:mx-auto md:w-[640px] md:p-12">
            <h2 className="text-h4">E · sin backdrop-filter</h2>
            <p className="text-p3 mt-3 text-blanco/50">
              todas las capas, pero sin desenfocar el fondo
            </p>
            <div className="mt-8 h-40 rounded-lg border border-borde" />
          </div>
        </Seccion>
      </section>
    </div>
  );
}
