import { cn } from "@/lib/cn";
import { LogoRemoto } from "@/components/ui/logo-remoto";
import type { Tecnologia } from "@/lib/dominio/tipos";

/**
 * "Stack tecnológico" de las verticales: el título a la izquierda y los logos
 * en fila, entre dos líneas punteadas que cruzan el ancho del contenedor.
 *
 * En mobile el título se va arriba y los logos se desplazan de costado.
 */
export function Stack({
  titulo,
  tecnologias,
  className,
}: {
  titulo: string;
  tecnologias: Tecnologia[];
  className?: string;
}) {
  if (!tecnologias.length) return null;

  return (
    <div
      className={cn(
        "border-y border-dashed border-gris-oscuro py-6",
        "flex flex-col gap-6 md:flex-row md:items-center md:gap-10",
        className,
      )}
    >
      <h2 className="text-h4 shrink-0">{titulo}</h2>

      <ul className="scroll-limpio -mx-6 flex gap-4 overflow-x-auto px-6 md:mx-0 md:flex-1 md:px-0">
        {tecnologias.map((tecnologia) => (
          /*
            En la maqueta cada tarjeta es un isologo: el ícono arriba y el
            nombre debajo. Con nombre siempre, porque muchas marcas no se
            reconocen solo por su símbolo —y algunas, como nextAuth, ni
            siquiera tienen uno—.
          */
          <li
            key={tecnologia.id}
            className="flex h-[90px] w-[180px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg bg-superficie-alta px-4"
          >
            {tecnologia.logo ? (
              <LogoRemoto src={tecnologia.logo} nombre="" className="max-h-6" />
            ) : null}
            <span className="text-h4 text-center leading-tight">
              {tecnologia.nombre}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
