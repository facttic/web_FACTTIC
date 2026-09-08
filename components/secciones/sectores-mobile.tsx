"use client";

import { useRouter } from "next/navigation";
import { Mazo } from "@/components/ui/mazo";
import { CaraSectorMobile } from "@/components/tarjetas/sector";
import type { Sector } from "@/lib/dominio/tipos";

/**
 * Sectores en mobile, en la pantalla de Nuestros servicios.
 *
 * Son un mazo de cartas, como los servicios de la Home, pero acá de las tapadas
 * asoma apenas el canto —37px, sin texto— y la de adelante muestra la misma
 * cara que en la Home: ilustración, nombre, propuesta de valor, línea y "Ver
 * más".
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
const ALTO = 449;
const ASOMA = 37;

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
      // Relleno opaco: si no, se leería el contenido de las cartas de atrás a
      // través de la de adelante.
      claseCarta="border-dotted border-borde-pleno bg-fondo"
      className={className}
    >
      {(sector) => <CaraSectorMobile sector={sector} className="h-full" />}
    </Mazo>
  );
}
