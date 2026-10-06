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
import { SolapasIdioma } from "@/components/admin/solapas-idioma";
import { CampoUbicacion } from "@/components/admin/mapa-ubicacion";
import type { Cooperativa } from "@/lib/datos/admin";
import { crearSector, crearServicio } from "./acciones";

/**
 * Alta y edición de una cooperativa.
 *
 * Es la ficha de la que vive Nuestra Red: sin ubicación la cooperativa no
 * aparece en el mapa federal —ni en ninguna otra parte del sitio—, sin
 * asociadxs no suma a la métrica de la Home, y sin servicios ni sectores el
 * panel de provincia queda vacío.
 *
 * Por eso la ubicación es obligatoria: una ficha completa que no se muestra en
 * ningún lado es peor que no haberla cargado.
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
          titulo="Quiénes son"
          ayuda="El párrafo que acompaña a la cooperativa en Nuestra Red."
        >
          <SolapasIdioma
            traducidos={{
              cargados: cooperativa?.en.descripcion ? 1 : 0,
              total: 1,
            }}
            espanol={
              <CampoTexto
                id="descripcion"
                name="descripcion"
                etiqueta="Descripción"
                ayuda="Una o dos frases: a qué se dedican y qué las distingue."
                multilinea
                rows={4}
                maxLength={1000}
                defaultValue={cooperativa?.descripcion}
              />
            }
            ingles={
              <CampoTexto
                id="en-descripcion"
                traducirDesde="descripcion"
                name="en.descripcion"
                etiqueta="Description"
                ayuda="Sin traducción, el sitio en inglés muestra el español."
                multilinea
                rows={4}
                maxLength={1000}
                defaultValue={cooperativa?.en.descripcion}
              />
            }
          />
        </Bloque>

        <Bloque
          titulo="Cómo contactarlas"
          ayuda="Lo que la tarjeta de Nuestra Red ofrece para seguir: el sitio, el contacto y las redes."
        >
          <Par>
            <CampoTexto
              id="sitio"
              name="sitio"
              etiqueta="Sitio web"
              ayuda="Con https:// adelante."
              type="url"
              placeholder="https://micoope.coop"
              maxLength={300}
              defaultValue={cooperativa?.sitio}
            />
            <CampoTexto
              id="fundacion"
              name="fundacion"
              etiqueta="Año de fundación"
              type="number"
              min={1900}
              max={2200}
              placeholder="2011"
              defaultValue={cooperativa?.fundacion ?? ""}
            />
          </Par>
          <Par>
            <CampoTexto
              id="email"
              name="email"
              etiqueta="Correo"
              type="email"
              placeholder="hola@micoope.coop"
              defaultValue={cooperativa?.email}
            />
            <CampoTexto
              id="telefono"
              name="telefono"
              etiqueta="Teléfono"
              maxLength={50}
              placeholder="+54 11 1234 5678"
              defaultValue={cooperativa?.telefono}
            />
          </Par>
          <Par>
            <CampoTexto
              id="linkedin"
              name="linkedin"
              etiqueta="LinkedIn"
              type="url"
              placeholder="https://linkedin.com/company/micoope"
              defaultValue={cooperativa?.redes.linkedin}
            />
            <CampoTexto
              id="instagram"
              name="instagram"
              etiqueta="Instagram"
              type="url"
              placeholder="https://instagram.com/micoope"
              defaultValue={cooperativa?.redes.instagram}
            />
          </Par>
          <CampoTexto
            id="github"
            name="github"
            etiqueta="GitHub o GitLab"
            type="url"
            placeholder="https://github.com/micoope"
            defaultValue={cooperativa?.redes.github}
          />
        </Bloque>

        <Bloque
          titulo="Dónde está"
          ayuda="Es obligatoria: sin ella la cooperativa no aparece en Nuestra Red. Alcanza con la ciudad, que el mapa agrupa por provincia."
        >
          <CampoUbicacion
            requerida
            lat={cooperativa?.ubicacion?.lat}
            lng={cooperativa?.ubicacion?.lng}
          />
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}
