import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerNovedad } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioNovedad } from "../formulario";
import { guardarNovedad } from "../acciones";

export const metadata = { title: "Editar novedad" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerirSesion();
  const novedad = await traerNovedad((await params).id);
  if (!novedad) notFound();

  return (
    <div>
      <Encabezado titulo="Editar novedad" />
      <FormularioNovedad
        accion={guardarNovedad.bind(null, novedad.id)}
        novedad={novedad}
      />
    </div>
  );
}
