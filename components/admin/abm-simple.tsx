import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/api/guardia";
import { crear, editar, borrar } from "@/lib/api/escritura";
import {
  Encabezado,
  EnlaceAdmin,
  Tabla,
  Fila,
  Celda,
  BotonBorrar,
  type EstadoForm,
} from "./piezas";
import { FormularioSimple } from "./abm-simple-form";

/**
 * ABM de los catálogos que son solo un nombre y, a veces, una imagen:
 * tecnologías, clientes y organizaciones.
 *
 * Los tres se comportan igual, así que en vez de escribir el mismo listado y
 * el mismo formulario tres veces, se arman desde acá con la configuración de
 * cada uno. Los recursos con más campos —cooperativas, novedades, proyectos—
 * tienen su propio ABM, porque forzarlos en este molde lo volvería ilegible.
 */

export interface ConfigSimple {
  /** Cómo se llama en la API: `tecnologias`, `clientes`, `organizaciones`. */
  recurso: string;
  ruta: string;
  titulo: string;
  singular: string;
  /** Etiqueta de cache a invalidar cuando algo cambia. */
  etiqueta: string;
  conImagen?: boolean;
  ayudaImagen?: string;
}

export interface RegistroSimple {
  id: string;
  nombre: string;
  logo?: string | null;
}

export function ListadoSimple({
  config,
  registros,
}: {
  config: ConfigSimple;
  registros: RegistroSimple[];
}) {
  async function borrarRegistro(
    _estado: EstadoForm,
    datos: FormData,
  ): Promise<EstadoForm> {
    "use server";
    await requerirSesion();
    const resultado = await borrar(
      config.recurso,
      String(datos.get("id")),
      config.etiqueta,
    );
    if (!resultado.ok) return { error: resultado.error };
    revalidatePath(config.ruta);
    return undefined;
  }

  const columnas = config.conImagen ? ["Nombre", "Imagen", ""] : ["Nombre", ""];

  return (
    <div className="mx-auto max-w-5xl">
      <Encabezado
        titulo={config.titulo}
        cantidad={registros.length}
        accion={
          <EnlaceAdmin href={`${config.ruta}/nueva`}>
            Agregar {config.singular}
          </EnlaceAdmin>
        }
      />

      <Tabla columnas={columnas}>
        {registros.map((registro) => (
          <Fila key={registro.id}>
            <Celda className="text-p2">{registro.nombre}</Celda>
            {config.conImagen ? (
              <Celda apagado={!registro.logo}>
                {registro.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={registro.logo}
                    alt=""
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  "falta"
                )}
              </Celda>
            ) : null}
            <Celda className="text-right">
              <span className="flex justify-end gap-2">
                <EnlaceAdmin
                  href={`${config.ruta}/${registro.id}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
                <BotonBorrarConId
                  accion={borrarRegistro}
                  id={registro.id}
                  que={registro.nombre}
                />
              </span>
            </Celda>
          </Fila>
        ))}
      </Tabla>
    </div>
  );
}

/** El botón de borrar necesita saber a quién borra. */
function BotonBorrarConId({
  accion,
  id,
  que,
}: {
  accion: (estado: EstadoForm, datos: FormData) => Promise<EstadoForm>;
  id: string;
  que: string;
}) {
  const conId = async (estado: EstadoForm, datos: FormData) => {
    "use server";
    datos.set("id", id);
    return accion(estado, datos);
  };
  return <BotonBorrar accion={conId} que={que} />;
}

export function EdicionSimple({
  config,
  registro,
  opciones,
}: {
  config: ConfigSimple;
  /** Sin registro es un alta. */
  registro?: RegistroSimple;
  opciones?: never;
}) {
  async function guardar(
    _estado: EstadoForm,
    datos: FormData,
  ): Promise<EstadoForm> {
    "use server";
    await requerirSesion();

    const nombre = String(datos.get("nombre") ?? "").trim();
    if (nombre.length < 3) {
      return { error: "El nombre tiene que tener al menos 3 caracteres" };
    }

    const archivo = datos.get("file");
    const traeArchivo = archivo instanceof File && archivo.size > 0;

    /*
     * Con archivo va como multipart y sin archivo como JSON: mandar un
     * multipart vacío haría que la API interprete que se quiere borrar la
     * imagen que ya estaba.
     */
    let cuerpo: FormData | object;
    if (traeArchivo) {
      const form = new FormData();
      form.set("nombre", nombre);
      form.set("file", archivo);
      cuerpo = form;
    } else {
      cuerpo = { nombre };
    }

    const resultado = registro
      ? await editar(config.recurso, registro.id, cuerpo, config.etiqueta)
      : await crear(config.recurso, cuerpo, config.etiqueta);

    if (!resultado.ok) return { error: resultado.error };

    revalidatePath(config.ruta);
    redirect(config.ruta);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Encabezado
        titulo={
          registro ? `Editar ${config.singular}` : `Agregar ${config.singular}`
        }
      />
      <FormularioSimple
        accion={guardar}
        volverA={config.ruta}
        nombre={registro?.nombre}
        conImagen={config.conImagen}
        ayudaImagen={config.ayudaImagen}
        imagenActual={registro?.logo ?? null}
      />
    </div>
  );
}
