import { requerirSesion } from "@/lib/api/guardia";
import { traerOpciones } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioAutoridad } from "../formulario";
import { guardarAutoridad } from "../acciones";

export const metadata = { title: "Agregar autoridad" };

export default async function Page() {
  await requerirSesion();
  const { cooperativas } = await traerOpciones();

  return (
    <div>
      <Encabezado titulo="Agregar autoridad" />
      <FormularioAutoridad
        accion={guardarAutoridad.bind(null, null)}
        cooperativas={cooperativas}
      />
    </div>
  );
}
