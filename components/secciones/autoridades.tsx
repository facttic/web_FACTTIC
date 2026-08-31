"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
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
 * El Consejo no entra en una pantalla —son siete— así que su cinta se desplaza
 * sola, recortada al ancho de la columna. La Sindicatura son dos y van quietas:
 * una marquesina de dos tarjetas es puro movimiento sin motivo. Si un órgano
 * queda vacío no se muestra su solapa, y si no hay nadie cargado la sección
 * entera desaparece en vez de dejar el hueco.
 */

/** Medidas de la tarjeta, que fijan cuánto hay que repetir la cinta. */
const ANCHO_TARJETA = 190;
const SEPARACION = 20;
/** Lo que tiene que cubrir cada mitad de la cinta, con margen sobre 1440. */
const ANCHO_MINIMO = 1600;
/** Cuántas tarjetas entran de un vistazo: con más, la cinta se mueve sola. */
const ENTRAN_EN_PANTALLA = 4;
/** Ritmo de la cinta. Bastante lento como para leer un nombre al pasar. */
const PIXELES_POR_SEGUNDO = 40;

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

  if (!grupos.length) return null;

  const visible = grupos.find((grupo) => grupo.id === activo) ?? grupos[0];
  const enCinta = visible.miembros.length > ENTRAN_EN_PANTALLA;

  return (
    /* `min-w-0`: es un item de grid, y sin eso el track se estira al ancho de
       la cinta en vez de recortarla. */
    <div className={cn("min-w-0", className)}>
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

      {enCinta ? (
        <Cinta miembros={visible.miembros} />
      ) : (
        <ul className="mt-8 flex gap-5">
          {visible.miembros.map((autoridad) => (
            <li key={autoridad.id}>
              <CardAutoridad
                autoridad={autoridad}
                className="h-[190px] w-[190px] shrink-0"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * La cinta que se desplaza sola.
 *
 * La animación recorre media cinta y vuelve a empezar, así que **cada mitad
 * tiene que ser más ancha que la pantalla**: si no, al llegar al salto queda un
 * hueco y las tarjetas parecen desaparecer y reaparecer. Es el mismo patrón que
 * la banda de aliados.
 *
 * La duración se calcula sobre lo que mide media cinta, no se fija: si no, más
 * autoridades harían la vuelta más rápida y el ritmo cambiaría solo. Se detiene
 * al pasar el mouse, al enfocar con teclado y con `prefers-reduced-motion`.
 */
function Cinta({ miembros }: { miembros: Autoridad[] }) {
  const anchoPasada = miembros.length * (ANCHO_TARJETA + SEPARACION);
  const pasadas = Math.ceil(ANCHO_MINIMO / anchoPasada);
  const cinta = Array.from({ length: pasadas * 2 }, (_, i) => i);
  const segundos = Math.round((pasadas * anchoPasada) / PIXELES_POR_SEGUNDO);

  return (
    <div className="mt-8 min-w-0 overflow-hidden">
      <ul
        className="animate-marquesina marquesina-detenible flex w-max gap-5 motion-reduce:animate-none"
        style={{ animationDuration: `${segundos}s` }}
      >
        {cinta.map((vuelta) =>
          miembros.map((autoridad) => (
            <li
              key={`${vuelta}-${autoridad.id}`}
              // Solo la primera pasada se anuncia; el resto es repetición.
              aria-hidden={vuelta > 0 || undefined}
            >
              <CardAutoridad
                autoridad={autoridad}
                className="h-[190px] w-[190px] shrink-0"
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
