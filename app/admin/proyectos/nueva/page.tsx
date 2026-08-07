import { requerirSesion } from "@/lib/api/guardia";
import { traerOpciones } from "@/lib/datos/admin";
import { Encabezado } from "@/components/admin/piezas";
import { FormularioProyecto } from "../formulario";
import { guardarProyecto } from "../acciones";

export const metadata = { title: "Agregar proyecto" };

/**
 * Alta de proyecto.
 *
 * Se puede llegar desde el listado o desde la ficha de una cooperativa. En el
 * segundo caso viene `?cooperativa=`, que deja esa cooperativa marcada, y
 * `?volver=`, que hace que al guardar se vuelva a la ficha en vez de al
 * listado: quien está completando una cooperativa carga varios proyectos
 * seguidos y no tiene por qué ir y volver a mano.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cooperativa?: string; volver?: string }>;
}) {
  await requerirSesion();
  const [opciones, { cooperativa, volver }] = await Promise.all([
    traerOpciones(),
    searchParams,
  ]);

  return (
    <div>
      <Encabezado titulo="Agregar proyecto" />
      <FormularioProyecto
        accion={guardarProyecto.bind(null, null)}
        opciones={opciones}
        cooperativa={cooperativa}
        volverA={volver}
      />
    </div>
  );
}
