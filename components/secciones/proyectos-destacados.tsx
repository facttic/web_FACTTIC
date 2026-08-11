"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { BotonFlecha } from "@/components/ui/boton";
import { EncabezadoSeccion } from "@/components/ui/seccion";
import { CardProyecto, FilaProyecto } from "@/components/tarjetas/proyecto";
import type { Proyecto } from "@/lib/dominio/tipos";

/**
 * "Proyectos destacados" de las verticales.
 *
 * En desktop es un carrusel con flechas junto al título —no un "Ver todos"—:
 * una tarjeta ancha y una angosta, como el bloque de destacados de la Home,
 * que avanza de a una pantalla. En mobile la maqueta lo cambia por la lista
 * de filas, sin flechas.
 *
 * Es un componente de cliente porque las flechas necesitan saber cuánto queda
 * por desplazar para deshabilitarse: la que no puede avanzar va punteada y
 * apagada, la útil va rellena.
 */
export function ProyectosDestacados({
  titulo,
  proyectos,
  className,
}: {
  titulo: string;
  proyectos: Proyecto[];
  className?: string;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ atras: false, adelante: false });

  const medir = () => {
    const el = pista.current;
    if (!el) return;
    setPuede({
      atras: el.scrollLeft > 4,
      adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const avanzar = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: sentido * el.clientWidth, behavior: "smooth" });
  };

  if (!proyectos.length) return null;

  return (
    <div className={className}>
      <EncabezadoSeccion
        titulo={titulo}
        tamanoTitulo="h2"
        accion={
          <div className="hidden items-center gap-2 md:flex">
            <BotonFlecha
              direccion="anterior"
              disabled={!puede.atras}
              onClick={() => avanzar(-1)}
            />
            <BotonFlecha
              direccion="siguiente"
              variante={puede.adelante ? "solida" : "punteada"}
              disabled={!puede.adelante}
              onClick={() => avanzar(1)}
            />
          </div>
        }
      />

      {/* En mobile no hay tarjetas con imagen: la maqueta lista los proyectos. */}
      <div className="md:hidden">
        {proyectos.map((proyecto) => (
          <FilaProyecto key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>

      <div
        ref={pista}
        onScroll={medir}
        className="scroll-limpio hidden gap-5 overflow-x-auto md:flex"
      >
        {proyectos.map((proyecto, i) => (
          <CardProyecto
            key={proyecto.id}
            proyecto={proyecto}
            alto="h-[310px]"
            // El ritmo de la maqueta: una tarjeta ancha y una angosta. La
            // ancha es la destacada, la única que muestra la descripción.
            destacada={i % 2 === 0}
            className={cn("shrink-0", i % 2 ? "w-[391px]" : "w-[808px]")}
          />
        ))}
      </div>
    </div>
  );
}
