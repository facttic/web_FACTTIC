import { requerirSesion } from "@/lib/api/guardia";
import { traerOpciones } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioCooperativa } from "../formulario";
import { guardarCooperativa } from "../acciones";

export const metadata = { title: "Agregar cooperativa" };

export default async function Page() {
  await requerirSesion();
  const { servicios, sectores } = await traerOpciones();

  return (
    <div>
      <Encabezado titulo="Agregar cooperativa" />
      <FormularioCooperativa
        accion={guardarCooperativa.bind(null, null)}
        servicios={servicios}
        sectores={sectores}
      />
    </div>
  );
}
