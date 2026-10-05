import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerServicio } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioServicio } from "../formulario";
import { guardarServicio } from "../acciones";

export const metadata = { title: "Editar servicio" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerirSesion();
  const servicio = await traerServicio((await params).id);
  if (!servicio) notFound();

  return (
    <div>
      <Encabezado titulo={`Editar ${servicio.nombre}`} />
      <FormularioServicio
        accion={guardarServicio.bind(null, servicio.id)}
        servicio={servicio}
      />
    </div>
  );
}
