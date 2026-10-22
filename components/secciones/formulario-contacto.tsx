"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Boton, FOCO } from "@/components/ui/boton";
import { Aviso } from "@/components/ui/aviso";
import { contenido } from "@/lib/contenido";
import { useIdioma } from "@/lib/idioma-cliente";

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
 * El envío va a `/api/contacto` de este mismo sitio, que lo reenvía a la API:
 * así no se expone su URL ni se depende de su CORS.
 */

type Estado = "editando" | "enviando" | "enviado" | "falló";

export function FormularioContacto({ className }: { className?: string }) {
  const T = contenido(useIdioma()).CONTACTO;
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

  /*
   * El widget pesa unos 20 KB y solo hace falta si alguien va a escribir. Se
   * carga al primer foco dentro del formulario, no al abrir la pantalla.
   */
  const [cargarPrueba, setCargarPrueba] = useState(false);
  useEffect(() => {
    if (!cargarPrueba) return;
    void import("altcha");
  }, [cargarPrueba]);

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
    <form
      onSubmit={enviar}
      onFocusCapture={() => setCargarPrueba(true)}
      noValidate
      className={cn("relative", className)}
    >
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

      {/*
        El campo trampa. Escondido de la vista, del teclado y de los lectores de
        pantalla, así que nadie lo ve ni lo puede completar sin querer; un bot
        que rellena todo lo que encuentra, sí. Quien decide es el servidor:
        acá solo se dibuja.

        `left-[-9999px]` y no `display:none` ni `hidden`: los bots que miran si
        el campo es visible descartan los que están ocultos a la vista.
      */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={campo("apellido")}>No completar</label>
        <input
          id={campo("apellido")}
          name="apellido"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/*
        La prueba de trabajo. El desafío lo firma nuestro servidor y nuestro
        servidor lo verifica: no hay un tercero mirando quién entra acá, y la
        política de contenido sigue sin permitir nada de afuera.

        El widget se carga recién cuando alguien toca el formulario, para no
        hacerle bajar nada a quien solo pasa por la pantalla.
      */}
      <div className="mt-8">
        {cargarPrueba ? (
          <altcha-widget
            /* En la v3 del widget el atributo es `challenge`, no `challengeurl`
               como en la v2: acepta la URL de donde traerlo. Con el nombre viejo
               no falla, simplemente no pide nada y después dice "verification
               failed", que no se parece en nada a la causa. */
            challenge="/api/contacto/desafio"
            name="altcha"
            /* Sin casilla que tildar ni nada que mirar: la cuenta se hace sola
               mientras se escribe el mensaje. Lo que estamos comprobando es que
               el envío costó trabajo, no que haya un humano del otro lado, así
               que pedirle a alguien que apriete algo no agrega nada. */
            display="invisible"
            auto="onload"
          />
        ) : null}
      </div>

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
    /*
      "Cuando se completa el campo la línea es continua", dice la anotación del
      archivo: el punteado marca el campo vacío y se vuelve trazo entero apenas
      hay algo escrito. Va con `:placeholder-shown`, que es CSS puro y no
      necesita estado.
    */
    "[&:not(:placeholder-shown)]:border-solid [&:not(:placeholder-shown)]:border-blanco/60",
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
