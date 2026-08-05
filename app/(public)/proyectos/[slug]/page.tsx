import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoSeccion, Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Acordeon, type ItemAcordeon } from "@/components/ui/acordeon";
import { Chip, ChipSector } from "@/components/ui/chip";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import { PROYECTOS_PAGINA as T } from "@/lib/contenido";
import {
  getProyecto,
  getProyectos,
  getProyectosRelacionados,
} from "@/lib/datos/proyectos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) return {};
  return { title: proyecto.nombre, description: proyecto.desafio ?? undefined };
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) notFound();

  const [relacionados, ultimos] = await Promise.all([
    getProyectosRelacionados(proyecto),
    getProyectos({ porPagina: 5 }),
  ]);

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
      {/* La portada cruza la pantalla de punta a punta, como en la maqueta. */}
      {portada ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portada}
          alt=""
          className="h-56 w-full object-cover md:h-[470px]"
        />
      ) : null}

      <Seccion className={portada ? "pt-12 md:pt-16" : "pt-32 md:pt-40"}>
        <h1 className="text-h1 max-w-4xl text-balance">{proyecto.nombre}</h1>

        {/* Ficha: sector y servicios, separados por una línea punteada. */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {proyecto.sector ? (
            <div className="border-l border-dotted border-blanco/40 pl-4">
              <p className="text-eyebrow text-blanco/40">Sector</p>
              <div className="mt-2">
                <ChipSector nombre={proyecto.sector.nombre} />
              </div>
            </div>
          ) : null}
          {servicios ? (
            <div className="border-l border-dotted border-blanco/40 pl-4">
              <p className="text-eyebrow text-blanco/40">Servicios</p>
              <p className="text-p2 mt-2 text-blanco/80">{servicios}</p>
            </div>
          ) : null}
          {proyecto.cliente ? (
            <div className="border-l border-dotted border-blanco/40 pl-4">
              <p className="text-eyebrow text-blanco/40">Cliente</p>
              <p className="text-p2 mt-2 text-blanco/80">
                {proyecto.cliente.nombre}
              </p>
            </div>
          ) : null}
        </div>
      </Seccion>

      {resena.length ? (
        <Seccion>
          <EncabezadoSeccion titulo={T.detalle.resena} tamanoTitulo="h2" />
          <Acordeon
            items={resena}
            className="divide-dashed divide-gris-oscuro border-gris-oscuro"
          />
        </Seccion>
      ) : null}

      {proyecto.tecnologias.length ? (
        <Seccion className="py-0 md:py-0">
          <FichaEnLinea titulo={T.detalle.stack}>
            {proyecto.tecnologias.map((tecnologia) => (
              <Chip key={tecnologia.id} className="px-4 py-2">
                {tecnologia.nombre}
              </Chip>
            ))}
          </FichaEnLinea>
        </Seccion>
      ) : null}

      {galeria.length ? (
        <Seccion>
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

      {proyecto.cooperativas.length ? (
        <Seccion className="py-0 md:py-0">
          <FichaEnLinea titulo={T.detalle.cooperativas}>
            {proyecto.cooperativas.map((cooperativa) => (
              <Chip key={cooperativa.id} className="px-4 py-2">
                {cooperativa.nombre}
              </Chip>
            ))}
          </FichaEnLinea>
        </Seccion>
      ) : null}

      {relacionados.length ? (
        <Seccion>
          <EncabezadoSeccion
            titulo={T.detalle.relacionados}
            tamanoTitulo="h2"
          />
          <div className="flex flex-col gap-5 md:grid md:grid-cols-3">
            {relacionados.map((otro) => (
              <CardProyecto key={otro.id} proyecto={otro} alto="h-[310px]" />
            ))}
          </div>
        </Seccion>
      ) : null}

      {ultimos.items.length ? (
        <Seccion>
          <EncabezadoSeccion titulo={T.ultimos.titulo} tamanoTitulo="h2" />
          <div className="-mt-2">
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
 * Fila con el rótulo a la izquierda y chips a la derecha, entre líneas
 * punteadas: el "Stack tecnológico" y las "Cooperativas" del detalle.
 */
function FichaEnLinea({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-y border-dashed border-borde-pleno py-6 md:grid md:grid-cols-[352px_1fr] md:items-center md:gap-16">
      <h2 className="text-h2">{titulo}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
