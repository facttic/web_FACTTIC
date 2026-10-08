"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { comprimirImagen } from "@/lib/admin/comprimir-imagen";
import { Etiqueta, Ayuda } from "./piezas";

/**
 * La galería de un proyecto: sumar, sacar y elegir cuál va de portada.
 *
 * El campo de archivos del navegador no sirve para esto y no hay forma de
 * convencerlo: cada vez que se elige algo **reemplaza** lo anterior en vez de
 * sumarlo, no deja quitar una sola, y el orden —que es el que decide la
 * portada— lo pone el diálogo del sistema, normalmente alfabético. Así que la
 * lista la lleva este componente y el input queda de mero transporte.
 *
 * Las que ya estaban subidas se bajan al abrir la ficha y se vuelven a mandar
 * con las nuevas. Es la única forma de borrar una sola: la API reemplaza la
 * lista entera en cada envío, así que para que queden dos de tres hay que
 * mandar esas dos. Pesan poco —se suben achicadas— y salen de nuestro propio
 * proxy. El día que la API sepa agregar y quitar de a una, esto sobra.
 */

interface Item {
  /** Estable, para React y para no reordenar mal al mover. */
  clave: string;
  archivo: File;
  /** `blob:` para la miniatura; se libera al sacarla. */
  vista: string;
}

/** Mete los archivos en el input, que es lo que el formulario envía. */
function ponerEnElInput(input: HTMLInputElement | null, archivos: File[]) {
  if (!input) return false;
  try {
    const bolsa = new DataTransfer();
    for (const archivo of archivos) bolsa.items.add(archivo);
    /* No alcanza con que no tire error: hay navegadores donde `add()` no
       agrega nada y asignar esa lista vacía borraría lo que había. */
    if (bolsa.files.length !== archivos.length) return false;
    input.files = bolsa.files;
    return input.files.length === archivos.length;
  } catch {
    return false;
  }
}

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

export function CampoGaleria({
  name,
  etiqueta,
  ayuda,
  actual,
  tope,
}: {
  name: string;
  etiqueta: string;
  ayuda?: string;
  /** Las que ya están subidas, como URL servible. */
  actual: string[];
  /** Cuánto puede pesar el envío entero. */
  tope: number;
}) {
  const idBase = useId();
  const transporte = useRef<HTMLInputElement>(null);
  const selector = useRef<HTMLInputElement>(null);
  const { pending: enviando } = useFormStatus();

  const [items, setItems] = useState<Item[]>([]);
  const [bajando, setBajando] = useState(actual.length > 0);
  const [avance, setAvance] = useState<{ hechas: number; total: number } | null>(
    null,
  );
  const [problema, setProblema] = useState<string | null>(null);
  /** Hasta que no se tocó nada, el envío no lleva imágenes y la API no las pisa. */
  const [tocado, setTocado] = useState(false);

  /* Las ya subidas, al abrir. Si alguna no baja, se avisa y no se toca nada:
     mandar la lista incompleta borraría las que faltaron. */
  useEffect(() => {
    if (!actual.length) return;
    let vivo = true;
    (async () => {
      try {
        const bajadas = await Promise.all(
          actual.map(async (url, i) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(String(res.status));
            const blob = await res.blob();
            const nombre = decodeURIComponent(url.split("/").pop() ?? `imagen-${i}`);
            return {
              clave: `ya-${i}`,
              archivo: new File([blob], nombre, { type: blob.type }),
              vista: URL.createObjectURL(blob),
            };
          }),
        );
        if (vivo) setItems(bajadas);
      } catch {
        if (vivo) {
          setProblema(
            "No pudimos leer las imágenes que ya están subidas, así que no se pueden reordenar ni quitar. Si elegís otras, reemplazan a todas.",
          );
        }
      } finally {
        if (vivo) setBajando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [actual]);

  /* Cada cambio de la lista se vuelca al input. */
  useEffect(() => {
    if (!tocado) return;
    const ok = ponerEnElInput(
      transporte.current,
      items.map((i) => i.archivo),
    );
    if (!ok) {
      setProblema(
        "Este navegador no deja armar la lista de archivos. Elegí todas juntas: van a reemplazar a las que estaban.",
      );
    }
  }, [items, tocado]);

  useEffect(() => {
    /* Las miniaturas son `blob:` y no se liberan solas. */
    return () => {
      for (const item of items) URL.revokeObjectURL(item.vista);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alElegir = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const nuevos = [...(evento.target.files ?? [])];
    evento.target.value = "";
    if (!nuevos.length) return;

    setProblema(null);
    setAvance({ hechas: 0, total: nuevos.length });
    const listos: Item[] = [];
    for (const archivo of nuevos) {
      const achicado = await comprimirImagen(archivo);
      listos.push({
        clave: `${Date.now()}-${listos.length}`,
        archivo: achicado,
        vista: URL.createObjectURL(achicado),
      });
      setAvance({ hechas: listos.length, total: nuevos.length });
    }
    setAvance(null);
    setTocado(true);
    setItems((previos) => [...previos, ...listos]);
  };

  const quitar = (clave: string) => {
    setTocado(true);
    setItems((previos) => {
      const fuera = previos.find((i) => i.clave === clave);
      if (fuera) URL.revokeObjectURL(fuera.vista);
      return previos.filter((i) => i.clave !== clave);
    });
  };

  const mover = (desde: number, hasta: number) => {
    if (hasta < 0 || hasta >= items.length) return;
    setTocado(true);
    setItems((previos) => {
      const copia = [...previos];
      const [item] = copia.splice(desde, 1);
      copia.splice(hasta, 0, item);
      return copia;
    });
  };

  const hacerPortada = (desde: number) => mover(desde, 0);

  const peso = items.reduce((suma, i) => suma + i.archivo.size, 0);
  const pesado = tocado && peso > tope;

  return (
    <div>
      <Etiqueta htmlFor={`${idBase}-elegir`}>{etiqueta}</Etiqueta>

      {/* El que viaja. Nunca lo toca la persona: lo llena la lista. */}
      <input ref={transporte} type="file" name={name} multiple hidden />

      {bajando ? (
        <p className="text-p3 mb-3 text-blanco/60">Leyendo las imágenes…</p>
      ) : null}

      {items.length ? (
        <ul className="mb-3 flex flex-wrap gap-3">
          {items.map((item, i) => (
            <li
              key={item.clave}
              className="relative w-[132px] overflow-hidden rounded-lg border border-borde bg-negro-oscuro/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.vista}
                alt=""
                className="h-[88px] w-full bg-superficie object-contain"
              />
              {i === 0 ? (
                <span className="text-eyebrow absolute top-1.5 left-1.5 rounded bg-lila px-1.5 py-0.5 text-negro-oscuro">
                  Portada
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => quitar(item.clave)}
                aria-label={`Quitar ${item.archivo.name}`}
                className={cn(
                  "absolute top-1.5 right-1.5 grid size-6 cursor-pointer place-items-center rounded-full",
                  "bg-negro-oscuro/80 text-blanco hover:bg-rojo hover:text-negro-oscuro",
                  FOCO,
                )}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden
                  className="size-3"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>

              <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                <span className="flex gap-0.5">
                  <Mover
                    etiqueta="Mover antes"
                    señal="m12 4-6 6 6 6"
                    alTocar={() => mover(i, i - 1)}
                    apagado={i === 0}
                  />
                  <Mover
                    etiqueta="Mover después"
                    señal="m8 4 6 6-6 6"
                    alTocar={() => mover(i, i + 1)}
                    apagado={i === items.length - 1}
                  />
                </span>
                {i === 0 ? (
                  <span className="text-p3 text-blanco/30">{mb(item.archivo.size)}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => hacerPortada(i)}
                    className={cn(
                      "text-p3 cursor-pointer rounded px-1 text-blanco/50 hover:text-blanco",
                      FOCO,
                    )}
                  >
                    Portada
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={selector}
        id={`${idBase}-elegir`}
        type="file"
        accept="image/*"
        multiple
        onChange={alElegir}
        className={cn(
          "text-p3 w-full cursor-pointer rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-2.5 text-blanco/70",
          "file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-superficie-alta file:px-3 file:py-1 file:text-blanco",
          FOCO,
        )}
      />

      <Ayuda>
        {ayuda ??
          "Se suman a las que ya están. La primera es la portada: podés moverlas o tocar «Portada»."}
      </Ayuda>

      {avance ? (
        <div className="mt-2" aria-live="polite">
          <p className="text-p3 text-blanco/60">
            Achicando {Math.max(1, avance.hechas)} de {avance.total}…
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded bg-superficie-alta">
            <div
              className="h-full rounded bg-lila transition-[width] duration-300"
              style={{ width: `${(avance.hechas / avance.total) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {!avance && enviando && tocado ? (
        <p className="text-p3 mt-2 text-blanco/60" aria-live="polite">
          Subiendo {items.length}{" "}
          {items.length === 1 ? "imagen" : "imágenes"} ({mb(peso)})…
        </p>
      ) : null}

      {!avance && !enviando && tocado ? (
        <p className="text-p3 mt-2 text-blanco/60">
          {items.length} {items.length === 1 ? "imagen" : "imágenes"}, {mb(peso)}
          {items.length ? "" : " — se van a borrar todas"}.
        </p>
      ) : null}

      {problema ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {problema}
        </p>
      ) : null}

      {pesado ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          Pesan {mb(peso)} y el máximo es {mb(tope)}. Sacá alguna: si se envía
          así, la carga falla.
        </p>
      ) : null}
    </div>
  );
}

function Mover({
  etiqueta,
  señal,
  alTocar,
  apagado,
}: {
  etiqueta: string;
  señal: string;
  alTocar: () => void;
  apagado: boolean;
}) {
  return (
    <button
      type="button"
      onClick={alTocar}
      disabled={apagado}
      aria-label={etiqueta}
      className={cn(
        "grid size-5 place-items-center rounded",
        apagado
          ? "cursor-default text-blanco/15"
          : "cursor-pointer text-blanco/50 hover:bg-superficie hover:text-blanco",
        FOCO,
      )}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-3"
      >
        <path d={señal} />
      </svg>
    </button>
  );
}
