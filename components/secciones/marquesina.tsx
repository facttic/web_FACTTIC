import { cn } from "@/lib/cn";

/**
 * Banda con el lema desplazándose, como en la Home ("Nuestro código es
 * cooperar"). El texto se repite para que el recorrido no muestre huecos.
 *
 * La animación se detiene si la persona pidió menos movimiento en su sistema:
 * un texto grande cruzando la pantalla es justo lo que esa preferencia busca
 * evitar.
 */
export function Marquesina({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const repeticiones = Array.from({ length: 4 });

  return (
    <div
      className={cn("overflow-hidden py-10 md:py-16", className)}
      aria-hidden
    >
      <div className="animate-marquesina flex w-max gap-8 motion-reduce:animate-none">
        {repeticiones.map((_, i) => (
          <span
            key={i}
            className="text-display shrink-0 whitespace-nowrap text-blanco/10"
          >
            {texto} /
          </span>
        ))}
      </div>
    </div>
  );
}
