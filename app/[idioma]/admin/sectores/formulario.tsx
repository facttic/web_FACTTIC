"use client";

import {
  CampoArchivo,
  CampoCasilla,
  CampoTexto,
  Columna,
  Columnas,
  FormularioAdmin,
  type EstadoForm,
} from "@/components/admin/piezas";
import type { Sector } from "@/lib/datos/admin";

/**
 * Alta y edición de un sector.
 *
 * El orden decide en qué posición aparece la vertical en el sitio, así que va
 * con su ayuda: hoy los tres están cargados en un orden distinto al del
 * prototipo y esto es lo que lo corrige.
 */
export function FormularioSector({
  accion,
  sector,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  sector?: Sector;
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/sectores">
      <Columnas>
        <Columna>
          <CampoTexto
            id="nombre"
            name="nombre"
            etiqueta="Nombre"
            defaultValue={sector?.nombre}
            required
            minLength={3}
            maxLength={100}
            autoFocus
          />
          <CampoTexto
            id="descripcion"
            name="descripcion"
            etiqueta="Descripción"
            ayuda="La bajada que acompaña al título de la vertical."
            multilinea
            rows={5}
            maxLength={1000}
            defaultValue={sector?.descripcion}
          />
          <CampoTexto
            id="orden"
            name="orden"
            etiqueta="Orden"
            ayuda="En qué posición se lista. Menor número, más arriba."
            type="number"
            min={0}
            defaultValue={sector?.orden ?? ""}
          />
          <CampoCasilla
            id="esDestacado"
            name="esDestacado"
            etiqueta="Destacado"
            ayuda="Los destacados son el catálogo de la Federación: los únicos que muestran la Home y Nuestros servicios, y los únicos con pantalla propia. Los demás son los que carga cada cooperativa para su ficha."
            defaultChecked={sector?.destacado}
          />
        </Columna>

        <Columna>
          <CampoArchivo
            id="imageFile"
            name="imageFile"
            etiqueta="Imagen"
            ayuda="La foto de fondo de la vertical. Hoy queda tapada por la animación."
            accept="image/*"
            actual={sector?.imagen}
          />
          <CampoArchivo
            id="lottieFile"
            name="lottieFile"
            etiqueta="Animación"
            ayuda={
              sector?.animacion
                ? "Ya tiene una cargada; si elegís otra, la reemplaza."
                : "El Lottie del sector, en JSON. Mientras no haya uno cargado, el sitio usa el que vive en el repositorio."
            }
            accept="application/json,.json"
          />
        </Columna>
      </Columnas>
    </FormularioAdmin>
  );
}
