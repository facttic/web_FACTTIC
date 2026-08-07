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
    >
      {children}
    </button>
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
            {/* La clave lleva la posición porque más de una columna puede ir
                sin encabezado —la de acciones, por ejemplo—. */}
            {columnas.map((columna, i) => (
              <th key={`${i}-${columna}`} className="px-4 py-3 font-normal">
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

/**
 * Reparte una ficha en dos columnas.
 *
 * El panel se usa en pantalla grande y de corrido: una sola columna angosta
 * deja media pantalla vacía y obliga a bajar para ver si falta algo. La regla
 * al repartir es siempre la misma: de un lado lo que se escribe, del otro lo
 * que se elige o se sube.
 */
export function Columnas({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">{children}</div>;
}

export function Columna({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

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

/** El aspecto de todo control de texto del panel; se exporta para los campos
 * que se arman a mano, como las filas de subservicios. */
export const CONTROL =
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

export interface Opcion {
  id: string;
  nombre: string;
}

/**
 * Un selector que además deja dar de alta la opción que falta.
 *
 * Es la versión de un solo valor del alta al vuelo del `CampoMultiple`, y vale
 * lo mismo: no recarga nada, así que lo que se venía escribiendo en el resto
 * del formulario no se pierde. Lo recién creado queda elegido, que es para lo
 * que se creó, y por eso el `<select>` va controlado.
 */
export function CampoSelectorConAlta({
  id,
  nombre,
  etiqueta,
  ayuda,
  opciones,
  elegida,
  vacio,
  crear,
  queEs,
}: {
  id: string;
  nombre: string;
  etiqueta: string;
  ayuda?: string;
  opciones: Opcion[];
  elegida?: string;
  /** El texto de la opción sin elegir: "Sin cliente". */
  vacio: string;
  crear: (
    nombre: string,
  ) => Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }>;
  queEs: string;
}) {
  const [sumadas, setSumadas] = useState<Opcion[]>([]);
  const [valor, setValor] = useState(elegida ?? "");
  const todas = [...opciones, ...sumadas];

  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      <select
        id={id}
        name={nombre}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className={cn(CONTROL, "cursor-pointer", FOCO)}
      >
        <option value="">{vacio}</option>
        {todas.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion.nombre}
          </option>
        ))}
      </select>
      <AltaAlVuelo
        queEs={queEs}
        yaEstan={todas}
        crear={crear}
        alCrear={(opcion) => {
          setSumadas((previas) => [...previas, opcion]);
          setValor(opcion.id);
        }}
      />
    </div>
  );
}

/**
 * Varias opciones a la vez, como los servicios de una cooperativa.
 *
 * Con `crear` se le agrega un alta al vuelo: si lo que la persona busca no
 * está en la lista, lo da de alta sin salir de la pantalla. Lo nuevo se suma
 * al estado y queda marcado, **sin recargar**: recargar volvería a pedir la
 * página al servidor y se perdería todo lo que se venía escribiendo en el
 * formulario. El id recién creado ya viaja con el resto al guardar.
 */
export function CampoMultiple({
  nombre,
  etiqueta,
  ayuda,
  opciones,
  elegidas,
  crear,
  queEs,
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
}) {
  const [sumadas, setSumadas] = useState<Opcion[]>([]);
  const todas = [...opciones, ...sumadas];

  return (
    <fieldset>
      <legend className="text-p3 mb-2 text-blanco/70">{etiqueta}</legend>
      {ayuda ? <p className="text-p3 mb-3 text-blanco/35">{ayuda}</p> : null}
      <div className="flex flex-wrap gap-2">
        {todas.map((opcion) => (
          <label
            key={opcion.id}
            className="text-p3 flex cursor-pointer items-center gap-2 rounded-lg border border-borde px-3 py-2 transition-colors hover:bg-superficie has-checked:border-lila has-checked:bg-lila/10"
          >
            <input
              type="checkbox"
              name={nombre}
              value={opcion.id}
              // Lo recién creado se marca solo: para eso se dio de alta.
              defaultChecked={
                elegidas.includes(opcion.id) ||
                sumadas.some((s) => s.id === opcion.id)
              }
              className={cn("size-3.5 cursor-pointer accent-lila", FOCO)}
            />
            {opcion.nombre}
          </label>
        ))}
      </div>
      {crear ? (
        <AltaAlVuelo
          queEs={queEs ?? "uno"}
          yaEstan={todas}
          crear={crear}
          alCrear={(opcion) => setSumadas((previas) => [...previas, opcion])}
        />
      ) : null}
    </fieldset>
  );
}

/** El campito que aparece al pie de un `CampoMultiple` para agregar una opción. */
function AltaAlVuelo({
  queEs,
  yaEstan,
  crear,
  alCrear,
}: {
  queEs: string;
  yaEstan: Opcion[];
  crear: (
    nombre: string,
  ) => Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }>;
  alCrear: (opcion: Opcion) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [valor, setValor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);

  async function confirmar() {
    const limpio = valor.trim();
    if (limpio.length < 3) {
      setError("El nombre tiene que tener al menos 3 caracteres");
      return;
    }
    // Avisar antes de crear un duplicado es más barato que limpiarlo después.
    const repetido = yaEstan.find(
      (o) => o.nombre.toLowerCase() === limpio.toLowerCase(),
    );
    if (repetido) {
      setError(`Ya existe: marcá "${repetido.nombre}" en la lista`);
      return;
    }

    setCreando(true);
    setError(null);
    const resultado = await crear(limpio);
    setCreando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    alCrear(resultado.opcion);
    setValor("");
    setAbierto(false);
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={cn(
          "text-p3 mt-3 cursor-pointer rounded-lg px-2 py-1 text-blanco/50 underline-offset-4 transition-colors hover:text-blanco hover:underline",
          FOCO,
        )}
      >
        ¿Falta {queEs}? Agregalo
      </button>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-start gap-2">
        <input
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          // Enter dentro de un formulario lo enviaría entero; acá solo crea.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void confirmar();
            }
            if (e.key === "Escape") setAbierto(false);
          }}
          placeholder={`Nombre ${queEs === "uno" ? "" : `del ${queEs}`}`.trim()}
          aria-label={`Nombre ${queEs}`}
          className={cn(CONTROL, FOCO, "w-auto min-w-64 flex-1")}
        />
        <BotonAdmin
          type="button"
          onClick={() => void confirmar()}
          disabled={creando}
        >
          {creando ? "Creando…" : "Crear"}
        </BotonAdmin>
        <BotonAdmin
          type="button"
          variante="secundario"
          onClick={() => {
            setAbierto(false);
            setError(null);
          }}
        >
          Cancelar
        </BotonAdmin>
      </div>
      {error ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Una casilla suelta, como "destacado" en un proyecto. */
export function CampoCasilla({
  id,
  etiqueta,
  ayuda,
  ...props
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
} & React.ComponentProps<"input">) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-p2 flex cursor-pointer items-center gap-3 text-blanco/80"
      >
        <input
          id={id}
          type="checkbox"
          className={cn("size-4 cursor-pointer accent-lila", FOCO)}
          {...props}
        />
        {etiqueta}
      </label>
      {ayuda ? <p className="text-p3 mt-1 text-blanco/35">{ayuda}</p> : null}
    </div>
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
  /**
   * Lo que ya está cargado, para saber si se va a reemplazar. Acepta varias
   * porque un proyecto lleva una galería entera.
   */
  actual?: string | string[] | null;
} & React.ComponentProps<"input">) {
  const cargadas = (Array.isArray(actual) ? actual : [actual]).filter(
    (url): url is string => !!url,
  );

  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      {cargadas.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {cargadas.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              className="h-12 w-auto rounded border border-borde object-contain"
            />
          ))}
          {cargadas.length === 1 ? (
            <span className="text-p3 text-blanco/40">
              Si elegís otro, reemplaza a este
            </span>
          ) : null}
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
 *
 * Los campos van dentro de un recuadro y **las acciones no van con ellos, sino
 * ancladas al pie de la ventana**. Es la única forma de que "Guardar" quede
 * siempre por debajo de todo: hay pantallas que siguen con otra sección —la
 * ficha de una cooperativa sigue con sus proyectos— y un botón de guardar a
 * mitad de página se lee como si guardara también lo de abajo. Anclado, además,
 * no hay que bajar hasta el final para guardar una ficha larga.
 *
 * El botón sigue siendo hijo del `<form>`: estar fijo es cosa del dibujo, no
 * del documento, así que envía este formulario y no otro.
 */
export function FormularioAdmin({
  accion,
  children,
  volverA,
  textoGuardar = "Guardar",
  className,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  children: React.ReactNode;
  volverA: string;
  textoGuardar?: string;
  /** Para los formularios que se reparten en columnas y necesitan más ancho. */
  className?: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  return (
    <form
      action={enviar}
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-borde p-6",
        className,
      )}
    >
      {children}

      {estado?.error ? (
        <p role="alert" className="text-p3 rounded-lg bg-rojo/10 p-3 text-rojo">
          {estado.error}
        </p>
      ) : null}

      {/* Arranca donde termina la barra lateral, para no taparla. */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-borde bg-negro-oscuro/95 p-4 backdrop-blur md:left-64 md:px-8">
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
  id,
  que,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  /** A quién borra. Viaja en el formulario, así la acción no necesita cierre. */
  id: string;
  que: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <form action={enviar} className="inline">
      <input type="hidden" name="id" value={id} />
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
