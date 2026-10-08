import { cn } from "@/lib/cn";

/**
 * Formas geométricas de la identidad, dibujadas en SVG hasta que lleguen los
 * fondos animados que faltan de la entrega. Cada pantalla las tiñe con
 * `text-*`.
 *
 * El sol con órbita que acompañaba a esta estrella se borró cuando QA
 * confirmó que ahí va la animación "02-Para empresas", la misma del hero de
 * Servicios.
 */

/**
 * Estrella de rayos, la otra forma de la identidad. Va detrás del contenido y
 * gira despacio; el grano y el desenfoque son los que la vuelven una mancha de
 * luz y no un dibujo nítido.
 *
 * En Sumá tu coop aparece en naranja detrás de "Elegí tu camino", solo en la
 * maqueta mobile: la de desktop deja esa zona limpia.
 *
 * **Gira el `<svg>` entero y no el grupo de adentro.** Girando el `<g>`, cada
 * cuadro obliga al navegador a volver a dibujar las sesenta y cuatro líneas:
 * las transformaciones dentro de un SVG no las compone la GPU, se rasterizan.
 * Girando el elemento, en cambio, se pinta una vez y después solo se mueve esa
 * capa. Se ve igual porque el halo es un degradado radial centrado, al que
 * girar no le cambia nada.
 */
export function Estrella({ className }: { className?: string }) {
  const rayos = Array.from({ length: 64 });

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      className={cn(
        "animate-girar-lento motion-reduce:animate-none",
        /* Se promueve a su propia capa: la animación no termina nunca, así que
           la alternativa es rasterizarla de nuevo para siempre. */
        "will-change-transform",
        className,
      )}
    >
      <defs>
        <radialGradient id="estrella-halo">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* El resplandor, que es lo que se ve más allá de los rayos. */}
      <circle cx="200" cy="200" r="190" fill="url(#estrella-halo)" />

      <g>
        {rayos.map((_, i) => {
          const angulo = (i / rayos.length) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(angulo) * 60}
              y1={200 + Math.sin(angulo) * 60}
              x2={200 + Math.cos(angulo) * 175}
              y2={200 + Math.sin(angulo) * 175}
              stroke="currentColor"
              strokeWidth="5"
            />
          );
        })}
        <circle cx="200" cy="200" r="68" fill="currentColor" />
      </g>
    </svg>
  );
}
