import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FONDO_ACENTO } from "@/components/ui/acento";

/**
 * Resultado de una acción: lo que se ve después de mandar el formulario de
 * contacto, salga bien o mal.
 *
 * Va en bloque de color pleno, como las tarjetas pintadas del diseño, porque es
 * el recurso que el sistema usa para destacar. Lima para el éxito y rojo para
 * el error, los dos con texto oscuro —es lo que pasa contraste sobre esos
 * tonos—.
 *
 * `role="status"` hace que un lector de pantalla lo anuncie al aparecer, sin
 * interrumpir lo que esté leyendo. Es la diferencia entre enterarse de que el
 * mensaje se envió y quedarse esperando.
 */
export function Aviso({
  tono = "exito",
  titulo,
  children,
  className,
}: {
  tono?: "exito" | "error";
  titulo: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-4 rounded-lg p-6",
        FONDO_ACENTO[tono === "exito" ? "amarillo" : "rojo"],
        className,
      )}
    >
      <Marca tono={tono} />
      <div>
        <p className="text-h4">{titulo}</p>
        {children ? (
          <p className="text-p2 mt-2 opacity-80">{children}</p>
        ) : null}
      </div>
    </div>
  );
}

/** Tilde o cruz, con el mismo trazo fino que el resto de los iconos. */
function Marca({ tono }: { tono: "exito" | "error" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 size-6 shrink-0"
    >
      {tono === "exito" ? (
        <path d="M4 12.5 9.5 18 20 6.5" />
      ) : (
        <>
          <path d="M12 7v6" />
          <path d="M12 16.5v.5" />
          <circle cx="12" cy="12" r="9" />
        </>
      )}
    </svg>
  );
}
