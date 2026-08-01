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
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  /*
    64px de aire arriba y abajo, o sea 128 entre dos secciones seguidas.
    Medido sobre el SVG: del pie de un bloque al rótulo del siguiente hay entre
    88 y 195px según la sección —el diseño no es parejo— y 128 es el punto que
    deja el ritmo general alineado. Con los 96px que había antes, la página
    terminaba 542px más larga que la maqueta.
  */
  return (
    <section
      className={cn("contenedor flex flex-col py-12 md:py-16", className)}
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
  titulo,
  descripcion,
  accion,
  accionAlPie = false,
  alineacion = "izquierda",
  className,
}: {
  rotulo?: string;
  titulo: ReactNode;
  descripcion?: ReactNode;
  accion?: ReactNode;
  /**
   * En mobile la maqueta baja el botón al final de la sección, después del
   * contenido, en vez de dejarlo pegado al título. Con esto el encabezado se
   * vuelve `display: contents` en mobile: sus partes pasan a ser hijas directas
   * del flex de `Seccion` y la acción se manda al final con `order`, sin
   * repetir el enlace en el HTML.
   */
  accionAlPie?: boolean;
  /** El diseño centra algunos bloques, como "Sectores" en la Home. */
  alineacion?: "izquierda" | "centro";
  className?: string;
}) {
  const centrado = alineacion === "centro";

  /*
    En mobile la maqueta centra todos los encabezados y estira la acción a lo
    ancho; la alineación que llega por prop solo decide qué pasa en desktop.
  */
  return (
    <header
      className={cn(
        "text-center",
        accionAlPie ? "contents md:mb-8 md:block" : "mb-8",
        centrado ? "md:text-center" : "md:text-left",
        className,
      )}
    >
      {rotulo ? <p className="text-eyebrow text-blanco/40">{rotulo}</p> : null}
      <div
        className={cn(
          "mt-3 flex flex-col items-center gap-6",
          accionAlPie && "contents md:mt-3 md:flex",
          centrado
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
          <h2 className="text-h1 whitespace-pre-line">{titulo}</h2>
          {descripcion ? (
            <p className="text-p1 mt-4 max-w-2xl text-blanco/60">
              {descripcion}
            </p>
          ) : null}
        </div>
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
 */
export function BandaCta({
  titulo,
  accion,
  className,
}: {
  titulo: ReactNode;
  accion: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // En mobile la banda va centrada y con el botón debajo del título.
        "flex flex-col items-center gap-6 rounded-xl border border-dashed border-borde-pleno px-6 py-10 text-center",
        // 113px de alto en el SVG: el botón mide 53 y quedan 30 arriba y abajo.
        "md:flex-row md:items-center md:justify-between md:px-10 md:py-7.5 md:text-left",
        className,
      )}
    >
      <p className="text-h2 text-balance">{titulo}</p>
      <div className="shrink-0">{accion}</div>
    </div>
  );
}
