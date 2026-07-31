import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  FONDO_ACENTO,
  HOVER_ACENTO,
  type Acento,
} from "@/components/ui/acento";
import { Tarjeta } from "@/components/ui/seccion";
import { BotonTexto } from "@/components/ui/boton";
import { Contador } from "@/components/ui/contador";

/**
 * Bloques de contenido que se repiten a lo largo del sitio: beneficios,
 * métricas y oportunidades. Todos tienen una versión neutra sobre la superficie
 * oscura y otra pintada con un acento de la paleta.
 */

/** Alto de la tarjeta de beneficio en el SVG (287x312), para que las dos capas coincidan. */
const ALTO_BENEFICIO = "h-78";

/**
 * Beneficio de la red ("Continuidad de trabajo", "Colaboración real, no
 * competencia").
 *
 * En reposo muestra la ilustración con el título centrado abajo; al pasar el
 * mouse se pinta con su color y aparece la descripción, como en el prototipo.
 * Por eso el board del diseño trae las dos variantes de la misma tarjeta.
 *
 * Las dos capas van superpuestas y se cruzan en opacidad, así el texto no se
 * reacomoda a mitad de la transición.
 */
export function CardBeneficioHover({
  titulo,
  descripcion,
  ilustracion,
  acento,
  className,
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  ilustracion?: ReactNode;
  acento: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-borde bg-superficie",
        "transition-colors duration-300 hover:border-transparent",
        HOVER_ACENTO[acento],
        ALTO_BENEFICIO,
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center transition-opacity duration-300 group-hover:opacity-0">
        {ilustracion ? (
          <div className="grid flex-1 place-items-center">{ilustracion}</div>
        ) : (
          <div className="flex-1" />
        )}
        <h3 className="text-h4 text-balance">{titulo}</h3>
      </div>

      <div
        className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <h3 className="text-h4 text-balance">{titulo}</h3>
        {descripcion ? <p className="text-p2">{descripcion}</p> : null}
      </div>
    </div>
  );
}

/**
 * Variante fija, sin cruce de estados: útil para el catálogo y para donde se
 * quiera mostrar directamente una de las dos caras.
 */
export function CardBeneficio({
  titulo,
  descripcion,
  ilustracion,
  acento,
  className,
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  ilustracion?: ReactNode;
  acento?: Acento;
  className?: string;
}) {
  if (acento) {
    return (
      <div
        className={cn(
          "flex flex-col gap-8 rounded-xl p-6",
          FONDO_ACENTO[acento],
          className,
        )}
      >
        <h3 className="text-h4 text-balance">{titulo}</h3>
        {descripcion ? (
          <p className="text-p2 opacity-80">{descripcion}</p>
        ) : null}
      </div>
    );
  }

  return (
    <Tarjeta
      className={cn(
        "flex flex-col items-center gap-6 p-6 text-center",
        className,
      )}
    >
      {ilustracion ? (
        <div className="grid h-24 place-items-center">{ilustracion}</div>
      ) : (
        <div className="h-24" />
      )}
      <h3 className="text-h4 text-balance">{titulo}</h3>
      {descripcion ? (
        <p className="text-p2 text-blanco/60">{descripcion}</p>
      ) : null}
    </Tarjeta>
  );
}

/**
 * Métrica de la red (+500 profesionales, +30 cooperativas, +10 provincias):
 * rótulo arriba y número grande abajo, con el bloque bien alto.
 */
export function CardMetrica({
  rotulo,
  valor,
  acento,
  acentoHover,
  className,
}: {
  rotulo: string;
  /**
   * Con un número el valor cuenta hasta llegar, como pide la anotación
   * "Animación de conteo" del diseño. Con texto se muestra tal cual.
   */
  valor: number | ReactNode;
  /** Color fijo, para mostrar la tarjeta ya pintada. */
  acento?: Acento;
  /** Color que toma al pasar el mouse, que es como va en la Home. */
  acentoHover?: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // 394x312 con radio 8 en el SVG; 78 = 312px.
        "flex min-h-78 flex-col justify-between rounded-lg p-6 transition-colors duration-300",
        acento ? FONDO_ACENTO[acento] : "bg-superficie-alta text-blanco",
        acentoHover ? HOVER_ACENTO[acentoHover] : null,
        className,
      )}
    >
      {/*
        El rótulo va con opacidad y no con un color fijo: hereda el del
        contenedor, que pasa de claro a oscuro cuando la tarjeta se pinta. Con
        `text-blanco/70` quedaba ilegible sobre el lima.
      */}
      <p className="text-eyebrow opacity-70">{rotulo}</p>
      <p className="text-display">
        {typeof valor === "number" ? (
          <Contador valor={valor} prefijo="+" />
        ) : (
          valor
        )}
      </p>
    </div>
  );
}

/**
 * Oportunidad de "Sumá tu coop": una cabecera de color con el número y la
 * pregunta, y debajo un panel con la explicación y el enlace.
 */
export function CardOportunidad({
  indice,
  pregunta,
  descripcion,
  enlace,
  acento,
  className,
}: {
  indice: number;
  pregunta: ReactNode;
  descripcion: ReactNode;
  enlace?: { texto: string; href: string };
  acento: Acento;
  className?: string;
}) {
  const numero = String(indice + 1).padStart(2, "0");

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className={cn(
          "flex aspect-square flex-col justify-between rounded-xl p-6",
          FONDO_ACENTO[acento],
        )}
      >
        <p className="text-h4">{numero}.</p>
        <p className="text-h3 text-balance">{pregunta}</p>
      </div>

      <div className="flex flex-1 flex-col rounded-xl bg-superficie-alta p-6">
        <p className="text-h4">{numero}.</p>
        <p className="text-p2 mt-4 flex-1 text-blanco/80">{descripcion}</p>
        {enlace ? (
          <>
            <div className="mt-8 border-t border-blanco/20" />
            <BotonTexto href={enlace.href} className="mt-4">
              {enlace.texto}
            </BotonTexto>
          </>
        ) : null}
      </div>
    </div>
  );
}
