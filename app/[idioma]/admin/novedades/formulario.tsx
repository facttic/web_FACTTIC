"use client";

import { Bloque, Bloques, Par } from "@/components/admin/bloque";
import { SolapasIdioma } from "@/components/admin/solapas-idioma";
import {
  CampoArchivo,
  CampoSelector,
  CampoTexto,
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
      <Bloques>
        <Bloque titulo="Dónde y cuándo se publica">
          <Par>
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
              ayuda="Con esto se ordena el listado."
              type="date"
              // La API guarda un ISO con hora; al campo solo le interesa el día.
              defaultValue={novedad?.fecha.slice(0, 10)}
              required
            />
          </Par>
          <CampoArchivo
            id="file"
            name="file"
            etiqueta="Portada"
            ayuda="La imagen de la tarjeta y del encabezado de la nota."
            accept="image/*"
            actual={novedad?.imagen}
          />
        </Bloque>

        <Bloque titulo="La nota">
          <SolapasIdioma
            traducidos={{
              cargados: [
                novedad?.en.titulo,
                novedad?.en.bajada,
                novedad?.en.cuerpo,
              ].filter(Boolean).length,
              total: 3,
            }}
            espanol={
              <>
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
                <CampoTexto
                  id="cuerpo"
                  name="cuerpo"
                  etiqueta="Cuerpo"
                  ayuda="El texto completo. Una línea en blanco separa párrafos."
                  multilinea
                  rows={14}
                  defaultValue={novedad?.cuerpo}
                  required
                  minLength={10}
                  maxLength={5000}
                />
              </>
            }
            ingles={
              <>
                <CampoTexto
                  id="en-titulo"
                  name="en.titulo"
                  etiqueta="Title"
                  ayuda="Sin traducción, el sitio en inglés muestra el español."
                  defaultValue={novedad?.en.titulo}
                  maxLength={200}
                />
                <CampoTexto
                  id="en-bajada"
                  name="en.bajada"
                  etiqueta="Summary"
                  multilinea
                  rows={3}
                  maxLength={500}
                  defaultValue={novedad?.en.bajada}
                />
                <CampoTexto
                  id="en-cuerpo"
                  name="en.cuerpo"
                  etiqueta="Body"
                  multilinea
                  rows={14}
                  maxLength={5000}
                  defaultValue={novedad?.en.cuerpo}
                />
              </>
            }
          />
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}
