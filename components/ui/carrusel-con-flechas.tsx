"use client";

import { cn } from "@/lib/cn";
import { clasesCarrusel, type PropsCarrusel } from "@/components/ui/carrusel";
import { BotonFlecha } from "@/components/ui/boton";
import { usePista } from "@/components/ui/pista";

/**
 * El carrusel con un par de flechas debajo, alineadas a la derecha.
 *
 * En el board mobile los proyectos de la Home se pasan así y no con un botón
 * de "ver todos": una tarjeta a la vista y las flechas para moverse. En
 * desktop el bloque pasa a grilla y las flechas sobran, así que se ocultan.
 *
 * Con `automatico` se pasa solo. El ritmo —cuándo arranca, cada cuánto, y
 * cuándo se queda quieto— está en `usePista`, que es el mismo que usan todos
 * los carruseles del sitio.
 */
export function CarruselConFlechas({
  automatico = false,
  children,
  ...resto
}: PropsCarrusel & { automatico?: boolean }) {
  // Donde la pista sigue siendo carrusel en desktop, las flechas también.
  const siempre = resto.desdeAncho === "nunca";
  const { pista, puede, alDesplazar, avanzar } = usePista({ automatico });

  return (
    <>
      <div ref={pista} onScroll={alDesplazar} className={clasesCarrusel(resto)}>
        {children}
      </div>
      <div
        className={cn(
          "mt-6 flex justify-end gap-2",
          siempre ? null : "md:hidden",
        )}
      >
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
    </>
  );
}
