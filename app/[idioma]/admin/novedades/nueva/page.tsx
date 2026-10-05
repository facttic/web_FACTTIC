import { requerirSesion } from "@/lib/api/guardia";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioNovedad } from "../formulario";
import { guardarNovedad } from "../acciones";

export const metadata = { title: "Agregar novedad" };

export default async function Page() {
  await requerirSesion();
  return (
    <div>
      <Encabezado titulo="Agregar novedad" />
      <FormularioNovedad accion={guardarNovedad.bind(null, null)} />
    </div>
  );
}
