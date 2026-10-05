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
import type { Autoridad, Opcion } from "@/lib/datos/admin";

/**
 * Alta y edición de una autoridad del consejo.
 *
 * El cargo es texto libre a propósito: la sección de Sobre FACTTIC ordena por
 * jerarquía leyendo lo que dice el cargo, y los nombres reales —"Vocal
 * titular", "Síndico suplente"— no entran en una lista corta.
 */
export function FormularioAutoridad({
  accion,
  autoridad,
  cooperativas,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  autoridad?: Autoridad;
  cooperativas: Opcion[];
}) {
  return (
    <FormularioAdmin accion={accion} volverA="/admin/consejo">
      <Columnas>
        <Columna>
          <CampoTexto
            id="nombre"
            name="nombre"
            etiqueta="Nombre"
            defaultValue={autoridad?.nombre}
            required
            minLength={2}
            maxLength={150}
            autoFocus
          />
          <CampoTexto
            id="cargo"
            name="cargo"
            etiqueta="Cargo"
            ayuda="Como figura en el acta: Presidenta, Tesorero, Vocal titular, Síndico suplente."
            defaultValue={autoridad?.cargo}
            required
            minLength={2}
            maxLength={100}
          />
        </Columna>

        <Columna>
          <CampoSelector
            id="cooperativa"
            name="cooperativa"
            etiqueta="Cooperativa"
            defaultValue={autoridad?.cooperativa?.id ?? ""}
            required
          >
            <option value="">Elegí una</option>
            {cooperativas.map((cooperativa) => (
              <option key={cooperativa.id} value={cooperativa.id}>
                {cooperativa.nombre}
              </option>
            ))}
          </CampoSelector>
          <CampoArchivo
            id="file"
            name="file"
            etiqueta="Foto"
            ayuda="La API la guarda, pero la maqueta de Autoridades todavía no la muestra."
            accept="image/*"
            actual={autoridad?.foto}
          />
        </Columna>
      </Columnas>
    </FormularioAdmin>
  );
}
