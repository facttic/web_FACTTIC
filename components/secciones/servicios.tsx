"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha, FOCO } from "@/components/ui/boton";
import { CardServicioSiguiente } from "@/components/tarjetas/servicios";
import { EncabezadoSeccion } from "@/components/ui/seccion";
import { acentoPorIndice } from "@/components/ui/acento";
import { acentoDeServicio, nombreCortoDeServicio } from "@/lib/animaciones";
import type { Servicio } from "@/lib/dominio/tipos";

/**
 * Bloque "Solucionamos con tecnología e innovación".
 *
 * En el prototipo no es un juego de solapas común: además de la lista con la
 * solapa activa subrayada, hay flechas que recorren los servicios, y debajo se
 * ven dos tarjetas —la del servicio activo y la del siguiente—. Al avanzar, la
 * segunda pasa a ser la primera. Las tres variantes de la hoja de componentes
 * lo confirman: las dos tarjetas son servicios, nunca subservicios, y ninguna
 * se pinta por estar activa; el color es el hover.
 *
 * **Por eso las tarjetas son una pista y no un par que se reemplaza.** Están
 * las cinco puestas en fila y lo que se mueve es la fila entera: al cambiar de
 * solapa, las tarjetas se deslizan hasta la que corresponde en vez de aparecer
 * con otro texto en el mismo lugar. Así se entiende que son un recorrido sobre
 * una misma lista —que es lo que dicen las flechas— y el cambio se nota.
 *
 * De yapa, al estar las cinco en la misma fila todas miden lo mismo, así que el
 * bloque ya no cambia de alto al pasar de una solapa a otra.
 *
 * El encabezado se arma acá adentro y no en la página porque las flechas van
 * junto al título de sección —así están en el SVG— y necesitan el estado de
 * este componente.
 *
 * Las solapas usan el nombre corto y las tarjetas el completo, como en el
 * diseño.
 */
export function Servicios({
  servicios,
  rotulo,
  titulo,
  className,
}: {
  servicios: Servicio[];
  rotulo?: string;
  titulo: React.ReactNode;
  className?: string;
}) {
  const [activo, setActivo] = useState(0);
  const baseId = useId();
  const pista = useRef<HTMLDivElement>(null);

  /*
   * La solapa elegida se trae a la vista.
   *
   * La lista no entra en la pantalla y las flechas recorren los servicios sin
   * tocarla: al pasar del cuarto al quinto, el subrayado quedaba fuera de
   * cuadro y no se veía cuál estaba activo. Se desplaza la pista y no la
   * página, que es lo que haría `scrollIntoView`.
   */
  useEffect(() => {
    const lista = pista.current;
    const solapa = lista?.children[activo] as HTMLElement | undefined;
    if (!lista || !solapa) return;
    const caja = lista.getBoundingClientRect();
    const suya = solapa.getBoundingClientRect();
    lista.scrollBy({
      left: suya.left - caja.left - (caja.width - suya.width) / 2,
      behavior: "smooth",
    });
  }, [activo]);

  if (!servicios.length) return null;

  const servicioActivo = servicios[activo];
  /*
   * Hasta dónde se corre la fila. No es `activo` directo: la pista se frena una
   * tarjeta antes del final, porque si no en la última solapa quedaría medio
   * bloque vacío. Así la última elegida se ve a la derecha en vez de a la
   * izquierda, que es lo que hace cualquier carrusel al llegar al tope.
   */
  const paso = Math.max(0, Math.min(activo, servicios.length - 2));

  return (
    <div className={className}>
      <EncabezadoSeccion
        rotulo={rotulo}
        titulo={titulo}
        accion={
          <div className="hidden items-center gap-2 md:flex">
            <BotonFlecha
              direccion="anterior"
              onClick={() =>
                setActivo((i) => (i - 1 + servicios.length) % servicios.length)
              }
            />
            <BotonFlecha
              direccion="siguiente"
              onClick={() => setActivo((i) => (i + 1) % servicios.length)}
            />
          </div>
        }
      />

      <div
        ref={pista}
        role="tablist"
        aria-label="Servicios"
        className="scroll-limpio -mx-6 flex gap-10 overflow-x-auto px-6 md:mx-0 md:gap-16 md:px-0"
      >
        {servicios.map((servicio, i) => (
          <button
            key={servicio.id}
            role="tab"
            type="button"
            id={`${baseId}-tab-${servicio.id}`}
            aria-selected={i === activo}
            aria-controls={`${baseId}-panel`}
            onClick={() => setActivo(i)}
            className={cn(
              "text-h3 relative cursor-pointer whitespace-nowrap pb-4 transition-colors",
              FOCO,
              i === activo
                ? "text-blanco"
                : "text-blanco/40 hover:text-blanco/70",
            )}
          >
            {nombreCortoDeServicio(servicio.nombre)}
            {i === activo ? (
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-blanco" />
            ) : null}
          </button>
        ))}
      </div>

      {/*
        Línea punteada que corre por debajo de las solapas. Va en Gris oscuro
        sólido, no en blanco translúcido: así están las tres líneas punteadas
        del SVG (stroke #3C3C3C, dash 3 3).
      */}
      <div className="border-t border-dashed border-gris-oscuro" />

      {/*
        La pista. Son tres cajas y cada una tiene su razón:

        1. la de afuera declara el `container-type`, y así `cqw` mide el ancho
           útil del bloque: el paso de una tarjeta a la otra sale exacto sin
           medir nada en JavaScript ni escuchar el `resize`;
        2. la del medio recorta lo que sobra, con el recorte corrido 16px para
           afuera —`-mx-4 px-4`— para que el borde no le coma el anillo de foco
           a la primera tarjeta. Tiene que ser **menos** que el gap de 24: con
           los dos iguales, el canto de la tarjeta de al lado caía justo sobre
           el corte y quedaba un hilo de medio píxel a la izquierda;
        3. la de adentro es la fila, que es lo único que se mueve.
      */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${servicioActivo.id}`}
        className="mt-8"
        style={{ containerType: "inline-size" }}
      >
        <div className="-mx-4 -my-2 overflow-hidden px-4 py-2">
          <div
            className="pista-de-servicios flex gap-6"
            style={{
              transform: `translateX(calc(${paso} * (-50cqw - 0.75rem)))`,
            }}
          >
            {servicios.map((servicio, i) => {
              /* Solo se llega con el tabulador a las dos que están en pantalla;
                 si no, el foco pasearía por tarjetas que nadie ve. */
              const aLaVista = i === paso || i === paso + 1;
              return (
                <div
                  key={servicio.id}
                  inert={aLaVista ? undefined : true}
                  className="flex shrink-0"
                  style={{ flexBasis: "calc(50cqw - 0.75rem)" }}
                >
                  <CardServicioSiguiente
                    className="w-full"
                    titulo={servicio.nombre}
                    acento={
                      acentoDeServicio(servicio.nombre) ?? acentoPorIndice(i)
                    }
                    descripcion={
                      servicio.descripcion ??
                      servicio.subservicios.map((sub) => sub.nombre).join(" · ")
                    }
                    onClick={() => setActivo(i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
