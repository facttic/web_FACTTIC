"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import { Bloque, Bloques, Par } from "@/components/admin/bloque";
import { SolapasIdioma } from "@/components/admin/solapas-idioma";
import {
  BotonAdmin,
  CampoCasilla,
  CampoTexto,
  CONTROL,
  FormularioAdmin,
  type EstadoForm,
} from "@/components/admin/piezas";
import type { Servicio } from "@/lib/datos/admin";

/**
 * Alta y edición de un servicio.
 *
 * Tres bloques: qué es el servicio, qué se lista adentro y cómo aparece en el
 * sitio. Los subservicios se llevan su propio bloque porque es la parte que
 * crece y necesita todo el ancho.
 */
export function FormularioServicio({
  accion,
  servicio,
  esAdmin,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  servicio?: Servicio;
  /** Solo la Federación arma el catálogo que muestra el sitio. */
  esAdmin: boolean;
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/servicios">
      <Bloques>
        <Bloque titulo="Qué servicio es">
          <SolapasIdioma
            traducidos={{
              cargados: [servicio?.en.nombre, servicio?.en.descripcion].filter(
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
                  defaultValue={servicio?.nombre}
                  required
                  minLength={3}
                  maxLength={100}
                  autoFocus
                />
                <CampoTexto
                  id="descripcion"
                  name="descripcion"
                  etiqueta="Descripción"
                  ayuda="El párrafo que acompaña al servicio en la solapa de Servicios."
                  multilinea
                  rows={6}
                  maxLength={1000}
                  defaultValue={servicio?.descripcion}
                />
              </>
            }
            ingles={
              <>
                <CampoTexto
                  id="en-nombre"
                  name="en.nombre"
                  etiqueta="Name"
                  ayuda="Sin traducción, el sitio en inglés muestra el español."
                  defaultValue={servicio?.en.nombre}
                  maxLength={100}
                />
                <CampoTexto
                  id="en-descripcion"
                  name="en.descripcion"
                  etiqueta="Description"
                  multilinea
                  rows={6}
                  maxLength={1000}
                  defaultValue={servicio?.en.descripcion}
                />
              </>
            }
          />
        </Bloque>

        <Bloque titulo="Subservicios">
          <Subservicios
            iniciales={servicio?.subservicios ?? []}
            enIngles={servicio?.en.subservicios ?? []}
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
              defaultValue={servicio?.orden ?? ""}
            />
          </Par>
          {esAdmin ? (
            <CampoCasilla
              id="esDestacado"
              name="esDestacado"
              etiqueta="Destacado"
              ayuda="Los destacados son el catálogo de la Federación: los únicos que muestran la Home y Nuestros servicios. Los demás son los que carga cada cooperativa para su ficha."
              defaultChecked={servicio?.destacado}
            />
          ) : null}
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}

interface Fila {
  clave: number;
  nombre: string;
  descripcion: string;
  nombreEn: string;
}

/**
 * Las filas de subservicios.
 *
 * Un formulario HTML no anida, así que los nombres y las descripciones viajan
 * como dos listas paralelas y la acción las junta por posición. La clave de
 * cada fila es un número propio y no el índice: si fuera el índice, borrar una
 * fila del medio haría que React reusara los inputs de la siguiente y el texto
 * saltaría de lugar.
 *
 * El inglés va en la misma fila, al lado del nombre: las dos listas se guardan
 * en el mismo envío, así que no pueden desfasarse. Antes viajaban escondidas y
 * se emparejaban por posición: reordenar o borrar un subservicio dejaba las
 * traducciones corridas, mostrando el nombre de otro.
 */
function Subservicios({
  iniciales,
  enIngles,
}: {
  iniciales: Array<{ nombre: string; descripcion: string }>;
  enIngles: Array<{ nombre?: string; descripcion?: string }>;
}) {
  const proxima = useRef(iniciales.length);
  const [filas, setFilas] = useState<Fila[]>(() =>
    iniciales.map((sub, i) => ({
      clave: i,
      ...sub,
      nombreEn: enIngles[i]?.nombre ?? "",
    })),
  );

  const agregar = () =>
    setFilas((previas) => [
      ...previas,
      { clave: proxima.current++, nombre: "", descripcion: "", nombreEn: "" },
    ]);

  const quitar = (clave: number) =>
    setFilas((previas) => previas.filter((fila) => fila.clave !== clave));

  return (
    <fieldset>
      <p className="text-p3 mb-3 text-blanco/35">
        Lo que se lista dentro del servicio, con su nombre en inglés al lado.
        Las filas sin nombre en español se descartan.
      </p>

      {filas.length === 0 ? (
        <p className="text-p3 mb-3 rounded-lg border border-dashed border-borde p-4 text-blanco/40">
          Todavía no tiene ninguno.
        </p>
      ) : (
        <ul className="mb-3 flex flex-col gap-2">
          {filas.map((fila) => (
            <li
              key={fila.clave}
              className="grid items-start gap-2 sm:grid-cols-[1fr_1fr_1.6fr_auto]"
            >
              <input
                name="subservicioNombre"
                defaultValue={fila.nombre}
                placeholder="Nombre"
                aria-label="Nombre del subservicio"
                className={cn(CONTROL, FOCO)}
              />
              <input
                name="subservicioNombreEn"
                defaultValue={fila.nombreEn}
                placeholder="Name · English"
                aria-label="Nombre del subservicio en inglés"
                className={cn(CONTROL, FOCO)}
              />
              <input
                name="subservicioDescripcion"
                defaultValue={fila.descripcion}
                placeholder="Descripción (opcional)"
                aria-label="Descripción del subservicio"
                className={cn(CONTROL, FOCO)}
              />
              <BotonAdmin
                type="button"
                variante="secundario"
                className="justify-self-start"
                onClick={() => quitar(fila.clave)}
                aria-label={`Quitar ${fila.nombre || "el subservicio"}`}
              >
                Quitar
              </BotonAdmin>
            </li>
          ))}
        </ul>
      )}

      <BotonAdmin type="button" variante="secundario" onClick={agregar}>
        Agregar subservicio
      </BotonAdmin>
    </fieldset>
  );
}
