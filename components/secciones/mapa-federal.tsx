"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { PROVINCIAS } from "@/lib/mapa/provincias";

/**
 * Mapa federal: las provincias dibujadas, pintadas y elegibles.
 *
 * Resuelve las dos anotaciones del archivo:
 *
 *  - "Que cada provincia tenga un color distinto de la paleta de colores, de
 *    forma aleatoria": las que tienen cooperativas se pintan cada una de un
 *    color, tomándolo de su posición en la lista y no de un sorteo por visita
 *    —si cambiara en cada carga, el mapa parpadearía y el servidor y el
 *    browser dibujarían distinto—. Se ven repartidos al azar pero son
 *    estables. Las que no tienen quedan en gris oscuro.
 *  - "En cada provincia debería haber puntitos dependiendo la cantidad de coop
 *    que hay": un punto por cooperativa, repartidos dentro del contorno.
 *
 * Las provincias sin cooperativas no se pueden elegir: el mapa cuenta dónde
 * está la red, no la división política.
 */

/**
 * Recuadro del país sin la Antártida ni las islas del Atlántico Sur, que
 * estirarían el dibujo hasta volverlo ilegible.
 */
/** Los colores de la identidad con los que se pintan las provincias. */
const COLORES = [
  "var(--color-lila)",
  "var(--color-celeste)",
  "var(--color-amarillo)",
  "var(--color-naranja)",
  "var(--color-azul)",
  "var(--color-rojo)",
];

const CAJA = { oeste: -73.6, este: -53.6, norte: -21.8, sur: -55.1 };
const ANCHO = 420;

/**
 * Los meridianos se juntan hacia el sur, así que un grado de longitud mide
 * menos que uno de latitud: a los -38° de la mitad del país, un 78%.
 */
const LATITUD_MEDIA = (CAJA.norte + CAJA.sur) / 2;
const ACHATE = Math.cos((LATITUD_MEDIA * Math.PI) / 180);

const ESCALA = ANCHO / ((CAJA.este - CAJA.oeste) * ACHATE);
const ALTO = Math.round((CAJA.norte - CAJA.sur) * ESCALA);

/**
 * Equirrectangular corregida por latitud. La proporción sale 2,13, que es la
 * de Argentina: unos 3.700 km de norte a sur por 1.700 de este a oeste. No se
 * deforma para que entre —la maqueta tampoco lo hace: lo que parecía un
 * achatamiento es que el panel se le superpone y tapa la Patagonia—; el tamaño
 * se resuelve en el layout, limitando el alto.
 */
function proyectar(lng: number, lat: number): [number, number] {
  return [(lng - CAJA.oeste) * ACHATE * ESCALA, (CAJA.norte - lat) * ESCALA];
}

function trazo(anillos: number[][][]): string {
  return anillos
    .map(
      (anillo) =>
        anillo
          .map((punto, i) => {
            const [x, y] = proyectar(punto[0], punto[1]);
            return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join("") + "Z",
    )
    .join("");
}

export function MapaFederal({
  cantidadPorProvincia,
  seleccionada,
  alElegir,
  className,
}: {
  cantidadPorProvincia: Record<string, number>;
  seleccionada: string | null;
  alElegir: (provincia: string) => void;
  className?: string;
}) {
  const formas = useMemo(
    () =>
      PROVINCIAS.map((provincia, i) => ({
        nombre: provincia.nombre,
        d: trazo(provincia.anillos),
        // CABA mide unos pocos píxeles a esta escala y es la que más
        // cooperativas tiene: se le agrega un disco para que se vea y se
        // pueda tocar. Es lo que hacen los mapas federales impresos.
        disco: discoDe(provincia.anillos),
        color: COLORES[i % COLORES.length],
        cantidad: cantidadPorProvincia[provincia.nombre] ?? 0,
        // Los "pueblitos": un punto por cooperativa, repartidos por el
        // contorno para que se lean como un puñado y no como una fila.
        puntos: discoDe(provincia.anillos)
          ? []
          : puntosDe(
              provincia.anillos,
              cantidadPorProvincia[provincia.nombre] ?? 0,
            ),
      })),
    [cantidadPorProvincia],
  );

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className={cn("w-full", className)}
      role="group"
      aria-label="Mapa de las provincias argentinas con cooperativas de la red"
    >
      {formas.map((provincia) => {
        const hay = provincia.cantidad > 0;
        const elegida = provincia.nombre === seleccionada;
        return (
          <g key={provincia.nombre}>
            <path
              d={provincia.d}
              role={hay ? "button" : undefined}
              tabIndex={hay ? 0 : undefined}
              aria-label={
                hay
                  ? `${provincia.nombre}: ${provincia.cantidad} cooperativas`
                  : undefined
              }
              aria-pressed={hay ? elegida : undefined}
              onClick={hay ? () => alElegir(provincia.nombre) : undefined}
              onKeyDown={
                hay
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        alElegir(provincia.nombre);
                      }
                    }
                  : undefined
              }
              fill={hay ? provincia.color : "var(--color-gris-oscuro)"}
              fillOpacity={elegida ? 1 : hay ? 0.4 : 0.55}
              stroke="var(--color-blanco)"
              strokeOpacity={hay ? 0.35 : 0.12}
              strokeWidth="0.7"
              className={cn(
                "transition-[fill-opacity] duration-300",
                hay && `cursor-pointer hover:[fill-opacity:0.7] ${FOCO}`,
              )}
            />
            {provincia.disco ? (
              <circle
                cx={provincia.disco[0]}
                cy={provincia.disco[1]}
                r={elegida ? 7 : 5.5}
                fill={hay ? provincia.color : "var(--color-gris-oscuro)"}
                fillOpacity={elegida ? 1 : 0.7}
                stroke="var(--color-blanco)"
                strokeOpacity="0.6"
                strokeWidth="0.8"
                onClick={hay ? () => alElegir(provincia.nombre) : undefined}
                className={cn(
                  "transition-all duration-300",
                  hay && "cursor-pointer",
                )}
              />
            ) : null}
            {provincia.puntos.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.6"
                fill="var(--color-blanco)"
                fillOpacity={elegida ? 0.85 : 0.4}
                className="pointer-events-none transition-[fill-opacity] duration-300"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Centro de una provincia demasiado chica para verse, o `null` si se dibuja
 * bien sola. Hoy solo aplica a CABA.
 */
function discoDe(anillos: number[][][]): [number, number] | null {
  const puntos = anillos.flat().map((p) => proyectar(p[0], p[1]));
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const ancho = Math.max(...xs) - Math.min(...xs);
  const alto = Math.max(...ys) - Math.min(...ys);
  if (Math.max(ancho, alto) > 9) return null;
  return [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2,
  ];
}

/**
 * Reparte `cantidad` puntos dentro del contorno de una provincia.
 *
 * Se prueban posiciones sobre una espiral que arranca en el centro y se abre;
 * la primera que cae dentro se toma. Es determinista, así que el servidor y el
 * browser dibujan lo mismo.
 */
function puntosDe(anillos: number[][][], cantidad: number): [number, number][] {
  if (!cantidad) return [];

  const anillo = anillos.reduce((mayor, actual) =>
    actual.length > mayor.length ? actual : mayor,
  );
  const xs = anillo.map((p) => proyectar(p[0], p[1])[0]);
  const ys = anillo.map((p) => proyectar(p[0], p[1])[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const radio = Math.min(Math.max(...xs) - cx, Math.max(...ys) - cy) * 0.72;

  const plano = anillo.map((p) => proyectar(p[0], p[1]));
  const dentro = (x: number, y: number) => {
    let d = false;
    for (let i = 0, j = plano.length - 1; i < plano.length; j = i++) {
      const [xi, yi] = plano[i];
      const [xj, yj] = plano[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        d = !d;
      }
    }
    return d;
  };

  const puntos: [number, number][] = [];
  for (let i = 0; puntos.length < cantidad && i < cantidad * 40; i++) {
    // Espiral áurea: reparte sin amontonar y sin necesitar azar.
    const angulo = i * 2.399963;
    const r = radio * Math.sqrt(i / Math.max(cantidad, 6));
    const x = cx + Math.cos(angulo) * r;
    const y = cy + Math.sin(angulo) * r;
    if (dentro(x, y)) puntos.push([x, y]);
  }
  return puntos;
}
