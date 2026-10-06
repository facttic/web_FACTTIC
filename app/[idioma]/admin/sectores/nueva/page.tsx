import { requerirSesion } from "@/lib/api/guardia";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioSector } from "../formulario";
import { guardarSector } from "../acciones";

export const metadata = { title: "Agregar sector" };

export default async function Page() {
  const sesion = await requerirSesion();
  return (
    <div>
      <Encabezado titulo="Agregar sector" />
      <FormularioSector
        accion={guardarSector.bind(null, null)}
        esAdmin={sesion.esAdmin}
      />
    </div>
  );
}
