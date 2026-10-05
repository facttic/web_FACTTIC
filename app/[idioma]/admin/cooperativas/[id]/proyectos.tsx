import { traerProyectosDe } from "@/lib/datos/admin";
import { Celda, EnlaceAdmin, Fila, Tabla } from "@/components/admin/piezas";

/**
 * Los proyectos de la cooperativa, debajo de su ficha.
 *
 * Va acá y no solo en el listado general porque así se carga: alguien de una
 * cooperativa entra a completar sus datos y sigue con sus proyectos, sin tener
 * que buscarlos entre los de todas. El alta y la edición vuelven a esta misma
 * pantalla en vez de al listado.
 *
 * Es una sección aparte y no parte del formulario: son dos cosas distintas y
 * un formulario no puede contener otro.
 */
export async function ProyectosDeLaCooperativa({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const proyectos = await traerProyectosDe(id);
  const vuelta = `/admin/cooperativas/${id}`;

  return (
    /*
     * Su propio recuadro, igual que el formulario: son dos cosas separadas y
     * cada una tiene su botón. Sin el borde, el "Guardar" de la ficha queda a
     * mitad de página y parece que guardara también los proyectos.
     */
    <section className="mt-8 rounded-xl border border-borde p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-h4">Proyectos</h2>
          <p className="text-p3 mt-1 text-blanco/50">
            {proyectos.length === 0
              ? `Todavía no hay ninguno cargado con ${nombre}.`
              : `${proyectos.length} en los que participa ${nombre}.`}
          </p>
        </div>
        <EnlaceAdmin
          href={`/admin/proyectos/nueva?cooperativa=${id}&volver=${vuelta}`}
        >
          Agregar proyecto
        </EnlaceAdmin>
      </div>

      {proyectos.length > 0 ? (
        <Tabla columnas={["Nombre", "Sector", "Cliente", "Imágenes", ""]}>
          {proyectos.map((proyecto) => (
            <Fila key={proyecto.id}>
              <Celda className="text-p2">
                <span className="line-clamp-1 max-w-xs">{proyecto.nombre}</span>
              </Celda>
              <Celda apagado={!proyecto.sector?.nombre}>
                {proyecto.sector?.nombre ?? "falta"}
              </Celda>
              <Celda apagado={!proyecto.cliente?.nombre}>
                {proyecto.cliente?.nombre ?? "falta"}
              </Celda>
              <Celda apagado={proyecto.imagenes.length === 0}>
                {proyecto.imagenes.length || "falta"}
              </Celda>
              <Celda className="text-right">
                <EnlaceAdmin
                  href={`/admin/proyectos/${proyecto.id}?volver=${vuelta}`}
                  className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                >
                  Editar
                </EnlaceAdmin>
              </Celda>
            </Fila>
          ))}
        </Tabla>
      ) : null}
    </section>
  );
}
