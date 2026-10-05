"use client";

import {
  CampoArchivo,
  CampoCasilla,
  CampoMultiple,
  CampoSelector,
  CampoSelectorConAlta,
  CampoTexto,
  Columna,
  Columnas,
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
 * Es la ficha más larga del panel, así que se reparte: arriba en dos columnas
 * —la ficha a la izquierda y el relato a la derecha— y abajo, a todo el ancho,
 * las listas de casillas, que necesitan el ancho para no quedar de a tres por
 * fila. Desafío, solución y resultado van seguidos y en ese orden porque es el
 * orden en que se leen en el sitio.
 */
export function FormularioProyecto({
  accion,
  proyecto,
  opciones,
  cooperativa,
  volverA,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  proyecto?: Proyecto;
  opciones: OpcionesProyecto;
  /** Viene marcada de entrada cuando se llega desde la ficha de una cooperativa. */
  cooperativa?: string;
  /** A dónde vuelve al guardar o al cancelar. Por defecto, al listado. */
  volverA?: string;
}) {
  const elegidas = proyecto?.cooperativas ?? (cooperativa ? [cooperativa] : []);

  return (
    <FormularioAdmin accion={accion} volverA={volverA ?? "/admin/proyectos"}>
      {volverA ? <input type="hidden" name="volver" value={volverA} /> : null}

      <Columnas>
        <Columna>
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

          <CampoSelector
            id="sector"
            name="sector"
            etiqueta="Sector"
            ayuda="La vertical en la que se lista y de donde salen los proyectos relacionados."
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
          />

          <Imagenes cargadas={proyecto?.imagenes ?? []} />

          <CampoCasilla
            id="esDestacado"
            name="esDestacado"
            etiqueta="Destacado"
            ayuda="Los destacados son los que muestra la Home. Si no hay ninguno, muestra los últimos cargados."
            defaultChecked={proyecto?.destacado}
          />
        </Columna>

        <Columna>
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
        </Columna>
      </Columnas>

      {/* Las listas largas van a todo el ancho: son cuarenta cooperativas y en
          media columna entrarían de a tres por fila. */}
      <Columna>
        <CampoMultiple
          nombre="servicios"
          etiqueta="Servicios"
          opciones={opciones.servicios}
          elegidas={proyecto?.servicios ?? []}
          crear={crearServicio}
          queEs="servicio"
        />
        <CampoMultiple
          nombre="tecnologias"
          etiqueta="Tecnologías"
          ayuda="Arman el stack que muestra el detalle."
          opciones={opciones.tecnologias}
          elegidas={proyecto?.tecnologias ?? []}
          crear={crearTecnologia}
          queEs="tecnología"
        />
        <CampoMultiple
          nombre="cooperativas"
          etiqueta="Cooperativas"
          ayuda="Quiénes lo hicieron."
          opciones={opciones.cooperativas}
          elegidas={elegidas}
        />
      </Columna>
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
