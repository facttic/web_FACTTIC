import { requerirSesion } from "@/lib/api/guardia";
import { traerServicios } from "@/lib/datos/admin";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarServicio } from "./acciones";

export const metadata = { title: "Servicios" };

export default async function ServiciosPage() {
  const sesion = await requerirSesion();
  const todos = await traerServicios();
  /* Los que creó su cooperativa. Los cinco de la Federación se eligen al
     completar la ficha, pero no se editan desde acá. */
  const servicios = sesion.esAdmin
    ? todos
    : todos.filter((servicio) =>
        sesion.cooperativas.some((suya) => suya.id === servicio.cooperativa),
      );

  return (
    <div>
      <Encabezado
        titulo="Servicios"
        cantidad={servicios.length}
        accion={
          <EnlaceAdmin href="/admin/servicios/nueva">
            Agregar servicio
          </EnlaceAdmin>
        }
      />

      <Tabla
        columnas={[
          "Orden",
          "Nombre",
          "Descripción",
          "Destacado",
          "Subservicios",
          "",
        ]}
      >
        {servicios.map((servicio) => (
          <Fila key={servicio.id}>
            <Celda apagado={servicio.orden === null}>
              {servicio.orden ?? "—"}
            </Celda>
            <Celda className="text-p2">{servicio.nombre}</Celda>
            <Celda apagado={!servicio.descripcion}>
              <span className="line-clamp-1 max-w-sm">
                {servicio.descripcion || "falta"}
              </span>
            </Celda>
            <Celda apagado={!servicio.destacado}>
              {servicio.destacado ? "sí" : "—"}
            </Celda>
            <Celda apagado={servicio.subservicios.length === 0}>
              {servicio.subservicios.length || "—"}
            </Celda>
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`/admin/servicios/${servicio.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrar
                  accion={borrarServicio}
                  id={servicio.id}
                  que={servicio.nombre}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}
