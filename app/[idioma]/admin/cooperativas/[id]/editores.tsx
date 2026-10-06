"use client";

import { useActionState } from "react";
import { Bloque } from "@/components/admin/bloque";
import {
  BotonAdmin,
  CampoTexto,
  type EstadoForm,
} from "@/components/admin/piezas";

/**
 * Quiénes pueden editar esta cooperativa.
 *
 * Solo lo ve la Federación. Al sumar un correo, esa persona queda habilitada
 * en el acto y recibe un enlace para crear su cuenta; al quitarlo, pierde el
 * acceso en el acto y su invitación pendiente deja de servir.
 *
 * El bloque va aparte del formulario de la ficha —y no adentro— porque cada
 * alta y cada baja es su propio envío: así no hay que guardar la cooperativa
 * entera para sumar a alguien, ni se pierde lo escrito si algo falla.
 */
export function Editores({
  cooperativaId,
  editores,
  invitar,
  quitar,
}: {
  cooperativaId: string;
  editores: string[];
  invitar: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  quitar: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
}) {
  const [estadoAlta, enviarAlta, invitando] = useActionState(
    invitar,
    undefined,
  );
  const [estadoBaja, enviarBaja] = useActionState(quitar, undefined);

  return (
    <Bloque
      titulo="Quiénes pueden editarla"
      ayuda="Cada persona recibe un enlace para crear su cuenta y queda habilitada para editar esta ficha, sus proyectos y sus servicios. Quitarla le corta el acceso en el momento."
    >
      {editores.length ? (
        <ul className="flex flex-col gap-2">
          {editores.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between gap-4 border-b border-borde pb-2"
            >
              <span className="text-p2 text-blanco/80">{email}</span>
              <form action={enviarBaja}>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="id" value={cooperativaId} />
                <BotonAdmin type="submit" variante="secundario">
                  Quitar
                </BotonAdmin>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-p3 text-blanco/40">Todavía no designaron a nadie.</p>
      )}

      <form action={enviarAlta} className="flex items-end gap-3">
        <CampoTexto
          id="email-editor"
          name="email"
          type="email"
          etiqueta="Correo de quien va a editar"
          placeholder="nombre@sucoope.coop"
          required
          className="flex-1"
        />
        <BotonAdmin type="submit" disabled={invitando}>
          {invitando ? "Invitando…" : "Invitar"}
        </BotonAdmin>
      </form>

      {estadoAlta?.error || estadoBaja?.error ? (
        <p role="alert" className="text-p3 text-rojo">
          {estadoAlta?.error ?? estadoBaja?.error}
        </p>
      ) : null}
    </Bloque>
  );
}
