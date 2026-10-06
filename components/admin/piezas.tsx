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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-borde pb-4">
      <div>
        <h1 className="text-h3">{titulo}</h1>
        {cantidad !== undefined ? (
          <p className="text-p3 mt-1 text-blanco/65">
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
        <p className="text-p2 text-blanco/65">
          {vacio ?? "Todavía no hay nada cargado."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-borde">
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-borde bg-superficie">
          <tr className="text-eyebrow text-blanco/60">
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
        apagado ? "text-blanco/40" : "text-blanco/90",
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
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-p3 mb-2 block text-blanco/90">
      {children}
    </label>
  );
}

/**
 * La aclaración de un campo, debajo del control.
 *
 * Va abajo y no entre la etiqueta y el campo porque no todos los campos
 * tienen una: cuando se mete en el medio, dos campos de la misma fila arrancan
 * a alturas distintas y la fila queda torcida. Abajo, la etiqueta y el control
 * siempre quedan a la misma altura y lo que sobra cuelga sin desalinear nada.
 */
export function Ayuda({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-p3 mt-2 text-blanco/55">{children}</p>;
}

/** El aspecto de todo control de texto del panel; se exporta para los campos
 * que se arman a mano, como las filas de subservicios. */
/**
 * El control de formulario del panel: más chico y más denso que el del sitio
 * público. Acá se cargan fichas largas y lo que importa es ver muchos campos
 * juntos, no que cada uno respire.
 */
export const CONTROL =
  "text-p2 w-full rounded-md border border-borde bg-negro-oscuro/60 px-3 py-2 " +
  "text-blanco placeholder:text-blanco/40 transition-colors " +
  "hover:border-blanco/25 focus:border-lila focus:bg-negro-oscuro";

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
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      {multilinea ? (
        <textarea id={id} rows={6} className={cn(CONTROL, FOCO)} {...props} />
      ) : (
        <input id={id} className={cn(CONTROL, FOCO)} {...props} />
      )}
      <Ayuda>{ayuda}</Ayuda>
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
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <select
        id={id}
        className={cn(CONTROL, "cursor-pointer", FOCO)}
        {...props}
      >
        {children}
      </select>
      <Ayuda>{ayuda}</Ayuda>
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
  conLogo,
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
    logo?: File,
  ) => Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }>;
  queEs: string;
  /** Si el catálogo tiene logo, el alta al vuelo también lo sube. */
  conLogo?: boolean;
}) {
  const [sumadas, setSumadas] = useState<Opcion[]>([]);
  const [valor, setValor] = useState(elegida ?? "");
  const todas = [...opciones, ...sumadas];

  return (
    <div>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
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
      <Ayuda>{ayuda}</Ayuda>
      <AltaAlVuelo
        queEs={queEs}
        yaEstan={todas}
        crear={crear}
        conLogo={conLogo}
        alCrear={(opcion) => {
          setSumadas((previas) => [...previas, opcion]);
          setValor(opcion.id);
        }}
      />
    </div>
  );
}

/**
 * El campito para dar de alta la opción que falta, al pie de un selector.
 *
 * Crea sin recargar: recargar volvería a pedir la página al servidor y se
 * perdería todo lo que se venía escribiendo en la ficha.
 */
function AltaAlVuelo({
  queEs,
  yaEstan,
  crear,
  alCrear,
  conLogo,
}: {
  queEs: string;
  yaEstan: Opcion[];
  crear: (
    nombre: string,
    logo?: File,
  ) => Promise<{ ok: true; opcion: Opcion } | { ok: false; error: string }>;
  alCrear: (opcion: Opcion) => void;
  conLogo?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [valor, setValor] = useState("");
  const [logo, setLogo] = useState<File | undefined>();
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
    const resultado = await crear(limpio, logo);
    setCreando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    alCrear(resultado.opcion);
    setValor("");
    setLogo(undefined);
    setAbierto(false);
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={cn(
          "text-p3 mt-3 cursor-pointer rounded-lg px-2 py-1 text-blanco/65 underline-offset-4 transition-colors hover:text-blanco hover:underline",
          FOCO,
        )}
      >
        ¿Falta {queEs}? Agregalo
      </button>
    );
  }

  /*
   * El alta abre su propio recuadro y no deja los controles sueltos debajo del
   * selector: con el nombre, el logo y los dos botones repartidos a lo largo
   * de la columna no se entendía dónde empezaba y dónde terminaba lo que se
   * estaba creando.
   */
  return (
    <div className="mt-2 rounded-md border border-borde bg-superficie/40 p-3">
      <p className="text-p3 mb-2 text-blanco/90">Nuevo {queEs}</p>

      <div className="flex flex-col gap-2">
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
          placeholder="Nombre"
          aria-label={`Nombre ${queEs}`}
          className={cn(CONTROL, FOCO)}
        />

        {conLogo ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0])}
            aria-label={`Logo del ${queEs}`}
            className={cn(
              "text-p3 w-full cursor-pointer rounded-md border border-borde bg-negro-oscuro/60 px-3 py-2 text-blanco/70",
              "file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-superficie-alta file:px-3 file:py-1 file:text-blanco",
              FOCO,
            )}
          />
        ) : null}
      </div>

      {conLogo ? (
        <Ayuda>
          El logo es opcional; después solo lo cambia la Federación.
        </Ayuda>
      ) : null}

      <div className="mt-3 flex gap-2">
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
      <Ayuda>{ayuda}</Ayuda>
    </div>
  );
}

/**
 * Lo que entra en un envío, en bytes. Tiene que quedar por debajo del
 * `serverActions.bodySizeLimit` de `next.config.ts`, porque el multipart suma
 * separadores y encabezados además de los archivos. Pasado ese tope, Next
 * rechaza el cuerpo antes de llegar a la acción y la pantalla se corta con "A
 * server error occurred", sin decir por qué: de ahí este aviso.
 */
const TOPE_ENVIO = 18 * 1024 * 1024;

export function CampoArchivo({
  id,
  etiqueta,
  ayuda,
  actual,
  onChange,
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
  const [pesado, setPesado] = useState<string | null>(null);

  const alElegir = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const elegidos = [...(evento.target.files ?? [])];
    const total = elegidos.reduce((suma, archivo) => suma + archivo.size, 0);
    const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
    setPesado(
      total > TOPE_ENVIO
        ? `Lo elegido pesa ${mb(total)} y el máximo es ${mb(TOPE_ENVIO)}. Subí menos archivos por vez, o achicalos antes: si se envía así, la carga falla.`
        : null,
    );
    onChange?.(evento);
  };

  return (
    <div>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
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
        onChange={alElegir}
        className={cn(
          "text-p3 w-full cursor-pointer rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-2.5 text-blanco/70",
          "file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-superficie-alta file:px-3 file:py-1 file:text-blanco",
          FOCO,
        )}
        {...props}
      />
      <Ayuda>{ayuda}</Ayuda>
      {pesado ? (
        <p role="alert" className="text-p3 mt-2 text-rojo">
          {pesado}
        </p>
      ) : null}
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
  className?: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  return (
    <form
      action={enviar}
      /* Sin recuadro propio: el marco lo ponen los bloques de adentro, y uno
         alrededor de todo dejaba una caja vacía del ancho de la pantalla. */
      className={cn("flex flex-col gap-5", className)}
    >
      {children}

      {estado?.error ? (
        <p role="alert" className="text-p3 rounded-lg bg-rojo/10 p-3 text-rojo">
          {estado.error}
        </p>
      ) : null}

      {/* Arranca donde termina la barra lateral, para no taparla. */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-borde bg-negro-oscuro/95 p-4 backdrop-blur md:left-64 md:px-8">
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
        /* Apagado hasta que se lo toca: en una tabla de veinte filas, veinte
           botones rojos gritan más que el contenido. El rojo aparece recién
           al confirmar, que es cuando importa. */
        <BotonAdmin
          type="button"
          variante="secundario"
          className="border-transparent text-blanco/45 hover:border-rojo/40 hover:bg-rojo/10 hover:text-rojo"
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
