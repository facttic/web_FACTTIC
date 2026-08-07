import { requerirSesion } from "@/lib/api/guardia";
import { traerSectores } from "@/lib/datos/admin";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarSector } from "./acciones";

export const metadata = { title: "Sectores" };

/**
 * Listado de sectores, en el orden en que el sitio los muestra: la columna de
 * orden es el motivo principal por el que se entra acá.
 */
export default async function SectoresPage() {
  await requerirSesion();
  const sectores = await traerSectores();

  return (
    <div>
      <Encabezado
        titulo="Sectores"
        cantidad={sectores.length}
        accion={
          <EnlaceAdmin href="/admin/sectores/nueva">Agregar sector</EnlaceAdmin>
        }
      />

      <Tabla columnas={["Orden", "Nombre", "Descripción", "Animación", ""]}>
        {sectores.map((sector) => (
          <Fila key={sector.id}>
            <Celda apagado={sector.orden === null}>{sector.orden ?? "—"}</Celda>
            <Celda className="text-p2">{sector.nombre}</Celda>
            <Celda apagado={!sector.descripcion}>
              <span className="line-clamp-1 max-w-md">
                {sector.descripcion || "falta"}
              </span>
            </Celda>
            <Celda apagado={!sector.animacion}>
              {sector.animacion ? "sí" : "falta"}
            </Celda>
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`/admin/sectores/${sector.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrar
                  accion={borrarSector}
                  id={sector.id}
                  que={sector.nombre}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}
