import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerOpciones, traerProyecto } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioProyecto } from "../formulario";
import { guardarProyecto } from "../acciones";

export const metadata = { title: "Editar proyecto" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  /** `volver` llega cuando se entró desde la ficha de una cooperativa. */
  searchParams: Promise<{ volver?: string }>;
}) {
  await requerirSesion();
  const { id } = await params;
  const [proyecto, opciones, { volver }] = await Promise.all([
    traerProyecto(id),
    traerOpciones(),
    searchParams,
  ]);
  if (!proyecto) notFound();

  return (
    <div>
      <Encabezado titulo={`Editar ${proyecto.nombre}`} />
      <FormularioProyecto
        accion={guardarProyecto.bind(null, proyecto.id)}
        proyecto={proyecto}
        opciones={opciones}
        volverA={volver}
      />
    </div>
  );
}
