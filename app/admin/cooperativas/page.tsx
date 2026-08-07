import { requerirSesion } from "@/lib/api/guardia";
import { traerCooperativas } from "@/lib/datos/admin";
import { provinciaDe } from "@/lib/mapa/provincias";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarCooperativa } from "./acciones";

export const metadata = { title: "Cooperativas" };

/**
 * Listado de cooperativas.
 *
 * Muestra de un vistazo qué le falta a cada una, que es lo que hoy tiene el
 * sitio a medio cargar: sin ubicación no aparece en el mapa federal, sin logo
 * la tarjeta muestra el nombre, y sin servicios ni sectores el panel de
 * provincia queda flojo.
 */
export default async function CooperativasPage() {
  await requerirSesion();
  const cooperativas = await traerCooperativas();

  return (
    <div>
      <Encabezado
        titulo="Cooperativas"
        cantidad={cooperativas.length}
        accion={
          <EnlaceAdmin href="/admin/cooperativas/nueva">
            Agregar cooperativa
          </EnlaceAdmin>
        }
      />

      <Tabla
        columnas={["Nombre", "Provincia", "Asociadxs", "Servicios", "Logo", ""]}
      >
        {cooperativas.map((cooperativa) => {
          const provincia = cooperativa.ubicacion
            ? provinciaDe(cooperativa.ubicacion.lat, cooperativa.ubicacion.lng)
            : null;

          return (
            <Fila key={cooperativa.id}>
              <Celda className="text-p2">{cooperativa.nombre}</Celda>
              <Celda apagado={!provincia}>{provincia ?? "sin ubicación"}</Celda>
              <Celda apagado={!cooperativa.asociados}>
                {cooperativa.asociados || "—"}
              </Celda>
              <Celda apagado={cooperativa.servicios.length === 0}>
                {cooperativa.servicios.length || "—"}
              </Celda>
              <Celda apagado={!cooperativa.logo}>
                {cooperativa.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cooperativa.logo}
                    alt=""
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  "falta"
                )}
              </Celda>
              <Celda className="text-right">
                <span className="flex justify-end gap-2">
                  <EnlaceAdmin
                    href={`/admin/cooperativas/${cooperativa.id}`}
                    className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                  >
                    Editar
                  </EnlaceAdmin>
                  <BotonBorrar
                    accion={borrarCooperativa}
                    id={cooperativa.id}
                    que={cooperativa.nombre}
                  />
                </span>
              </Celda>
            </Fila>
          );
        })}
      </Tabla>
    </div>
  );
}
