import { cn } from "@/lib/cn";
import { BotonLink } from "@/components/ui/boton";
import { RevelarAlScroll, Typewriter } from "./texto-animado";

/**
 * Encabezado principal de la Home.
 *
 * Sigue las indicaciones de los comentarios del diseño:
 *   - el fondo es un video, no una foto;
 *   - el título entra con efecto máquina de escribir unos segundos después de
 *     que arranca el video;
 *   - el título es un <h1> con el estilo Display;
 *   - la bajada se revela al entrar en pantalla.
 *
 * Mientras no esté el video exportado, cae a la imagen y, si tampoco hay, a un
 * degradado con la paleta.
 */

/** Cuánto espera el título antes de escribirse, para dejar correr el video. */
const RETRASO_TITULO_MS = 2000;

export function Hero({
  titulo,
  bajada,
  accion,
  video,
  imagen,
  className,
}: {
  titulo: string;
  bajada?: string;
  accion?: { texto: string; href: string };
  /** Video de fondo; se reproduce en silencio y en bucle. */
  video?: string;
  /** Imagen de fondo, o póster del video mientras carga. */
  imagen?: string;
  className?: string;
}) {
  return (
    <section className={cn("contenedor pt-6", className)}>
      <div className="relative isolate overflow-hidden rounded-2xl">
        {video ? (
          <video
            className="absolute inset-0 -z-10 size-full object-cover"
            src={video}
            poster={imagen}
            autoPlay
            muted
            loop
            playsInline
            // Decorativo: el contenido está en el título y la bajada.
            aria-hidden
          />
        ) : imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_20%_0%,var(--color-gris-oscuro)_0%,var(--color-negro)_45%,var(--color-negro-oscuro)_100%)]" />
        )}

        {video || imagen ? (
          <div className="absolute inset-0 -z-10 bg-negro-oscuro/55" />
        ) : null}

        <div className="flex min-h-[26rem] flex-col justify-end gap-8 p-6 md:min-h-[34rem] md:p-12">
          <h1 className="text-display max-w-3xl text-balance">
            <Typewriter texto={titulo} retrasoMs={RETRASO_TITULO_MS} />
          </h1>

          <RevelarAlScroll retrasoMs={RETRASO_TITULO_MS}>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              {bajada ? (
                <p className="text-p1 max-w-xl text-blanco/80">{bajada}</p>
              ) : null}
              {accion ? (
                <BotonLink
                  href={accion.href}
                  variante="solida"
                  className="self-start md:self-auto"
                >
                  {accion.texto}
                </BotonLink>
              ) : null}
            </div>
          </RevelarAlScroll>
        </div>
      </div>
    </section>
  );
}
