import { requerirSesion } from "@/lib/api/guardia";
import { traerNovedades } from "@/lib/datos/admin";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarNovedad } from "./acciones";

export const metadata = { title: "Novedades" };

/** El día de la fecha, sin la hora que la API guarda de más. */
function comoDia(iso: string): string {
  if (!iso) return "—";
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? iso
    : fecha.toLocaleDateString("es-AR", { timeZone: "UTC" });
}

export default async function NovedadesPage() {
  await requerirSesion();
  const novedades = await traerNovedades();

  return (
    <div>
      <Encabezado
        titulo="Novedades"
        cantidad={novedades.length}
        accion={
          <EnlaceAdmin href="/admin/novedades/nueva">
            Agregar novedad
          </EnlaceAdmin>
        }
      />

      <Tabla columnas={["Fecha", "Tipo", "Título", "Portada", ""]}>
        {novedades.map((novedad) => (
          <Fila key={novedad.id}>
            <Celda className="whitespace-nowrap">
              {comoDia(novedad.fecha)}
            </Celda>
            <Celda>{novedad.tipo}</Celda>
            <Celda className="text-p2">
              <span className="line-clamp-1 max-w-sm">{novedad.titulo}</span>
            </Celda>
            <Celda apagado={!novedad.imagen}>
              {novedad.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={novedad.imagen}
                  alt=""
                  className="h-8 w-14 rounded object-cover"
                />
              ) : (
                "falta"
              )}
            </Celda>
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`/admin/novedades/${novedad.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrar
                  accion={borrarNovedad}
                  id={novedad.id}
                  que={novedad.titulo}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}
