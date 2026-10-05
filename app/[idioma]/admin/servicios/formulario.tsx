"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FOCO } from "@/components/ui/boton";
import {
  BotonAdmin,
  CampoCasilla,
  CampoTexto,
  Columna,
  Columnas,
  CONTROL,
  FormularioAdmin,
  type EstadoForm,
} from "@/components/admin/piezas";
import type { Servicio } from "@/lib/datos/admin";

/**
 * Alta y edición de un servicio.
 *
 * A la izquierda lo que describe al servicio y a la derecha su lista de
 * subservicios, que es la que crece: así se ve entera sin bajar.
 */
export function FormularioServicio({
  accion,
  servicio,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  servicio?: Servicio;
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/servicios">
      <Columnas>
        <Columna>
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
          <CampoTexto
            id="orden"
            name="orden"
            etiqueta="Orden"
            ayuda="En qué posición se lista. Menor número, más arriba."
            type="number"
            min={0}
            defaultValue={servicio?.orden ?? ""}
          />
          <CampoCasilla
            id="esDestacado"
            name="esDestacado"
            etiqueta="Destacado"
            ayuda="Los destacados son el catálogo de la Federación: los únicos que muestran la Home y Nuestros servicios. Los demás son los que carga cada cooperativa para su ficha."
            defaultChecked={servicio?.destacado}
          />
        </Columna>

        <Columna>
          <Subservicios iniciales={servicio?.subservicios ?? []} />
        </Columna>
      </Columnas>
    </FormularioAdmin>
  );
}

interface Fila {
  clave: number;
  nombre: string;
  descripcion: string;
}

/**
 * Las filas de subservicios.
 *
 * Un formulario HTML no anida, así que los nombres y las descripciones viajan
 * como dos listas paralelas y la acción las junta por posición. La clave de
 * cada fila es un número propio y no el índice: si fuera el índice, borrar una
 * fila del medio haría que React reusara los inputs de la siguiente y el texto
 * saltaría de lugar.
 */
function Subservicios({
  iniciales,
}: {
  iniciales: Array<{ nombre: string; descripcion: string }>;
}) {
  const proxima = useRef(iniciales.length);
  const [filas, setFilas] = useState<Fila[]>(() =>
    iniciales.map((sub, i) => ({ clave: i, ...sub })),
  );

  const agregar = () =>
    setFilas((previas) => [
      ...previas,
      { clave: proxima.current++, nombre: "", descripcion: "" },
    ]);

  const quitar = (clave: number) =>
    setFilas((previas) => previas.filter((fila) => fila.clave !== clave));

  return (
    <fieldset>
      <legend className="text-p3 mb-2 text-blanco/70">Subservicios</legend>
      <p className="text-p3 mb-3 text-blanco/35">
        Lo que se lista dentro del servicio. Las filas sin nombre se descartan.
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
              className="grid items-start gap-2 sm:grid-cols-[1fr_1.6fr_auto]"
            >
              <input
                name="subservicioNombre"
                defaultValue={fila.nombre}
                placeholder="Nombre"
                aria-label="Nombre del subservicio"
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
