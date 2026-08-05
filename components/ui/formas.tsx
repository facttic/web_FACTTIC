/**
 * Formas geométricas de la identidad, dibujadas en SVG hasta que lleguen los
 * fondos animados que faltan de la entrega. Cada pantalla las tiñe con
 * `text-*`: el sol de Sumá tu coop va en verde y el del 404, en lila.
 */

/**
 * El sol de rayos con su órbita punteada, como en el archivo: el sol gira
 * despacio sobre sí mismo y los dos puntos recorren la órbita en sentido
 * contrario. Con `prefers-reduced-motion` queda quieto.
 *
 * Los grupos giran con `transform-box: view-box`, que hace que la rotación
 * tome el centro del viewBox y no el de cada figura.
 */
export function SolConOrbita({ className }: { className?: string }) {
  const rayos = Array.from({ length: 40 });
  const giro = {
    transformOrigin: "260px 260px",
    transformBox: "view-box",
  } as const;

  return (
    <svg viewBox="0 0 520 520" fill="none" aria-hidden className={className}>
      <g
        className="animate-girar-lento motion-reduce:animate-none"
        style={giro}
      >
        <circle
          cx="260"
          cy="260"
          r="250"
          stroke="var(--color-blanco)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeDasharray="1.5 7"
        />
        <circle
          cx="35"
          cy="185"
          r="6"
          fill="var(--color-blanco)"
          fillOpacity="0.5"
        />
        <circle
          cx="428"
          cy="455"
          r="6"
          fill="var(--color-blanco)"
          fillOpacity="0.5"
        />
      </g>

      <g
        className="animate-girar-medio motion-reduce:animate-none"
        style={giro}
      >
        {rayos.map((_, i) => {
          const angulo = (i / rayos.length) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={260 + Math.cos(angulo) * 60}
              y1={260 + Math.sin(angulo) * 60}
              x2={260 + Math.cos(angulo) * 145}
              y2={260 + Math.sin(angulo) * 145}
              stroke="currentColor"
              strokeWidth="7"
            />
          );
        })}
        <circle cx="260" cy="260" r="62" fill="currentColor" />
      </g>
    </svg>
  );
}
