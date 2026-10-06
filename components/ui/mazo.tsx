"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";

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
  conFlechas = false,
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
  /**
   * Suma el par de flechas debajo, para pasar las cartas a mano además de con
   * el scroll. Hace falta donde las tapadas no muestran su nombre y no hay
   * nada evidente que tocar, como en los beneficios de la Home.
   */
  conFlechas?: boolean;
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
       * Las cartas pasan mientras el mazo está a la vista, no antes ni después.
       *
       * El recorrido iba de "asoma por abajo" a "termina de salir por arriba",
       * y así casi ninguna carta se podía leer: las primeras pasaban con el
       * mazo todavía debajo del pliegue y la última recién al frente cuando ya
       * se había ido 277px por encima del borde. De cinco cartas, una sola se
       * abría con el mazo entero en pantalla.
       *
       * Ahora el tramo arranca cuando el mazo **terminó de entrar** —su pie
       * toca el pie de la pantalla, `top = pantalla - alto`— y se agota cuando
       * su cabeza llega al borde de arriba. Entre esos dos puntos el mazo está
       * entero a la vista, así que toda carta que pase al frente se puede leer.
       *
       * El piso del 40% es para los mazos que no entran en pantallas chicas: sin
       * él el recorrido se achica a nada —o se da vuelta— y las cartas pasarían
       * todas juntas con el primer movimiento del dedo.
       */
      const recorrido = Math.max(pantalla - r.height, pantalla * 0.4);
      const t = (recorrido - r.top) / recorrido;
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

  /** Traer una carta al frente a mano. Desde acá el scroll ya no las mueve. */
  const elegir = (i: number) => {
    elegidaAMano.current = true;
    setAbierto(i);
  };

  if (!items.length) return null;

  const mazo = (
    <div
      ref={caja}
      style={{ height: alto + (items.length - 1) * asoma }}
      className={cn("relative", conFlechas ? undefined : className)}
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
              else elegir(i);
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

  if (!conFlechas) return mazo;

  return (
    <div className={className}>
      {mazo}
      <div className="mt-5 flex justify-end gap-2">
        <BotonFlecha
          direccion="anterior"
          disabled={abierto === 0}
          onClick={() => elegir(abierto - 1)}
        />
        <BotonFlecha
          direccion="siguiente"
          variante={abierto < items.length - 1 ? "solida" : "punteada"}
          disabled={abierto >= items.length - 1}
          onClick={() => elegir(abierto + 1)}
        />
      </div>
    </div>
  );
}
