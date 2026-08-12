"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { CardMetrica } from "@/components/tarjetas/bloques";
import { HazEntre } from "@/components/ui/haz";
import { Carrusel } from "@/components/ui/carrusel";

/**
 * Las métricas de la red, unidas.
 *
 * Es el momento de la Home. Los tres números —profesionales, cooperativas y
 * provincias— dejan de ser tarjetas sueltas: quedan enlazados por haces de luz
 * que viajan de una a otra mientras los contadores suben. La federación
 * dibujada, con los datos que ya trae la API.
 *
 * Los haces solo se dibujan en desktop: en mobile las tarjetas se apilan y las
 * curvas cruzarían el texto. Ahí la sección se queda con el conteo, que ya es
 * movimiento suficiente para una pantalla chica.
 *
 * Las líneas apagadas se ven siempre —la red se lee aunque no haya
 * movimiento— y los haces se apagan con `prefers-reduced-motion`.
 */
export function RedViva({
  metricas,
  etiquetas,
  className,
}: {
  metricas: { profesionales: number; cooperativas: number; provincias: number };
  etiquetas: { profesionales: string; cooperativas: string; provincias: string };
  className?: string;
}) {
  const marco = useRef<HTMLDivElement>(null);
  const uno = useRef<HTMLDivElement>(null);
  const dos = useRef<HTMLDivElement>(null);
  const tres = useRef<HTMLDivElement>(null);

  return (
    <div ref={marco} className={cn("relative", className)}>
      {/*
        Los haces van por delante y en modo `screen`: sobre el gris de las
        tarjetas se leen como luz que las cruza, no como una línea dibujada
        encima. Detrás no servía —las tarjetas son opacas y se los comían
        enteros, solo asomaban en los huecos—.
      */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden mix-blend-screen md:block">
        <HazEntre
          contenedor={marco}
          desde={uno}
          hasta={dos}
          color="var(--color-lila)"
          curvatura={70}
          duracion={4}
        />
        <HazEntre
          contenedor={marco}
          desde={dos}
          hasta={tres}
          color="var(--color-amarillo)"
          curvatura={70}
          duracion={4}
          retraso={1.2}
        />
        <HazEntre
          contenedor={marco}
          desde={uno}
          hasta={tres}
          color="var(--color-naranja)"
          curvatura={-110}
          duracion={5.5}
          retraso={2.4}
          invertido
        />
      </div>

      <Carrusel grilla="md:grid-cols-3" gap="gap-10 md:gap-6">
        {/* Un color por métrica, como en el board: lila, lima y naranja. */}
        <div ref={uno} className="shrink-0">
          <CardMetrica
            rotulo={etiquetas.profesionales}
            valor={metricas.profesionales}
            acentoHover="lila"
          />
        </div>
        <div ref={dos} className="shrink-0">
          <CardMetrica
            rotulo={etiquetas.cooperativas}
            valor={metricas.cooperativas}
            acentoHover="amarillo"
          />
        </div>
        <div ref={tres} className="shrink-0">
          <CardMetrica
            rotulo={etiquetas.provincias}
            valor={metricas.provincias}
            acentoHover="naranja"
          />
        </div>
      </Carrusel>
    </div>
  );
}
