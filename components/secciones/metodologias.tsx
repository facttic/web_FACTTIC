"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha } from "@/components/ui/boton";
import { FONDO_ACENTO, type Acento } from "@/components/ui/acento";

/**
 * "¿Cómo trabajamos?" en mobile: se ve una modalidad por vez y las flechas la
 * cambian. En desktop las tres pantallas usan otra cosa —bloques de color en
 * Nuestros servicios, desplegables en las verticales—, así que este componente
 * es solo para pantallas chicas.
 *
 * El board la dibuja de dos formas distintas según la pantalla y hay que
 * respetar las dos:
 *
 *  - `tarjeta` (Nuestros servicios): un panel pintado con el color de la
 *    modalidad, con el nombre y la descripción adentro y las flechas debajo.
 *  - `recuadro` (las verticales): la misma idea pero sin pintar, con un marco
 *    fino y el nombre en blanco. Ahí la pantalla ya tiene el color del sector
 *    repartido en otras piezas, y un panel pintado más se lee como otra
 *    sección y no como la misma modalidad.
 *
 * La vertical usaba antes una solapa subrayada en el color, con las flechas en
 * la misma línea del título. Se cambió porque la anotación de la maqueta pedía
 * justamente ajustar esa pantalla en mobile.
 */
export function Metodologias({
  items,
  variante = "tarjeta",
  className,
}: {
  items: readonly {
    titulo: string;
    acento: Acento;
    descripcion: string | null;
  }[];
  variante?: "tarjeta" | "recuadro";
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();

  if (!items.length) return null;

  const actual = items[activo];

  const flechas = (
    <>
      <BotonFlecha
        direccion="anterior"
        disabled={activo === 0}
        onClick={() => setActivo((i) => Math.max(0, i - 1))}
      />
      <BotonFlecha
        direccion="siguiente"
        variante={activo < items.length - 1 ? "solida" : "punteada"}
        disabled={activo === items.length - 1}
        onClick={() => setActivo((i) => Math.min(items.length - 1, i + 1))}
      />
    </>
  );

  /* `P1/Bold` en el archivo: DM Mono 16, no los 18 de `P1/Regular`. */
  const descripcion = (
    <p aria-labelledby={`${baseId}-titulo`} className="text-p1-bold">
      {actual.descripcion}
    </p>
  );

  const cuerpo = (
    <>
      <p id={`${baseId}-titulo`} className="text-h3">
        {actual.titulo.replace("\n", " ")}
      </p>
      <div className="mt-8">{descripcion}</div>
    </>
  );

  return (
    <div className={className}>
      <div
        className={cn(
          "rounded-xl px-6 py-10",
          variante === "tarjeta"
            ? FONDO_ACENTO[actual.acento]
            : "border border-borde",
        )}
      >
        {cuerpo}
      </div>
      <div className="mt-5 flex justify-end gap-2">{flechas}</div>
    </div>
  );
}
