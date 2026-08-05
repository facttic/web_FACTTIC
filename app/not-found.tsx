import { BotonLink } from "@/components/ui/boton";
import { BandaCta } from "@/components/ui/seccion";
import { Animacion } from "@/components/ui/animacion";
import { MarcoPublico } from "@/components/layout/marco";
import { FONDOS } from "@/lib/animaciones";
import { ERROR_404 as T } from "@/lib/contenido";

export const metadata = { title: "Página no encontrada" };

/**
 * 404.
 *
 * Las dos maquetas no son la misma pantalla reacomodada: desktop alinea todo a
 * la izquierda y termina en el pie; mobile centra el bloque y suma una tarjeta
 * de cierre que invita a sumar la cooperativa.
 *
 * Trae puesto el marco del sitio: al vivir en la raíz de `app/` —donde tiene
 * que estar para atender cualquier URL inexistente— queda fuera del layout de
 * `(public)`, así que el encabezado y el pie los pone acá.
 *
 * Toda la decoración —el arco punteado, los planetas, el sol lila y el naranja
 * de la esquina— viene en la animación que entregó diseño: son 161 fotogramas
 * y los cuerpos se desplazan, así que la maqueta muestra un instante y no una
 * posición fija.
 *
 * Conserva su proporción propia (1000×887) para no deformar las órbitas, y se
 * ubica como en cada maqueta: en mobile a lo ancho y arriba del texto; en
 * desktop al costado derecho, con el texto a la izquierda. En los dos casos se
 * recorta por abajo, porque a lo ancho la composición mide 1277 de alto y
 * empujaría el texto fuera de la pantalla.
 */
export default function NotFound() {
  return (
    <MarcoPublico>
      <section className="relative isolate md:flex md:min-h-[700px] md:items-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden md:left-auto md:h-[640px] md:w-[62%]">
          <Animacion
            nombre={FONDOS.error404}
            className="aspect-[1000/887] w-full"
          />
        </div>

        <div className="contenedor pt-72 pb-16 md:w-full md:py-24">
          <div className="text-center md:text-left">
            <h1 className="text-h1">{T.titulo}</h1>
            <p className="text-p1 mx-auto mt-6 max-w-xl text-blanco/80 md:mx-0">
              {T.texto}
            </p>
            <BotonLink
              href={T.cta.href}
              className="mt-10 w-full md:w-auto md:min-w-56"
            >
              {T.cta.texto}
            </BotonLink>
          </div>
        </div>
      </section>

      {/* La tarjeta de cierre existe solo en la maqueta mobile. */}
      <div className="contenedor pb-12 md:hidden">
        <BandaCta
          variante="vidrio"
          titulo={T.cierre.titulo}
          accion={
            <BotonLink href={T.cierre.cta.href}>{T.cierre.cta.texto}</BotonLink>
          }
        />
      </div>
    </MarcoPublico>
  );
}
