import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  FONDO_ACENTO,
  HOVER_ACENTO,
  type Acento,
} from "@/components/ui/acento";
import { FOCO } from "@/components/ui/boton";
import { Tarjeta } from "@/components/ui/seccion";

/**
 * Tarjetas que muestran un título y revelan la explicación sobre un fondo de
 * color. Es el mismo patrón en tres lugares del diseño —"Card servicio",
 * "Card por qué elegirnos" y las obligaciones de Sumá tu coop— así que se
 * resuelven con un componente y no con tres casi iguales.
 */

/**
 * Servicio o propuesta de valor. Sin `acento` queda el estado de reposo, con
 * borde y solo el título; con `acento` se despliega la descripción y el nombre
 * del servicio pasa abajo como rótulo.
 */
export function CardServicio({
  titulo,
  descripcion,
  acento,
  rotulo,
  className,
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  acento?: Acento;
  /** Texto chico al pie; por defecto repite el título. */
  rotulo?: string;
  className?: string;
}) {
  if (!acento) {
    return (
      <div
        className={cn(
          "flex min-h-44 flex-col rounded-xl border border-blanco/40 p-6",
          className,
        )}
      >
        <h3 className="text-h4 text-balance">{titulo}</h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-44 flex-col justify-between gap-8 rounded-xl p-6",
        FONDO_ACENTO[acento],
        className,
      )}
    >
      {descripcion ? <p className="text-p2">{descripcion}</p> : null}
      <p className="text-eyebrow opacity-60">
        {rotulo ?? (typeof titulo === "string" ? titulo : "")}
      </p>
    </div>
  );
}

/**
 * Tarjeta del servicio siguiente: en reposo muestra solo el título y al pasar
 * el mouse se pinta con su color y revela la descripción, igual que la del
 * servicio activo. Al hacer clic avanza a ese servicio.
 *
 * Las dos caras van superpuestas y se cruzan en opacidad, así el texto no se
 * reacomoda a mitad de la transición.
 */
export function CardServicioSiguiente({
  titulo,
  descripcion,
  acento,
  onClick,
  className,
}: {
  titulo: string;
  descripcion?: ReactNode;
  acento: Acento;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver ${titulo}`}
      className={cn(
        // 599x235 con radio 20 en el SVG de la Home, y borde blanco pleno.
        // Es una caja ancha y baja, no el cuadrado de las otras tarjetas.
        "group relative h-[235px] cursor-pointer overflow-hidden rounded-[20px] text-left",
        "border border-borde-pleno transition-colors duration-300 hover:border-transparent",
        HOVER_ACENTO[acento],
        FOCO,
        className,
      )}
    >
      <span className="absolute inset-0 flex flex-col p-11 transition-opacity duration-300 group-hover:opacity-0">
        <span className="text-h3 whitespace-pre-line">{titulo}</span>
      </span>

      <span
        className="absolute inset-0 flex flex-col justify-between gap-8 p-11 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        {descripcion ? <span className="text-p2">{descripcion}</span> : null}
        <span className="text-eyebrow opacity-60">{titulo}</span>
      </span>
    </button>
  );
}

/**
 * Modalidad de trabajo (Proyectos a medida, Managed Services, Staff
 * Augmentation): bloque de color alto con el nombre abajo a la izquierda.
 */
export function CardMetodologia({
  nombre,
  descripcion,
  acento,
  className,
}: {
  nombre: ReactNode;
  /** Se revela al pasar el mouse, con el nombre arriba como rótulo. */
  descripcion?: string;
  acento: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative min-h-44 overflow-hidden rounded-lg",
        // Al revés que el resto: acá el reposo es el color y el mouse la apaga
        // a gris para dejar leer la explicación. Así está en el board.
        FONDO_ACENTO[acento],
        descripcion &&
          "transition-colors duration-300 hover:bg-superficie-alta",
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-h4 text-balance">{nombre}</h3>
      </div>

      {descripcion ? (
        <div
          className="absolute inset-0 flex flex-col gap-6 p-6 text-blanco opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <p className="text-eyebrow text-blanco/50">{nombre}</p>
          <p className="text-p2">{descripcion}</p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Requisito o compromiso de "Sumá tu coop" ("Ser una cooperativa o
 * precooperativa"). Solo lleva título; la variante `contorno` se usa cuando van
 * sobre un fondo ya claro.
 */
export function CardRequisito({
  titulo,
  variante = "solida",
  className,
}: {
  titulo: ReactNode;
  variante?: "solida" | "contorno";
  className?: string;
}) {
  if (variante === "contorno") {
    return (
      <Tarjeta
        className={cn(
          "flex min-h-32 items-start bg-transparent p-6",
          className,
        )}
      >
        <h3 className="text-h4 text-balance">{titulo}</h3>
      </Tarjeta>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-32 items-start rounded-xl bg-superficie-alta p-6",
        className,
      )}
    >
      <h3 className="text-h4 text-balance">{titulo}</h3>
    </div>
  );
}

/**
 * Propuesta de valor ("¿Por qué elegirnos?").
 *
 * Dos caras, como casi todas las tarjetas del sitio: en reposo el título sobre
 * la superficie gris y, al pasar el mouse, se pinta con su color y aparece la
 * explicación. El board de Componentes trae las dos.
 *
 * Las capas van superpuestas y se cruzan en opacidad para que el texto no se
 * reacomode a mitad de la transición.
 */
export function CardPropuesta({
  titulo,
  descripcion,
  acento,
  className,
}: {
  titulo: string;
  descripcion?: string;
  acento: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-superficie-alta",
        "transition-colors duration-300",
        HOVER_ACENTO[acento],
        className,
      )}
    >
      <div className="absolute inset-0 p-6 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-h4 text-balance">{titulo}</h3>
      </div>

      {descripcion ? (
        <div
          className="absolute inset-0 flex items-start p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <p className="text-p2">{descripcion}</p>
        </div>
      ) : null}
    </div>
  );
}
