import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Seccion, BandaCta } from "@/components/ui/seccion";
import { BotonLink } from "@/components/ui/boton";
import { Chip } from "@/components/ui/chip";
import { CardNovedad } from "@/components/tarjetas/novedad";
import { NOVEDADES as T } from "@/lib/contenido";
import { getNovedad, getNovedades } from "@/lib/datos/novedades";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const novedad = await getNovedad(slug);
  if (!novedad) return {};
  return { title: novedad.titulo, description: novedad.bajada ?? undefined };
}

/** Fecha como la escribe la maqueta: "4 nov, 2025". */
function fechaCorta(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const mes = d
    .toLocaleDateString("es-AR", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  return `${d.getUTCDate()} ${mes}, ${d.getUTCFullYear()}`;
}

/**
 * Detalle de novedad.
 *
 * El contenido va sobre una tarjeta de vidrio con la imagen de fondo
 * difuminada detrás, como en la maqueta: la foto de portada no se muestra
 * entera sino que tiñe la tarjeta.
 */
export default async function NovedadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const novedad = await getNovedad(slug);
  if (!novedad) notFound();

  const { items } = await getNovedades(4);
  const otras = items.filter((otra) => otra.id !== novedad.id).slice(0, 2);

  return (
    <>
      <Seccion className="pt-24 md:pt-32">
        <article className="relative isolate overflow-hidden rounded-2xl">
          {/* La imagen queda de fondo, difuminada y oscurecida. */}
          {novedad.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={novedad.imagen}
              alt=""
              className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-40 blur-xl"
            />
          ) : null}

          <div className="borde-degradado textura-ruido bg-negro/40 p-6 backdrop-blur-sm md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {novedad.fecha ? (
                <time
                  dateTime={novedad.fecha}
                  className="text-p3 text-blanco/70"
                >
                  {fechaCorta(novedad.fecha)}
                </time>
              ) : (
                <span />
              )}
              <Chip className="bg-blanco text-negro-oscuro">
                {T.solapas[novedad.tipo]}
              </Chip>
            </div>

            <h1 className="text-h1 mt-8 max-w-3xl text-balance">
              {novedad.titulo}
            </h1>

            {novedad.bajada ? (
              <p className="text-p1 mt-6 max-w-3xl text-blanco/80">
                {novedad.bajada}
              </p>
            ) : null}

            {novedad.cuerpo ? (
              // El cuerpo viene como texto plano: cada línea en blanco separa
              // un párrafo.
              <div className="mt-8 flex max-w-3xl flex-col gap-5">
                {novedad.cuerpo
                  .split(/\n{2,}/)
                  .map((parrafo) => parrafo.trim())
                  .filter(Boolean)
                  .map((parrafo) => (
                    <p key={parrafo} className="text-p2 text-blanco/80">
                      {parrafo}
                    </p>
                  ))}
              </div>
            ) : null}
          </div>
        </article>
      </Seccion>

      {otras.length ? (
        <Seccion className="pt-0">
          <div className="grid gap-5 md:grid-cols-2">
            {otras.map((otra) => (
              <CardNovedad key={otra.id} novedad={otra} />
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
