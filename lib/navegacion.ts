/**
 * Estructura de navegación del sitio.
 *
 * El menú principal es el de las maquetas, que difiere del mapa del sitio
 * (`Propuesta B.2.pdf`): ese quedó desactualizado y usa nombres viejos como
 * "Para empresas" y "Para cooperativas".
 *
 * Novedades no está en el menú principal: aparece solo en el pie, bajo
 * "Sobre FACTTIC", tal como en el diseño.
 */

export interface Enlace {
  etiqueta: string
  href: string
}

export const MENU: Enlace[] = [
  { etiqueta: 'Nuestros servicios', href: '/nuestros-servicios' },
  { etiqueta: 'Sumá tu coop', href: '/suma-tu-coop' },
  { etiqueta: 'Proyectos', href: '/proyectos' },
  { etiqueta: 'Nuestra Red', href: '/nuestra-red' },
  { etiqueta: 'Sobre Facttic', href: '/sobre-facttic' },
  { etiqueta: 'Contacto', href: '/contacto' },
]

export interface ColumnaPie {
  titulo: string
  href: string
  enlaces: Enlace[]
}

export const COLUMNAS_PIE: ColumnaPie[] = [
  {
    titulo: 'Nuestros servicios',
    href: '/nuestros-servicios',
    enlaces: [
      { etiqueta: 'Soluciones', href: '/nuestros-servicios#soluciones' },
      { etiqueta: 'Verticales', href: '/nuestros-servicios#verticales' },
      { etiqueta: 'Cómo trabajamos', href: '/nuestros-servicios#metodologias' },
      { etiqueta: 'Por qué FACTTIC', href: '/nuestros-servicios#por-que' },
    ],
  },
  {
    titulo: 'Sumá tu coop',
    href: '/suma-tu-coop',
    enlaces: [
      { etiqueta: 'Qué es FACTTIC', href: '/suma-tu-coop#que-es' },
      { etiqueta: 'Oportunidades', href: '/suma-tu-coop#oportunidades' },
      { etiqueta: 'Compromisos y derechos', href: '/suma-tu-coop#compromisos' },
      { etiqueta: 'Camino cooperativo', href: '/suma-tu-coop#camino' },
    ],
  },
  {
    titulo: 'Proyectos',
    href: '/proyectos',
    enlaces: [
      { etiqueta: 'Proyectos destacados', href: '/proyectos' },
      { etiqueta: 'Trabajar con FACTTIC', href: '/contacto' },
    ],
  },
  {
    titulo: 'Nuestra red',
    href: '/nuestra-red',
    enlaces: [{ etiqueta: 'Mapa federal', href: '/nuestra-red#mapa' }],
  },
  {
    titulo: 'Sobre Facttic',
    href: '/sobre-facttic',
    enlaces: [
      { etiqueta: 'Qué es FACTTIC', href: '/sobre-facttic#que-es' },
      { etiqueta: 'Modelo cooperativo', href: '/sobre-facttic#modelo' },
      { etiqueta: 'Autoridades', href: '/sobre-facttic#autoridades' },
      { etiqueta: 'Novedades', href: '/novedades' },
    ],
  },
]

export const REDES: Enlace[] = [
  { etiqueta: 'LinkedIn', href: 'https://www.linkedin.com/company/facttic' },
  { etiqueta: 'Instagram', href: 'https://www.instagram.com/facttic' },
  { etiqueta: 'YouTube', href: 'https://www.youtube.com/@facttic' },
]
