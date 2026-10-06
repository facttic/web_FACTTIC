import type { Metadata } from "next";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { Animacion } from "@/components/ui/animacion";
import { CardSector } from "@/components/tarjetas/sector";
import {
  CardMetodologia,
  CardPropuesta,
} from "@/components/tarjetas/servicios";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import { Metodologias } from "@/components/secciones/metodologias";
import { Aliados } from "@/components/secciones/aliados";
import { FONDOS } from "@/lib/animaciones";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import {
  getClientesConLogo,
  getSectoresDestacados,
  getServiciosDestacados,
} from "@/lib/datos/catalogos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}): Promise<Metadata> {
  const T = contenido((await params).idioma).SERVICIOS_PAGINA;
  return { title: T.hero.titulo, description: T.hero.bajada };
}

/**
 * Nuestros servicios.
 *
 * Los sectores, los servicios —con su descripción y sus subservicios— y los
 * logos de "Eligen soluciones cooperativas" son los clientes de los proyectos,
 * que es lo que dice el título; lo fijo está en `lib/contenido.ts`.
 *
 * Dos bloques cambian de forma entre las maquetas, como pasa en la Home:
 * la metodología es tres bloques de color en desktop y un carrusel con
 * descripción en mobile, y las tarjetas de "¿Por qué elegirnos?" se desplazan
 * de costado en pantallas chicas.
 */
export default async function NuestrosServiciosPage({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}) {
  const { idioma } = await params;
  const T = contenido(idioma).SERVICIOS_PAGINA;
  // Las verticales y los servicios de la Federación, no los de cada coop.
  const [sectores, servicios, aliados] = await Promise.all([
    getSectoresDestacados(idioma),
    getServiciosDestacados(idioma),
    getClientesConLogo(),
  ]);

  return (
    <>
      {/* El hero de esta pantalla no lleva video. El fondo animado que entregó
          diseño aparece solo en mobile: el prototipo desktop lo deja liso. */}
      {/*
        El sol no se corta contra el bloque de abajo: lo que sobra del dibujo
        sigue de largo por detrás de "Nuestras soluciones", apagándose. Antes
        el `overflow-hidden` lo partía con una recta justo donde termina el
        hero, y se veía el arco punteado cortado al medio.

        Por eso la sección va con `-z-10` y sin `isolate`, igual que el lema de
        la Home: aislarla la volvía un contexto propio y el sol quedaba pintado
        por encima de la sección siguiente en vez de pasarle por debajo. El
        recorte horizontal queda —`overflow-x-clip`, que no arrastra el eje
        vertical—: el dibujo mide 1024 y la pantalla 393.
      */}
      <section className="relative -z-10 overflow-x-clip">
        {/* Cruza todo el ancho y se apoya contra el borde de arriba: en el
            board los rayos se ven por detrás de la barra. */}
        <Animacion
          nombre={FONDOS.servicios}
          className="sol-del-hero pointer-events-none absolute -top-[39rem] left-1/2 -z-10 size-[64rem] -translate-x-1/2 blur-[2px] md:hidden"
        />
        {/* El hero respira más abajo que el resto de las secciones: en el
            board hay 121px entre la última línea de la bajada y el rótulo de
            la sección que sigue. */}
        <Seccion className="pt-24 pb-20 md:pt-40 md:pb-16">
          <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
          {/* En mobile el archivo la escribe en `P1/Bold` —DM Mono 16— y sin
              balancear: los renglones cortan a lo ancho de la columna. */}
          <p className="text-p1-bold mt-6 max-w-xl text-blanco/80 md:text-p1 md:text-balance">
            {T.hero.bajada}
          </p>
        </Seccion>
      </section>

      {servicios.length ? (
        <Seccion id="soluciones">
          <BloqueDesplegable
            rotulo={T.soluciones.rotulo}
            titulo={T.soluciones.titulo}
            items={servicios.map((s) => ({
              id: s.id,
              titulo: s.nombre,
              descripcion: s.descripcion,
              detalle: s.subservicios.map((sub) => sub.nombre).join(" · "),
            }))}
          />
        </Seccion>
      ) : null}

      {sectores.length ? (
        <Seccion id="verticales">
          {/* El rótulo cambia entre maquetas: "Verticales" en desktop e
              "Industrias" en mobile. */}
          <EncabezadoSeccion
            rotulo={T.sectores.rotulo}
            rotuloMobile={T.sectores.rotuloMobile}
            titulo={T.sectores.titulo}
            tituloMobile={T.sectores.tituloMobile}
            descripcion={T.sectores.descripcion}
            descripcionAlLado
          />
          {/*
            Una tarjeta abajo de la otra en mobile —como en la Home— y tres en
            fila en desktop.

            Antes en mobile eran un mazo apilado: de las tapadas asomaba un
            canto de 37px sin texto y no se entendía que hubiera más de una
            industria. La caja va en los dos anchos, que es lo que separa una
            tarjeta de la siguiente.
          */}
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {sectores.map((sector, i) => (
              <CardSector
                key={sector.id}
                sector={sector}
                indice={i}
                conCaja
                href={`/nuestros-servicios/${sector.slug}`}
              />
            ))}
          </div>
        </Seccion>
      ) : null}

      <Seccion id="metodologias">
        <EncabezadoSeccion
          rotulo={T.metodologia.rotulo}
          rotuloMobile={T.metodologia.rotuloMobile}
          titulo={T.metodologia.titulo}
        />

        {/* Tres bloques de color en desktop. */}
        <div className="hidden gap-5 md:grid md:grid-cols-3">
          {T.metodologia.items.map((item) => (
            <CardMetodologia
              key={item.titulo}
              nombre={item.titulo}
              descripcion={item.descripcion ?? undefined}
              acento={item.acento}
              className="h-[263px] whitespace-pre-line"
            />
          ))}
        </div>

        {/* Carrusel con la descripción en mobile. */}
        <Metodologias items={T.metodologia.items} className="md:hidden" />
      </Seccion>

      {/*
        Hasta el board de agosto esta banda iba en mobile sobre un sol naranja
        y alineada a la izquierda. El archivo nuevo la deja igual que las otras:
        punteada, centrada y sin fondo. Solo cambia el cuerpo del título, que
        acá entra en tres renglones y va un escalón más chico.
      */}
      <div className="pt-8 pb-12 md:pt-0 md:pb-16">
        <div className="contenedor">
          <BandaCta
            claseTitulo="text-h3 md:text-h2"
            titulo={T.metodologia.cierre.titulo}
            accion={
              <>
                <BotonLink
                  href={T.metodologia.cierre.ctaMobile.href}
                  className="md:hidden"
                >
                  {T.metodologia.cierre.ctaMobile.texto}
                </BotonLink>
                <BotonLink
                  href={T.metodologia.cierre.cta.href}
                  className="hidden md:inline-flex"
                >
                  {T.metodologia.cierre.cta.texto}
                </BotonLink>
              </>
            }
          />
        </div>
      </div>

      <Seccion id="por-que">
        <EncabezadoSeccion
          rotulo={T.porQue.rotulo}
          titulo={T.porQue.titulo}
          descripcion={T.porQue.descripcion}
          descripcionAlLado
        />
        {/* Con flechas y pasando solo, como el resto de los carruseles del
            sitio: en mobile entra una tarjeta por vez y sin nada que indique
            que hay más, las otras tres no existían. */}
        <CarruselConFlechas grilla="md:grid-cols-4" gap="gap-5" automatico>
          {T.porQue.items.map((item) => (
            <CardPropuesta
              key={item.titulo}
              titulo={item.titulo}
              descripcion={item.descripcion}
              acento={item.acento}
              className="h-[265px] w-[287px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </CarruselConFlechas>
      </Seccion>

      {aliados.length ? (
        <Seccion className="pb-0">
          <EncabezadoSeccion
            rotulo={T.aliados.rotulo}
            titulo={T.aliados.titulo}
            tamanoTitulo="h2"
            // Centrado solo en desktop: el board mobile lo alinea a la
            // izquierda, como el resto de los encabezados de la pantalla.
            alineacion="centro-en-desktop"
          />
        </Seccion>
      ) : null}
      {aliados.length ? (
        /* La cinta va fuera del contenedor: los logos entran y salen por los
           bordes de la pantalla. */
        <Aliados logos={aliados} className="pb-12 md:pb-16" />
      ) : null}

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
