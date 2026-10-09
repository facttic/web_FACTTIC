import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Carrusel } from "@/components/ui/carrusel";
import { Animacion } from "@/components/ui/animacion";
import { FONDO_ACENTO } from "@/components/ui/acento";
import { cn } from "@/lib/cn";
import { CardPropuesta } from "@/components/tarjetas/servicios";
import { CardSector } from "@/components/tarjetas/sector";
import { BloqueDesplegable } from "@/components/secciones/desplegables";
import { ProyectosDestacados } from "@/components/secciones/proyectos-destacados";
import { Metodologias } from "@/components/secciones/metodologias";
import { Stack } from "@/components/secciones/stack";
import { Aliados } from "@/components/secciones/aliados";
import { Acordeon } from "@/components/ui/acordeon";
import { acentoDeSector } from "@/lib/animaciones";
import { contenido } from "@/lib/contenido";
import { IDIOMAS, type Idioma } from "@/lib/idioma";
import {
  getClientesConLogo,
  getSectoresDestacados,
  getSectorPorSlug,
  getTecnologias,
} from "@/lib/datos/catalogos";
import { getProyectos } from "@/lib/datos/proyectos";
import { metadatosDe } from "@/lib/seo";

/**
 * Vertical: Organizaciones, Agro o Financiero.
 *
 * Una sola plantilla para las tres —diseño confirmó que se reúsa— y lo que
 * cambia sale de la API: el nombre, la descripción y los proyectos del sector.
 * El color con el que se pintan las tarjetas lo fija una anotación del archivo
 * y vive en `acentoDeSector`.
 */

/*
 * Solo las verticales de la Federación tienen pantalla propia. Los sectores
 * que dan de alta las cooperativas describen lo suyo y se ven en su ficha, no
 * acá: sin esto, cada uno abriría una vertical vacía —sin propuesta de valor,
 * sin metodología y sin aliados—.
 */
export async function generateStaticParams() {
  // El slug es el mismo en los dos idiomas: sale del nombre en español.
  const sectores = await getSectoresDestacados();
  return IDIOMAS.flatMap((idioma) =>
    sectores.map((sector) => ({ idioma, vertical: sector.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; idioma: Idioma }>;
}): Promise<Metadata> {
  const { vertical, idioma } = await params;
  const T = contenido(idioma).VERTICALES;
  const sector = await getSectorPorSlug(vertical, idioma);
  if (!sector?.destacado) return {};
  /*
   * Agro trae dos párrafos y el buscador muestra una línea: alcanza con el
   * primero, que es el que resume la vertical.
   */
  const descripcion = T.descripciones[vertical] ?? sector.descripcion;
  return metadatosDe({
    idioma,
    ruta: `/nuestros-servicios/${vertical}`,
    titulo: sector.nombre,
    descripcion: descripcion ? parrafos(descripcion)[0] : "",
    imagen: sector.imagen,
  });
}

/** Una descripción puede venir en varios párrafos, separados por una línea. */
function parrafos(texto: string) {
  return texto.split("\n\n").filter(Boolean);
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string; idioma: Idioma }>;
}) {
  const { vertical, idioma } = await params;
  const { SERVICIOS_PAGINA, VERTICALES: T } = contenido(idioma);
  const sector = await getSectorPorSlug(vertical, idioma);
  if (!sector?.destacado) notFound();

  const [proyectos, tecnologias, clientes, verticales, deLaVertical] =
    await Promise.all([
      getProyectos({ sector: sector.id, porPagina: 6 }, idioma),
      getTecnologias(),
      getClientesConLogo(),
      getSectoresDestacados(idioma),
      /*
       * Todos los proyectos de la vertical, no los seis que se muestran: la
       * banda de clientes se arma con quiénes contrataron en este sector, y
       * recortarla a los seis destacados dejaría afuera a la mayoría.
       */
      getProyectos({ sector: sector.id, porPagina: 100 }, idioma),
    ]);

  /*
   * Los clientes y el stack de esta vertical, no los de todo el catálogo: acá
   * el sector es el tema de la página, y un cliente de otro rubro —o una
   * tecnología que nadie usó en este— no dicen nada. El stack mostraba las
   * cincuenta y cuatro tecnologías cargadas, idénticas en las tres verticales.
   *
   * Las dos listas salen de los proyectos del sector, cruzadas contra el
   * catálogo porque los proyectos traen solo el id y el nombre, y acá hace
   * falta el logo.
   */
  const clientesDelSector = new Set(
    deLaVertical.items.map((proyecto) => proyecto.cliente?.id).filter(Boolean),
  );
  const aliados = clientes.filter((cliente) =>
    clientesDelSector.has(cliente.id),
  );

  const tecnologiasDelSector = new Set(
    deLaVertical.items.flatMap((proyecto) =>
      proyecto.tecnologias.map((t) => t.id),
    ),
  );
  const stack = tecnologias.filter((t) => tecnologiasDelSector.has(t.id));

  /*
   * Las otras verticales, para el bloque que cierra la pantalla. El número que
   * muestra cada tarjeta es el puesto que ocupa en el catálogo —en el archivo
   * son "02. Agro" y "03. Finanzas"—, así que se conserva el índice original
   * en vez de volver a numerar las dos que quedan.
   */
  const otras = verticales
    .map((vertical, indice) => ({ vertical, indice }))
    .filter(({ vertical }) => vertical.id !== sector.id);

  const motivos = T.propuesta.items[vertical] ?? [];
  const acento = acentoDeSector(sector.slug);
  const descripcion = T.descripciones[vertical] ?? sector.descripcion;

  return (
    <>
      {/*
        El hero arranca con el bloque pintado del color de la vertical, que
        pasa por detrás de la barra hasta el borde de arriba: lo pide la
        anotación "Agregué este fondo de color y cambié la diagramación del
        header". No lleva alto fijo —en el archivo mide 444 en Organizaciones
        y 592 en Agro, que tiene un párrafo más—, así que crece con el texto y
        lo que se respeta son los aires: el título a 157 del tope y 117 de aire
        abajo en desktop, 158 y 54 en mobile. El margen negativo lo mete por
        detrás de la barra, que es fija y deja 72px de aire en `MarcoPublico`.
        El radio de 12 va solo abajo: arriba el bloque termina contra el borde
        de la ventana y el redondeo dejaba ver dos esquinas oscuras.

        La ilustración del sector ya no va acá: las maquetas nuevas la sacaron
        del hero. Sigue estando en las tarjetas de "Descubrí otros sectores",
        al pie de la pantalla.
      */}
      <section className={cn("-mt-[72px] rounded-b-xl", FONDO_ACENTO[acento])}>
        <div className="contenedor pt-[158px] pb-[54px] md:pt-[157px] md:pb-[117px]">
          <h1 className="text-h1">{sector.nombre}</h1>
          {descripcion
            ? parrafos(descripcion).map((parrafo, i) => (
                <p
                  key={parrafo}
                  /* En mobile el board la escribe en `P1/Bold` —DM Mono 16—,
                     como el hero de Nuestros servicios. El ancho de 811 es el
                     de la caja de texto del archivo. */
                  className={cn(
                    "text-p1-bold md:text-p1 text-negro-oscuro/80 md:max-w-[811px]",
                    i === 0 ? "mt-5 md:mt-8" : "mt-4",
                  )}
                >
                  {parrafo}
                </p>
              ))
            : null}
        </div>
      </section>

      {motivos.length ? (
        <Seccion>
          <EncabezadoSeccion
            rotulo={T.propuesta.rotulo}
            titulo={T.propuesta.titulo}
            tamanoTitulo="h2"
            descripcion={SERVICIOS_PAGINA.porQue.descripcion}
            descripcionSoloMobile
            /* La bajada y el primer ítem quedan pegados en el board: 26px
               entre el último renglón y "Soluciones adaptadas". */
            className="mb-1 md:mb-8"
          />

          {/* En desktop son cuatro tarjetas que toman el color de la vertical al
              pasar el mouse; en mobile, un acordeón. */}
          <div className="hidden gap-5 md:grid md:grid-cols-4">
            {motivos.map((item) => (
              <CardPropuesta
                key={item.titulo}
                titulo={item.titulo}
                descripcion={item.descripcion}
                acento={acento}
                className="h-[264px] whitespace-pre-line"
              />
            ))}
          </div>
          <Acordeon
            className="divide-dashed divide-gris-oscuro border-t-0 border-gris-oscuro md:hidden"
            claseTitulo="text-h3"
            inicial={null}
            items={motivos.map((item) => ({
              id: item.titulo,
              titulo: item.titulo.replace("\n", " "),
              contenido: item.descripcion,
            }))}
          />
        </Seccion>
      ) : null}

      {/* Los aires de esta pantalla están medidos sobre la maqueta: 98px de
          las tarjetas a la línea del stack, 57 de la línea al título de
          metodologías y 118 del desplegable a proyectos. */}
      {stack.length ? (
        <Seccion className="md:py-8">
          <Stack titulo={T.stack.titulo} tecnologias={stack} />
        </Seccion>
      ) : null}

      {/* El aire de esta pantalla no es el del resto: entre metodologías y
          proyectos el diseño deja menos, y antes del cierre, más. */}
      <Seccion className="md:pt-6 md:pb-0">
        {/*
          Las dos maquetas resuelven este bloque distinto: desktop lo lista
          como desplegables bajo "Metodologías de trabajo" y el board mobile lo
          convierte en el mismo carrusel de "¿Cómo trabajamos?" que Nuestros
          servicios, pero con la solapa subrayada en vez de la tarjeta pintada.
        */}
        <EncabezadoSeccion
          className="md:hidden"
          rotulo={SERVICIOS_PAGINA.metodologia.rotuloMobile}
          titulo={SERVICIOS_PAGINA.metodologia.titulo}
          tamanoTitulo="h2"
        />
        <Metodologias
          items={SERVICIOS_PAGINA.metodologia.items}
          variante="recuadro"
          className="md:hidden"
        />

        <BloqueDesplegable
          className="hidden md:grid"
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
        <Seccion className="md:pt-28">
          <ProyectosDestacados
            titulo={T.proyectos.titulo}
            proyectos={proyectos.items}
          />
        </Seccion>
      ) : null}

      {aliados.length ? (
        <Seccion className="pb-0 md:pt-28">
          <EncabezadoSeccion
            rotulo={SERVICIOS_PAGINA.aliados.rotulo}
            titulo={SERVICIOS_PAGINA.aliados.titulo}
            tamanoTitulo="h2"
            alineacion="centro-en-desktop"
          />
        </Seccion>
      ) : null}
      {aliados.length ? (
        <Aliados logos={aliados} className="pb-12 md:pb-24" />
      ) : null}

      {/* El cierre va sobre el sol naranja. La banda va punteada como en el
          resto del sitio —el componente tiene un solo estilo—, y no de vidrio.
          El fondo propio de este bloque no vino en la entrega, así que se usa
          el de "Trabajo con impacto", del mismo color. */}
      {/* Recorta solo a lo ancho: contiene la animación —que es más ancha que
          la pantalla— sin cortarle el resplandor a la banda, que se derrama
          por arriba y por abajo del panel. */}
      <div className="relative isolate pt-20 pb-12 [overflow-x:clip] md:pt-0 md:pb-16">
        <Animacion
          nombre="beneficio-trabajo"
          className="pointer-events-none absolute -top-8 -left-52 -z-10 size-[30rem] opacity-80 blur-[2px] md:hidden"
        />
        <div className="contenedor">
          <BandaCta
            titulo={T.cierre.titulo}
            accion={
              <BotonLink href={T.cierre.cta.href}>
                {T.cierre.cta.texto}
              </BotonLink>
            }
          />
        </div>
      </div>

      {otras.length ? (
        <Seccion className="pt-0 pb-16 md:pb-24">
          {/* Una columna de texto y las otras verticales al lado, en la misma
              grilla de tres que usa Nuestros servicios para los sectores. En
              mobile van apiladas debajo del texto. */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:self-center">
              <h2 className="text-h3 whitespace-pre-line">{T.otras.titulo}</h2>
              <p className="text-p2 mt-4 whitespace-pre-line text-blanco/60">
                {T.otras.descripcion}
              </p>
            </div>
            {otras.map(({ vertical, indice }) => (
              <CardSector
                key={vertical.id}
                sector={vertical}
                indice={indice}
                conCaja
                href={`/nuestros-servicios/${vertical.slug}`}
              />
            ))}
          </div>
        </Seccion>
      ) : null}
    </>
  );
}
