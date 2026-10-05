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
import { borrarProyecto } from "./acciones";

export const metadata = { title: "Proyectos" };

export default async function ProyectosPage() {
  await requerirSesion();
  const proyectos = await traerProyectos();

  return (
    <div>
      <Encabezado
        titulo="Proyectos"
        cantidad={proyectos.length}
        accion={
          <EnlaceAdmin href="/admin/proyectos/nueva">
            Agregar proyecto
          </EnlaceAdmin>
        }
      />

      <Tabla
        columnas={["Nombre", "Sector", "Cliente", "Imágenes", "Destacado", ""]}
      >
        {proyectos.map((proyecto) => (
          <Fila key={proyecto.id}>
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
