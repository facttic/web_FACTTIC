"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Boton, FOCO } from "@/components/ui/boton";
import { PROYECTOS_PAGINA as T } from "@/lib/contenido";
import type { Referencia } from "@/lib/dominio/tipos";

/**
 * Fila de filtros de la grilla de Proyectos.
 *
 * Es un formulario GET: cada cambio navega a `/proyectos?sector=…`, así que
 * los filtros viven en la URL —se pueden compartir y volver atrás— y la
 * página, que es un componente de servidor, consulta la API con ellos. Sin
 * JavaScript sigue funcionando con el botón de buscar.
 *
 * En desktop la fila va siempre a la vista; en mobile queda detrás del botón
 * "Filtrar", como en la maqueta, que se marca activo si hay filtros puestos.
 */
export function FiltrosProyectos({
  sectores,
  servicios,
  tecnologias,
  cooperativas,
  className,
}: {
  sectores: Referencia[];
  servicios: Referencia[];
  tecnologias: Referencia[];
  cooperativas: Referencia[];
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const formulario = useRef<HTMLFormElement>(null);
  const hayFiltros = ["sector", "servicio", "tecnologia", "cooperativa"].some(
    (k) => params.get(k),
  );
  const [abierto, setAbierto] = useState(hayFiltros);

  /** Navega con lo elegido, sin recargar y sin params vacíos en la URL. */
  const aplicar = () => {
    const datos = new FormData(formulario.current!);
    const query = new URLSearchParams();
    for (const [clave, valor] of datos) {
      if (typeof valor === "string" && valor) query.set(clave, valor);
    }
    router.push(`/proyectos${query.size ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const grupos = [
    { nombre: "sector", etiqueta: T.filtros.sector, opciones: sectores },
    { nombre: "servicio", etiqueta: T.filtros.servicio, opciones: servicios },
    {
      nombre: "tecnologia",
      etiqueta: T.filtros.tecnologia,
      opciones: tecnologias,
    },
    {
      nombre: "cooperativa",
      etiqueta: T.filtros.cooperativa,
      opciones: cooperativas,
      // En la maqueta este es el único con borde; los demás van rellenos.
      conBorde: true,
    },
  ];

  return (
    <div className={className}>
      {/* En mobile la línea va arriba del botón; en desktop, bajo la fila. */}
      <div className="border-t border-borde pt-6 md:hidden" />
      <div className="flex justify-end md:hidden">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls="filtros-proyectos"
          onClick={() => setAbierto((v) => !v)}
          className={cn(
            "text-p1-bold flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-3",
            FOCO,
            hayFiltros
              ? "border-solid border-blanco bg-blanco text-negro-oscuro"
              : "border-blanco/60 text-blanco",
          )}
        >
          <IconoFiltro />
          {T.filtros.abrir}
        </button>
      </div>

      <form
        ref={formulario}
        id="filtros-proyectos"
        method="get"
        action="/proyectos"
        onSubmit={(e) => {
          e.preventDefault();
          aplicar();
        }}
        className={cn(
          "mt-4 flex-col gap-3 md:mt-0 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-3 md:border-b md:border-borde md:pb-6",
          abierto ? "flex" : "hidden md:grid",
        )}
      >
        {grupos.map((grupo) => (
          <label key={grupo.nombre} className="relative block">
            <span className="sr-only">{grupo.etiqueta}</span>
            <select
              name={grupo.nombre}
              defaultValue={params.get(grupo.nombre) ?? ""}
              onChange={aplicar}
              className={cn(
                // 56px de alto y radio 6, como los Menu-item de la maqueta.
                "text-p2 h-14 w-full cursor-pointer appearance-none rounded-md px-5 pr-11 text-blanco",
                FOCO,
                grupo.conBorde
                  ? "border border-blanco/60 bg-transparent"
                  : "border border-transparent bg-superficie-alta",
              )}
            >
              <option value="">{grupo.etiqueta}</option>
              {grupo.opciones.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.nombre}
                </option>
              ))}
            </select>
            <IconoChevron />
          </label>
        ))}

        <Boton
          type="submit"
          variante="contorno"
          aria-label="Buscar"
          className="h-14 md:w-14 md:px-0"
        >
          <IconoLupa />
        </Boton>
      </form>

      {hayFiltros ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/proyectos", { scroll: false })}
            className={cn(
              "text-p3 cursor-pointer text-blanco/60 underline-offset-4 hover:text-blanco hover:underline",
              FOCO,
            )}
          >
            {T.filtros.limpiar}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function IconoChevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-blanco/70"
    >
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}

function IconoLupa() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className="size-5"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.5 13.5 3.5 3.5" />
    </svg>
  );
}

function IconoFiltro() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className="size-5"
    >
      <path d="M3 5h14M6 10h8M8.5 15h3" />
    </svg>
  );
}
