import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FONDO_ACENTO, type Acento } from "@/components/ui/acento";
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
 * Modalidad de trabajo (Proyectos a medida, Managed Services, Staff
 * Augmentation): bloque de color alto con el nombre abajo a la izquierda.
 */
export function CardMetodologia({
  nombre,
  acento,
  className,
}: {
  nombre: ReactNode;
  acento: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col justify-end rounded-xl p-6",
        FONDO_ACENTO[acento],
        className,
      )}
    >
      <h3 className="text-h4 text-balance">{nombre}</h3>
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
