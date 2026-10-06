"use client";

import { Bloque, Bloques, Par } from "@/components/admin/bloque";
import { CampoBuscador } from "@/components/admin/campo-buscador";
import { SolapasIdioma } from "@/components/admin/solapas-idioma";
import {
  CampoArchivo,
  CampoCasilla,
  CampoSelector,
  CampoSelectorConAlta,
  CampoTexto,
  FormularioAdmin,
  type EstadoForm,
} from "@/components/admin/piezas";
import type { Opcion, Proyecto } from "@/lib/datos/admin";
import { crearCliente, crearServicio, crearTecnologia } from "./acciones";

export interface OpcionesProyecto {
  sectores: Opcion[];
  clientes: Opcion[];
  servicios: Opcion[];
  tecnologias: Opcion[];
  cooperativas: Opcion[];
}

/**
 * Alta y edición de un proyecto.
 *
 * Es la ficha más larga del panel: cuatro bloques que se completan de arriba
 * abajo —qué proyecto es, cómo se clasifica, qué cuenta y con qué imágenes—.
 * Antes iba en dos columnas con muros de casillas y no se entendía qué iba con
 * qué.
 *
 * Desafío, solución y resultado van seguidos y en ese orden porque es el orden
 * en que se leen en el sitio, y detrás de solapas de idioma: son seis textos
 * largos y de a dos por campo el formulario medía el doble.
 */
export function FormularioProyecto({
  accion,
  proyecto,
  opciones,
  cooperativa,
  esAdmin,
  volverA,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  proyecto?: Proyecto;
  opciones: OpcionesProyecto;
  /** Viene marcada de entrada cuando se llega desde la ficha de una cooperativa. */
  cooperativa?: string;
  /** Solo la Federación decide qué proyectos muestra la Home. */
  esAdmin: boolean;
  /** A dónde vuelve al guardar o al cancelar. Por defecto, al listado. */
  volverA?: string;
}) {
  const elegidas = proyecto?.cooperativas ?? (cooperativa ? [cooperativa] : []);

  return (
    <FormularioAdmin accion={accion} volverA={volverA ?? "/admin/proyectos"}>
      {volverA ? <input type="hidden" name="volver" value={volverA} /> : null}

      <Bloques>
        <Bloque titulo="Identificación">
          <Par>
            <CampoTexto
              id="nombre"
              name="nombre"
              etiqueta="Nombre"
              ayuda={
                proyecto
                  ? "La dirección del proyecto se generó con el nombre original y no cambia si lo editás."
                  : "De acá sale la dirección del proyecto en el sitio, y después no se puede cambiar."
              }
              defaultValue={proyecto?.nombre}
              required
              minLength={3}
              maxLength={200}
              autoFocus
            />
            <CampoTexto
              id="en-nombre"
              name="en.nombre"
              etiqueta="Nombre · English"
              ayuda="Opcional. Sin traducción, el sitio en inglés muestra el nombre en español."
              defaultValue={proyecto?.en.nombre}
              maxLength={200}
            />
          </Par>
        </Bloque>

        <Bloque
          titulo="Clasificación"
          ayuda="De esto salen los filtros de Proyectos y los proyectos relacionados."
        >
          <Par>
            <CampoSelector
              id="sector"
              name="sector"
              etiqueta="Sector"
              ayuda="La vertical en la que se lista."
              defaultValue={proyecto?.sector?.id ?? ""}
            >
              <option value="">Sin sector</option>
              {opciones.sectores.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.nombre}
                </option>
              ))}
            </CampoSelector>

            <CampoSelectorConAlta
              id="cliente"
              nombre="cliente"
              etiqueta="Cliente"
              opciones={opciones.clientes}
              elegida={proyecto?.cliente?.id}
              vacio="Sin cliente"
              crear={crearCliente}
              queEs="cliente"
              conLogo
            />
          </Par>

          <CampoBuscador
            nombre="cooperativas"
            etiqueta="Cooperativas"
            ayuda="Quiénes lo hicieron. Cualquiera de ellas puede editar este proyecto."
            opciones={opciones.cooperativas}
            elegidas={elegidas}
            vacio="Todavía no hay cooperativas cargadas."
          />
          <CampoBuscador
            nombre="servicios"
            etiqueta="Servicios"
            ayuda="Los que se prestaron en este proyecto."
            opciones={opciones.servicios}
            elegidas={proyecto?.servicios ?? []}
            crear={crearServicio}
            queEs="servicio"
          />
          <CampoBuscador
            nombre="tecnologias"
            etiqueta="Tecnologías"
            ayuda="Arman el stack que muestra el detalle."
            opciones={opciones.tecnologias}
            elegidas={proyecto?.tecnologias ?? []}
            crear={crearTecnologia}
            queEs="tecnología"
          />
        </Bloque>

        <Bloque
          titulo="La historia del proyecto"
          ayuda="Los tres textos que se leen en el detalle, uno debajo del otro."
        >
          <SolapasIdioma
            traducidos={{
              cargados: [
                proyecto?.en.desafio,
                proyecto?.en.solucion,
                proyecto?.en.resultado,
              ].filter(Boolean).length,
              total: 3,
            }}
            espanol={
              <>
                <CampoTexto
                  id="desafio"
                  name="desafio"
                  etiqueta="Desafío"
                  ayuda="Qué problema había."
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.desafio}
                />
                <CampoTexto
                  id="solucion"
                  name="solucion"
                  etiqueta="Solución"
                  ayuda="Qué se hizo."
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.solucion}
                />
                <CampoTexto
                  id="resultado"
                  name="resultado"
                  etiqueta="Resultado"
                  ayuda="Qué cambió después."
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.resultado}
                />
              </>
            }
            ingles={
              <>
                <CampoTexto
                  id="en-desafio"
                  name="en.desafio"
                  etiqueta="Challenge"
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.en.desafio}
                />
                <CampoTexto
                  id="en-solucion"
                  name="en.solucion"
                  etiqueta="Solution"
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.en.solucion}
                />
                <CampoTexto
                  id="en-resultado"
                  name="en.resultado"
                  etiqueta="Outcome"
                  multilinea
                  rows={5}
                  maxLength={2000}
                  defaultValue={proyecto?.en.resultado}
                />
              </>
            }
          />
        </Bloque>

        <Bloque titulo={esAdmin ? "Imágenes y publicación" : "Imágenes"}>
          <Imagenes cargadas={proyecto?.imagenes ?? []} />
          {esAdmin ? (
            <CampoCasilla
              id="esDestacado"
              name="esDestacado"
              etiqueta="Destacado"
              ayuda="Los destacados son los que muestra la Home. Si no hay ninguno, muestra los últimos cargados."
              defaultChecked={proyecto?.destacado}
            />
          ) : null}
        </Bloque>
      </Bloques>
    </FormularioAdmin>
  );
}

/**
 * Las imágenes del proyecto.
 *
 * La API no sabe agregar de a una: cada envío reemplaza la lista entera, así
 * que las que ya están se muestran acá para poder decidir con eso a la vista.
 */
function Imagenes({ cargadas }: { cargadas: string[] }) {
  return (
    <CampoArchivo
      id="imageFiles"
      name="imageFiles"
      etiqueta="Imágenes"
      ayuda={
        cargadas.length > 0
          ? `Hay ${cargadas.length} cargada${cargadas.length === 1 ? "" : "s"}. Si elegís otras, reemplazan a todas: subilas juntas. La primera es la portada.`
          : "La primera es la portada. Se pueden elegir varias juntas."
      }
      accept="image/*"
      multiple
      actual={cargadas}
    />
  );
}
