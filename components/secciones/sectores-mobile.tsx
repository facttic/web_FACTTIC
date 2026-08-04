"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Mazo } from "@/components/ui/mazo";
import { IconoFlecha } from "@/components/ui/iconos";
import { Animacion } from "@/components/ui/animacion";
import { animacionDeSector } from "@/lib/animaciones";
import type { Sector } from "@/lib/dominio/tipos";

/**
 * Sectores en mobile, en la pantalla de Nuestros servicios.
 *
 * Son un mazo de cartas, como los servicios de la Home, pero con una
 * diferencia: acá el pie —la línea y el "Ver más"— se ve también en las
 * tapadas, porque es justamente lo que asoma de cada una. Lo que se oculta es
 * la parte de arriba: ilustración, nombre y descripción.
 *
 * La carta abierta lleva al detalle del sector; tocar una tapada la trae al
 * frente. Por eso navega con el router y no con un <a>: dos enlaces anidados no
 * son válidos y, además, tocar una tapada no debería llevar a ningún lado.
 *
 * Recibe el prefijo de la URL y no una función que la arme: los props que
 * cruzan de un componente de servidor a uno de cliente tienen que ser
 * serializables.
 */

/** Alto de la carta y cuánto asoma de las tapadas, medidos en la maqueta. */
const ALTO = 335;
const ASOMA = 89;

export function SectoresMobile({
  sectores,
  hrefBase,
  className,
}: {
  sectores: Sector[];
  /** Prefijo del detalle; se le agrega el slug de cada sector. */
  hrefBase: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Mazo
      items={sectores}
      alto={ALTO}
      asoma={ASOMA}
      claveDe={(s) => s.id}
      etiquetaDe={(s) => `${s.nombre}. Ver más`}
      alTocarLaAbierta={(s) => router.push(`${hrefBase}/${s.slug}`)}
      claseCarta="border-dashed border-borde-pleno bg-fondo"
      className={className}
    >
      {(sector, estaAbierto) => {
        const animacion = animacionDeSector(sector.nombre);

        return (
          <span className="flex h-full flex-col p-6">
            <span
              className={cn(
                "flex flex-1 flex-col transition-opacity duration-300",
                estaAbierto ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="grid flex-1 place-items-center">
                {animacion ? (
                  <Animacion nombre={animacion} className="size-[110px]" />
                ) : null}
              </span>
              <span className="text-h4 mt-4 block">{sector.nombre}</span>
              {sector.descripcion ? (
                <span className="text-p2 mt-2 block text-blanco/70">
                  {sector.descripcion}
                </span>
              ) : null}
            </span>

            {/* El pie asoma también cuando la carta está tapada: es el canto. */}
            <span className="mt-6 block">
              <span className="block border-t border-borde-pleno" />
              <span className="text-p2 mt-4 flex items-center justify-between">
                Ver más
                <IconoFlecha />
              </span>
            </span>
          </span>
        );
      }}
    </Mazo>
  );
}
