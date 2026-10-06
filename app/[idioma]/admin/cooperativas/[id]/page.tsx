import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerCooperativa, traerOpciones } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioCooperativa } from "../formulario";
import { guardarCooperativa, invitarEditor, quitarEditor } from "../acciones";
import { Editores } from "./editores";
import { ProyectosDeLaCooperativa } from "./proyectos";

export const metadata = { title: "Editar cooperativa" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesion = await requerirSesion();
  const { id } = await params;
  const [cooperativa, { servicios, sectores }] = await Promise.all([
    traerCooperativa(id),
    traerOpciones(),
  ]);
  if (!cooperativa) notFound();

  return (
    <div>
      <Encabezado titulo={`Editar ${cooperativa.nombre}`} />
      <FormularioCooperativa
        accion={guardarCooperativa.bind(null, cooperativa.id)}
        cooperativa={cooperativa}
        servicios={servicios}
        sectores={sectores}
      />
      {/* Designar editores es cosa de la Federación: una cooperativa no elige
          quién más entra a su ficha. La API lo verifica igual. */}
      {sesion.esAdmin ? (
        <Editores
          cooperativaId={cooperativa.id}
          editores={cooperativa.editores}
          invitar={invitarEditor.bind(null, cooperativa.id)}
          quitar={quitarEditor.bind(null, cooperativa.id)}
        />
      ) : null}

      {/* Los proyectos son otra consulta: que no demoren el formulario. */}
      <Suspense
        fallback={
          <p className="text-p3 mt-8 rounded-xl border border-borde p-6 text-blanco/40">
            Buscando sus proyectos…
          </p>
        }
      >
        <ProyectosDeLaCooperativa
          id={cooperativa.id}
          nombre={cooperativa.nombre}
        />
      </Suspense>
    </div>
  );
}
