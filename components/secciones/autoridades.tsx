"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { CardAutoridad } from "@/components/tarjetas/red";
import type { Autoridad } from "@/lib/dominio/tipos";

/**
 * Los dos órganos de la Federación, en solapas: el Consejo de administración y
 * la Sindicatura.
 *
 * La API guarda a todo el mundo en el mismo recurso, sin decir a qué órgano
 * pertenece, así que se reparten por el cargo: quien es síndico o síndica va a
 * Sindicatura y el resto al Consejo. Cuando el backend agregue el campo, este
 * reparto se reemplaza por una lectura directa.
 *
 * Las tarjetas se desplazan de costado con las flechas del pie, que es como lo
 * dibuja la maqueta: entran cuatro por pantalla y el consejo tiene más. Si un
 * órgano queda vacío no se muestra su solapa, y si no hay nadie cargado la
 * sección entera desaparece en vez de dejar el hueco.
 */
export function Autoridades({
  autoridades,
  etiquetas,
  className,
}: {
  autoridades: Autoridad[];
  etiquetas: { consejo: string; sindicatura: string };
  className?: string;
}) {
  const esSindicatura = (autoridad: Autoridad) =>
    /s[ií]ndic/i.test(autoridad.cargo);

  /*
   * La API devuelve por fecha de carga, así que el orden dependía de en qué
   * momento se cargó cada persona. Se ordenan por jerarquía del cargo, que es
   * como los muestra la maqueta; lo que no reconoce esta lista va al final,
   * alfabético. Si el backend agrega un campo de orden, se usa ese.
   */
  const JERARQUIA = [
    // Anclados al principio: si no, "Vicepresidenta" cae en /presiden/.
    /^presiden/i,
    /^vicepresiden/i,
    /^secretari/i,
    /^tesorer/i,
    /^vocal titular/i,
    /^vocal suplente/i,
    /^s[ií]ndic\w* titular/i,
    /^s[ií]ndic\w* suplente/i,
  ];

  const rango = (autoridad: Autoridad) => {
    const i = JERARQUIA.findIndex((patron) => patron.test(autoridad.cargo));
    return i === -1 ? JERARQUIA.length : i;
  };

  const porJerarquia = (a: Autoridad, b: Autoridad) =>
    rango(a) - rango(b) || a.nombre.localeCompare(b.nombre, "es");

  const grupos = [
    {
      id: "consejo",
      etiqueta: etiquetas.consejo,
      miembros: autoridades.filter((a) => !esSindicatura(a)).sort(porJerarquia),
    },
    {
      id: "sindicatura",
      etiqueta: etiquetas.sindicatura,
      miembros: autoridades.filter(esSindicatura).sort(porJerarquia),
    },
  ].filter((grupo) => grupo.miembros.length > 0);

  const [activo, setActivo] = useState(grupos[0]?.id);
  const pista = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ atras: false, adelante: false });

  const medir = () => {
    const el = pista.current;
    if (!el) return;
    setPuede({
      atras: el.scrollLeft > 4,
      adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [activo]);

  if (!grupos.length) return null;

  const visible = grupos.find((grupo) => grupo.id === activo) ?? grupos[0];

  const avanzar = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: sentido * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex gap-10 border-b border-borde"
        aria-label="Órganos de la Federación"
      >
        {grupos.map((grupo) => {
          const esActiva = grupo.id === visible.id;
          return (
            <button
              key={grupo.id}
              role="tab"
              type="button"
              aria-selected={esActiva}
              onClick={() => setActivo(grupo.id)}
              className={cn(
                "text-h4 -mb-px cursor-pointer border-b-2 pb-3 transition-colors",
                FOCO,
                esActiva
                  ? "border-blanco text-blanco"
                  : "border-transparent text-blanco/40 hover:text-blanco/70",
              )}
            >
              {grupo.etiqueta}
            </button>
          );
        })}
      </div>

      <div
        ref={pista}
        onScroll={medir}
        className="scroll-limpio mt-8 flex gap-5 overflow-x-auto"
      >
        {visible.miembros.map((autoridad) => (
          <CardAutoridad
            key={autoridad.id}
            autoridad={autoridad}
            acento="lila"
            className="h-[190px] w-[190px] shrink-0 snap-start"
          />
        ))}
      </div>

      {/* Las flechas solo tienen sentido si hay más de lo que entra. */}
      {puede.atras || puede.adelante ? (
        <div className="mt-6 flex justify-end gap-2">
          <BotonFlecha
            direccion="anterior"
            disabled={!puede.atras}
            onClick={() => avanzar(-1)}
          />
          <BotonFlecha
            direccion="siguiente"
            variante={puede.adelante ? "solida" : "punteada"}
            disabled={!puede.adelante}
            onClick={() => avanzar(1)}
          />
        </div>
      ) : null}
    </div>
  );
}
