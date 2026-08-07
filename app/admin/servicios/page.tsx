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
  await requerirSesion();
  const servicios = await traerServicios();

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

      <Tabla columnas={["Orden", "Nombre", "Descripción", "Subservicios", ""]}>
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
