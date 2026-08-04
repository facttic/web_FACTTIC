import { Hero } from "@/components/secciones/hero";
import { RevelarPalabras } from "@/components/secciones/texto-animado";
import { Marquesina } from "@/components/secciones/marquesina";
import { Pasos } from "@/components/secciones/pasos";
import { BandaCta, EncabezadoSeccion, Seccion } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Servicios } from "@/components/secciones/servicios";
import { ServiciosMobile } from "@/components/secciones/servicios-mobile";
import { CardSector } from "@/components/tarjetas/sector";
import { CardProyecto } from "@/components/tarjetas/proyecto";
import { CardBeneficioHover, CardMetrica } from "@/components/tarjetas/bloques";
import { Animacion } from "@/components/ui/animacion";
import { Carrusel } from "@/components/ui/carrusel";
import { FONDOS, VIDEO_HERO } from "@/lib/animaciones";
import { HOME } from "@/lib/contenido";
import {
  getMetricasRed,
  getSectores,
  getServicios,
} from "@/lib/datos/catalogos";
import { getProyectosDestacados } from "@/lib/datos/proyectos";

/**
 * Home.
 *
 * Es composición: cada bloque del diseño se arma con componentes del catálogo y
 * el contenido fijo sale de `lib/contenido.ts`. Lo propio de esta página es el
 * orden de los bloques y qué datos pide.
 *
 * Las maquetas de desktop y mobile no son la misma página reacomodada: cambian
 * el orden de las secciones y la forma de varias de ellas. El orden se resuelve
 * acá con `order`, sobre un contenedor flex, así el HTML sale una sola vez y no
 * hay que duplicar bloques enteros para reubicarlos.
 *
 *   mobile   hero · texto · sectores · servicios · método · cta · lema ·
 *            beneficios · red · proyectos · cta
 *   desktop  hero · sectores · servicios · método · proyectos · cta · lema ·
 *            beneficios · red · cta
 *
 * Los bloques que dependen de la API se omiten si no hay datos, para que la
 * página no muestre secciones vacías mientras el contenido se termina de cargar
 * desde el backoffice.
 */
export default async function HomePage() {
  const [sectores, servicios, destacados, metricas] = await Promise.all([
    getSectores(),
    getServicios(),
    getProyectosDestacados(2),
    getMetricasRed(),
  ]);

  return (
    <div className="flex flex-col">
      <Hero
        className="order-1"
        titulo={HOME.hero.titulo}
        tituloMobile={HOME.hero.tituloMobile}
        bajada={HOME.hero.bajada}
        accion={HOME.hero.cta}
        video={VIDEO_HERO.desktop}
        videoMobile={VIDEO_HERO.mobile}
        imagen={VIDEO_HERO.poster}
      />

      {/*
        En mobile la bajada del hero no va sobre el video: abre la página como
        un bloque de texto grande. En desktop ese lugar no existe.
      */}
      <Seccion className="order-2 md:hidden">
        {/* La anotación del diseño pide acá el "Scroll reveal": el texto se
            enciende palabra por palabra a medida que sube por la pantalla. */}
        <RevelarPalabras
          texto={HOME.hero.bajada}
          className="text-h1 text-balance"
        />
      </Seccion>

      {sectores.length ? (
        // La primera sección respira más: en el SVG hay 112px entre el pie del
        // hero y el rótulo "INDUSTRIAS", contra los 64 del resto.
        <Seccion className="order-3 md:order-2 md:pt-28">
          <EncabezadoSeccion
            rotulo={HOME.sectores.rotulo}
            titulo={HOME.sectores.titulo}
            alineacion="centro-en-mobile"
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {sectores.map((sector, i) => (
              <CardSector
                key={sector.id}
                sector={sector}
                indice={i}
                href={`/nuestros-servicios/${sector.slug}`}
              />
            ))}
          </div>
        </Seccion>
      ) : null}

      {servicios.length ? (
        <Seccion className="order-4 md:order-3">
          {/*
            Dos formas distintas del mismo bloque: en desktop, solapas con
            flechas; en mobile, un mazo de tarjetas apiladas. El encabezado lo
            arma el de desktop porque las flechas necesitan su estado.
          */}
          <Servicios
            className="hidden md:block"
            rotulo={HOME.servicios.rotulo}
            titulo={HOME.servicios.titulo}
            servicios={servicios}
          />
          <div className="md:hidden">
            <EncabezadoSeccion
              rotulo={HOME.servicios.rotulo}
              titulo={HOME.servicios.tituloMobile}
              alineacion="centro-en-mobile"
            />
            <ServiciosMobile servicios={servicios} />
          </div>
        </Seccion>
      ) : null}

      <Seccion className="order-5 md:order-4">
        <EncabezadoSeccion
          rotulo={HOME.metodologia.rotulo}
          titulo={HOME.metodologia.titulo}
          alineacion="centro-en-mobile"
          accion={
            <BotonLink href={HOME.metodologia.cta.href}>
              {HOME.metodologia.cta.texto}
            </BotonLink>
          }
        />
        <Pasos pasos={HOME.metodologia.pasos} />
      </Seccion>

      {destacados.items.length ? (
        <Seccion className="order-10 md:order-5">
          <EncabezadoSeccion
            rotulo={HOME.proyectos.rotulo}
            titulo={HOME.proyectos.titulo}
            alineacion="centro-en-mobile"
            accionAlPie
            accion={
              <BotonLink href={HOME.proyectos.cta.href}>
                {HOME.proyectos.cta.texto}
              </BotonLink>
            }
          />
          <Carrusel grilla="md:grid-cols-[2.06fr_1fr]" gap="gap-5">
            {destacados.items.map((proyecto) => (
              <CardProyecto
                key={proyecto.id}
                proyecto={proyecto}
                className="w-[350px] shrink-0 snap-start md:w-auto"
              />
            ))}
          </Carrusel>
        </Seccion>
      ) : null}

      {/* Va suelta: en mobile cierra la metodología y en desktop, los proyectos. */}
      <div className="contenedor order-6 pb-16 md:order-6 md:pb-24">
        <BandaCta
          titulo={HOME.proyectos.cierre.titulo}
          accion={
            <BotonLink href={HOME.proyectos.cierre.cta.href}>
              {HOME.proyectos.cierre.cta.texto}
            </BotonLink>
          }
        />
      </div>

      {/*
        El lema también cambia de forma: marquesina que cruza la pantalla en
        desktop, sección centrada con bajada y botón en mobile.
      */}
      {/*
        `overflow-hidden` no es decorativo: la animación mide 576px y va
        centrada, así que en pantallas angostas se salía del viewport y le daba
        scroll horizontal a toda la página.
      */}
      <div className="relative isolate order-7 overflow-hidden">
        <Animacion
          nombre={FONDOS.homeLema}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 hidden size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40 md:block"
        />
        <div className="hidden md:block">
          <Marquesina texto={HOME.lema.texto} />
        </div>
        <Seccion className="items-center text-center md:hidden">
          {/* En mobile la animación va en el flujo, arriba del rótulo, y no
              como fondo: en la maqueta ocupa su propio bloque de 137px. */}
          <Animacion nombre={FONDOS.homeLema} className="mb-8 size-[137px]" />
          <p className="text-eyebrow text-blanco/40">{HOME.lema.rotulo}</p>
          <h2 className="text-h1 mt-3 text-balance">{HOME.lema.texto}</h2>
          <p className="text-p1 mt-4 text-balance text-blanco/80">
            {HOME.lema.bajada}
          </p>
          <BotonLink
            href={HOME.lema.cta.href}
            variante="solida"
            className="mt-8 w-full"
          >
            {HOME.lema.cta.texto}
          </BotonLink>
        </Seccion>
      </div>

      <Seccion className="order-8">
        <EncabezadoSeccion
          rotulo={HOME.beneficios.rotulo}
          titulo={HOME.beneficios.titulo}
          alineacion="centro-en-mobile"
          accionAlPie
          accion={
            <BotonLink href={HOME.beneficios.cta.href}>
              {HOME.beneficios.cta.texto}
            </BotonLink>
          }
        />
        <Carrusel grilla="sm:grid-cols-2 lg:grid-cols-4" desdeAncho="sm">
          {HOME.beneficios.items.map((beneficio) => (
            <CardBeneficioHover
              key={beneficio.titulo}
              titulo={beneficio.titulo}
              descripcion={beneficio.descripcion}
              acento={beneficio.acento}
              className="w-[287px] shrink-0 snap-start sm:w-auto"
              ilustracion={
                <Animacion
                  nombre={beneficio.animacion}
                  className="size-[70px]"
                />
              }
            />
          ))}
        </Carrusel>
      </Seccion>

      <Seccion className="order-9">
        <EncabezadoSeccion
          rotulo={HOME.red.rotulo}
          titulo={HOME.red.titulo}
          alineacion="centro-en-mobile"
          accionAlPie
          accion={
            <BotonLink href={HOME.red.cta.href}>{HOME.red.cta.texto}</BotonLink>
          }
        />
        <Carrusel grilla="md:grid-cols-3" gap="gap-10 md:gap-6">
          {/* Un color por métrica, como en el board: lila, lima y naranja. */}
          <CardMetrica
            rotulo="Profesionales"
            valor={metricas.profesionales}
            acentoHover="lila"
            className="shrink-0"
          />
          <CardMetrica
            rotulo="Cooperativas"
            valor={metricas.cooperativas}
            acentoHover="amarillo"
            className="shrink-0"
          />
          <CardMetrica
            rotulo="Provincias"
            valor={metricas.provincias}
            acentoHover="naranja"
            className="shrink-0"
          />
        </Carrusel>
      </Seccion>

      <div className="contenedor order-11 pb-16 md:order-10 md:pb-24">
        <BandaCta
          titulo={HOME.red.cierre.titulo}
          accion={
            <BotonLink href={HOME.red.cierre.cta.href}>
              {HOME.red.cierre.cta.texto}
            </BotonLink>
          }
        />
      </div>
    </div>
  );
}
