"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";
import { Boton, FOCO } from "@/components/ui/boton";
import { Enlace } from "@/components/ui/enlace";
import { Logo } from "@/components/layout/logo";
import type { Invitacion } from "@/lib/api/invitaciones";

/**
 * Formulario de la invitación.
 *
 * Tres estados: el link no sirve, la persona ya tiene cuenta —ahí solo hay que
 * entrar— o hay que crearla. El mail se muestra pero no se puede escribir: es
 * el de la invitación y la API no acepta otro.
 */

type Estado = { error?: string } | undefined;

export function FormularioInvitacion({
  accion,
  invitacion,
}: {
  accion: (estado: Estado, datos: FormData) => Promise<Estado>;
  invitacion: Invitacion | null;
}) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  if (!invitacion) {
    return (
      <Marco>
        <h1 className="text-h3 text-center">Esta invitación ya no sirve</h1>
        <p className="text-p3 mt-3 text-center text-blanco/60">
          Puede que ya la hayas usado, que haya vencido o que te hayan quitado
          el acceso. Escribile a FACTTIC para que te mande una nueva.
        </p>
      </Marco>
    );
  }

  if (invitacion.tieneCuenta) {
    return (
      <Marco>
        <h1 className="text-h3 text-center">
          Ya podés editar {invitacion.cooperativa.nombre}
        </h1>
        <p className="text-p3 mt-3 text-center text-blanco/60">
          Tu cuenta de {invitacion.email} ya existe, así que entrá con ella.
        </p>
        <Enlace
          href="/admin/ingresar"
          className={cn(
            "text-p1-bold mt-8 block rounded-lg bg-blanco px-5 py-3 text-center text-negro-oscuro",
            FOCO,
          )}
        >
          Ingresar
        </Enlace>
      </Marco>
    );
  }

  return (
    <Marco>
      <h1 className="text-h3 text-center">
        Te invitaron a editar {invitacion.cooperativa.nombre}
      </h1>
      <p className="text-p3 mt-3 text-center text-blanco/60">
        Creá tu cuenta para {invitacion.email} y entrás directo a la ficha de tu
        cooperativa.
      </p>

      {/*
        No se pide nombre de usuario. La API lo exige para crear la cuenta, pero
        después no se usa para nada: para entrar alcanza el correo. Hacer que
        alguien invente —y recuerde— un dato que el sistema puede deducir del
        correo, justo en la única pantalla donde no hay margen para trabarse, es
        un trámite que no le sirve a nadie. Lo arma la acción.
      */}
      <form action={enviar} className="mt-8 flex flex-col gap-5">
        {/* El correo, a la vista y sin poder escribirlo: es con el que después
            se entra, así que conviene que quede claro cuál es. */}
        <Campo
          id="correo"
          etiqueta="Tu correo"
          ayuda="Con este entrás al panel."
          value={invitacion.email}
          readOnly
          className="text-blanco/60"
        />
        <Campo
          id="contrasena"
          name="contrasena"
          type="password"
          etiqueta="Contraseña"
          ayuda="Al menos 6 caracteres, con letras y números."
          autoComplete="new-password"
          autoFocus
          required
        />

        {estado?.error ? (
          <p role="alert" className="text-p3 text-rojo">
            {estado.error}
          </p>
        ) : null}

        <Boton type="submit" disabled={enviando}>
          {enviando ? "Creando…" : "Crear mi cuenta"}
        </Boton>
      </form>
    </Marco>
  );
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto" />
        <p className="text-eyebrow mt-4 mb-10 text-center text-blanco/40">
          Panel de contenido
        </p>
        {children}
      </div>
    </main>
  );
}

function Campo({
  id,
  etiqueta,
  ayuda,
  className,
  ...props
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
} & React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={id} className="text-p3 mb-2 block text-blanco/70">
        {etiqueta}
      </label>
      <input
        id={id}
        className={cn(
          "text-p2 w-full rounded-lg border border-borde bg-negro-oscuro/60 px-4 py-3 text-blanco",
          FOCO,
          className,
        )}
        {...props}
      />
      {ayuda ? <p className="text-p3 mt-2 text-blanco/35">{ayuda}</p> : null}
    </div>
  );
}
