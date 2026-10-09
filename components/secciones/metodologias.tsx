import { cn } from "@/lib/cn";
import { CarruselConFlechas } from "@/components/ui/carrusel-con-flechas";
import { FONDO_ACENTO, type Acento } from "@/components/ui/acento";

/**
 * "¿Cómo trabajamos?" en mobile: se ve una modalidad por vez y las flechas la
 * cambian. En desktop las tres pantallas usan otra cosa —bloques de color en
 * Nuestros servicios, desplegables en las verticales—, así que este componente
 * es solo para pantallas chicas.
 *
 * El board la dibuja de dos formas distintas según la pantalla y hay que
 * respetar las dos:
 *
 *  - `tarjeta` (Nuestros servicios): un panel pintado con el color de la
 *    modalidad, con el nombre y la descripción adentro y las flechas debajo.
 *  - `recuadro` (las verticales): la misma idea pero sin pintar, con un marco
 *    fino y el nombre en blanco. Ahí la pantalla ya tiene el color del sector
 *    repartido en otras piezas, y un panel pintado más se lee como otra
 *    sección y no como la misma modalidad.
 *
 * La vertical usaba antes una solapa subrayada en el color, con las flechas en
 * la misma línea del título. Se cambió porque la anotación de la maqueta pedía
 * justamente ajustar esa pantalla en mobile.
 *
 * Pasa con el mismo carrusel que el resto del sitio —se desliza, con las
 * flechas debajo a la derecha— en vez de cambiar el contenido de golpe. Eso
 * además empareja el alto: todas las tarjetas están en la misma fila, así que
 * todas miden lo que la más alta y el bloque deja de saltar al cambiar de
 * modalidad.
 *
 * Es el único carrusel del sitio que **no** pasa solo. Los demás llevan
 * tarjetas de un renglón; acá hay un párrafo, y que se corra a los cuatro
 * segundos es quitárselo a quien lo está leyendo.
 */
export function Metodologias({
  items,
  variante = "tarjeta",
  className,
}: {
  items: readonly {
    titulo: string;
    acento: Acento;
    descripcion: string | null;
  }[];
  variante?: "tarjeta" | "recuadro";
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <CarruselConFlechas
      grilla=""
      desdeAncho="nunca"
      gap="gap-4"
      className={cn("items-stretch", className)}
    >
      {items.map((item) => (
        <div
          key={item.titulo}
          className={cn(
            /* `w-full` con `shrink-0`: una por pantalla, y el `gap` deja
               asomar un pedacito de la siguiente, que es lo que avisa que hay
               más sin necesidad de puntitos. */
            "flex w-full shrink-0 snap-start flex-col rounded-xl px-6 py-10",
            variante === "tarjeta"
              ? FONDO_ACENTO[item.acento]
              : "border border-borde",
          )}
        >
          <p className="text-h3">{item.titulo.replace("\n", " ")}</p>
          {/* `P1/Bold` en el archivo: DM Mono 16, no los 18 de `P1/Regular`. */}
          <p className="text-p1-bold mt-8">{item.descripcion}</p>
        </div>
      ))}
    </CarruselConFlechas>
  );
}
