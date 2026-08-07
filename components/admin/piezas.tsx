"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";

/**
 * Piezas del panel: los ladrillos que arman los nueve ABMs.
 *
 * Densas y sobrias a propósito. En el sitio público cada tarjeta respira; acá
 * lo que importa es ver muchas filas juntas y que el foco del teclado se note,
 * porque se cargan datos durante horas.
 */

export function Encabezado({
  titulo,
  cantidad,
  accion,
}: {
  titulo: string;
  cantidad?: number;
  accion?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-h2">{titulo}</h1>
        {cantidad !== undefined ? (
          <p className="text-p3 mt-1 text-blanco/50">
            {cantidad} {cantidad === 1 ? "registro" : "registros"}
          </p>
        ) : null}
      </div>
      {accion}
    </div>
  );
}

export function BotonAdmin({
  children,
  variante = "primario",
  className,
  ...props
}: {
  variante?: "primario" | "secundario" | "peligro";
  children: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "text-p3 cursor-pointer rounded-lg px-4 py-2 transition-colors disabled:opacity-40",
        FOCO,
        variante === "primario" && "bg-blanco text-negro-oscuro hover:bg-lila",
        variante === "secundario" &&
          "border border-borde text-blanco hover:bg-superficie",
        variante === "peligro" &&
          "border border-rojo/40 text-rojo hover:bg-rojo/10",
        className,
      )}
      {...props}
    />
  );
}

export function EnlaceAdmin({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href as "/admin"}
      className={cn(
        "text-p3 rounded-lg bg-blanco px-4 py-2 text-negro-oscuro transition-colors hover:bg-lila",
        FOCO,
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Tabla del panel: cabecera fija de estilo, filas que se marcan al pasar. */
export function Tabla({
  columnas,
  children,
  vacio,
}: {
  columnas: string[];
  children: React.ReactNode;
  vacio?: string;
}) {
  const hayFilas = Array.isArray(children) ? children.length > 0 : !!children;

  if (!hayFilas) {
    return (
      <div className="rounded-xl border border-dashed border-borde p-12 text-center">
        <p className="text-p2 text-blanco/50">
          {vacio ?? "Todavía no hay nada cargado."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-borde">
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-borde bg-superficie">
          <tr className="text-eyebrow text-blanco/40">
            {columnas.map((columna) => (
              <th key={columna} className="px-4 py-3 font-normal">
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">{children}</tbody>
      </table>
    </div>
  );
}

export function Fila({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors hover:bg-superficie">{children}</tr>;
}

export function Celda({
  children,
  apagado = false,
  className,
}: {
  children: React.ReactNode;
  /** Lo que falta cargar se ve apagado, para leer la tabla de un vistazo. */
  apagado?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "text-p3 px-4 py-3",
        apagado ? "text-blanco/25" : "text-blanco/80",
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ---------- Formularios ---------- */

export function Etiqueta({
  htmlFor,
  children,
  ayuda,
}: {
  htmlFor: string;
  children: React.ReactNode;
  ayuda?: string;
}) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="text-p3 block text-blanco/70">
        {children}
      </label>
      {ayuda ? <p className="text-p3 mt-1 text-blanco/35">{ayuda}</p> : null}
    </div>
  );
}

const CONTROL =
  "text-p2 w-full rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-2.5 " +
  "text-blanco placeholder:text-blanco/25 transition-colors focus:border-blanco/40";

export function CampoTexto({
  id,
  etiqueta,
  ayuda,
  multilinea = false,
  ...props
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  multilinea?: boolean;
} & React.ComponentProps<"input"> &
  React.ComponentProps<"textarea">) {
  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      {multilinea ? (
        <textarea id={id} rows={6} className={cn(CONTROL, FOCO)} {...props} />
      ) : (
        <input id={id} className={cn(CONTROL, FOCO)} {...props} />
      )}
    </div>
  );
}

export function CampoSelector({
  id,
  etiqueta,
  ayuda,
  children,
  ...props
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
} & React.ComponentProps<"select">) {
  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      <select
        id={id}
        className={cn(CONTROL, "cursor-pointer", FOCO)}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/** Varias opciones a la vez, como los servicios de una cooperativa. */
export function CampoMultiple({
  nombre,
  etiqueta,
  ayuda,
  opciones,
  elegidas,
}: {
  nombre: string;
  etiqueta: string;
  ayuda?: string;
  opciones: Array<{ id: string; nombre: string }>;
  elegidas: string[];
}) {
  return (
    <fieldset>
      <legend className="text-p3 mb-2 text-blanco/70">{etiqueta}</legend>
      {ayuda ? <p className="text-p3 mb-3 text-blanco/35">{ayuda}</p> : null}
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <label
            key={opcion.id}
            className="text-p3 flex cursor-pointer items-center gap-2 rounded-lg border border-borde px-3 py-2 transition-colors hover:bg-superficie has-checked:border-lila has-checked:bg-lila/10"
          >
            <input
              type="checkbox"
              name={nombre}
              value={opcion.id}
              defaultChecked={elegidas.includes(opcion.id)}
              className={cn("size-3.5 cursor-pointer accent-lila", FOCO)}
            />
            {opcion.nombre}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CampoArchivo({
  id,
  etiqueta,
  ayuda,
  actual,
  ...props
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  /** Lo que ya está cargado, para saber si se va a reemplazar. */
  actual?: string | null;
} & React.ComponentProps<"input">) {
  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      {actual ? (
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={actual}
            alt=""
            className="h-12 w-auto rounded border border-borde object-contain"
          />
          <span className="text-p3 text-blanco/40">
            Si elegís otro, reemplaza a este
          </span>
        </div>
      ) : null}
      <input
        id={id}
        type="file"
        className={cn(
          "text-p3 w-full cursor-pointer rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-2.5 text-blanco/70",
          "file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-superficie-alta file:px-3 file:py-1 file:text-blanco",
          FOCO,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Formulario del panel: envía con una acción de servidor y muestra el error
 * sin perder lo escrito.
 */
export function FormularioAdmin({
  accion,
  children,
  volverA,
  textoGuardar = "Guardar",
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  children: React.ReactNode;
  volverA: string;
  textoGuardar?: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  return (
    <form action={enviar} className="flex max-w-2xl flex-col gap-6">
      {children}

      {estado?.error ? (
        <p role="alert" className="text-p3 rounded-lg bg-rojo/10 p-3 text-rojo">
          {estado.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-borde pt-6">
        <BotonAdmin type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : textoGuardar}
        </BotonAdmin>
        <Link
          href={volverA as "/admin"}
          className={cn(
            "text-p3 rounded-lg px-4 py-2 text-blanco/60 transition-colors hover:text-blanco",
            FOCO,
          )}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

export type EstadoForm = { error?: string } | undefined;

/**
 * Botón de borrar con confirmación en dos pasos.
 *
 * No usa `confirm()` del navegador: bloquea el hilo y se ve ajeno. El primer
 * clic pide confirmación en el mismo botón y el segundo borra.
 */
export function BotonBorrar({
  accion,
  que,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  que: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <form action={enviar} className="inline">
      {confirmando ? (
        <span className="flex items-center gap-2">
          <BotonAdmin type="submit" variante="peligro" disabled={enviando}>
            {enviando ? "Borrando…" : "Confirmar"}
          </BotonAdmin>
          <BotonAdmin
            type="button"
            variante="secundario"
            onClick={() => setConfirmando(false)}
          >
            No
          </BotonAdmin>
        </span>
      ) : (
        <BotonAdmin
          type="button"
          variante="peligro"
          onClick={() => setConfirmando(true)}
          aria-label={`Borrar ${que}`}
        >
          Borrar
        </BotonAdmin>
      )}
      {estado?.error ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {estado.error}
        </p>
      ) : null}
    </form>
  );
}
