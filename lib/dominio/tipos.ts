/**
 * Modelo de dominio del sitio.
 *
 * Esto es lo que consumen las vistas. A propósito NO se parece a lo que
 * devuelve la API: no hay `_id`, ni referencias sin resolver, ni nombres de
 * archivo sueltos. Todo llega ya resuelto y con nombres del negocio.
 *
 * La traducción vive en `lib/dominio/adaptadores.ts`. Cuando la API cambie
 * —y va a cambiar: hay slug, provincia, logo de cooperativa y novedades
 * pedidos al backend— se toca el adaptador y estos tipos siguen igual, así que
 * ninguna vista se entera.
 */

/** Referencia mínima a otra entidad, ya resuelta. */
export interface Referencia {
  id: string;
  nombre: string;
}

export interface Servicio extends Referencia {
  descripcion: string | null;
  orden: number;
  subservicios: { nombre: string; descripcion: string | null }[];
}

export interface Sector extends Referencia {
  /** Identificador para la URL de la vertical. */
  slug: string;
  descripcion: string | null;
  orden: number;
  /** URL lista para usar en un `<img>`, o null si no hay imagen cargada. */
  imagen: string | null;
  /** URL de la animación Lottie del sector, si tiene. */
  animacion: string | null;
}

export interface Tecnologia extends Referencia {
  logo: string | null;
}

export interface Cooperativa extends Referencia {
  asociados: number;
  ubicacion: { lat: number; lng: number } | null;
  /**
   * Hoy se deriva de la ubicación; cuando el backend agregue el campo, el
   * adaptador lo toma de ahí sin que cambie nada más.
   */
  provincia: string | null;
  logo: string | null;
  servicios: Referencia[];
  sectores: Referencia[];
}

export interface Autoridad extends Referencia {
  cargo: string;
  cooperativa: Referencia | null;
}

export interface Organizacion extends Referencia {
  logo: string | null;
}

export interface Proyecto extends Referencia {
  /** Se usa en la URL. Hoy es el id; pasa a ser el slug real cuando exista. */
  slug: string;
  cliente: Referencia | null;
  sector: Referencia | null;
  servicios: Referencia[];
  tecnologias: Tecnologia[];
  cooperativas: Referencia[];
  desafio: string | null;
  solucion: string | null;
  resultado: string | null;
  destacado: boolean;
  /** Portada ya resuelta a URL servible. */
  portada: string | null;
  imagenes: string[];
  videos: string[];
  fecha: string | null;
}

/** Página de resultados, con la forma que usan las vistas. */
export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  porPagina: number;
  paginas: number;
}

/** Filtros de la grilla de proyectos, en términos del sitio. */
export interface FiltrosProyectos {
  pagina?: number;
  porPagina?: number;
  busqueda?: string;
  sector?: string;
  servicio?: string;
  tecnologia?: string;
  cooperativa?: string;
  destacado?: boolean;
}

/** Tipos de novedad, en el orden en que el diseño los lista. */
export type TipoNovedad = "comunicado" | "noticia" | "actividad";

export interface Novedad {
  id: string;
  slug: string;
  tipo: TipoNovedad;
  titulo: string;
  bajada: string | null;
  cuerpo: string | null;
  /** ISO, para el `datetime` del `<time>`. */
  fecha: string | null;
  imagen: string | null;
}
