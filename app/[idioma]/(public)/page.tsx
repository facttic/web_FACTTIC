import { Hero } from "@/components/secciones/hero";
import { Marquesina } from "@/components/secciones/marquesina";
import { Pasos } from "@/components/secciones/pasos";
import { BandaCta, EncabezadoSeccion, Seccion } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Servicios } from "@/components/secciones/servicios";
import { BeneficiosMobile } from "@/components/secciones/beneficios-mobile";
import { ServiciosMobile } from "@/components/secciones/servicios-mobile";
import { CardSector } from "@/components/tarjetas/sector";
import { CardProyecto } from "@/components/tarjetas/proyecto";
import { CardBeneficioHover, CardMetrica } from "@/components/tarjetas/bloques";
import { AlEntrar } from "@/components/ui/al-entrar";
import { Animacion } from "@/components/ui/animacion";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { Carrusel } from "@/components/ui/carrusel";
import { FONDOS, VIDEO_HERO } from "@/lib/animaciones";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import {
  getSectoresDestacados,
  getServiciosDestacados,
} from "@/lib/datos/catalogos";
import { getProyectosDestacados } from "@/lib/datos/proyectos";
import { getMetricasRed } from "@/lib/datos/red";

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
 *   mobile   hero · texto · sectores · servicios · método · proyectos · cta ·
 *            lema · beneficios · red · cta
 *   desktop  hero · sectores · servicios · método · proyectos · cta · lema ·
 *            beneficios · red · cta
 *
 * Los bloques que dependen de la API se omiten si no hay datos, para que la
 * página no muestre secciones vacías mientras el contenido se termina de cargar
 * desde el backoffice.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ idioma: Idioma }>;
}) {
  const { idioma } = await params;
  const HOME = contenido(idioma).HOME;
  // Solo el catálogo de la Federación: lo que cargan las cooperativas para su
  // propia ficha no sale acá.
  const [sectores, servicios, destacados, metricas] = await Promise.all([
    getSectoresDestacados(idioma),
    getServiciosDestacados(idioma),
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
        bajadaMobile={HOME.hero.bajadaMobile}
        accion={HOME.hero.cta}
        video={VIDEO_HERO.desktop}
        videoMobile={VIDEO_HERO.mobile}
        imagen={VIDEO_HERO.poster}
      />

      {sectores.length ? (
        // La primera sección respira más: en el SVG hay 112px entre el pie del
        // hero y el rótulo "INDUSTRIAS", contra los 64 del resto. En el board
        // mobile la diferencia es la misma pero más chica: 47 contra 28.
        <Seccion className="order-3 pt-11 md:order-2 md:pt-28">
          {/* El botón cambia de lugar entre maquetas: en desktop va a la
              derecha del título y en mobile cierra la sección, a lo ancho. */}
          <EncabezadoSeccion
            className="revelar-al-entrar"
            rotulo={HOME.sectores.rotulo}
            titulo={HOME.sectores.titulo}
            tituloMobile={HOME.sectores.tituloMobile}
            alineacion="centro-en-mobile"
            accionAlPie
            accion={
              <BotonLink href={HOME.sectores.cta.href}>
                {HOME.sectores.cta.texto}
              </BotonLink>
            }
          />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {sectores.map((sector, i) => (
              <AlEntrar key={sector.id} indice={i}>
                <CardSector
                  sector={sector}
                  indice={i}
                  href={`/nuestros-servicios/${sector.slug}`}
                />
              </AlEntrar>
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
          className="revelar-al-entrar"
          rotulo={HOME.metodologia.rotulo}
          titulo={HOME.metodologia.titulo}
          alineacion="centro-en-mobile"
          accionAlPie
          accion={
            <BotonLink href={HOME.metodologia.cta.href}>
              {HOME.metodologia.cta.texto}
            </BotonLink>
          }
        />
        <Pasos pasos={HOME.metodologia.pasos} />
      </Seccion>

      {destacados.items.length ? (
        <Seccion className="order-6 md:order-5">
          <EncabezadoSeccion
            className="revelar-al-entrar"
            rotulo={HOME.proyectos.rotulo}
            titulo={HOME.proyectos.titulo}
            alineacion="centro-en-mobile"
            accionAlPie
            accion={
              /* En mobile el board cierra el bloque con las flechas del
                 carrusel, no con este botón. */
              <BotonLink
                href={HOME.proyectos.cta.href}
                className="hidden md:inline-flex"
              >
                {HOME.proyectos.cta.texto}
              </BotonLink>
            }
          />
          <CarruselConFlechas grilla="md:grid-cols-[2.06fr_1fr]" gap="gap-5">
            {destacados.items.map((proyecto, i) => (
              <AlEntrar
                key={proyecto.id}
                indice={i}
                className="w-[347px] shrink-0 snap-start md:w-auto"
              >
                <CardProyecto
                  proyecto={proyecto}
                  // La primera es la ancha: la única que lleva la descripción.
                  destacada={i === 0}
                />
              </AlEntrar>
            ))}
          </CarruselConFlechas>
        </Seccion>
      ) : null}

      {/* Va suelta: en mobile cierra la metodología y en desktop, los proyectos. */}
      <div className="revelar-al-entrar contenedor order-7 pb-7 md:order-6 md:pb-24">
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
        El lema es la misma marquesina en los dos anchos: cruza la pantalla con
        el texto en gris muy tenue. La animación de fondo va solo en desktop.

        Hasta el board de agosto mobile lo resolvía como una sección propia
        —animación, rótulo, bajada y botón—; el archivo nuevo la reemplazó por
        la marquesina sola, así que en mobile ya no hay enlace a Sobre FACTTIC
        desde acá.

        `overflow-hidden` no es decorativo: la animación mide 576px y va
        centrada, así que en pantallas angostas se salía del viewport y le daba
        scroll horizontal a toda la página.
      */}
      <div className="relative isolate order-8 overflow-hidden md:order-7">
        <Animacion
          nombre={FONDOS.homeLema}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 hidden size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40 md:block"
        />
        <Marquesina texto={HOME.lema.texto} />
      </div>

      <Seccion className="order-9 md:order-8">
        <EncabezadoSeccion
          className="revelar-al-entrar"
          rotulo={HOME.beneficios.rotulo}
          titulo={HOME.beneficios.titulo}
          tituloMobile={HOME.beneficios.tituloMobile}
          alineacion="centro-en-mobile"
          accionAlPie
          accion={
            <BotonLink href={HOME.beneficios.cta.href}>
              {HOME.beneficios.cta.texto}
            </BotonLink>
          }
        />
        {/*
          Dos formas distintas, no la misma reacomodada: en desktop son cuatro
          tarjetas en fila que cambian de cara al pasar el mouse y en mobile un
          mazo que se pasa solo con el scroll.
        */}
        <BeneficiosMobile
          className="md:hidden"
          items={HOME.beneficios.items.map((beneficio) => ({
            titulo: beneficio.titulo,
            descripcion: beneficio.descripcion,
            ilustracion: (
              <Animacion
                nombre={beneficio.animacion}
                bucle={false}
                className="size-[80px]"
              />
            ),
          }))}
        />
        <div className="hidden md:block">
          <Carrusel grilla="sm:grid-cols-2 lg:grid-cols-4" desdeAncho="sm">
            {HOME.beneficios.items.map((beneficio, i) => (
              <AlEntrar key={beneficio.titulo} indice={i}>
                <CardBeneficioHover
                  titulo={beneficio.titulo}
                  descripcion={beneficio.descripcion}
                  acento={beneficio.acento}
                  ilustracion={
                    <Animacion
                      nombre={beneficio.animacion}
                      bucle={false}
                      className="size-[70px]"
                    />
                  }
                />
              </AlEntrar>
            ))}
          </Carrusel>
        </div>
      </Seccion>

      <Seccion className="order-10 md:order-9">
        <EncabezadoSeccion
          className="revelar-al-entrar"
          rotulo={HOME.red.rotulo}
          titulo={HOME.red.titulo}
          alineacion="centro-en-mobile"
          accionAlPie
          accion={
            <BotonLink href={HOME.red.cta.href}>{HOME.red.cta.texto}</BotonLink>
          }
        />
        {/*
          Apiladas en mobile y en tres columnas en desktop. No van en carrusel:
          el board mobile las define una debajo de la otra, a lo ancho.
        */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {/* Un color por métrica, como en el board: lila, lima y naranja. */}
          <AlEntrar indice={0}>
            <CardMetrica
              rotulo="Profesionales"
              valor={metricas.profesionales}
              acentoHover="lila"
            />
          </AlEntrar>
          <AlEntrar indice={1}>
            <CardMetrica
              rotulo="Cooperativas"
              valor={metricas.cooperativas}
              acentoHover="amarillo"
            />
          </AlEntrar>
          <AlEntrar indice={2}>
            <CardMetrica
              rotulo="Provincias"
              valor={metricas.provincias}
              acentoHover="naranja"
            />
          </AlEntrar>
        </div>
      </Seccion>

      <div className="revelar-al-entrar contenedor order-11 pb-16 md:order-10 md:pb-24">
        {/* La maqueta mobile pregunta otra cosa y manda al formulario. */}
        <BandaCta
          titulo={
            <>
              <span className="whitespace-pre-line md:hidden">
                {HOME.red.cierre.tituloMobile}
              </span>
              <span className="hidden md:inline">{HOME.red.cierre.titulo}</span>
            </>
          }
          accion={
            <>
              <BotonLink
                href={HOME.red.cierre.ctaMobile.href}
                className="md:hidden"
              >
                {HOME.red.cierre.ctaMobile.texto}
              </BotonLink>
              <BotonLink
                href={HOME.red.cierre.cta.href}
                className="hidden md:inline-flex"
              >
                {HOME.red.cierre.cta.texto}
              </BotonLink>
            </>
          }
        />
      </div>
    </div>
  );
}
