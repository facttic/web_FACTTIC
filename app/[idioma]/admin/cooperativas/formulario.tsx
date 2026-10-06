"use client";

import {
  CampoArchivo,
  CampoTexto,
  FormularioAdmin,
  type EstadoForm,
  type Opcion,
} from "@/components/admin/piezas";
import { Bloque, Bloques, Par } from "@/components/admin/bloque";
import { CampoBuscador } from "@/components/admin/campo-buscador";
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
      <Bloques>
        <Bloque titulo="Datos de la cooperativa">
          <Par>
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
              ayuda="Cuántas personas la integran. La Home suma este número."
              type="number"
              min={0}
              defaultValue={cooperativa?.asociados ?? ""}
            />
          </Par>
          <CampoArchivo
            id="file"
            name="file"
            etiqueta="Logo"
            ayuda="Va arriba de la tarjeta en Nuestra Red; sin él se muestra el nombre."
            accept="image/*"
            actual={cooperativa?.logo}
          />
        </Bloque>

        <Bloque
          titulo="Qué hace"
          ayuda="Es lo que muestra el panel de provincia en Nuestra Red. Si falta alguno, se crea desde acá."
        >
          <CampoBuscador
            nombre="servicios"
            etiqueta="Servicios"
            ayuda="Los que ofrece esta cooperativa."
            opciones={servicios}
            elegidas={cooperativa?.servicios ?? []}
            crear={crearServicio}
            queEs="servicio"
            vacio="Todavía no hay servicios cargados."
          />
          <CampoBuscador
            nombre="sectores"
            etiqueta="Sectores"
            ayuda="Las industrias en las que trabaja."
            opciones={sectores}
            elegidas={cooperativa?.sectores ?? []}
            crear={crearSector}
            queEs="sector"
            vacio="Todavía no hay sectores cargados."
          />
        </Bloque>

        <Bloque
          titulo="Dónde está"
          ayuda="Sin ubicación no aparece en el mapa federal. Alcanza con la ciudad: el mapa agrupa por provincia."
        >
          <CampoUbicacion
            lat={cooperativa?.ubicacion?.lat}
            lng={cooperativa?.ubicacion?.lng}
          />
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}
