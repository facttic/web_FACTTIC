"use client";

import { Bloque, Bloques, Par } from "./bloque";
import {
  CampoTexto,
  CampoArchivo,
  FormularioAdmin,
  type EstadoForm,
} from "./piezas";

/** El formulario de los catálogos simples: un nombre y, si corresponde, una imagen. */
export function FormularioSimple({
  accion,
  volverA,
  titulo = "Datos",
  nombre,
  conImagen,
  ayudaImagen,
  imagenActual,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  volverA: string;
  /** De qué es la ficha: "Tecnología", "Cliente". */
  titulo?: string;
  nombre?: string;
  conImagen?: boolean;
  ayudaImagen?: string;
  imagenActual?: string | null;
}) {
  const campoNombre = (
    <CampoTexto
      id="nombre"
      name="nombre"
      etiqueta="Nombre"
      defaultValue={nombre}
      required
      minLength={3}
      autoFocus
    />
  );

  return (
    <FormularioAdmin accion={accion} volverA={volverA}>
      <Bloques>
        <Bloque titulo={titulo}>
          {conImagen ? (
            <Par>
              {campoNombre}
              <CampoArchivo
                id="file"
                name="file"
                etiqueta="Imagen"
                ayuda={
                  ayudaImagen ??
                  "PNG o SVG, preferentemente sobre fondo transparente."
                }
                accept="image/*"
                actual={imagenActual}
              />
            </Par>
          ) : (
            campoNombre
          )}
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}
