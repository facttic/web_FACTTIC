import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { Animacion } from "@/components/ui/animacion";
import { CardProyecto } from "@/components/tarjetas/proyecto";
import { CardPropuesta } from "@/components/tarjetas/servicios";
import { Metodologias } from "@/components/secciones/metodologias";
import { CardMetodologia } from "@/components/tarjetas/servicios";
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
        <EncabezadoSeccion
          rotulo={SERVICIOS_PAGINA.metodologia.rotulo}
          titulo={SERVICIOS_PAGINA.metodologia.titulo}
        />
        <div className="hidden gap-5 md:grid md:grid-cols-3">
          {SERVICIOS_PAGINA.metodologia.items.map((item) => (
            <CardMetodologia
              key={item.titulo}
              nombre={item.titulo}
              descripcion={item.descripcion ?? undefined}
              acento={item.acento}
              className="h-[263px] whitespace-pre-line"
            />
          ))}
        </div>
        <Metodologias
          items={SERVICIOS_PAGINA.metodologia.items}
          className="md:hidden"
        />
      </Seccion>

      {proyectos.items.length ? (
        <Seccion>
          <EncabezadoSeccion
            rotulo={T.proyectos.rotulo}
            titulo={T.proyectos.titulo}
            accionAlPie
            accion={<BotonLink href="/proyectos">Ver todos</BotonLink>}
          />
          <Carrusel grilla="md:grid-cols-[2.06fr_1fr]" gap="gap-5">
            {proyectos.items.map((proyecto) => (
              <CardProyecto
                key={proyecto.id}
                proyecto={proyecto}
                className="w-[350px] shrink-0 snap-start md:w-auto"
              />
            ))}
          </Carrusel>
        </Seccion>
      ) : null}

      {aliados.length ? (
        <Seccion>
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
