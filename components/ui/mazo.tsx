"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

/**
 * Cartas apiladas: una se ve entera y de las otras asoma solo el canto. Al
 * tocar una, pasa al frente.
 *
 * Es la forma que toman en mobile los servicios de la Home y los sectores de
 * Nuestros servicios, así que la mecánica vive acá y cada pantalla decide qué
 * dibuja adentro.
 *
 * Cómo se apilan, que es lo que hace el efecto:
 *
 *  - **Todas miden lo mismo** y van una encima de otra, corridas por `asoma`.
 *    No se achican: si se les bajara la altura, el radio las volvería píldoras
 *    y dejarían de parecer cartas.
 *  - **La abierta va al frente** y el z-index baja hacia los costados, así las
 *    de abajo muestran su borde inferior —el canto— y las de arriba, el
 *    superior.
 *
 * El alto del conjunto es fijo: la carta entera más el canto de cada una de las
 * otras. Sin eso, la última —que no tiene ninguna encima— se desplegaría
 * completa por debajo.
 */
export function Mazo<T>({
  items,
  alto,
  asoma,
  claveDe,
  etiquetaDe,
  alTocarLaAbierta,
  claseCarta = "border-borde-pleno bg-superficie-alta",
  porScroll = false,
  children,
  className,
}: {
  items: readonly T[];
  /** Alto de la carta desplegada. */
  alto: number;
  /** Cuánto se ve de las que están tapadas. */
  asoma: number;
  claveDe: (item: T, i: number) => string;
  /** Qué anuncia un lector de pantalla al llegar a la carta. */
  etiquetaDe: (item: T, i: number) => string;
  /**
   * Qué pasa al tocar la carta que ya está al frente. Sin esto, el clic solo
   * sirve para traer una carta adelante; con esto, la de adelante puede llevar
   * a otro lado —en Sectores, al detalle—.
   */
  alTocarLaAbierta?: (item: T, i: number) => void;
  /**
   * Aspecto de la carta. Cambia entre pantallas: los servicios de la Home van
   * en gris con borde entero y los sectores de Servicios, sobre el fondo del
   * sitio y con borde punteado.
   */
  claseCarta?: string;
  /**
   * Además del clic, la carta al frente cambia sola con el scroll: cada una se
   * adelanta cuando el mazo lleva su tramo recorrido por la pantalla. Es la
   * "animación de superposición" que pide la anotación del archivo sobre los
   * servicios de la Home.
   */
  porScroll?: boolean;
  children: (
    item: T,
    estaAbierto: boolean,
    i: number,
    /** Cuál está al frente, para saber de qué lado asoma esta carta. */
    abierto: number,
  ) => ReactNode;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(0);
  const baseId = useId();
  const caja = useRef<HTMLDivElement>(null);
  /* El clic manda: si alguien eligió una carta, el scroll deja de moverlas. */
  const elegidaAMano = useRef(false);

  useEffect(() => {
    if (!porScroll) return;
    const nodo = caja.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pedido = 0;
    const pintar = () => {
      pedido = 0;
      if (elegidaAMano.current) return;
      const r = nodo.getBoundingClientRect();
      const pantalla = window.innerHeight;
      /*
       * 0 cuando el mazo entra por abajo y 1 cuando termina de salir por
       * arriba. El recorrido se reparte en tantos tramos como cartas, así cada
       * una pasa al frente en su turno.
       */
      const t = (pantalla - r.top) / (pantalla + r.height);
      const i = Math.floor(Math.min(0.999, Math.max(0, t)) * items.length);
      setAbierto(i);
    };
    const alScrollear = () => {
      if (!pedido) pedido = requestAnimationFrame(pintar);
    };
    pintar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [porScroll, items.length]);

  if (!items.length) return null;

  return (
    <div
      ref={caja}
      style={{ height: alto + (items.length - 1) * asoma }}
      className={cn("relative", className)}
    >
      {items.map((item, i) => {
        const estaAbierto = i === abierto;
        const panelId = `${baseId}-${i}`;

        return (
          <button
            key={claveDe(item, i)}
            type="button"
            aria-expanded={estaAbierto}
            aria-controls={panelId}
            onClick={() => {
              if (estaAbierto) alTocarLaAbierta?.(item, i);
              else {
                elegidaAMano.current = true;
                setAbierto(i);
              }
            }}
            style={{
              top: i * asoma,
              height: alto,
              zIndex: items.length - Math.abs(i - abierto),
            }}
            className={cn(
              "absolute inset-x-0 cursor-pointer overflow-hidden rounded-[21px] border text-left",
              claseCarta,
              "transition-opacity duration-200",
              FOCO,
              // Las tapadas se atenúan al apuntarlas: solo se llega al canto,
              // que es lo único que no está debajo de otra carta.
              !estaAbierto && "hover:opacity-80 focus-visible:opacity-80",
            )}
          >
            <span className="sr-only">{etiquetaDe(item, i)}</span>
            <span id={panelId} className="block h-full">
              {children(item, estaAbierto, i, abierto)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
