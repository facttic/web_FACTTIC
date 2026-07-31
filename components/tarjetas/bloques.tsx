import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FONDO_ACENTO, type Acento } from "@/components/ui/acento";
import { Tarjeta } from "@/components/ui/seccion";
import { BotonTexto } from "@/components/ui/boton";
import { Contador } from "@/components/ui/contador";

/**
 * Bloques de contenido que se repiten a lo largo del sitio: beneficios,
 * métricas y oportunidades. Todos tienen una versión neutra sobre la superficie
 * oscura y otra pintada con un acento de la paleta.
 */

/**
 * Beneficio de la red ("Continuidad de trabajo", "Colaboración real, no
 * competencia"). Sin acento va la ilustración arriba y el título centrado; con
 * acento, el título y la descripción sobre el color.
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
  className,
}: {
  rotulo: string;
  /**
   * Con un número el valor cuenta hasta llegar, como pide la anotación
   * "Animación de conteo" del diseño. Con texto se muestra tal cual.
   */
  valor: number | ReactNode;
  acento?: Acento;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col justify-between rounded-xl p-6",
        acento ? FONDO_ACENTO[acento] : "bg-superficie-alta text-blanco",
        className,
      )}
    >
      <p
        className={cn("text-eyebrow", acento ? "opacity-70" : "text-blanco/70")}
      >
        {rotulo}
      </p>
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
