import { requerirSesion } from "@/lib/api/guardia";
import { traerConsejo } from "@/lib/datos/admin";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarAutoridad } from "./acciones";

export const metadata = { title: "Consejo" };

export default async function ConsejoPage() {
  await requerirSesion();
  const consejo = await traerConsejo();

  return (
    <div>
      <Encabezado
        titulo="Consejo de administración"
        cantidad={consejo.length}
        accion={
          <EnlaceAdmin href="/admin/consejo/nueva">
            Agregar autoridad
          </EnlaceAdmin>
        }
      />

      <Tabla columnas={["Nombre", "Cargo", "Cooperativa", ""]}>
        {consejo.map((autoridad) => (
          <Fila key={autoridad.id}>
            <Celda className="text-p2">{autoridad.nombre}</Celda>
            <Celda>{autoridad.cargo}</Celda>
            <Celda apagado={!autoridad.cooperativa?.nombre}>
              {autoridad.cooperativa?.nombre ?? "falta"}
            </Celda>
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`/admin/consejo/${autoridad.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrar
                  accion={borrarAutoridad}
                  id={autoridad.id}
                  que={autoridad.nombre}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}
