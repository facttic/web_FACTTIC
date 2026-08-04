import type { Metadata } from "next";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { Animacion } from "@/components/ui/animacion";
import { CardSector } from "@/components/tarjetas/sector";
import {
  CardMetodologia,
  CardPropuesta,
} from "@/components/tarjetas/servicios";
import { Soluciones } from "@/components/secciones/soluciones";
import { SectoresMobile } from "@/components/secciones/sectores-mobile";
import { Metodologias } from "@/components/secciones/metodologias";
import { Aliados } from "@/components/secciones/aliados";
import { FONDOS } from "@/lib/animaciones";
import { SERVICIOS_PAGINA as T } from "@/lib/contenido";
import {
  getOrganizaciones,
  getSectores,
  getServicios,
} from "@/lib/datos/catalogos";

export const metadata: Metadata = {
  title: "Nuestros servicios",
  description: T.hero.bajada,
};

/**
 * Nuestros servicios.
 *
 * Los sectores, los servicios —con su descripción y sus subservicios— y los
 * logos de aliados salen de la API; lo fijo está en `lib/contenido.ts`.
 *
 * Dos bloques cambian de forma entre las maquetas, como pasa en la Home:
 * la metodología es tres bloques de color en desktop y un carrusel con
 * descripción en mobile, y las tarjetas de "¿Por qué elegirnos?" se desplazan
 * de costado en pantallas chicas.
 */
export default async function NuestrosServiciosPage() {
  const [sectores, servicios, aliados] = await Promise.all([
    getSectores(),
    getServicios(),
    getOrganizaciones(),
  ]);

  return (
    <>
      {/* El hero de esta pantalla no lleva video. El fondo animado que entregó
          diseño aparece solo en mobile: el prototipo desktop lo deja liso. */}
      <section className="relative isolate overflow-hidden">
        <Animacion
          nombre={FONDOS.servicios}
          className="pointer-events-none absolute -top-[25rem] left-1/2 -z-10 size-[40rem] -translate-x-1/2 opacity-70 md:hidden"
        />
        <Seccion className="pt-32 md:pt-40">
          <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
          <p className="text-p1 mt-6 max-w-xl text-balance text-blanco/80">
            {T.hero.bajada}
          </p>
        </Seccion>
      </section>

      {sectores.length ? (
        <Seccion id="verticales">
          {/* El rótulo cambia entre maquetas: "Verticales" en desktop e
              "Industrias" en mobile. */}
          <EncabezadoSeccion
            rotulo={T.sectores.rotulo}
            rotuloMobile={T.sectores.rotuloMobile}
            titulo={T.sectores.titulo}
            descripcion={T.sectores.descripcion}
            descripcionAlLado
          />
          {/* En mobile los sectores son un mazo de cartas con "Ver más"; en
              desktop, tres tarjetas en fila. */}
          <SectoresMobile
            sectores={sectores}
            hrefBase="/nuestros-servicios"
            className="md:hidden"
          />
          <div className="hidden gap-6 md:grid md:grid-cols-3">
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

      {servicios.length ? (
        <Seccion id="soluciones">
          {/* Título a la izquierda y acordeón a la derecha, como en la maqueta;
              en mobile el acordeón pasa a ocupar todo el ancho. */}
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            {/* En desktop el título entra en una línea: sin esto la columna lo
                parte en dos y deja de coincidir con la maqueta. */}
            <h2 className="text-h1 md:whitespace-nowrap">
              <span className="text-eyebrow mb-3 block text-blanco/40">
                {T.soluciones.rotulo}
              </span>
              {T.soluciones.titulo}
            </h2>
            <Soluciones servicios={servicios} />
          </div>
        </Seccion>
      ) : null}

      <Seccion id="metodologias">
        <EncabezadoSeccion
          rotulo={T.metodologia.rotulo}
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

      <div className="contenedor pb-12 md:pb-16">
        <BandaCta
          titulo={T.metodologia.cierre.titulo}
          accion={
            <BotonLink href={T.metodologia.cierre.cta.href}>
              {T.metodologia.cierre.cta.texto}
            </BotonLink>
          }
        />
      </div>

      <Seccion id="por-que">
        <EncabezadoSeccion
          rotulo={T.porQue.rotulo}
          titulo={T.porQue.titulo}
          descripcion={T.porQue.descripcion}
          descripcionAlLado
        />
        <Carrusel grilla="md:grid-cols-4" gap="gap-5">
          {T.porQue.items.map((item) => (
            <CardPropuesta
              key={item.titulo}
              titulo={item.titulo}
              descripcion={item.descripcion}
              acento={item.acento}
              className="h-[265px] w-[287px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </Carrusel>
      </Seccion>

      {aliados.length ? (
        <Seccion>
          <EncabezadoSeccion
            rotulo={T.aliados.rotulo}
            titulo={T.aliados.titulo}
            alineacion="centro"
          />
          {/* De punta a punta: los logos entran y salen por el borde. */}
          <Aliados logos={aliados} className="-mx-6" />
        </Seccion>
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
