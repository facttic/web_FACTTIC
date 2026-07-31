import { Hero } from "@/components/secciones/hero";
import { Marquesina } from "@/components/secciones/marquesina";
import { Pasos } from "@/components/secciones/pasos";
import { BandaCta, EncabezadoSeccion, Seccion } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Servicios } from "@/components/secciones/servicios";
import { CardSector } from "@/components/tarjetas/sector";
import { CardProyecto } from "@/components/tarjetas/proyecto";
import { CardBeneficioHover, CardMetrica } from "@/components/tarjetas/bloques";
import { Animacion } from "@/components/ui/animacion";
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
    <>
      <Hero
        titulo={HOME.hero.titulo}
        bajada={HOME.hero.bajada}
        accion={HOME.hero.cta}
        video={VIDEO_HERO.desktop}
        videoMobile={VIDEO_HERO.mobile}
        imagen={VIDEO_HERO.poster}
      />

      {sectores.length ? (
        <Seccion>
          <EncabezadoSeccion
            rotulo={HOME.sectores.rotulo}
            titulo={HOME.sectores.titulo}
            alineacion="centro"
          />
          <div className="grid gap-6 md:grid-cols-3">
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
        <Seccion>
          <EncabezadoSeccion
            rotulo={HOME.servicios.rotulo}
            titulo={HOME.servicios.titulo}
          />
          <Servicios servicios={servicios} />
        </Seccion>
      ) : null}

      <Seccion>
        <EncabezadoSeccion
          rotulo={HOME.metodologia.rotulo}
          titulo={HOME.metodologia.titulo}
          accion={
            <BotonLink href={HOME.metodologia.cta.href}>
              {HOME.metodologia.cta.texto}
            </BotonLink>
          }
        />
        <Pasos pasos={HOME.metodologia.pasos} />
      </Seccion>

      {destacados.items.length ? (
        <Seccion>
          <EncabezadoSeccion
            rotulo={HOME.proyectos.rotulo}
            titulo={HOME.proyectos.titulo}
            accion={
              <BotonLink href={HOME.proyectos.cta.href}>
                {HOME.proyectos.cta.texto}
              </BotonLink>
            }
          />
          <div className="grid gap-5 md:grid-cols-[2.06fr_1fr]">
            {destacados.items.map((proyecto) => (
              <CardProyecto key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
          <BandaCta
            className="mt-10"
            titulo={HOME.proyectos.cierre.titulo}
            accion={
              <BotonLink href={HOME.proyectos.cierre.cta.href}>
                {HOME.proyectos.cierre.cta.texto}
              </BotonLink>
            }
          />
        </Seccion>
      ) : null}

      <div className="relative isolate">
        <Animacion
          nombre={FONDOS.homeLema}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40"
        />
        <Marquesina texto={HOME.lema} />
      </div>

      <Seccion>
        <EncabezadoSeccion
          rotulo={HOME.beneficios.rotulo}
          titulo={HOME.beneficios.titulo}
          accion={
            <BotonLink href={HOME.beneficios.cta.href}>
              {HOME.beneficios.cta.texto}
            </BotonLink>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME.beneficios.items.map((beneficio) => (
            <CardBeneficioHover
              key={beneficio.titulo}
              titulo={beneficio.titulo}
              descripcion={beneficio.descripcion}
              acento={beneficio.acento}
              ilustracion={
                <Animacion
                  nombre={beneficio.animacion}
                  className="size-[70px]"
                />
              }
            />
          ))}
        </div>
      </Seccion>

      <Seccion>
        <EncabezadoSeccion
          rotulo={HOME.red.rotulo}
          titulo={HOME.red.titulo}
          accion={
            <BotonLink href={HOME.red.cta.href}>{HOME.red.cta.texto}</BotonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          <CardMetrica rotulo="Profesionales" valor={metricas.profesionales} />
          <CardMetrica rotulo="Cooperativas" valor={metricas.cooperativas} />
          <CardMetrica rotulo="Provincias" valor={metricas.provincias} />
        </div>
        <BandaCta
          className="mt-10"
          titulo={HOME.red.cierre.titulo}
          accion={
            <BotonLink href={HOME.red.cierre.cta.href}>
              {HOME.red.cierre.cta.texto}
            </BotonLink>
          }
        />
      </Seccion>
    </>
  );
}
