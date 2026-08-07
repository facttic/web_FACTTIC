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

export const SECCIONES: Array<{ titulo: string; items: ItemAdmin[] }> = [
  {
    titulo: "Contenido",
    items: [
      { href: "/admin/cooperativas", etiqueta: "Cooperativas", listo: true },
      { href: "/admin/consejo", etiqueta: "Consejo", listo: false },
      { href: "/admin/novedades", etiqueta: "Novedades", listo: false },
      { href: "/admin/proyectos", etiqueta: "Proyectos", listo: false },
    ],
  },
  {
    titulo: "Catálogos",
    items: [
      { href: "/admin/sectores", etiqueta: "Sectores", listo: false },
      { href: "/admin/servicios", etiqueta: "Servicios", listo: false },
      { href: "/admin/tecnologias", etiqueta: "Tecnologías", listo: false },
      { href: "/admin/clientes", etiqueta: "Clientes", listo: false },
      {
        href: "/admin/organizaciones",
        etiqueta: "Organizaciones",
        listo: false,
      },
    ],
  },
];
