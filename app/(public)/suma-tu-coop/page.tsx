import type { Metadata } from "next";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import { CardRequisito } from "@/components/tarjetas/servicios";
import { CardOportunidad } from "@/components/tarjetas/bloques";
import { Estrella, SolConOrbita } from "@/components/ui/formas";
import { HOME, SUMA_TU_COOP as T } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Sumá tu coop",
  description: T.hero.bajada,
};

/**
 * Sumá tu coop.
 *
 * No consulta la API: es la pantalla institucional para cooperativas que
 * quieren federarse, toda de contenido fijo. La estructura repite el patrón de
 * la columna de 352px con el contenido a la derecha que usan Servicios y las
 * verticales.
 */
export default function SumaTuCoopPage() {
  // Los mismos beneficios de la Home, en el orden propio de esta pantalla.
  const oportunidades = T.oportunidades.orden
    .map((titulo) =>
      HOME.beneficios.items.find((item) => item.titulo === titulo),
    )
    .filter((item) => item !== undefined);

  return (
    <>
      {/* El sol con su órbita punteada, arriba a la derecha del hero. Es Verde
          (#8E8001), medido sobre el archivo, no el amarillo lima.

          Va donde lo pone la maqueta: la órbita ocupa de 0 a 500 de la página
          —o sea que su arco superior pasa por detrás del encabezado, que es
          transparente— y termina 107px antes de "Sumate a FACTTIC". La
          sección no puede recortar, o el círculo se corta arriba y abajo.

          El fondo animado de esta página no vino en la entrega: mientras
          tanto va esta versión propia con las formas de la identidad. */}
      <section className="relative isolate">
        <SolConOrbita className="pointer-events-none absolute -top-18 right-22 -z-10 hidden w-[500px] text-verde md:block" />
        <Seccion className="pt-32 md:pt-40">
          <h1 className="text-display whitespace-pre-line">{T.hero.titulo}</h1>
          <p className="text-p1 mt-6 max-w-2xl text-blanco/80">
            {T.hero.bajada}
          </p>
        </Seccion>
      </section>

      <Seccion>
        <div className="grid gap-8 md:grid-cols-[352px_1fr] md:gap-16">
          <h2 className="text-h2">
            <span className="text-eyebrow mb-3 block text-blanco/40">
              {T.sumate.rotulo}
            </span>
            {T.sumate.titulo}
          </h2>
          <div>
            <p className="text-p1 text-blanco/80">{T.sumate.texto}</p>
            <BotonLink
              href={T.sumate.cta.href}
              className="mt-8 w-full md:w-auto"
            >
              {T.sumate.cta.texto}
            </BotonLink>
          </div>
        </div>
      </Seccion>

      <Seccion>
        <BloqueDesplegable
          rotulo={T.oportunidades.rotulo}
          titulo={T.oportunidades.titulo}
          tamano="h2"
          items={oportunidades.map((item) => ({
            id: item.titulo,
            titulo: item.titulo,
            descripcion: item.descripcion,
          }))}
        />
      </Seccion>

      <Seccion>
        <EncabezadoSeccion
          rotulo={T.compromisos.rotulo}
          titulo={T.compromisos.titulo}
          tamanoTitulo="h2"
        />
        {/* Al pasar el mouse pierden el relleno gris y quedan con el borde
            blanco: son las dos variantes del componente en el board. Cuatro en
            fila en desktop; en mobile se desplazan de costado. */}
        <Carrusel grilla="md:grid-cols-4" gap="gap-5">
          {T.compromisos.items.map((titulo, i) => (
            <CardRequisito
              key={`${titulo}-${i}`}
              titulo={<span className="whitespace-pre-line">{titulo}</span>}
              className="h-[135px] w-[287px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </Carrusel>
      </Seccion>

      <Seccion>
        <div className="grid gap-8 md:grid-cols-[352px_1fr] md:gap-16">
          <h2 className="text-h2 whitespace-pre-line">{T.codigo.titulo}</h2>
          <div>
            <p className="text-p1 max-w-2xl text-blanco/80">{T.codigo.texto}</p>
            <BotonLink
              href={T.codigo.cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full md:w-auto"
            >
              {T.codigo.cta.texto}
            </BotonLink>
          </div>
        </div>
      </Seccion>

      <Seccion className="relative isolate overflow-hidden">
        {/* La estrella naranja que la maqueta mobile pone detrás de las
            tarjetas y que se ve a través de la segunda, que es de vidrio. En
            desktop esta zona va limpia.

            Mide 210 y su centro cae en el hueco entre la primera y la segunda
            tarjeta, asomando por el borde derecho: son las medidas del PNG
            —núcleo de 211 a 392 a lo ancho y de 2667 a 2877 a lo alto—. */}
        <Estrella className="pointer-events-none absolute top-[421px] -right-4 -z-10 w-[210px] text-naranja md:hidden" />

        <EncabezadoSeccion titulo={T.camino.titulo} tamanoTitulo="h2" />
        {/* Al pasar el mouse la tarjeta crece y se vuelve gris con la
            explicación, como en el prototipo. Alineadas arriba para que al
            estirarse una no se estiren las tres. */}
        <div className="grid items-start gap-5 md:grid-cols-3">
          {T.camino.items.map((item, i) => (
            <CardOportunidad
              key={item.pregunta}
              indice={i}
              pregunta={item.pregunta}
              descripcion={item.descripcion}
              enlace={item.enlace}
              acento={item.acento}
              vidrioEnMobile={"vidrioEnMobile" in item}
            />
          ))}
        </div>
      </Seccion>

      <div className="contenedor pb-12 md:pb-16">
        {/* Las maquetas difieren: mobile la dibuja de vidrio y desktop con el
            borde punteado y el botón al costado. */}
        <BandaCta
          variante="vidrio-en-mobile"
          titulo={T.cierre.titulo}
          accion={
            <BotonLink href={T.cierre.cta.href}>{T.cierre.cta.texto}</BotonLink>
          }
        />
      </div>
    </>
  );
}
