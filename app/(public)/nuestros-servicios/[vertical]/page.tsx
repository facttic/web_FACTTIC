import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { Animacion } from "@/components/ui/animacion";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import { CardPropuesta } from "@/components/tarjetas/servicios";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import { Stack } from "@/components/secciones/stack";
import { Aliados } from "@/components/secciones/aliados";
import { Acordeon } from "@/components/ui/acordeon";
import { acentoDeSector, animacionDeSector } from "@/lib/animaciones";
import { SERVICIOS_PAGINA, VERTICALES as T } from "@/lib/contenido";
import {
  getOrganizaciones,
  getSectores,
  getSectorPorSlug,
  getTecnologias,
} from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";

/**
 * Vertical: Organizaciones, Agro o Financiero.
 *
 * Una sola plantilla para las tres —diseño confirmó que se reúsa— y lo que
 * cambia sale de la API: el nombre, la ilustración y los proyectos del sector.
 * El color con el que se pintan las tarjetas lo fija una anotación del archivo
 * y vive en `acentoDeSector`.
 */

export async function generateStaticParams() {
  const sectores = await getSectores();
  return sectores.map((sector) => ({ vertical: sector.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const sector = await getSectorPorSlug(vertical);
  if (!sector) return {};
  return {
    title: sector.nombre,
    description: T.descripciones[vertical] ?? sector.descripcion ?? undefined,
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const sector = await getSectorPorSlug(vertical);
  if (!sector) notFound();

  const [proyectos, tecnologias, aliados] = await Promise.all([
    getProyectos({ sector: sector.id, porPagina: 2 }),
    getTecnologias(),
    getOrganizaciones(),
  ]);

  const acento = acentoDeSector(sector.nombre);
  const animacion = animacionDeSector(sector.nombre);
  const descripcion = T.descripciones[vertical] ?? sector.descripcion;

  return (
    <>
      {/* En desktop el hero va centrado y con la ilustración del sector; en
          mobile la maqueta la saca y alinea el texto a la izquierda. */}
      <Seccion className="pt-32 md:items-center md:pt-40 md:text-center">
        {animacion ? (
          <Animacion
            nombre={animacion}
            className="hidden size-[180px] md:block"
          />
        ) : null}
        <h1 className="text-h1 md:mt-8">{sector.nombre}</h1>
        {descripcion ? (
          <p className="text-p1 mt-6 text-blanco/80 md:max-w-3xl md:text-balance">
            {descripcion}
          </p>
        ) : null}
      </Seccion>

      <Seccion>
        <EncabezadoSeccion
          rotulo={T.propuesta.rotulo}
          titulo={T.propuesta.titulo}
        />

        {/* En desktop son cuatro tarjetas que toman el color de la vertical al
            pasar el mouse; en mobile, un acordeón. */}
        <div className="hidden gap-5 md:grid md:grid-cols-4">
          {T.propuesta.items.map((item) => (
            <CardPropuesta
              key={item.titulo}
              titulo={item.titulo}
              descripcion={item.descripcion}
              acento={acento}
              className="h-[200px] whitespace-pre-line"
            />
          ))}
        </div>
        <Acordeon
          className="divide-dashed divide-gris-oscuro border-gris-oscuro md:hidden"
          inicial={null}
          items={T.propuesta.items.map((item) => ({
            id: item.titulo,
            titulo: item.titulo.replace("\n", " "),
            contenido: item.descripcion,
          }))}
        />
      </Seccion>

      {tecnologias.length ? (
        <Seccion>
          <Stack titulo={T.stack.titulo} tecnologias={tecnologias} />
        </Seccion>
      ) : null}

      <Seccion>
        <BloqueDesplegable
          titulo={T.metodologia.titulo}
          tamano="h2"
          items={SERVICIOS_PAGINA.metodologia.items.map((item) => ({
            id: item.titulo,
            titulo: item.titulo.replace("\n", " "),
            descripcion: item.descripcion,
          }))}
        />
      </Seccion>

      {proyectos.items.length ? (
        <Seccion>
          <EncabezadoSeccion
            titulo={T.proyectos.titulo}
            accionAlPie
            accion={<BotonLink href="/proyectos">Ver todos</BotonLink>}
          />
          {/* En mobile la maqueta no usa tarjetas con imagen: los proyectos van
              en lista, con los servicios y los chips debajo del título. */}
          <div className="md:hidden">
            {proyectos.items.map((proyecto) => (
              <FilaProyecto key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
          <div className="hidden gap-5 md:grid md:grid-cols-[2.06fr_1fr]">
            {proyectos.items.map((proyecto) => (
              <CardProyecto key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        </Seccion>
      ) : null}

      {aliados.length ? (
        <Seccion className="pb-0">
          <EncabezadoSeccion
            rotulo={SERVICIOS_PAGINA.aliados.rotulo}
            titulo={SERVICIOS_PAGINA.aliados.titulo}
          />
        </Seccion>
      ) : null}
      {aliados.length ? (
        <Aliados logos={aliados} className="pb-12 md:pb-16" />
      ) : null}

      {/* El cierre va sobre el sol naranja, con la tarjeta de vidrio dejándolo
          ver a través. El fondo propio de este bloque no vino en la entrega, así
          que se usa el de "Trabajo con impacto", del mismo color. */}
      <div className="relative isolate overflow-hidden pt-20 pb-12 md:pt-0 md:pb-16">
        <Animacion
          nombre="beneficio-trabajo"
          className="pointer-events-none absolute -top-8 -left-52 -z-10 size-[30rem] opacity-80 blur-[2px] md:hidden"
        />
        <div className="contenedor">
          <BandaCta
            variante="vidrio"
            titulo={T.cierre.titulo}
            accion={
              <BotonLink href={T.cierre.cta.href}>
                {T.cierre.cta.texto}
              </BotonLink>
            }
          />
        </div>
      </div>
    </>
  );
}
