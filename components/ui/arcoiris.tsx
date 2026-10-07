"use client";

import { useEffect, useRef, useState } from "react";

/**
 * El arcoíris escondido del pie.
 *
 * Tocando cinco veces seguidas el FACT[TIC] del pie, sale un arcoíris desde el
 * logo y cruza la pantalla. No hay nada que lo anuncie: es para quien lo
 * encuentre.
 *
 * El logo del pie **dejó de ser un enlace** para que esto funcione: mientras lo
 * era, el primer toque se llevaba a la Home antes del segundo. Retrasar la
 * navegación no alcanzaba —para dar lugar a cinco clics de persona hay que
 * esperar casi un segundo, y ahí un clic normal se siente roto—. Ir a la Home
 * ya lo cubre el logo de la barra de arriba.
 *
 * En mobile el pie no muestra el logo sino el "© FACTTIC", así que ese también
 * cuenta.
 *
 * Los colores son los seis de la bandera del orgullo y no los siete de Newton:
 * es el arcoíris que la gente dibuja.
 */

/**
 * Cuánto puede pasar entre un toque y el siguiente sin perder la cuenta.
 *
 * Generoso a propósito: la primera versión daba un cuarto de segundo y solo
 * funcionaba a velocidad de robot. A 450ms entre clics —que es como hace clic
 * una persona— no llegaba nunca a los cinco.
 */
const VENTANA = 900;
/** Toques para que salga. */
const TOQUES = 5;
/** Lo que dura el arcoíris en pantalla, incluido el desvanecido. */
const DURACION = 2200;

const COLORES = [
  "#e40303",
  "#ff8c00",
  "#ffed00",
  "#008026",
  "#24408e",
  "#732982",
];

export function ConArcoiris({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const caja = useRef<HTMLSpanElement>(null);
  const toques = useRef(0);
  const ultimo = useRef(0);
  const [desde, setDesde] = useState<{ x: number; y: number } | null>(null);

  function alTocar() {
    const ahora = performance.now();
    /* La cuenta se reinicia si pasó demasiado entre toque y toque: cinco clics
       repartidos a lo largo de una tarde no son una intención. */
    toques.current = ahora - ultimo.current > VENTANA ? 1 : toques.current + 1;
    ultimo.current = ahora;
    if (toques.current < TOQUES) return;

    toques.current = 0;
    const r = caja.current?.getBoundingClientRect();
    if (r) setDesde({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  return (
    <>
      <span ref={caja} onClick={alTocar} className={className}>
        {children}
      </span>
      {desde ? (
        <Arcoiris desde={desde} alTerminar={() => setDesde(null)} />
      ) : null}
    </>
  );
}

/**
 * El dibujo: seis anillos que salen del logo y se abren hasta pasarse de la
 * pantalla.
 *
 * El trazo no escala —`vector-effect="non-scaling-stroke"`—, así que la banda
 * conserva su grosor mientras el radio crece: sin eso, al final serían seis
 * manchas enormes. Lo que se anima es una transformación, que la resuelve el
 * compositor sin volver a dibujar nada.
 */
function Arcoiris({
  desde,
  alTerminar,
}: {
  desde: { x: number; y: number };
  alTerminar: () => void;
}) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    /* Un cuadro quieto antes de crecer: si se monta ya con la clase puesta, no
       hay transición desde ningún lado y aparece de golpe. */
    const arranque = requestAnimationFrame(() => setAbierto(true));
    const fin = setTimeout(alTerminar, DURACION);
    return () => {
      cancelAnimationFrame(arranque);
      clearTimeout(fin);
    };
  }, [alTerminar]);

  /* Hasta dónde tiene que llegar para pasarse de la esquina más lejana. */
  const lejos =
    typeof window === "undefined"
      ? 1200
      : Math.hypot(
          Math.max(desde.x, window.innerWidth - desde.x),
          Math.max(desde.y, window.innerHeight - desde.y),
        );
  /** Separación entre anillos: con el trazo, da una banda de unos 54px. */
  const PASO = 9;

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 size-full"
    >
      {/* La opacidad va en el grupo y el radio en cada anillo: así se apaga
          entero mientras la banda se abre. */}
      <g className="arcoiris-que-se-apaga" style={{ opacity: abierto ? 0 : 1 }}>
        {COLORES.map((color, i) => (
          <circle
            key={color}
            cx={desde.x}
            cy={desde.y}
            fill="none"
            stroke={color}
            strokeWidth="8"
            className="anillo-del-arcoiris"
            /*
              Lo que crece es el radio y no una escala: escalando, la distancia
              entre anillos crece con todo lo demás y al llegar al borde ya no
              son una banda sino seis arcos sueltos y separados. Con el radio,
              la banda mantiene su grosor de punta a punta.
            */
            style={
              {
                "--r": `${(abierto ? lejos : 0) + i * PASO}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}
