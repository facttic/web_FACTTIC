"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

/**
 * El mismo bloque de campos en los dos idiomas, con solapas.
 *
 * Antes cada campo traducible se dibujaba dos veces seguidas —"Desafío",
 * "Desafío · English"— y el formulario medía el doble: se perdía de vista qué
 * campos había y cuál era el original.
 *
 * Los dos juegos quedan montados a la vez y el que no se muestra va con
 * `hidden`: el formulario es uno solo, así que al guardar viajan los dos
 * idiomas aunque la solapa del inglés nunca se haya abierto.
 */
export function SolapasIdioma({
  espanol,
  ingles,
  /** Cuántos campos del inglés están cargados, para avisar en la solapa. */
  traducidos,
}: {
  espanol: React.ReactNode;
  ingles: React.ReactNode;
  traducidos?: { cargados: number; total: number };
}) {
  const [activa, setActiva] = useState<"es" | "en">("es");

  const solapa = (cual: "es" | "en", texto: string) => (
    <button
      key={cual}
      type="button"
      onClick={() => setActiva(cual)}
      aria-pressed={activa === cual}
      className={cn(
        "text-p3 -mb-px cursor-pointer border-b-2 px-1 pb-2 transition-colors",
        FOCO,
        activa === cual
          ? "border-lila text-blanco"
          : "border-transparent text-blanco/55 hover:text-blanco/80",
      )}
    >
      {texto}
    </button>
  );

  return (
    <div>
      <div className="mb-5 flex items-center gap-6 border-b border-borde">
        {solapa("es", "Español")}
        {solapa("en", "English")}
        {traducidos ? (
          <span className="text-p3 ml-auto pb-2 text-blanco/55">
            {traducidos.cargados === 0
              ? "sin traducir"
              : `${traducidos.cargados} de ${traducidos.total} traducidos`}
          </span>
        ) : null}
      </div>

      <div
        className={cn("flex flex-col gap-5", activa === "es" ? "" : "hidden")}
      >
        {espanol}
      </div>
      <div
        className={cn("flex flex-col gap-5", activa === "en" ? "" : "hidden")}
      >
        {ingles}
      </div>
    </div>
  );
}
