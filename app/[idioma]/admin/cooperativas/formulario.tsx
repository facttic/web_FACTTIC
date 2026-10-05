"use client";

import {
  CampoArchivo,
  CampoMultiple,
  CampoTexto,
  Columna,
  Columnas,
  FormularioAdmin,
  type EstadoForm,
  type Opcion,
} from "@/components/admin/piezas";
import { CampoUbicacion } from "@/components/admin/mapa-ubicacion";
import type { Cooperativa } from "@/lib/datos/admin";
import { crearSector, crearServicio } from "./acciones";

/**
 * Alta y edición de una cooperativa.
 *
 * Los cuatro datos que se cargan acá son los que hoy tiene el sitio a medias:
 * sin ubicación la cooperativa no aparece en el mapa federal, sin asociadxs no
 * suma a la métrica de la Home, y sin servicios ni sectores el panel de
 * provincia de Nuestra Red queda vacío.
 *
 * Va en dos columnas porque es la ficha más larga del panel y se completa de
 * corrido: a la izquierda lo que se escribe, a la derecha lo que se elige. Así
 * las dos listas de casillas —que son largas— quedan a la vista sin tener que
 * bajar hasta el final para ver si falta algo.
 */
export function FormularioCooperativa({
  accion,
  cooperativa,
  servicios,
  sectores,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  cooperativa?: Cooperativa;
  servicios: Opcion[];
  sectores: Opcion[];
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/cooperativas">
      <Columnas>
        <Columna>
          <CampoTexto
            id="nombre"
            name="nombre"
            etiqueta="Nombre"
            defaultValue={cooperativa?.nombre}
            required
            minLength={3}
            maxLength={150}
            autoFocus
          />
          <CampoTexto
            id="asociados"
            name="asociados"
            etiqueta="Asociadxs"
            ayuda="Cuántas personas la integran. La Home suma este número para la métrica de profesionales."
            type="number"
            min={0}
            defaultValue={cooperativa?.asociados ?? ""}
          />

          <CampoUbicacion
            lat={cooperativa?.ubicacion?.lat}
            lng={cooperativa?.ubicacion?.lng}
          />

          <CampoArchivo
            id="file"
            name="file"
            etiqueta="Logo"
            ayuda="Va arriba de la tarjeta en Nuestra Red; sin él se muestra el nombre."
            accept="image/*"
            actual={cooperativa?.logo}
          />
        </Columna>

        <Columna>
          <CampoMultiple
            nombre="servicios"
            etiqueta="Servicios"
            ayuda="Los que ofrece. El panel de provincia los muestra como los servicios que concentra la zona."
            opciones={servicios}
            elegidas={cooperativa?.servicios ?? []}
            crear={crearServicio}
            queEs="servicio"
          />
          <CampoMultiple
            nombre="sectores"
            etiqueta="Sectores"
            ayuda="Las industrias en las que trabaja."
            opciones={sectores}
            elegidas={cooperativa?.sectores ?? []}
            crear={crearSector}
            queEs="sector"
          />
        </Columna>
      </Columnas>
    </FormularioAdmin>
  );
}
