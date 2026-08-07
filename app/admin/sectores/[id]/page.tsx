import { notFound } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { traerSector } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioSector } from "../formulario";
import { guardarSector } from "../acciones";

export const metadata = { title: "Editar sector" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerirSesion();
  const sector = await traerSector((await params).id);
  if (!sector) notFound();

  return (
    <div>
      <Encabezado titulo={`Editar ${sector.nombre}`} />
      <FormularioSector
        accion={guardarSector.bind(null, sector.id)}
        sector={sector}
      />
    </div>
  );
}
