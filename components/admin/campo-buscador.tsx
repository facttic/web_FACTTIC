"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { Ayuda, Etiqueta, type Opcion } from "./piezas";

/**
 * Elegir varios de una lista larga, buscando.
 *
 * Reemplaza a la tirada de casillas: con cinco servicios entraban, con treinta
 * tecnologías era un muro donde no se encontraba nada.
 *
 * Se comporta como el campo de destinatarios de un correo, que es el gesto que
 * todo el mundo ya tiene: lo elegido vive **adentro** del campo, como etiquetas
 * que se sacan con su cruz, y la lista se despliega al tocarlo. Antes las
 * opciones disponibles colgaban sueltas debajo con la misma forma que las
 * elegidas y no se distinguía una cosa de la otra.
 *
 * Si lo que se busca no existe y el recurso lo permite, la misma lista ofrece
 * crearlo: es el caso de las tecnologías y los clientes, que aparecen mientras
 * se carga un proyecto y no tiene sentido ir a darlos de alta a otra pantalla
 * para volver después.
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
  const id = useId();
  const [sumadas, setSumadas] = useState<Opcion[]>([]);
  const [puestas, setPuestas] = useState<string[]>(elegidas);
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [resaltada, setResaltada] = useState(0);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const campo = useRef<HTMLInputElement>(null);

  const todas = [...opciones, ...sumadas];
  const porId = new Map(todas.map((o) => [o.id, o]));
  const limpia = busqueda.trim().toLowerCase();

  const candidatas = todas
    .filter((o) => !puestas.includes(o.id))
    .filter((o) => !limpia || o.nombre.toLowerCase().includes(limpia));

  const yaExiste = todas.some((o) => o.nombre.trim().toLowerCase() === limpia);
  const ofreceCrear = Boolean(crear) && limpia.length > 0 && !yaExiste;
  /** Cuántas filas tiene la lista: las coincidencias y, al final, el alta. */
  const filas = candidatas.length + (ofreceCrear ? 1 : 0);

  const poner = (idOpcion: string) => {
    setPuestas((previas) =>
      previas.includes(idOpcion) ? previas : [...previas, idOpcion],
    );
    setBusqueda("");
    setResaltada(0);
    campo.current?.focus();
  };

  const sacar = (idOpcion: string) =>
    setPuestas((previas) => previas.filter((otro) => otro !== idOpcion));

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

  /** Elige lo que esté resaltado: la última fila es el alta, si se ofrece. */
  const elegirResaltada = () => {
    if (ofreceCrear && resaltada === candidatas.length) {
      void crearYPoner();
      return;
    }
    const opcion = candidatas[resaltada];
    if (opcion) poner(opcion.id);
  };

  function alTeclear(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      setAbierto(true);
      if (filas === 0) return;
      const paso = evento.key === "ArrowDown" ? 1 : -1;
      setResaltada((previa) => (previa + paso + filas) % filas);
      return;
    }
    if (evento.key === "Enter") {
      // Dentro de un formulario, Enter enviaría todo: acá solo elige.
      evento.preventDefault();
      elegirResaltada();
      return;
    }
    if (evento.key === "Escape") {
      setAbierto(false);
      return;
    }
    // Con el campo vacío, un retroceso saca la última etiqueta.
    if (evento.key === "Backspace" && !busqueda && puestas.length) {
      sacar(puestas[puestas.length - 1]);
    }
  }

  const sinNada = todas.length === 0 && !crear;

  return (
    <fieldset
      // Un clic afuera cierra la lista; moverse entre sus botones, no.
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node)) {
          setAbierto(false);
        }
      }}
    >
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>

      {/* Lo elegido viaja acá: las etiquetas de la caja son solo lo que se ve. */}
      {puestas.map((idOpcion) => (
        <input key={idOpcion} type="hidden" name={nombre} value={idOpcion} />
      ))}

      {sinNada ? (
        <p className="text-p3 rounded-md border border-dashed border-borde px-3 py-2 text-blanco/55">
          {vacio}
        </p>
      ) : (
        <div className="relative">
          {/* Parece un control y se comporta como uno: el clic en cualquier
              parte de la caja lleva el cursor al campo de texto. */}
          <div
            onMouseDown={(evento) => {
              if (evento.target === evento.currentTarget) {
                evento.preventDefault();
                campo.current?.focus();
              }
            }}
            className={cn(
              "flex w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-borde",
              "bg-negro-oscuro/60 px-2 py-1.5 transition-colors",
              "hover:border-blanco/25 focus-within:border-lila focus-within:bg-negro-oscuro",
            )}
          >
            {puestas.map((idOpcion) => (
              <span
                key={idOpcion}
                className="text-p3 flex items-center gap-1.5 rounded border border-lila/40 bg-lila/15 py-0.5 pr-1 pl-2 text-blanco"
              >
                {porId.get(idOpcion)?.nombre ?? idOpcion}
                <button
                  type="button"
                  onClick={() => sacar(idOpcion)}
                  aria-label={`Quitar ${porId.get(idOpcion)?.nombre ?? "selección"}`}
                  className={cn(
                    "cursor-pointer rounded px-1 text-blanco/60 hover:text-blanco",
                    FOCO,
                  )}
                >
                  ×
                </button>
              </span>
            ))}

            <input
              ref={campo}
              id={id}
              type="text"
              role="combobox"
              aria-expanded={abierto}
              aria-controls={`${id}-lista`}
              autoComplete="off"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setResaltada(0);
                setAbierto(true);
              }}
              onFocus={() => setAbierto(true)}
              onKeyDown={alTeclear}
              placeholder={
                puestas.length
                  ? "Agregar…"
                  : `Buscar${crear ? " o escribir uno nuevo" : ""}…`
              }
              className="text-p2 min-w-40 flex-1 bg-transparent px-1 py-1 text-blanco placeholder:text-blanco/40 focus:outline-none"
            />
          </div>

          {abierto ? (
            <ul
              id={`${id}-lista`}
              role="listbox"
              className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-borde bg-negro-oscuro py-1 shadow-xl"
            >
              {candidatas.map((opcion, i) => (
                <li
                  key={opcion.id}
                  role="option"
                  aria-selected={i === resaltada}
                >
                  <button
                    type="button"
                    onClick={() => poner(opcion.id)}
                    onMouseEnter={() => setResaltada(i)}
                    className={cn(
                      "text-p2 block w-full cursor-pointer px-3 py-1.5 text-left text-blanco/90",
                      i === resaltada && "bg-superficie-alta text-blanco",
                    )}
                  >
                    {opcion.nombre}
                  </button>
                </li>
              ))}

              {ofreceCrear ? (
                <li
                  role="option"
                  aria-selected={resaltada === candidatas.length}
                >
                  <button
                    type="button"
                    disabled={creando}
                    onClick={crearYPoner}
                    onMouseEnter={() => setResaltada(candidatas.length)}
                    className={cn(
                      "text-p2 block w-full cursor-pointer px-3 py-1.5 text-left text-lila disabled:opacity-50",
                      resaltada === candidatas.length && "bg-superficie-alta",
                    )}
                  >
                    {creando
                      ? "Creando…"
                      : `Crear ${queEs} «${busqueda.trim()}»`}
                  </button>
                </li>
              ) : null}

              {filas === 0 ? (
                <li className="text-p3 px-3 py-1.5 text-blanco/55">
                  {limpia
                    ? `Nada coincide con «${busqueda.trim()}».`
                    : "Ya están todos elegidos."}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      )}

      <Ayuda>{ayuda}</Ayuda>

      {error ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
