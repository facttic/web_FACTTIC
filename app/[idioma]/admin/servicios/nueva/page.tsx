import { requerirSesion } from "@/lib/api/guardia";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioServicio } from "../formulario";
import { guardarServicio } from "../acciones";

export const metadata = { title: "Agregar servicio" };

export default async function Page() {
  const sesion = await requerirSesion();
  return (
    <div>
      <Encabezado titulo="Agregar servicio" />
      <FormularioServicio
        accion={guardarServicio.bind(null, null)}
        esAdmin={sesion.esAdmin}
      />
    </div>
  );
}
