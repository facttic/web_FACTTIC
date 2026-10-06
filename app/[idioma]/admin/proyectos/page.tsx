import { requerirSesion } from "@/lib/api/guardia";
import { traerProyectos } from "@/lib/datos/admin";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { BuscadorDeTabla } from "@/components/admin/buscador-de-tabla";
import { borrarProyecto } from "./acciones";

export const metadata = { title: "Proyectos" };

export default async function ProyectosPage() {
  const sesion = await requerirSesion();
  const todos = await traerProyectos();
  /* Los proyectos donde figura su cooperativa: son los que puede editar. */
  const proyectos = sesion.esAdmin
    ? todos
    : todos.filter((proyecto) =>
        proyecto.cooperativas.some((id) =>
          sesion.cooperativas.some((suya) => suya.id === id),
        ),
      );

  return (
    <div>
      <Encabezado
        titulo="Proyectos"
        accion={
          <EnlaceAdmin href="/admin/proyectos/nueva">
            Agregar proyecto
          </EnlaceAdmin>
        }
      />

      {/* La cuenta la lleva el buscador, que sabe cuántos quedan a la vista. */}
      <BuscadorDeTabla queBusca="proyectos" total={proyectos.length} />

      <Tabla
        columnas={["Nombre", "Sector", "Cliente", "Imágenes", "Destacado", ""]}
      >
        {proyectos.map((proyecto) => (
          <Fila
            key={proyecto.id}
            /* Se busca por lo que se ve en la fila: con solo el nombre no se
               puede pedir "los de Agro" ni "los de tal cliente". */
            busca={[
              proyecto.nombre,
              proyecto.sector?.nombre,
              proyecto.cliente?.nombre,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Celda className="text-p2">
              <span className="line-clamp-1 max-w-xs">{proyecto.nombre}</span>
            </Celda>
            <Celda apagado={!proyecto.sector?.nombre}>
              {proyecto.sector?.nombre ?? "falta"}
            </Celda>
            <Celda apagado={!proyecto.cliente?.nombre}>
              {proyecto.cliente?.nombre ?? "falta"}
            </Celda>
            <Celda apagado={proyecto.imagenes.length === 0}>
              {proyecto.imagenes.length || "falta"}
            </Celda>
            <Celda apagado={!proyecto.destacado}>
              {proyecto.destacado ? "sí" : "—"}
            </Celda>
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`/admin/proyectos/${proyecto.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrar
                  accion={borrarProyecto}
                  id={proyecto.id}
                  que={proyecto.nombre}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}
