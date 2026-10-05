"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";
import { Boton, FOCO } from "@/components/ui/boton";
import { Logo } from "@/components/layout/logo";

/**
 * Formulario de ingreso.
 *
 * Es el único lugar del panel que pide credenciales. Los campos usan
 * `autoComplete` para que el gestor de contraseñas del navegador las guarde y
 * las complete: es más seguro que memorizarlas o anotarlas.
 */

type Estado = { error?: string; usuario?: string } | undefined;

export function FormularioIngreso({
  accion,
  volver,
}: {
  accion: (estado: Estado, datos: FormData) => Promise<Estado>;
  volver: string;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  return (
    <main className="grid min-h-svh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto" />
        <p className="text-eyebrow mt-4 text-center text-blanco/40">
          Panel de contenido
        </p>

        <form action={enviar} className="mt-10 flex flex-col gap-5">
          <input type="hidden" name="volver" value={volver} />

          <Campo
            id="usuario"
            name="usuario"
            etiqueta="Usuario"
            autoComplete="username"
            defaultValue={estado?.usuario}
            autoFocus
            required
          />
          <Campo
            id="contrasena"
            name="contrasena"
            type="password"
            etiqueta="Contraseña"
            autoComplete="current-password"
            required
          />

          {estado?.error ? (
            <p role="alert" className="text-p3 text-rojo">
              {estado.error}
            </p>
          ) : null}

          <Boton type="submit" disabled={enviando} className="mt-2 w-full">
            {enviando ? "Entrando…" : "Entrar"}
          </Boton>
        </form>
      </div>
    </main>
  );
}

function Campo({
  id,
  etiqueta,
  ...props
}: { id: string; etiqueta: string } & React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={id} className="text-p3 mb-2 block text-blanco/70">
        {etiqueta}
      </label>
      <input
        id={id}
        className={cn(
          "text-p2 w-full rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-3",
          "text-blanco transition-colors focus:border-blanco/40",
          FOCO,
        )}
        {...props}
      />
    </div>
  );
}
