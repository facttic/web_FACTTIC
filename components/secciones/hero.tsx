import { cn } from "@/lib/cn";
import { BotonLink } from "@/components/ui/boton";
import { RevelarAlScroll, RevelarPalabras, Typewriter } from "./texto-animado";

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
/**
 * Cuándo se enciende la bajada en mobile. El bloque entero aparece con el
 * mismo retraso que el título y tarda 700 ms en entrar; si el barrido de
 * palabras arranca ahí nomás, los dos efectos de opacidad se pisan y no se
 * lee ninguno. Espera a que el bloque esté casi puesto.
 */
const RETRASO_BAJADA_MS = RETRASO_TITULO_MS + 400;

export function Hero({
  titulo,
  tituloMobile,
  bajada,
  bajadaMobile,
  accion,
  video,
  videoMobile,
  imagen,
  className,
}: {
  titulo: string;
  /** Variante para pantallas chicas: el diseño mobile suma una línea. */
  tituloMobile?: string;
  bajada?: string;
  /** Variante para pantallas chicas: la maqueta mobile la escribe más corta. */
  bajadaMobile?: string;
  accion?: { texto: string; href: string };
  /** Video de fondo; se reproduce en silencio y en bucle. */
  video?: string;
  /** Corte vertical para pantallas chicas. */
  videoMobile?: string;
  /** Imagen de fondo, o póster del video mientras carga. */
  imagen?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        // Radio 21 abajo, como el frame del diseño.
        "relative isolate -mt-[90px] overflow-hidden rounded-b-[21px]",
        className,
      )}
    >
      {video ? (
        <video
          className="paralaje-fondo absolute inset-0 -z-10 size-full object-cover"
          poster={imagen}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          // Decorativo: el contenido está en el título y la bajada.
          aria-hidden
        >
          {/*
           * Dos cortes distintos, no el mismo video escalado: el de mobile es
           * vertical y el de desktop apaisado. El navegador elige por media
           * query y descarga solo uno.
           */}
          {videoMobile ? (
            <source
              src={videoMobile}
              media="(max-width: 767px)"
              type="video/mp4"
            />
          ) : null}
          <source src={video} type="video/mp4" />
        </video>
      ) : imagen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagen}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="paralaje-fondo absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_20%_0%,var(--color-gris-oscuro)_0%,var(--color-negro)_45%,var(--color-negro-oscuro)_100%)]" />
      )}

      {video || imagen ? (
        <div className="absolute inset-0 -z-10 bg-negro-oscuro/55" />
      ) : null}

      {/*
        Las dos maquetas alinean a la izquierda y llevan el título arriba, la
        bajada abajo y el botón al pie. Lo que cambia es el reparto: en mobile
        el texto se apoya contra el borde inferior; en desktop el bloque es más
        bajo y la bajada y el botón van uno al lado del otro.

        En mobile el hero **no** ocupa la pantalla entera: la maqueta lo corta
        en 754 de 852 —un 88%— y deja asomar la sección siguiente, que es lo
        que avisa que hay más abajo. Con `min-h-svh` esa franja desaparecía y,
        como el reparto es `justify-between`, los 128 px de sobra se iban
        enteros al único hueco que hay —el de abajo del título—: la bajada y el
        botón quedaban 128 px más abajo que en el board.
      */}
      <div className="contenedor flex min-h-[88svh] flex-col justify-between pt-[121px] pb-11 md:min-h-[39rem] md:justify-end md:gap-8 md:pt-32 md:pb-14">
        <h1 className="text-display text-balance md:max-w-3xl">
          <Typewriter
            texto={titulo}
            textoAngosto={tituloMobile}
            retrasoMs={RETRASO_TITULO_MS}
          />
        </h1>

        <RevelarAlScroll retrasoMs={RETRASO_TITULO_MS}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            {bajada ? (
              <>
                {/*
                  La anotación "Animación: Scroll reveal" del archivo está
                  puesta sobre esta bajada: en mobile se lee sola a medida que
                  sube por la pantalla, palabra por palabra. En desktop es un
                  párrafo común —ahí la anotación no está— y además el texto es
                  más largo.
                */}
                <RevelarPalabras
                  texto={bajadaMobile ?? bajada}
                  retrasoMs={RETRASO_BAJADA_MS}
                  className="text-p1 max-w-xl text-blanco/80 md:hidden"
                />
                <p className="text-p1 hidden max-w-xl text-blanco/80 md:block">
                  {bajada}
                </p>
              </>
            ) : null}
            {accion ? (
              <BotonLink
                href={accion.href}
                variante="solida"
                tamano="lg"
                // A lo ancho en mobile, como en la maqueta; suelto en desktop.
                className="w-full md:w-auto md:self-auto"
              >
                {accion.texto}
              </BotonLink>
            ) : null}
          </div>
        </RevelarAlScroll>
      </div>
    </section>
  );
}
