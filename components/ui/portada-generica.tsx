import { cn } from "@/lib/cn";

/**
 * La portada de un proyecto que todavía no tiene foto.
 *
 * Nueve de los once proyectos cargados no tienen imagen, así que esto no es la
 * excepción sino lo habitual: tiene que verse como una decisión y no como un
 * hueco. Por eso no es una foto de archivo —una de gente trabajando diría algo
 * del proyecto que no sabemos— sino un dibujo de la casa: la trama de puntos
 * del fondo del sitio, agrandada, y la inicial del proyecto en la mono de la
 * identidad, enorme y recortada por el borde, como una tapa.
 *
 * **Cambia con cada proyecto.** De su nombre salen la letra, dónde se concentra
 * la trama y cuánto se inclina, así que dos tarjetas vecinas nunca se ven
 * iguales y un mismo proyecto se ve siempre igual: en el listado, en el detalle
 * y al volver.
 *
 * La trama va como fondo repetido y no como cientos de círculos: en el listado
 * hay nueve de estas a la vez.
 *
 * Se reemplaza sola en cuanto se carguen las portadas reales.
 */

/** Un número estable a partir del texto, para repartir las variantes. */
function semillaDe(texto: string): number {
  let n = 0;
  for (const letra of texto) n = (n * 31 + letra.charCodeAt(0)) % 100003;
  return n;
}

export function PortadaGenerica({
  nombre,
  className,
}: {
  /** De acá salen la letra y la variante; el mismo proyecto se ve siempre igual. */
  nombre: string;
  className?: string;
}) {
  const semilla = semillaDe(nombre);
  const letra = (nombre.match(/[a-záéíóúñ]/i)?.[0] ?? "F").toUpperCase();

  /* Dónde se concentra la trama y de qué lado entra la letra. */
  const x = 18 + (semilla % 6) * 13;
  const y = 22 + ((semilla >> 3) % 4) * 16;
  const giro = -14 + (semilla % 5) * 7;
  const aLaDerecha = (semilla >> 5) % 2 === 0;

  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-gris-oscuro via-negro to-negro-oscuro",
        className,
      )}
    >
      {/*
        La trama: un punto cada 14px, más densa alrededor de un lugar que
        cambia con el proyecto. La máscara es lo que la hace una mancha y no un
        empapelado parejo.
      */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(255 255 255 / 0.26) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          maskImage: `radial-gradient(60% 75% at ${x}% ${y}%, #000 10%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(60% 75% at ${x}% ${y}%, #000 10%, transparent 75%)`,
        }}
      />

      {/* La inicial, recortada por el borde: entra desde un lado y se va. */}
      <span
        className="pointer-events-none absolute font-mono leading-none font-bold text-blanco/9 select-none"
        style={{
          fontSize: "clamp(180px, 42vw, 420px)",
          [aLaDerecha ? "right" : "left"]: "-6%",
          bottom: "-22%",
          transform: `rotate(${giro}deg)`,
        }}
      >
        {letra}
      </span>

      {/* El grano de la textura, apenas, para que no se lea como un vector. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/marca/proyecto-sin-portada.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover opacity-50 mix-blend-overlay grayscale"
      />
    </div>
  );
}
