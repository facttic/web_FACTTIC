# Pendientes

Lo que falta de terceros para terminar el sitio. Marcar con `[x]` a medida que
llegue.

Última actualización: 31/07/2026

---

## Backend — API

### Tanda 1 (enviada)

- [ ] **1. GET públicos.** Hoy los 9 recursos devuelven 401 sin JWT, y las
      imágenes también. Mientras tanto el sitio usa la credencial `admin`
      guardada en `.env.local`, solo del lado del servidor.
- [ ] **2. Recurso de novedades** (tipo comunicado/noticia/actividad, título,
      bajada, cuerpo, imagen, fecha) y **endpoint de contacto** (nombre, email,
      mensaje, motivo). Son dos pantallas maquetadas sin backend.
- [ ] **3. Bug en `POST /api/consejo`.** El schema pide `cargo` con
      `maxLength: 0`, `nombre` con `maxLength: 5` y un `message` requerido sin
      tipo. **Bloquea el ABM de autoridades.**
- [ ] **4. Multipart en cooperativas y consejo.** Hoy no aceptan archivos: no
      hay forma de cargar el logo de una cooperativa ni la foto de una autoridad.
- [ ] **5. Multipart de proyectos incompleto.** No acepta `servicios`,
      `tecnologias` ni `cooperativas`, que sí están en el schema JSON.
- [ ] **6. `slug` en proyectos**, para no tener URLs con ObjectId.
- [ ] **7. Corregir el spec.** La ruta real de archivos es
      `/api/files/{filename}`, no `/files/{filename}`. Y falta declarar
      `security` en clientes, consejo, organizaciones, tecnologías y users —ni
      siquiera en sus POST/PUT/DELETE.
- [ ] **8. Cargar el servicio "Datos e inteligencia artificial".** La maqueta
      muestra 5 solapas y la API tiene 4.

### Tanda 2 (enviada)

- [ ] **9. `provincia` en cooperativa, o `ubicacion` cargada.** ← **bloquea
      Nuestra Red.** Ninguna de las 3 cooperativas tiene ubicación.
- [ ] **10. Campo `logo` en cooperativa.** El punto 4 cubre la subida, no el campo.
- [ ] **11. Usuario de solo lectura** para el front.
- [ ] **12. Higiene de datos**: espacio inicial en `" Capacitación y
      consultoría"`; tres formas distintas de guardar la imagen en
      `tecnologias`; URLs guardadas en `http://`; sectores sin `descripcion`;
      datos de prueba a limpiar (`javaja`, `Cooperativa A/B/C`, `Proyecto1`).
- [ ] **13. `createdBy`/`updatedBy`** expuestos en todas las respuestas.
- [ ] **14. Unificar la paginación** entre proyectos y el resto.
- [ ] **15. Token de 15 minutos**: extenderlo o permitir `refresh-token` sin cookie.
- [ ] **16. `cache-control`** en las respuestas, para cachear en CDN.
- [ ] **17. CORS**: hoy refleja cualquier `Origin` con `allow-credentials: true`.
- [ ] **18. Consulta**: campo `verticales` no documentado en cooperativa, que
      convive con `sectores`. ¿Cuál se usa?

### Nuevos (sin enviar)

- [ ] **19. Borrar las imágenes de sector cargadas en el backoffice.** Son fotos
      de stock ajenas a la identidad (una de "RISK", otra de un diagrama de red
      genérico). Ahora quedan tapadas por las animaciones de diseño, pero
      conviene sacarlas.
- [ ] **20. Cargar `lottieFileName` en los sectores.** El modelo ya tiene el
      campo y diseño entregó las animaciones. Mientras tanto se sirven desde el
      repo y se resuelven por nombre de sector.
- [ ] **21. Marcar algún proyecto como destacado.** El bloque de destacados de
      la Home no aparece porque ningún proyecto tiene `esDestacado`.
- [ ] **22. Corregir el `orden` de los sectores.** El prototipo los muestra como
      Organizaciones, Agro, Finanzas; la API los tiene cargados como Financiero
      (1), Agro (2), Organizaciones (3). El sitio respeta el `orden` de la API,
      así que se arregla desde el backoffice.
- [ ] **23. Nombre corto para los servicios.** Las solapas del diseño dicen
      "Diseño", "IA y Datos", "Ingeniería e infra", mientras que las tarjetas
      usan el nombre completo. La API solo tiene el completo, así que hoy se usa
      ese en los dos lugares y las solapas quedan largas.

---

## Diseño

### Assets

- [ ] **Icono `08-Icono_Oportunidades-Continuidad` en JSON.** Vino solo el GIF
      (2,2 MB) y por eso la card "Continuidad de trabajo" es la única sin
      animación.
- [ ] **Icono `04`.** La numeración de la entrega salta de 03 a 05. ¿Existe?
- [ ] **`images/img_0.png` de `07-Icono_Oportunidades-Trabajo`.** El Lottie lo
      referencia y no vino. Se quitó esa capa (59×59) para que no se viera roto;
      puede faltarle un detalle al sol naranja.
- [ ] **Fondos de las páginas que no vinieron**: Sumá tu coop, Proyectos y
      Nuestra Red. La entrega trajo cinco (Home, Servicios, Sobre Facttic,
      Contacto, Error 404).
- [ ] **Logo FACT[TIC] en SVG**, en sus variantes. Se exportó del archivo a PNG
      4x y ya está en uso, pero en Figma también está insertado como imagen, así
      que el vector original hay que pedirlo aparte.
- [ ] **Imágenes en alta** de proyectos y logos de aliados y cooperativas.

### Maquetas

- [ ] **Menú mobile abierto** (overlay del hamburguesa). No aparece en las
      páginas Desktop ni Mobile del archivo; se resolvió con criterio propio.
- [ ] **Estados interactivos**: hover/focus/active de botones y tarjetas,
      formulario de contacto con validación, error y éxito, y empty state de los
      filtros de Proyectos.
- [ ] **Breakpoint tablet.** Solo hay 1440 y 393.
- [ ] **Vertical Financiero.** Hay maquetas de Organizaciones y Agro. ¿Reusa el
      template de Agro o tiene diseño propio?

### Anotaciones del archivo pendientes de definir

Las anotaciones verdes de "Desarrollo" en Figma —distintas de los comentarios—
llevan indicaciones de implementación. Estado de las encontradas:

- [ ] **"Habrá que poner máximo de caracteres a los títulos"** (board
      Componentes). **Falta definir el número.** Por ahora los títulos de
      proyecto se acotan a dos líneas para que no desalineen la grilla, pero
      convendría validarlo también en el backoffice al cargar.
- [ ] **Revisar las anotaciones del resto de las pantallas.** Se leyeron las de
      la Home y las del board de Componentes; faltan Proyectos, Sumá tu coop,
      Nuestra Red, Sobre Facttic, Comunicados, Contacto y 404.
- [x] ~~"Animación de conteo"~~ (Red contador) → implementado.
- [x] ~~"Acá va un video"~~ (hero) → implementado con el video de Drive.
- [x] ~~"Efecto typewriter"~~ (hero) → implementado.
- [x] ~~"Scroll reveal"~~ (hero) → implementado.
- [x] ~~"`<h1>` con clase `.display`"~~ (hero) → ya se cumplía.

### Decisiones de contenido

- [ ] **"Finanzas" vs "Financiero".** El Home dice una cosa, Nuestros servicios
      otra, y la API tiene cargado "Financiero". Hay que elegir uno.
- [ ] **Lorem ipsum en Proyectos - Detalle**, en el bloque "¿De qué se trató?".
- [ ] **¿Dónde entra Comunicados?** Tiene dos pantallas maquetadas pero no está
      en el menú, solo en el pie bajo "Sobre Facttic → Novedades".
- [ ] **El mapa del sitio (`Propuesta B.2.pdf`) contradice a las maquetas.** Su
      menú usa nombres viejos ("Para empresas", "Para cooperativas", "Red"). O se
      actualiza o se descarta como referencia.
- [ ] **Copys definitivos** de las páginas que todavía no se construyeron.

---

## Resueltos

- [x] ~~Tipografías del diseño~~ → Inter y DM Mono, leídas del archivo de Figma.
- [x] ~~Paleta y escala tipográfica~~ → relevadas y verificadas una por una.
      El "Rojo" era `#FF6B7A`, no el `#D80027` que aparentaba en las maquetas.
- [x] ~~Maquetas desktop de Nuestra red y Sobre Facttic~~ → existían en Figma,
      solo no se habían exportado.
- [x] ~~Mapa de Argentina en SVG con ids por provincia~~ → se resuelve con
      GeoJSON público, no hace falta el asset.
- [x] ~~Video del hero~~ → entregado en Drive, en sus dos cortes.
- [x] ~~Ilustraciones de sectores y beneficios~~ → entregadas como Lottie.

---

## Cómo seguir cuando llegue cada cosa

Casi todo lo del backend se absorbe en un solo archivo: ver la tabla de
`lib/README.md`, que dice qué tocar ante cada cambio de la API. Los assets van a
`public/animaciones/` y `public/video/`, y se referencian desde
`lib/animaciones.ts`.
