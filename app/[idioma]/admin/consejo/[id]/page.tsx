import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerAutoridad, traerOpciones } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioAutoridad } from "../formulario";
import { guardarAutoridad } from "../acciones";

export const metadata = { title: "Editar autoridad" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerirSesion();
  const [autoridad, { cooperativas }] = await Promise.all([
    traerAutoridad((await params).id),
    traerOpciones(),
  ]);
  if (!autoridad) notFound();

  return (
    <div>
      <Encabezado titulo={`Editar ${autoridad.nombre}`} />
      <FormularioAutoridad
        accion={guardarAutoridad.bind(null, autoridad.id)}
        autoridad={autoridad}
        cooperativas={cooperativas}
      />
    </div>
  );
}
