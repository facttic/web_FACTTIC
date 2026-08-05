"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Boton, FOCO } from "@/components/ui/boton";
import { Aviso } from "@/components/ui/aviso";
import { CONTACTO as T } from "@/lib/contenido";

/**
 * Formulario de contacto.
 *
 * Cambia de forma entre maquetas: en desktop cada campo lleva su etiqueta
 * arriba y va en un recuadro; en mobile no hay etiquetas —el ejemplo hace de
 * pista— y el campo se apoya sobre una línea punteada. Es el mismo control con
 * dos apariencias, así que la etiqueta siempre está en el marcado y en mobile
 * queda solo para lectores de pantalla.
 *
 * El textarea crece a medida que se escribe, como pide la anotación del
 * diseño ("Cuando se completa en este campo, se extiende el espacio").
 *
 * La API todavía no tiene dónde recibir esto (`PENDIENTES`, ítem 2). La
 * validación, los estados y el envío están hechos; cuando exista el endpoint
 * se cambia el `fetch` de `enviar()` y nada más.
 */

type Estado = "editando" | "enviando" | "enviado" | "falló";

export function FormularioContacto({ className }: { className?: string }) {
  const idBase = useId();
  const [estado, setEstado] = useState<Estado>("editando");
  const [errores, setErrores] = useState<Record<string, string>>({});

  const campo = (nombre: string) => `${idBase}-${nombre}`;

  const validar = (datos: FormData) => {
    const fallas: Record<string, string> = {};
    const nombre = String(datos.get("nombre") ?? "").trim();
    const email = String(datos.get("email") ?? "").trim();
    const mensaje = String(datos.get("mensaje") ?? "").trim();

    if (!nombre) fallas.nombre = T.formulario.errores.nombre;
    // Alcanza con que tenga forma de correo: quien lo valida de verdad es el
    // servidor, y de más está rechazar direcciones raras pero legítimas.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fallas.email = T.formulario.errores.email;
    if (!mensaje) fallas.mensaje = T.formulario.errores.mensaje;

    return fallas;
  };

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);

    const fallas = validar(datos);
    setErrores(fallas);
    if (Object.keys(fallas).length) {
      // El foco va al primer campo con problema, para no dejar a nadie
      // buscando dónde estuvo el error.
      formulario
        .querySelector<HTMLElement>(`[name="${Object.keys(fallas)[0]}"]`)
        ?.focus();
      return;
    }

    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        body: datos,
      });
      setEstado(res.ok ? "enviado" : "falló");
      if (res.ok) formulario.reset();
    } catch {
      setEstado("falló");
    }
  };

  if (estado === "enviado") {
    return (
      <div className={className}>
        <Aviso titulo={T.formulario.exito.titulo}>
          {T.formulario.exito.texto}
        </Aviso>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={className}>
      <h2 className="text-h2">{T.formulario.titulo}</h2>

      <div className="mt-8 flex flex-col gap-8 md:gap-5">
        <CampoContacto
          id={campo("nombre")}
          name="nombre"
          etiqueta={T.formulario.nombre.etiqueta}
          placeholder={T.formulario.nombre.ejemplo}
          autoComplete="name"
          error={errores.nombre}
        />
        <CampoContacto
          id={campo("email")}
          name="email"
          type="email"
          etiqueta={T.formulario.email.etiqueta}
          placeholder={T.formulario.email.ejemplo}
          autoComplete="email"
          error={errores.email}
        />
        <CampoContacto
          id={campo("mensaje")}
          name="mensaje"
          multilinea
          etiqueta={T.formulario.mensaje.etiqueta}
          placeholder={T.formulario.mensaje.ejemplo}
          error={errores.mensaje}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="text-p1-bold mb-4">
          {T.formulario.motivo.etiqueta}
        </legend>
        {/* En columna en mobile y los cuatro en una fila en desktop, repartidos
            entre los dos bordes de la tarjeta, como cada maqueta. */}
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-between md:gap-x-2 md:gap-y-3">
          {T.formulario.motivo.opciones.map((opcion, i) => (
            <label
              key={opcion}
              className="flex cursor-pointer items-center gap-2 md:gap-1.5"
            >
              <input
                type="radio"
                name="motivo"
                value={opcion}
                defaultChecked={i === 0}
                className={cn(
                  "size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-blanco",
                  "checked:border-4 checked:border-lila",
                  FOCO,
                )}
              />
              {/* En desktop van los cuatro en una fila, en Inter chico. */}
              <span className="text-p2 text-blanco/80 md:text-p3 md:font-sans md:whitespace-nowrap">
                {opcion}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {estado === "falló" ? (
        <Aviso tono="error" titulo={T.formulario.falla.titulo} className="mt-8">
          {T.formulario.falla.texto}
        </Aviso>
      ) : null}

      <Boton
        type="submit"
        disabled={estado === "enviando"}
        className="mt-8 w-full"
      >
        {estado === "enviando" ? T.formulario.enviando : T.formulario.enviar}
      </Boton>
    </form>
  );
}

/**
 * Un campo del formulario, en sus dos apariencias: recuadro con etiqueta
 * visible en desktop, línea punteada sin etiqueta en mobile.
 */
function CampoContacto({
  id,
  etiqueta,
  error,
  multilinea = false,
  ...props
}: {
  id: string;
  etiqueta: string;
  error?: string;
  multilinea?: boolean;
} & React.ComponentProps<"input"> &
  React.ComponentProps<"textarea">) {
  const areaRef = useRef<HTMLTextAreaElement>(null);

  /** El textarea se estira con lo que se escribe, sin barra de desplazamiento. */
  const estirar = () => {
    const nodo = areaRef.current;
    if (!nodo) return;
    nodo.style.height = "auto";
    nodo.style.height = `${nodo.scrollHeight}px`;
  };

  const apariencia = cn(
    "w-full bg-transparent text-p2 text-blanco placeholder:text-blanco/40",
    "border-b border-dotted border-punteado pb-3 transition-colors",
    // En desktop el campo pasa a ser un recuadro con fondo propio.
    "md:rounded-lg md:border md:border-solid md:border-borde md:bg-negro-oscuro/60 md:px-4 md:py-3",
    "focus:border-blanco focus:outline-none md:focus:border-blanco/40",
    error && "border-rojo md:border-rojo",
  );

  return (
    <div>
      {/* La etiqueta existe siempre; en mobile la maqueta no la muestra. */}
      <label
        htmlFor={id}
        className="text-p3 sr-only mb-2 text-blanco/70 md:not-sr-only md:block"
      >
        {etiqueta}
      </label>

      {multilinea ? (
        <textarea
          ref={areaRef}
          id={id}
          rows={1}
          onInput={estirar}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(apariencia, "resize-none overflow-hidden md:min-h-28")}
          {...props}
        />
      ) : (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={apariencia}
          {...props}
        />
      )}

      {error ? (
        <p id={`${id}-error`} className="text-p3 mt-2 text-rojo">
          {error}
        </p>
      ) : null}
    </div>
  );
}
