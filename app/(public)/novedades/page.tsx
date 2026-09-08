import type { Metadata } from "next";
import Link from "next/link";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink, BotonFlechaLink } from "@/components/ui/boton";
import { SinResultados } from "@/components/ui/sin-resultados";
import { CardNovedad } from "@/components/tarjetas/novedad";
import { NOVEDADES as T } from "@/lib/contenido";
import { getNovedades } from "@/lib/datos/novedades";
import type { TipoNovedad } from "@/lib/dominio/tipos";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

export const metadata: Metadata = {
  title: "Novedades",
  description: T.hero.bajada,
};

const POR_PAGINA = 6;
const TIPOS: TipoNovedad[] = ["comunicado", "noticia", "actividad"];

/**
 * Novedades: comunicados, noticias y actividades.
 *
 * Las solapas y el "Ver más" viven en la URL, igual que los filtros de
 * Proyectos: cada combinación es un enlace que se puede compartir y todo
 * funciona sin JavaScript. La solapa activa filtra por `tipo`.
 */
export default async function NovedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const uno = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const tipoPedido = uno(params.tipo);
  const tipo = TIPOS.includes(tipoPedido as TipoNovedad)
    ? (tipoPedido as TipoNovedad)
    : undefined;
  const pagina = Math.max(1, Number(uno(params.pagina)) || 1);

  // Se trae de más y se filtra acá porque la API no filtra por tipo todavía.
  const { items, total } = await getNovedades(
    POR_PAGINA * pagina * TIPOS.length,
  );
  const delTipo = tipo ? items.filter((n) => n.tipo === tipo) : items;
  const visibles = delTipo.slice(0, POR_PAGINA * pagina);
  const hayMas = delTipo.length > visibles.length || items.length < total;

  const enlace = (destino: { tipo?: string; pagina?: number }) => {
    const query = new URLSearchParams();
    if (destino.tipo) query.set("tipo", destino.tipo);
    if (destino.pagina && destino.pagina > 1)
      query.set("pagina", String(destino.pagina));
    return `/novedades${query.size ? `?${query}` : ""}`;
  };

  const solapas = [
    { id: undefined, etiqueta: T.solapas.todos },
    ...TIPOS.map((t) => ({ id: t, etiqueta: T.solapas[t] })),
  ];
  const indiceSolapa = solapas.findIndex((s) => s.id === tipo);

  return (
    <>
      <Seccion className="pt-24 md:pt-32">
        <h1 className="text-h1 whitespace-pre-line">{T.hero.titulo}</h1>
        <p className="text-p1 mt-6 max-w-2xl text-blanco/80">{T.hero.bajada}</p>

        {/* Las solapas son enlaces, así que filtran sin JavaScript. En mobile
            el board suma las flechas a la derecha, por encima de la línea; son
            enlaces también, a la solapa de al lado. */}
        <div className="relative mt-12 md:mt-16">
          <div
            role="tablist"
            aria-label="Tipo de novedad"
            className="scroll-limpio flex gap-8 overflow-x-auto border-b border-borde pr-28 md:pr-0"
          >
            {solapas.map((solapa) => {
              const activa = solapa.id === tipo;
              return (
                <Link
                  key={solapa.etiqueta}
                  role="tab"
                  aria-selected={activa}
                  href={enlace({ tipo: solapa.id })}
                  scroll={false}
                  className={cn(
                    "text-h4 -mb-px shrink-0 border-b-2 pb-3 transition-colors",
                    FOCO,
                    activa
                      ? "border-lila text-lila"
                      : "border-transparent text-blanco/40 hover:text-blanco/70",
                  )}
                >
                  {solapa.etiqueta}
                </Link>
              );
            })}
          </div>

          {/* Con relleno propio: la lista se desplaza por debajo. */}
          <div className="bg-fondo absolute right-0 bottom-2.5 flex items-center gap-2 pl-3 md:hidden">
            <BotonFlechaLink
              direccion="anterior"
              href={
                indiceSolapa > 0
                  ? enlace({ tipo: solapas[indiceSolapa - 1].id })
                  : undefined
              }
            />
            <BotonFlechaLink
              direccion="siguiente"
              variante={
                indiceSolapa < solapas.length - 1 ? "solida" : "punteada"
              }
              href={
                indiceSolapa < solapas.length - 1
                  ? enlace({ tipo: solapas[indiceSolapa + 1].id })
                  : undefined
              }
            />
          </div>
        </div>
      </Seccion>

      <Seccion className="pt-0">
        {visibles.length ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {visibles.map((novedad) => (
                <CardNovedad key={novedad.id} novedad={novedad} />
              ))}
            </div>

            {hayMas ? (
              <div className="mt-10 flex justify-center">
                <BotonLink
                  href={enlace({ tipo, pagina: pagina + 1 })}
                  scroll={false}
                  className="w-full md:w-auto md:min-w-72"
                >
                  {T.verMas}
                </BotonLink>
              </div>
            ) : null}
          </>
        ) : (
          <SinResultados titulo={T.vacio.titulo}>
            {T.vacio.sugerencia}
          </SinResultados>
        )}
      </Seccion>

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
