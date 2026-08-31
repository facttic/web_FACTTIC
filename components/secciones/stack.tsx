import { cn } from "@/lib/cn";
import { Cinta } from "@/components/ui/cinta";
import { LogoRemoto } from "@/components/ui/logo-remoto";
import type { Tecnologia } from "@/lib/dominio/tipos";

/** Medidas de la tarjeta de logo, que fijan el ritmo de la cinta. */
const ANCHO = 180;
const SEPARACION = 16;
/** Con estas o menos entran sin moverse en la columna de la derecha. */
const ENTRAN = 4;

/**
 * "Stack tecnológico" de las verticales: el título a la izquierda y los logos
 * en fila, entre dos líneas punteadas que cruzan el ancho del contenedor.
 *
 * Las tecnologías no entran en la columna, así que la fila se desplaza sola.
 * En mobile el título se va arriba y la cinta sigue corriendo igual.
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
        // Las líneas que enmarcan el stack van en blanco pleno, no en el gris
        // de los otros separadores punteados: medido sobre la maqueta, #F2F2F2,
        // con 27px de aire entre la línea y las tarjetas.
        "border-y border-dashed border-borde-pleno py-7",
        // La misma retícula que el bloque desplegable: así las tarjetas
        // arrancan alineadas con la columna de contenido de metodologías.
        "flex flex-col gap-6 md:grid md:grid-cols-[352px_1fr] md:items-center md:gap-16",
        className,
      )}
    >
      <h2 className="text-h2">{titulo}</h2>

      <Cinta
        items={tecnologias}
        clave={(t) => t.id}
        anchoItem={ANCHO}
        separacion={SEPARACION}
        minimoParaMover={ENTRAN}
        etiqueta={titulo}
      >
        {(tecnologia) => (
          /*
            En la maqueta cada tarjeta es un isologo: el ícono arriba y el
            nombre debajo. Con nombre siempre, porque muchas marcas no se
            reconocen solo por su símbolo —y algunas, como nextAuth, ni
            siquiera tienen uno—.
          */
          <div className="flex h-[90px] w-[180px] flex-col items-center justify-center gap-1.5 rounded-lg bg-superficie-alta px-4">
            {tecnologia.logo ? (
              <LogoRemoto src={tecnologia.logo} nombre="" className="max-h-6" />
            ) : null}
            <span className="text-h4 text-center leading-tight">
              {tecnologia.nombre}
            </span>
          </div>
        )}
      </Cinta>
    </div>
  );
}
