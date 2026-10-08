import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Acordeon, type ItemAcordeon } from "@/components/ui/acordeon";
import { Chip, ChipCliente, ChipSector } from "@/components/ui/chip";
import { SelloIntercoop } from "@/components/ui/sello-intercoop";
import { PortadaGenerica } from "@/components/ui/portada-generica";
import { LogoRemoto } from "@/components/ui/logo-remoto";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import { getTecnologias } from "@/lib/datos/catalogos";
import { contenido } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import {
  getProyecto,
  getProyectos,
  getProyectosRelacionados,
} from "@/lib/datos/proyectos";
import { metadatosDe } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; idioma: Idioma }>;
}): Promise<Metadata> {
  const { slug, idioma } = await params;
  const proyecto = await getProyecto(slug, idioma);
  if (!proyecto) return {};
  return metadatosDe({
    idioma,
    ruta: `/proyectos/${slug}`,
    titulo: proyecto.nombre,
    descripcion: proyecto.desafio ?? "",
    /* La portada del proyecto es la imagen de la tarjeta al compartirlo. */
    imagen: proyecto.portada,
    tipo: "article",
  });
}

/**
 * Detalle de proyecto.
 *
 * Todo el contenido sale de la API: portada, reseña en tres partes, stack,
 * cooperativas que participaron, y las imágenes. La galería es opcional —lo
 * pide una anotación del diseño— y las de más abajo se muestran solo si el
 * proyecto tiene más de una imagen cargada.
 *
 * No hay maqueta mobile de esta pantalla: el orden apilado y la galería a una
 * columna son criterio propio, anotado en PENDIENTES.
 */
export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string; idioma: Idioma }>;
}) {
  const { slug, idioma } = await params;
  const T = contenido(idioma).PROYECTOS_PAGINA;
  const proyecto = await getProyecto(slug, idioma);
  if (!proyecto) notFound();

  const [relacionados, ultimos, catalogoTecnologias] = await Promise.all([
    getProyectosRelacionados(proyecto),
    getProyectos({ porPagina: 5 }),
    getTecnologias(),
  ]);

  /* El proyecto trae de cada tecnología solo el id y el nombre; el ícono está
     en el catálogo, así que se cruzan para poder mostrarlo. */
  const logoPorId = new Map(catalogoTecnologias.map((t) => [t.id, t.logo]));
  const stack = proyecto.tecnologias.map((t) => ({
    ...t,
    logo: logoPorId.get(t.id) ?? null,
  }));

  const [portada, ...galeria] = proyecto.imagenes;
  const servicios = proyecto.servicios.map((s) => s.nombre).join("  ·  ");

  const resena: ItemAcordeon[] = (
    [
      ["desafio", proyecto.desafio],
      ["solucion", proyecto.solucion],
      ["resultado", proyecto.resultado],
    ] as const
  )
    .filter(([, texto]) => texto)
    .map(([clave, texto]) => ({
      id: clave,
      titulo: T.detalle.secciones[clave],
      contenido: texto,
    }));

  return (
    <>
      {/*
        Las dos maquetas ordenan esto distinto, así que el orden lo decide el
        ancho y no el HTML: en mobile la portada abre la pantalla de punta a
        punta y el título va debajo; en desktop, desde la anotación "se ajustó
        el tamaño de la IMG principal", la portada pasa a ir **después** del
        título y de la ficha, metida en el contenedor —1223x438 con radio 21—
        en vez de cruzar la pantalla.
      */}
      <div className="flex flex-col">
        {portada ? (
          /* El `viewTransitionName` la enlaza con la imagen de la tarjeta que
             trajo hasta acá: al abrir el proyecto, una se transforma en la
             otra. Es la misma imagen en los dos lados, como pide la
             anotación. */
          <ViewTransition name={`proyecto-${proyecto.slug}`} share="morph">
            {/* En mobile arranca pegada al borde de arriba —por detrás de la
                barra, que es transparente— y cierra con las esquinas
                redondeadas: así la dibuja el board. */}
            <div className="md:contenedor md:order-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* Arriba de todo y es la imagen más grande de la pantalla: va
                  con prioridad y sin `lazy`, que la retrasaría. El `alt`
                  describe de qué es la foto —antes iba vacío, y una portada
                  con nombre propio no es decorativa—. */}
              <img
                src={portada}
                alt={`Portada del proyecto ${proyecto.nombre}`}
                loading="eager"
                fetchPriority="high"
                className="-mt-[72px] h-[488px] w-full rounded-b-3xl object-cover md:mt-0 md:h-[438px] md:rounded-[21px]"
              />
            </div>
          </ViewTransition>
        ) : (
          /* Sin foto cargada, la misma portada que mostró la tarjeta: el
             proyecto se ve igual antes y después de abrirlo. Antes acá no iba
             nada y el detalle arrancaba en seco con el título. */
          <ViewTransition name={`proyecto-${proyecto.slug}`} share="morph">
            <div className="md:contenedor md:order-2">
              <PortadaGenerica
                nombre={proyecto.slug}
                className="-mt-[72px] h-[488px] w-full rounded-b-3xl md:mt-0 md:h-[438px] md:rounded-[21px]"
              />
            </div>
          </ViewTransition>
        )}

        <Seccion className={"pt-8 md:order-1 md:pt-[93px] md:pb-[75px]"}>
          {/* En mobile la ficha se resuelve con dos etiquetas arriba del título y
            la lista de servicios debajo, sin los rótulos "Sector" y
            "Servicios" de la columna de desktop. */}
          <div className="mb-5 flex flex-wrap items-center gap-2 md:hidden">
            {proyecto.cliente ? (
              <ChipCliente>{proyecto.cliente.nombre}</ChipCliente>
            ) : null}
            {proyecto.sector ? (
              <ChipSector nombre={proyecto.sector.nombre} />
            ) : null}
          </div>

          {/* El sello a la derecha del título, no encima: que el proyecto se
              haya hecho entre varias cooperativas es lo que lo distingue, y
              enterarse recién al final —en la lista de cooperativas— lo deja
              como un dato administrativo.

              Acá va en el flujo y no montado sobre un borde: no hay ninguna
              tarjeta de la que colgarlo. */}
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-h1 max-w-4xl text-balance">
              {proyecto.nombre}
            </h1>
            {proyecto.cooperativas.length > 1 ? (
              <SelloIntercoop
                cooperativas={proyecto.cooperativas.length}
                className="mt-2 shrink-0"
              />
            ) : null}
          </div>

          {servicios ? (
            <p className="text-p3 mt-4 text-blanco/60 md:hidden">{servicios}</p>
          ) : null}

          {/* Ficha: sector y servicios, separados por una línea punteada. */}
          <div className="mt-10 hidden flex-col gap-6 md:flex md:flex-row md:items-start md:gap-10">
            {proyecto.sector ? (
              <div className="border-l border-dotted border-punteado pl-4">
                <p className="text-eyebrow text-blanco/40">Sector</p>
                <div className="mt-2">
                  <ChipSector nombre={proyecto.sector.nombre} />
                </div>
              </div>
            ) : null}
            {servicios ? (
              <div className="border-l border-dotted border-punteado pl-4">
                <p className="text-eyebrow text-blanco/40">Servicios</p>
                <p className="text-p2 mt-2 text-blanco/80">{servicios}</p>
              </div>
            ) : null}
            {proyecto.cliente ? (
              <div className="border-l border-dotted border-punteado pl-4">
                <p className="text-eyebrow text-blanco/40">Cliente</p>
                <p className="text-p2 mt-2 text-blanco/80">
                  {proyecto.cliente.nombre}
                </p>
              </div>
            ) : null}
          </div>
        </Seccion>
      </div>

      {resena.length ? (
        <Seccion>
          <EncabezadoSeccion titulo={T.detalle.resena} tamanoTitulo="h2" />
          {/* En mobile el board los muestra a los tres cerrados, sin la línea
              de arriba y con el título un cuerpo más grande. */}
          <Acordeon
            items={resena}
            inicialMobile={null}
            claseTitulo="text-h3 py-8 md:text-h4 md:py-5"
            className="divide-dashed divide-gris-oscuro border-t-0 border-gris-oscuro md:border-t"
          />
        </Seccion>
      ) : null}

      {/* Las dos maquetas los ordenan al revés: desktop pone el stack antes de
          la galería y el board mobile, después. */}
      <div className="flex flex-col">
        {stack.length ? (
          <Seccion className="py-0 md:py-0">
            <FichaEnLinea titulo={T.detalle.stack} items={stack} />
          </Seccion>
        ) : null}

        {galeria.length ? (
          <Seccion className="order-first md:order-none">
            {/*
            Dos por fila, con el acercamiento al pasar el mouse que pide la
            anotación "Animación: Zoom in". El video quedó consultado —"¿se
            podría incorporar?"— y entra acá cuando el backend lo sirva.
          */}
            <div className="grid gap-5 md:grid-cols-2">
              {galeria.map((imagen) => (
                <div key={imagen} className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagen}
                    alt=""
                    loading="lazy"
                    className="aspect-[587/341] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Seccion>
        ) : null}
      </div>

      {proyecto.cooperativas.length ? (
        <Seccion className="py-0 md:py-0">
          <FichaEnLinea
            titulo={T.detalle.cooperativas}
            items={proyecto.cooperativas}
          />
        </Seccion>
      ) : null}

      {relacionados.length ? (
        <Seccion>
          <EncabezadoSeccion
            titulo={T.detalle.relacionados}
            tamanoTitulo="h2"
          />
          {/* En mobile se pasan con las flechas, de a uno. */}
          <CarruselConFlechas grilla="md:grid-cols-3" gap="gap-5" automatico>
            {relacionados.map((otro) => (
              <CardProyecto
                key={otro.id}
                proyecto={otro}
                alto="min-h-[366px] md:h-[310px]"
                className="w-full shrink-0 snap-start md:w-auto"
              />
            ))}
          </CarruselConFlechas>
        </Seccion>
      ) : null}

      {/* El board mobile cierra el detalle con los relacionados: esta tabla
          existe solo en la maqueta de desktop. */}
      {ultimos.items.length ? (
        <Seccion className="hidden md:flex">
          <EncabezadoSeccion titulo={T.ultimos.titulo} tamanoTitulo="h2" />
          <div className="border-t border-dotted border-punteado">
            {ultimos.items
              .filter((otro) => otro.id !== proyecto.id)
              .slice(0, 4)
              .map((otro) => (
                <FilaProyecto
                  key={otro.id}
                  proyecto={otro}
                  variante="ultimos"
                />
              ))}
          </div>
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

/**
 * "Stack tecnológico" y "Cooperativas" del detalle.
 *
 * Las dos maquetas los resuelven distinto: desktop pone el rótulo a la
 * izquierda y los nombres como chips, entre dos líneas punteadas; el board
 * mobile los dibuja como tarjetas con el isologo, en una fila que se desplaza,
 * y sin líneas.
 */
function FichaEnLinea({
  titulo,
  items,
}: {
  titulo: string;
  items: readonly { id: string; nombre: string; logo?: string | null }[];
}) {
  return (
    <div className="flex flex-col gap-4 py-6 md:grid md:grid-cols-[352px_1fr] md:items-center md:gap-16 md:border-y md:border-dashed md:border-borde-pleno">
      <h2 className="text-h2">{titulo}</h2>

      <div className="scroll-limpio -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:hidden md:px-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex h-[92px] w-[184px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg bg-superficie-alta px-4"
          >
            {item.logo ? (
              <LogoRemoto src={item.logo} nombre="" className="max-h-6" />
            ) : null}
            <span className="text-h4 text-center leading-tight">
              {item.nombre}
            </span>
          </div>
        ))}
      </div>

      {/* En escritorio van como etiquetas, con el ícono adentro cuando lo hay:
          el mismo dato que en mobile, en la forma que pide la maqueta. */}
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        {items.map((item) => (
          <Chip key={item.id} className="flex items-center gap-2 px-4 py-2">
            {item.logo ? (
              <LogoRemoto src={item.logo} nombre="" className="max-h-4" />
            ) : null}
            {item.nombre}
          </Chip>
        ))}
      </div>
    </div>
  );
}
