"use client";

import { Bloque, Bloques, Par } from "@/components/admin/bloque";
import { SolapasIdioma } from "@/components/admin/solapas-idioma";
import {
  CampoArchivo,
  CampoCasilla,
  CampoTexto,
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
  esAdmin,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  sector?: Sector;
  /**
   * Una cooperativa carga sectores para describir en qué rubros trabaja, pero
   * no decide las verticales del sitio. Lo que es de la Federación —destacar, y
   * la imagen y la animación de la pantalla propia— no se le muestra. La API lo
   * descarta igual: esto es para no ofrecer campos que no van a guardarse.
   */
  esAdmin: boolean;
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/sectores">
      <Bloques>
        <Bloque titulo="Qué sector es">
          <SolapasIdioma
            traducidos={{
              cargados: [sector?.en.nombre, sector?.en.descripcion].filter(
                Boolean,
              ).length,
              total: 2,
            }}
            espanol={
              <>
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
              </>
            }
            ingles={
              <>
                <CampoTexto
                  id="en-nombre"
                  traducirDesde="nombre"
                  name="en.nombre"
                  etiqueta="Name"
                  ayuda="Sin traducción, el sitio en inglés muestra el español."
                  defaultValue={sector?.en.nombre}
                  maxLength={100}
                />
                <CampoTexto
                  id="en-descripcion"
                  traducirDesde="descripcion"
                  name="en.descripcion"
                  etiqueta="Description"
                  multilinea
                  rows={5}
                  maxLength={1000}
                  defaultValue={sector?.en.descripcion}
                />
              </>
            }
          />
        </Bloque>

        <Bloque titulo="Cómo se lista">
          <Par>
            <CampoTexto
              id="orden"
              name="orden"
              etiqueta="Orden"
              ayuda="En qué posición se lista. Menor número, más arriba."
              type="number"
              min={0}
              defaultValue={sector?.orden ?? ""}
            />
          </Par>
          {esAdmin ? (
            <CampoCasilla
              id="esDestacado"
              name="esDestacado"
              etiqueta="Destacado"
              ayuda="Los destacados son el catálogo de la Federación: los únicos que muestran la Home y Nuestros servicios, y los únicos con pantalla propia. Los demás son los que carga cada cooperativa para su ficha."
              defaultChecked={sector?.destacado}
            />
          ) : null}
        </Bloque>

        {esAdmin ? (
          <Bloque titulo="Imagen y animación">
            <Par>
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
            </Par>
          </Bloque>
        ) : null}
      </Bloques>
    </FormularioAdmin>
  );
}
