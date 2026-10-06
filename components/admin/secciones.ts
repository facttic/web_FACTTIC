/**
 * Qué se puede editar en el panel, y en qué orden.
 *
 * Vive en su propio archivo y no dentro de la navegación porque esta lista la
 * leen los dos lados: la navegación, que es de cliente, y el tablero, que es
 * de servidor. Exportar datos desde un módulo `"use client"` no funciona —el
 * servidor recibe una referencia, no el array—, así que el dato va aparte y
 * cada uno lo importa de acá.
 *
 * El orden no es alfabético sino el de urgencia para cargar contenido:
 * primero lo que el sitio está mostrando vacío o con datos de ejemplo,
 * después los catálogos que casi no cambian. `listo` marca los ABMs ya
 * construidos; el resto se ve apagado, para que el alcance esté a la vista.
 */
export interface ItemAdmin {
  href: string;
  etiqueta: string;
  listo: boolean;
}

/**
 * Lo que puede editar una cooperativa: su ficha, sus proyectos, y los sectores
 * y servicios que ella misma dé de alta. El resto es de la Federación.
 *
 * Clientes y tecnologías quedan afuera a propósito: puede crearlos al vuelo
 * desde el formulario de un proyecto, pero la API solo deja **editarlos** a la
 * Federación, así que un listado propio sería una pantalla donde cada "Editar"
 * termina en 403.
 */
const DE_LAS_COOPERATIVAS = [
  "/admin/cooperativas",
  "/admin/proyectos",
  "/admin/sectores",
  "/admin/servicios",
];

/**
 * El menú que corresponde a quien entró.
 *
 * Esconder no es proteger: la API rechaza igual lo que no corresponda. Esto
 * es para no ofrecer pantallas que al guardar van a dar 403.
 */
export function seccionesPara(esAdmin: boolean) {
  if (esAdmin) return SECCIONES;
  return SECCIONES.map((seccion) => ({
    ...seccion,
    items: seccion.items.filter((item) =>
      DE_LAS_COOPERATIVAS.includes(item.href),
    ),
  })).filter((seccion) => seccion.items.length);
}

export const SECCIONES: Array<{ titulo: string; items: ItemAdmin[] }> = [
  {
    titulo: "Contenido",
    items: [
      { href: "/admin/cooperativas", etiqueta: "Cooperativas", listo: true },
      { href: "/admin/consejo", etiqueta: "Consejo", listo: true },
      { href: "/admin/novedades", etiqueta: "Novedades", listo: true },
      { href: "/admin/proyectos", etiqueta: "Proyectos", listo: true },
    ],
  },
  {
    titulo: "Catálogos",
    items: [
      { href: "/admin/sectores", etiqueta: "Sectores", listo: true },
      { href: "/admin/servicios", etiqueta: "Servicios", listo: true },
      { href: "/admin/tecnologias", etiqueta: "Tecnologías", listo: true },
      { href: "/admin/clientes", etiqueta: "Clientes", listo: true },
      {
        href: "/admin/organizaciones",
        etiqueta: "Organizaciones",
        listo: true,
      },
    ],
  },
];
