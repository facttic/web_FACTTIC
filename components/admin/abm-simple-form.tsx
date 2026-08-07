"use client";

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
  nombre,
  conImagen,
  ayudaImagen,
  imagenActual,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  volverA: string;
  nombre?: string;
  conImagen?: boolean;
  ayudaImagen?: string;
  imagenActual?: string | null;
}) {
  return (
    <FormularioAdmin accion={accion} volverA={volverA}>
      <CampoTexto
        id="nombre"
        name="nombre"
        etiqueta="Nombre"
        defaultValue={nombre}
        required
        minLength={3}
        autoFocus
      />
      {conImagen ? (
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
      ) : null}
    </FormularioAdmin>
  );
}
