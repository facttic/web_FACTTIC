<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sitio FACTTIC

Web pública + backoffice. El diseño está en Figma (`Facttic_ Web`) y exportado en
`Material/`. La API ya existe; lo que falta de terceros está en `PENDIENTES.md`.

## Antes de construir una pantalla

1. **Leer las anotaciones del archivo de Figma** —las etiquetas verdes de
   "Desarrollo", que no son los comentarios— de esa pantalla, en las páginas
   Desktop y Mobile. Llevan animaciones y decisiones que no se ven en el PNG.
   Saltearse esto ya obligó a rehacer trabajo. En `PENDIENTES.md` está la lista
   de las que quedan por leer.
2. **Mirar la maqueta mobile además de la desktop.** No son la misma página
   reacomodada: cambian el orden de las secciones, la forma de varios bloques y
   parte del copy. En la Home, mobile suma una línea al título del hero y
   renombra dos secciones enteras.
3. **Componer con lo que ya existe** (`components/ui`, `tarjetas`, `secciones`).
   El catálogo se ve en `/componentes`.

## Medidas: de dónde salen

Los SVG de `Material/desktop/` son la fuente exacta, no una referencia: cada
rect declara tamaño, radio, relleno y opacidad. Extraerlos de ahí antes de
estimar a ojo. Las maquetas mobile son PNG, así que ahí se mide sobre la imagen.

`herramientas/medir.py` levanta un Chrome headless al ancho real, mide el DOM y
saca capturas de página completa. La extensión del browser **no** sirve para
esto: dice que redimensiona pero no cambia el viewport.

## Trampas conocidas

- **Clases nuevas de Tailwind no aparecen sin reiniciar.** Si se usa una utilidad
  que no existía en el proyecto, el dev server no regenera el CSS: la clase queda
  en el DOM sin regla y el estilo no aplica, lo que parece un error de lógica.
  Hay que matar el server, borrar `.next` y arrancar de nuevo —en ese orden, o
  Turbopack deja el índice corrupto—.
- **Toda utilidad tipográfica nueva va también a `lib/cn.ts`.** Si no,
  tailwind-merge la toma por una clase de color y la descarta.
- **`group-hover:` no alcanza al elemento que lleva `group`.** Para pintar la
  propia tarjeta va `hover:`.
- **Los datos vienen cacheados una hora** (`revalidate: 3600` en `lib/datos/`).
  Después de tocar contenido por API hay que reiniciar para verlo.
- **El token de la API dura 15 minutos.** Un `curl` sin `-i` devuelve 401 sin que
  se note y parece que la escritura funcionó.

## Cómo está organizado

- `lib/api/` transporte, `lib/dominio/` traducción, `lib/datos/` lo único que
  importan las vistas. Si la API cambia, se toca `adaptadores.ts` y nada más.
- `lib/contenido.ts` los textos fijos, incluidas las variantes mobile.
- `app/globals.css` los tokens y la escala tipográfica, relevados del archivo de
  Figma.
