"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { BotonAdmin, CONTROL, type Opcion } from "./piezas";

/**
 * Elegir varios de una lista larga, buscando.
 *
 * Reemplaza a la tirada de casillas: con cinco servicios entraban, con treinta
 * tecnologías era un muro donde no se encontraba nada. Acá se escribe, la lista
 * filtra, y lo elegido queda arriba como etiquetas que se sacan de a una.
 *
 * Si lo que se busca no existe y el recurso lo permite, la misma búsqueda
 * ofrece crearlo: es el caso de las tecnologías y los clientes, que aparecen
 * mientras se carga un proyecto y no tiene sentido ir a darlos de alta a otra
 * pantalla para volver después.
 *
 * Lo elegido viaja en campos ocultos con el mismo nombre repetido, que es como
 * lo lee la acción —igual que las casillas de antes—.
 */
export function CampoBuscador({
  nombre,
  etiqueta,
  ayuda,
  opciones,
  elegidas,
  crear,
  queEs = "uno",
  vacio = "Todavía no hay ninguno cargado.",
}: {
  nombre: string;
  etiqueta: string;
  ayuda?: string;
  opciones: Opcion[];
  elegidas: string[];
  /** Da de alta uno nuevo y lo devuelve ya con su id. */
  crear?: (
    nombre: string,
  ) => Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }>;
  /** Cómo se llama de a uno, para los textos del alta. */
  queEs?: string;
  /** Qué decir cuando no hay nada para elegir. */
  vacio?: string;
}) {
  const [sumadas, setSumadas] = useState<Opcion[]>([]);
  const [puestas, setPuestas] = useState<string[]>(elegidas);
  const [busqueda, setBusqueda] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const campo = useRef<HTMLInputElement>(null);

  const todas = [...opciones, ...sumadas];
  const porId = new Map(todas.map((o) => [o.id, o]));
  const limpia = busqueda.trim().toLowerCase();

  const candidatas = todas
    .filter((o) => !puestas.includes(o.id))
    .filter((o) => !limpia || o.nombre.toLowerCase().includes(limpia))
    .slice(0, 8);

  const yaExiste = todas.some((o) => o.nombre.trim().toLowerCase() === limpia);

  const poner = (id: string) => {
    setPuestas((previas) =>
      previas.includes(id) ? previas : [...previas, id],
    );
    setBusqueda("");
    campo.current?.focus();
  };

  const sacar = (id: string) =>
    setPuestas((previas) => previas.filter((otro) => otro !== id));

  async function crearYPoner() {
    if (!crear || !busqueda.trim()) return;
    setCreando(true);
    setError(null);
    const resultado = await crear(busqueda.trim());
    setCreando(false);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setSumadas((previas) => [...previas, resultado.opcion]);
    poner(resultado.opcion.id);
  }

  return (
    <fieldset>
      <legend className="text-p3 mb-2 text-blanco/90">{etiqueta}</legend>
      {ayuda ? <p className="text-p3 mb-3 text-blanco/55">{ayuda}</p> : null}

      {puestas.length ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {puestas.map((id) => (
            <li
              key={id}
              className="text-p3 flex items-center gap-2 rounded-md border border-lila/40 bg-lila/10 py-1 pr-1 pl-3 text-blanco"
            >
              {porId.get(id)?.nombre ?? id}
              <button
                type="button"
                onClick={() => sacar(id)}
                aria-label={`Quitar ${porId.get(id)?.nombre ?? "selección"}`}
                className={cn(
                  "cursor-pointer rounded px-1.5 text-blanco/60 hover:text-blanco",
                  FOCO,
                )}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Lo elegido viaja acá: la lista de arriba es solo lo que se ve. */}
      {puestas.map((id) => (
        <input key={id} type="hidden" name={nombre} value={id} />
      ))}

      {todas.length === 0 && !crear ? (
        <p className="text-p3 rounded-md border border-dashed border-borde px-3 py-2 text-blanco/55">
          {vacio}
        </p>
      ) : (
        <>
          <input
            ref={campo}
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              // Enter elige la primera coincidencia; sin ninguna, crea.
              e.preventDefault();
              if (candidatas[0]) poner(candidatas[0].id);
              else if (crear && !yaExiste) void crearYPoner();
            }}
            placeholder={`Buscar${crear ? " o escribir uno nuevo" : ""}…`}
            aria-label={`Buscar ${etiqueta.toLowerCase()}`}
            className={cn(CONTROL, FOCO)}
          />

          {limpia || candidatas.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {candidatas.map((opcion) => (
                <li key={opcion.id}>
                  <button
                    type="button"
                    onClick={() => poner(opcion.id)}
                    className={cn(
                      "text-p3 cursor-pointer rounded-md border border-borde px-3 py-1.5 text-blanco/90 transition-colors hover:border-blanco/40 hover:text-blanco",
                      FOCO,
                    )}
                  >
                    {opcion.nombre}
                  </button>
                </li>
              ))}

              {crear && limpia && !yaExiste ? (
                <li>
                  <BotonAdmin
                    type="button"
                    variante="secundario"
                    disabled={creando}
                    onClick={crearYPoner}
                  >
                    {creando
                      ? "Creando…"
                      : `Crear ${queEs} «${busqueda.trim()}»`}
                  </BotonAdmin>
                </li>
              ) : null}

              {!candidatas.length && !crear ? (
                <li className="text-p3 py-1.5 text-blanco/55">
                  Nada coincide con «{busqueda.trim()}».
                </li>
              ) : null}
            </ul>
          ) : null}
        </>
      )}

      {error ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
