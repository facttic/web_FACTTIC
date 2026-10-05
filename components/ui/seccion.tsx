import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Piezas de estructura que se repiten en todas las pantallas: el rótulo con el
 * título de sección, la tarjeta y la banda de llamada a la acción.
 */

/**
 * La sección es un flex en columna —no un bloque— para que el encabezado pueda
 * mandar su acción al pie en mobile sin repetirla en el HTML. Ver
 * `EncabezadoSeccion` y su prop `accionAlPie`.
 */
export function Seccion({
  children,
  id,
  className,
}: {
  children: ReactNode;
  /** Ancla para los enlaces del menú secundario (`/nuestros-servicios#soluciones`). */
  id?: string;
  className?: string;
}) {
  /*
    64px de aire arriba y abajo en desktop, o sea 128 entre dos secciones
    seguidas. Medido sobre el SVG: del pie de un bloque al rótulo del siguiente
    hay entre 88 y 195px según la sección —el diseño no es parejo— y 128 es el
    punto que deja el ritmo general alineado. Con los 96px que había antes, la
    página terminaba 542px más larga que la maqueta.

    En mobile el board es bastante más compacto: entre el pie de una sección y
    el rótulo de la siguiente hay 54-62px, así que 28 por lado.
  */
  return (
    <section
      id={id}
      className={cn("contenedor flex flex-col py-7 md:py-16", className)}
    >
      {children}
    </section>
  );
}

/**
 * Encabezado de sección: rótulo chico arriba, título grande, y una acción
 * opcional alineada a la derecha en desktop.
 */
export function EncabezadoSeccion({
  rotulo,
  rotuloMobile,
  titulo,
  tituloMobile,
  descripcion,
  descripcionSoloMobile = false,
  accion,
  accionAlPie = false,
  descripcionAlLado = false,
  alineacion = "izquierda",
  tamanoTitulo = "h1",
  className,
}: {
  rotulo?: string;
  /** El rótulo cambia entre maquetas en algunas pantallas ("Verticales" en
   *  desktop, "Industrias" en mobile). */
  rotuloMobile?: string;
  titulo: ReactNode;
  /** El título también cambia entre maquetas en algunas pantallas. */
  tituloMobile?: ReactNode;
  descripcion?: ReactNode;
  /**
   * Algunas secciones llevan bajada solo en mobile: en las verticales el
   * prototipo de desktop va directo del título a las tarjetas y el board mobile
   * suma "La tecnología es nuestra herramienta…".
   */
  descripcionSoloMobile?: boolean;
  accion?: ReactNode;
  /**
   * En mobile la maqueta baja el botón al final de la sección, después del
   * contenido, en vez de dejarlo pegado al título. Con esto el encabezado se
   * vuelve `display: contents` en mobile: sus partes pasan a ser hijas directas
   * del flex de `Seccion` y la acción se manda al final con `order`, sin
   * repetir el enlace en el HTML.
   */
  accionAlPie?: boolean;
  /**
   * En Servicios la bajada va en una segunda columna, a la derecha del título,
   * en vez de debajo. En mobile siempre queda debajo.
   */
  descripcionAlLado?: boolean;
  /**
   * Cómo se alinea el encabezado. No hay una regla única entre pantallas: la
   * Home centra todo en mobile y alinea a la izquierda en desktop, mientras que
   * Servicios va a la izquierda en las dos. Por eso son tres valores y no un
   * comportamiento automático.
   */
  alineacion?:
    "izquierda" | "centro" | "centro-en-mobile" | "centro-en-desktop";
  /**
   * Los títulos de sección no son todos H1: en las verticales van en H2, y el
   * de aliados también en Nuestros servicios. Medido maqueta por maqueta.
   */
  tamanoTitulo?: "h1" | "h2";
  className?: string;
}) {
  const centradoSiempre = alineacion === "centro";
  const centradoEnMobile = centradoSiempre || alineacion === "centro-en-mobile";
  const centradoEnDesktop =
    centradoSiempre || alineacion === "centro-en-desktop";

  return (
    <header
      className={cn(
        centradoEnMobile ? "text-center" : "text-left",
        accionAlPie ? "contents md:mb-8 md:block" : "mb-8",
        centradoEnDesktop ? "md:text-center" : "md:text-left",
        className,
      )}
    >
      {rotulo ? (
        <p className="text-eyebrow text-blanco/40">
          {rotuloMobile ? (
            <>
              <span className="md:hidden">{rotuloMobile}</span>
              <span className="hidden md:inline">{rotulo}</span>
            </>
          ) : (
            rotulo
          )}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-3 flex flex-col gap-6",
          centradoEnMobile ? "items-center" : "items-start",
          accionAlPie && "contents md:mt-3 md:flex",
          centradoEnDesktop
            ? "md:items-center"
            : "md:flex-row md:items-end md:justify-between",
        )}
      >
        {/*
          El título no se acota: en el diseño los cortes de línea son
          deliberados —vienen como saltos en el texto— y no producto de un ancho
          máximo. Con un límite acá, "Solucionamos con tecnología e innovación"
          se partía en dos cuando el diseño lo deja en una. La bajada sí se
          acota, que es donde importa el largo de línea para leer.
        */}
        <div className={cn("min-w-0", accionAlPie && "mt-3 mb-8 md:my-0")}>
          {/*
            Los saltos del contenido son los cortes de línea que el diseño eligió
            para desktop. En mobile no entran —el ancho es la mitad— y la maqueta
            reparte distinto, así que ahí se ignoran y el balance del navegador
            arma las líneas parejas.
          */}
          {/*
            En mobile el board escribe todos los títulos de sección en
            `H2/Mobile` —26px—, sin importar cuál de los dos tamaños usen en
            desktop. Por eso el salto va con `md:`.
          */}
          <h2
            className={cn(
              "text-balance whitespace-normal md:whitespace-pre-line",
              tamanoTitulo === "h1" ? "text-h2 md:text-h1" : "text-h2",
            )}
          >
            {tituloMobile ? (
              <>
                <span className="whitespace-pre-line md:hidden">
                  {tituloMobile}
                </span>
                <span className="hidden md:inline">{titulo}</span>
              </>
            ) : (
              titulo
            )}
          </h2>
          {descripcion && !descripcionAlLado ? (
            <p
              className={cn(
                "text-p1 mt-4 max-w-2xl whitespace-pre-line text-blanco/60",
                descripcionSoloMobile && "md:hidden",
              )}
            >
              {descripcion}
            </p>
          ) : null}
        </div>
        {descripcion && descripcionAlLado ? (
          <p className="text-p1 mt-4 max-w-xl whitespace-pre-line text-blanco/60 md:mt-0 md:flex-1">
            {descripcion}
          </p>
        ) : null}
        {accion ? (
          <div
            className={cn(
              "w-full shrink-0 [&>a]:w-full [&>button]:w-full md:w-auto md:[&>a]:w-auto md:[&>button]:w-auto",
              // order-1 la manda al final del flex de la sección; el resto de
              // los bloques queda en order 0 y conserva el orden del HTML.
              accionAlPie && "order-1 mt-10 md:order-none md:mt-0",
            )}
          >
            {accion}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function Tarjeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-borde bg-superficie", className)}
    >
      {children}
    </div>
  );
}

/**
 * Banda de conversión con borde punteado que cierra casi todas las páginas
 * ("¿Tenés algún proyecto en mente?", "¿Querés ser parte de la red?").
 *
 * Va siempre punteada: QA pidió el 10/8 que el componente tenga un solo
 * estilo, así que las variantes de vidrio quedaron sin usar en todo el sitio.
 * Se conservan porque son las que dibujan las maquetas mobile de Sumá tu coop
 * y Novedades, que todavía no se revisaron.
 */
export function BandaCta({
  titulo,
  accion,
  variante = "punteada",
  alineacion = "centro-en-mobile",
  claseTitulo,
  className,
}: {
  titulo: ReactNode;
  accion: ReactNode;
  /**
   * El cuerpo del título. En mobile no es parejo entre bandas: la de la Home
   * va en `H2/Mobile` y la de Nuestros servicios, que tiene tres renglones, en
   * `H3/Mobile`.
   */
  claseTitulo?: string;
  /**
   * `vidrio` es la que va sobre una animación de fondo: en vez del borde
   * punteado lleva un vidrio esmerilado que deja pasar el color de atrás
   * atenuado y difuminado. Se usa en Servicios, sobre el sol naranja.
   *
   * `vidrio-en-mobile` es la de Sumá tu coop, donde las maquetas no coinciden:
   * mobile la dibuja de vidrio y desktop con el borde punteado.
   */
  variante?: "punteada" | "vidrio" | "vidrio-en-mobile";
  /**
   * En mobile la Home centra sus bandas y Servicios las alinea a la izquierda,
   * igual que pasa con los encabezados.
   */
  alineacion?: "centro-en-mobile" | "izquierda";
  className?: string;
}) {
  return (
    <div
      className={cn(
        // En mobile la banda va centrada y con el botón debajo del título.
        "flex flex-col gap-12 rounded-xl px-6 py-14",
        variante !== "vidrio" && "border",
        alineacion === "centro-en-mobile"
          ? "items-center text-center"
          : "items-start text-left",
        /*
          Vidrio esmerilado: apenas tiñe. Medido sobre la maqueta, deja pasar
          entre el 85 y el 98% del color de atrás, así que lo que hace el
          efecto es el desenfoque y el grano, no una capa oscura. Con más
          opacidad el naranja desaparece.
        */
        variante === "vidrio" &&
          "textura-ruido borde-degradado bg-negro/15 backdrop-blur-2xl",
        variante === "vidrio-en-mobile" &&
          "textura-ruido borde-degradado bg-negro/15 backdrop-blur-2xl md:border-dashed md:border-borde-pleno md:bg-transparent md:backdrop-blur-none",
        variante === "punteada" && "border-dashed border-borde-pleno",
        // 113px de alto en el SVG: el botón mide 53 y quedan 30 arriba y abajo.
        "md:flex-row md:items-center md:justify-between md:gap-6 md:px-10 md:py-7.5 md:text-left",
        // Contiene el reflejo, que se recorta contra el radio de la tarjeta.
        "relative isolate overflow-hidden",
        className,
      )}
    >
      {/* Un reflejo de vidrio cruza la tarjeta cada tanto. Es lo único que se
          mueve en la banda: el resto queda quieto, como en la maqueta.

          Va apenas insinuado —blanco al 10%, difuminado—: tiene que leerse
          como un reflejo sobre el panel y no como una barra de luz. */}
      <span
        aria-hidden
        className="reflejo-de-vidrio pointer-events-none absolute inset-y-[-60%] -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-blanco/18 to-transparent blur-lg"
      />
      <p className={cn("text-h2 text-balance", claseTitulo)}>{titulo}</p>
      {/* A lo ancho de la tarjeta en mobile, como en el board; en desktop el
          botón va al lado del título y toma el ancho de su texto. */}
      <div className="w-full shrink-0 *:w-full md:w-auto md:*:w-auto">
        {accion}
      </div>
    </div>
  );
}
