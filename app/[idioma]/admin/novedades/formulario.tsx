"use client";

import {
  CampoArchivo,
  CampoSelector,
  CampoTexto,
  Columna,
  Columnas,
  FormularioAdmin,
  type EstadoForm,
} from "@/components/admin/piezas";
import type { Novedad } from "@/lib/datos/admin";

const TIPOS = [
  { valor: "comunicado", etiqueta: "Comunicado" },
  { valor: "noticia", etiqueta: "Noticia" },
  { valor: "actividad", etiqueta: "Actividad" },
];

/** Alta y edición de una novedad: comunicado, noticia o actividad. */
export function FormularioNovedad({
  accion,
  novedad,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  novedad?: Novedad;
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/novedades">
      <Columnas>
        <Columna>
          <CampoTexto
            id="titulo"
            name="titulo"
            etiqueta="Título"
            defaultValue={novedad?.titulo}
            required
            minLength={3}
            maxLength={200}
            autoFocus
          />
          <CampoTexto
            id="bajada"
            name="bajada"
            etiqueta="Bajada"
            ayuda="La línea que se lee en la tarjeta del listado."
            multilinea
            rows={3}
            defaultValue={novedad?.bajada}
            required
            minLength={3}
            maxLength={500}
          />
          <CampoSelector
            id="tipo"
            name="tipo"
            etiqueta="Tipo"
            ayuda="Define en qué solapa de Novedades aparece."
            defaultValue={novedad?.tipo ?? "noticia"}
            required
          >
            {TIPOS.map((tipo) => (
              <option key={tipo.valor} value={tipo.valor}>
                {tipo.etiqueta}
              </option>
            ))}
          </CampoSelector>
          <CampoTexto
            id="fecha"
            name="fecha"
            etiqueta="Fecha"
            type="date"
            // La API guarda un ISO con hora; al campo solo le interesa el día.
            defaultValue={novedad?.fecha.slice(0, 10)}
            required
          />
          <CampoArchivo
            id="file"
            name="file"
            etiqueta="Portada"
            ayuda="La imagen de la tarjeta y del encabezado de la nota."
            accept="image/*"
            actual={novedad?.imagen}
          />
        </Columna>

        {/* El cuerpo es lo más largo de escribir: se lleva su propia columna. */}
        <Columna>
          <CampoTexto
            id="cuerpo"
            name="cuerpo"
            etiqueta="Cuerpo"
            ayuda="El texto completo. Una línea en blanco separa párrafos."
            multilinea
            rows={22}
            defaultValue={novedad?.cuerpo}
            required
            minLength={10}
            maxLength={5000}
          />
        </Columna>
      </Columnas>
    </FormularioAdmin>
  );
}
