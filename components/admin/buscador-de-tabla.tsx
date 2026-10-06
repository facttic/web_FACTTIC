"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { CONTROL } from "./piezas";

/**
 * Filtra las filas de la tabla de al lado, mientras se escribe.
 *
 * Filtra en el browser y no pidiéndole al servidor: los listados del panel
 * traen la colección entera —veintiocho proyectos hoy, y el orden de magnitud
 * no va a cambiar—, así que buscar es recorrer lo que ya está en pantalla y
 * responde en el acto, sin recargar ni perder el lugar.
 *
 * No recibe las filas: las encuentra por `data-busca`, el texto contra el que
 * cada una se compara, que arma quien la dibuja. Así sirve para cualquier
 * listado sin que ninguno tenga que convertirse en componente de cliente.
 */
export function BuscadorDeTabla({
  queBusca = "registros",
  total,
}: {
  /** Qué se está buscando, para el texto del campo: "proyectos". */
  queBusca?: string;
  /** Cuántos hay en total, para poder decir "9 de 28". */
  total: number;
}) {
  const [texto, setTexto] = useState("");
  const [visibles, setVisibles] = useState(total);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const busca = texto.trim().toLowerCase();
    const filas = document.querySelectorAll<HTMLElement>("[data-busca]");
    let cuentan = 0;
    for (const fila of filas) {
      const coincide = !busca || (fila.dataset.busca ?? "").includes(busca);
      fila.hidden = !coincide;
      if (coincide) cuentan++;
    }
    setVisibles(cuentan);
    // Al desmontarse quedarían filas escondidas si se navega con el filtro puesto.
    return () => {
      for (const fila of filas) fila.hidden = false;
    };
  }, [texto]);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        ref={campo}
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setTexto("");
        }}
        placeholder={`Buscar entre los ${queBusca}…`}
        aria-label={`Buscar ${queBusca}`}
        className={cn(CONTROL, FOCO, "max-w-xs")}
      />
      <span className="text-p3 text-blanco/55">
        {texto.trim()
          ? visibles === 0
            ? "Ninguno coincide"
            : `${visibles} de ${total}`
          : `${total} ${total === 1 ? "registro" : "registros"}`}
      </span>
    </div>
  );
}
