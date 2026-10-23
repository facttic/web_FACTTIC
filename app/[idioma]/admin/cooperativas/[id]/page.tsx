import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requerirCooperativa } from "@/lib/api/guardia";
import {
  traerCooperativa,
  traerEditores,
  traerOpciones,
} from "@/lib/datos/admin";
import { Bloques } from "@/components/admin/bloque";
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
  const { id } = await params;
  /* No alcanza con que haya sesión: esta ficha es de una cooperativa en
     particular y antes la abría cualquiera que estuviera dentro del panel. */
  const sesion = await requerirCooperativa(id);
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

      {/* Lo que no es la ficha va aparte del formulario —un formulario no
          contiene otro— pero con el mismo ancho, para que la columna de
          títulos siga la misma línea de arriba abajo. */}
      <div className="mt-5">
        <Bloques>
          {/* Designar editores es cosa de la Federación: una cooperativa no
              elige quién más entra a su ficha. La API lo verifica igual. */}
          {sesion.esAdmin ? (
            <Editores
              cooperativaId={cooperativa.id}
              editores={await traerEditores(cooperativa.id)}
              invitar={invitarEditor.bind(null, cooperativa.id)}
              quitar={quitarEditor.bind(null, cooperativa.id)}
            />
          ) : null}

          {/* Los proyectos son otra consulta: que no demoren el formulario. */}
          <Suspense
            fallback={
              <p className="text-p3 rounded-xl border border-borde p-6 text-blanco/40">
                Buscando sus proyectos…
              </p>
            }
          >
            <ProyectosDeLaCooperativa
              id={cooperativa.id}
              nombre={cooperativa.nombre}
            />
          </Suspense>
        </Bloques>
      </div>
    </div>
  );
}
