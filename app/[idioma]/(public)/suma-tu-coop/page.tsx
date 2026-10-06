import type { Metadata } from "next";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import { CardRequisito } from "@/components/tarjetas/servicios";
import { CardOportunidad } from "@/components/tarjetas/bloques";
import { Estrella } from "@/components/ui/formas";
import { Animacion } from "@/components/ui/animacion";
import { FONDOS } from "@/lib/animaciones";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { metadatosDe } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  const T = contenido(idioma).SUMA_TU_COOP;
  return metadatosDe({
    idioma,
    ruta: "/suma-tu-coop",
    titulo: T.hero.titulo,
    descripcion: T.hero.bajada,
  });
}

/**
 * Sumá tu coop.
 *
 * No consulta la API: es la pantalla institucional para cooperativas que
 * quieren federarse, toda de contenido fijo. La estructura repite el patrón de
 * la columna de 352px con el contenido a la derecha que usan Servicios y las
 * verticales.
 */
export default async function SumaTuCoopPage({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}) {
  const { idioma } = await params;
  const { HOME, SUMA_TU_COOP: T } = contenido(idioma);

  // Los mismos beneficios de la Home, en el orden propio de esta pantalla.
  const oportunidades = T.oportunidades.orden
    .map((titulo) =>
      HOME.beneficios.items.find((item) => item.titulo === titulo),
    )
    .filter((item) => item !== undefined);

  return (
    <>
      {/* El sol con su órbita punteada, arriba a la derecha del hero.

          Es la misma animación que el hero de Servicios —"02-Para empresas" en
          la entrega—: lo confirmó QA, así que la forma dibujada a mano que se
          usaba mientras el fondo no llegaba ya no hace falta.

          Las medidas salen de calzar la órbita sobre la maqueta: queda un
          círculo de 458 centrado en (1115, 190) de la página, o sea que su
          arco superior pasa por detrás del encabezado, que es transparente. La
          sección no puede recortar, o el círculo se corta arriba. */}
      <section className="relative isolate">
        <Animacion
          nombre={FONDOS.servicios}
          className="pointer-events-none absolute -top-[123px] right-[89px] -z-10 hidden size-[477px] md:block"
        />
        {/* El mismo sol, mucho más chico: en el board mobile la órbita mide 188
            y su arco de arriba también pasa por detrás del encabezado. */}
        <Animacion
          nombre={FONDOS.servicios}
          className="pointer-events-none absolute -top-[50px] right-[40px] -z-10 size-[196px] md:hidden"
        />
        <Seccion className="pt-44 md:pt-40">
          {/* Un escalón más chico en mobile: el board lo escribe en `H1/Mobile`
              y no en el display, que es el cuerpo de desktop. */}
          <h1 className="text-h1 md:text-display whitespace-pre-line">
            {T.hero.titulo}
          </h1>
          <p className="text-p1-bold md:text-p1 mt-6 max-w-2xl text-blanco/80">
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
          descripcion={T.compromisos.bajada}
          tamanoTitulo="h2"
        />
        {/* Al pasar el mouse pierden el relleno gris y quedan con el borde
            blanco: son las dos variantes del componente en el board.

            Van en carrusel en los dos anchos, con flechas: son seis, y en
            grilla de tres quedaban en dos filas. En desktop entran tres a la
            vista y las otras se pasan. */}
        <CarruselConFlechas grilla="" gap="gap-5" desdeAncho="nunca" automatico>
          {T.compromisos.items.map((titulo, i) => (
            <CardRequisito
              key={`${titulo}-${i}`}
              titulo={<span className="whitespace-pre-line">{titulo}</span>}
              /* Alto mínimo y no fijo: el compromiso más largo necesita una
                 línea más en mobile, y así crece la fila entera pareja en vez
                 de recortarlo. */
              /* Tres a la vista en desktop: 394 es lo que queda de los 1223
                 del contenedor repartidos en tres con 20 de aire. */
              className="min-h-[135px] w-[287px] shrink-0 snap-start md:w-[394px]"
            />
          ))}
        </CarruselConFlechas>
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

        {/* En mobile el board muestra una tarjeta por vez, pintada y con todo
            desplegado, y se pasan con las flechas. */}
        <CarruselConFlechas
          grilla=""
          gap="gap-5"
          className="md:hidden"
          automatico
        >
          {T.camino.items.map((item, i) => (
            <CardOportunidad
              key={item.pregunta}
              indice={i}
              pregunta={item.pregunta}
              descripcion={item.descripcion}
              enlace={item.enlace}
              acento={item.acento}
              desplegada
              className="w-full shrink-0 snap-start"
            />
          ))}
        </CarruselConFlechas>

        {/* Al pasar el mouse la tarjeta crece y se vuelve gris con la
            explicación, como en el prototipo. Alineadas arriba para que al
            estirarse una no se estiren las tres. */}
        <div className="hidden items-start gap-5 md:grid md:grid-cols-3">
          {T.camino.items.map((item, i) => (
            <CardOportunidad
              key={item.pregunta}
              indice={i}
              pregunta={item.pregunta}
              descripcion={item.descripcion}
              enlace={item.enlace}
              acento={item.acento}
              enMobile={"vidrioEnMobile" in item ? "vidrio" : undefined}
            />
          ))}
        </div>
      </Seccion>

      <div className="contenedor pb-12 md:pb-16">
        <BandaCta
          titulo={T.cierre.titulo}
          accion={
            <BotonLink href={T.cierre.cta.href}>{T.cierre.cta.texto}</BotonLink>
          }
        />
      </div>
    </>
  );
}
