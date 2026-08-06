# Pendientes

Lo que falta de terceros para terminar el sitio. Marcar con `[x]` a medida que
llegue.

Última actualización: 06/08/2026

---

## Backend — API

### Tanda 1 (enviada)

- [x] ~~**1. GET públicos**~~ → abiertos. Las lecturas van sin credencial y
      bajaron de ~4,9s a ~0,2s, lo que además destrabó `next build`.
- [x] ~~**2. Novedades y contacto**~~ → existen los dos.
      `GET/POST /api/novedades` con `tipo` (comunicado | noticia | actividad),
      `titulo`, `bajada`, `cuerpo`, `fecha` y `file`, y paginado con `page` y
      `perPage`. `POST /api/contacto` es público y pide `nombre`, `email`,
      `mensaje` y `motivo`: el formulario ya envía contra él.
- [x] ~~**3. `POST /api/consejo`**~~ → el endpoint anda: se cargaron las cuatro
      autoridades sin problema. Lo que sigue mal es el **spec**, que declara
      `cargo` con `maxLength: 0`, `nombre` con `maxLength: 5` y un `message`
      requerido sin tipo (ver punto 7).
- [x] ~~**4. Multipart en cooperativas y consejo**~~ → aceptan `file` en POST
      y PUT. Se probó subiendo un PNG a cada uno y queda en `fileName`.
- [ ] **5. Multipart de proyectos incompleto.** No acepta `servicios`,
      `tecnologias` ni `cooperativas`, que sí están en el schema JSON.
      **Además el spec miente en el nombre del campo de imágenes**: documenta
      `imageFiles[]` y con eso responde 500 (`MulterError: Unexpected field`);
      el que funciona es `imageFiles`, sin corchetes. Lo mismo habría que
      revisar en `videoFiles`.
- [x] ~~**6. `slug` en proyectos**~~ → se genera del nombre al crear;
      verificado creando uno de prueba. **Falta migrar los que ya estaban**:
      los cuatro cargados antes del campo no lo tienen y, como es inmutable,
      un PUT no lo rellena. El sitio ya usa el slug si viene y el ObjectId si
      no, así que no bloquea.
- [ ] **7. Corregir el spec.** ~~La ruta real de archivos es
      `/api/files/{filename}`~~ → ya está bien documentada. **Queda**: el
      `POST /api/consejo` declara `cargo` con `maxLength: 0`, `nombre` con
      `maxLength: 5` y un `message` requerido sin tipo, aunque el endpoint
      acepta valores normales; y falta declarar `security` en clientes,
      consejo, organizaciones, tecnologías y users —ni siquiera en sus
      POST/PUT/DELETE—.
- [x] ~~**8. Servicio "Datos e inteligencia artificial"**~~ → cargado, ya son
      cinco.
- [x] ~~**9. Ubicación de las cooperativas**~~ → el campo `ubicacion
      {lat,lng}` existe y funciona; se probó cargándolo y leyéndolo. **No es
      un pendiente del backend sino de contenido**: está vacío en las 40, y
      con las coordenadas la provincia sale por point-in-polygon contra un
      GeoJSON del IGN. Hace falta la dirección o ciudad de cada una para
      geocodificarlas y cargarlas. ← **es lo único que traba Nuestra Red.**
- [x] ~~**10. Imagen de cooperativa**~~ → la guarda en `fileName`, igual que
      el resto de los recursos con archivo.
- [x] ~~**11. Usuario de solo lectura**~~ → ya no hace falta: con los GET
      públicos el sitio lee sin credencial.
- [ ] **12. Higiene de datos.** ~~Espacio inicial en `" Capacitación y
      consultoría"`~~ → corregido. ~~Tres formas de guardar la imagen en
      `tecnologias`~~ → unificadas en `fileName`. ~~`javaja` y las tecnologías
      con logo de marcador~~ → borradas al cargar el stack real. **Queda**
      limpiar los datos de prueba (`Cooperativa A/B/C`, `Proyecto1`), que
      borramos nosotros por API.
- [ ] **13. `createdBy`/`updatedBy`** expuestos en todas las respuestas.
- [ ] **14. Unificar la paginación.** ~~El tamaño de página no se podía
      elegir~~ → `perPage` ya se respeta en los catálogos. **Queda** que la
      forma sea la misma: los catálogos y novedades devuelven `{items,
      totalCount}` y proyectos `{items, total, page, limit, pages}`, con
      `limit` en vez de `perPage`.
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
- [ ] **21. Limpiar los proyectos de prueba.** Se cargaron tres vía API para
      poder ver el bloque de destacados de la Home. Son datos de prueba, hay que
      borrarlos cuando entren los proyectos reales:

      | Proyecto | id |
      |---|---|
      | Desarrollo de sitio web de Provincia Fondos S.A | `6a6d09bbdbeffa345bccfbe0` |
      | Skyloop Dron en Base Autónoma | `6a6d09d2dbeffa345bccfbe1` |
      | Optimización de Control de Calidad en Manufactura | `6a6d09d2dbeffa345bccfbe2` |

      No tienen imagen cargada, así que se ven con el marcador gris.
- [ ] **22. Corregir el `orden` de los sectores.** El prototipo los muestra como
      Organizaciones, Agro, Finanzas; la API los tiene cargados como Financiero
      (1), Agro (2), Organizaciones (3). El sitio respeta el `orden` de la API,
      así que se arregla desde el backoffice.
- [ ] **24. Textos de Servicios escritos por nosotros, a validar.** El diseño
      no los define y se redactaron siguiendo el tono del resto. Conviene que
      FACTTIC los revise:
      - **Subservicios de cuatro servicios** (Datos e IA, Diseño, Capacitación,
        Ingeniería), cargados en la API. Los de "Desarrollo de software" sí
        salen de la maqueta.
      - **Descripciones de "Managed Services" y "Staff Augmentation"**, que el
        carrusel de metodologías muestra en mobile.
      - **Descripciones de "Agilidad y capacidad de adaptación" y "Cada proyecto
        es nuestro"**: el prototipo solo implementa el hover de las dos
        primeras tarjetas de "¿Por qué elegirnos?".
- [ ] **25. Logos de aliados: los cargados son provisorios.** Se dieron de alta
      las tres organizaciones de la maqueta —Cooperativa Obrera, Banco Credicoop
      y Abuelas de Plaza de Mayo— con logos bajados de fuentes públicas
      (Wikimedia Commons y el sitio de Abuelas) y pasados a blanco a mano para
      que se lean sobre la tarjeta gris. **Hay que reemplazarlos por los
      oficiales**: son marcas de terceros, las versiones públicas suelen estar
      desactualizadas y el recorte del fondo se hizo por color. Confirmar además
      con FACTTIC que la lista de aliados sea esa.
- [ ] **23. Nombre corto para los servicios.** Las solapas del diseño dicen
      "Diseño", "IA y Datos", "Ingeniería e infra", mientras que las tarjetas
      usan el nombre completo. La API solo tiene el completo, así que hoy se usa
      ese en los dos lugares y las solapas quedan largas.

---

## Diseño

### Assets

- [x] ~~**Icono `08-Icono_Oportunidades-Continuidad` en JSON**~~ → llegó el 4/8
      y ya está en uso; las cuatro tarjetas de beneficio tienen su animación.
- [x] ~~**Icono `04`**~~ → no existe, es un error de numeración de la entrega.
- [ ] **`images/img_0.png` de `07-Icono_Oportunidades-Trabajo`.** El Lottie lo
      referencia y no vino. Se quitó esa capa (59×59) para que no se viera roto;
      puede faltarle un detalle al sol naranja.
- [ ] **Fondos de las páginas que no vinieron**: Sumá tu coop, Proyectos y
      Nuestra Red. La entrega trajo cinco (Home, Servicios, Sobre Facttic,
      Contacto, Error 404). **Falta también el sol naranja** que va detrás de la
      banda "¿Cuál es el modelo ideal…?" en Servicios mobile: por ahora se usa
      el de la tarjeta "Trabajo con impacto", que es la misma forma y color.
- [ ] **Logo FACT[TIC] en SVG**, en sus variantes. Se exportó del archivo a PNG
      4x y ya está en uso, pero en Figma también está insertado como imagen, así
      que el vector original hay que pedirlo aparte.
- [ ] **Imágenes en alta** de proyectos y logos de aliados y cooperativas.

### Maquetas

- [ ] **Menú mobile abierto** (overlay del hamburguesa). **Lo hacen** (4/8).
      Mientras tanto está resuelto con criterio propio.
- [x] ~~**Estados interactivos**~~ → resueltos con el lenguaje del sistema y
      puestos en `/componentes` (grupo "Estados") para que diseño los valide:
      foco de teclado con contorno lila, campo con error en rojo, avisos de
      envío en bloque de color pleno —lima el correcto, rojo el fallido, como
      las tarjetas pintadas— y sin resultados con el borde punteado de la banda
      de cierre. **Si algo no convence, se cambia ahí y se propaga solo.**
- [ ] **Breakpoint tablet.** Solo hay 1440 y 393, y no hay criterio de diseño.
      **Propuesta:** no hace falta maqueta nueva —lo adaptamos con criterio y lo
      validan— salvo que quieran algo distinto entre 768 y 1024.
- [x] ~~**Vertical Financiero**~~ → todas las verticales reúsan el mismo
      template, así que no hace falta maqueta nueva. Existen Organizaciones y
      Agro; Financiero sale del mismo molde.

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

- [ ] **26. Descripción larga de cada sector.** El modelo tiene un solo campo de
      texto y lo ocupa la frase corta del hover de la Home; la pantalla de cada
      vertical necesita otra más extensa. Hoy vive en `lib/contenido.ts`.
- [ ] **27. Inconsistencia entre las maquetas de la vertical.** En desktop la
      propuesta de valor dice "Trabajamos con compromiso · Somos parte ·
      Intercooperamos · Nos conocemos" y en mobile "Soluciones adaptadas ·
      Alcance Federal · Trabajo colaborativo · Capacitación y consultoría". Se
      tomó la de desktop, que es la que también está en el prototipo.
- [ ] **28. Textos de las verticales escritos por nosotros.** El prototipo solo
      define la descripción de "Trabajamos con compromiso"; las otras tres
      tarjetas y las descripciones largas de Agro y Financiero están redactadas
      acá y hay que validarlas.

- [ ] **29. Maqueta mobile del detalle de proyecto.** No existe en el archivo
      —hay desktop (03.A) y de mobile solo la grilla—. El orden apilado, la
      galería a una columna y la ficha en vertical son criterio propio.
- [ ] **30. Video en la galería del detalle.** La anotación del diseño pregunta
      "¿se podría incorporar video?": la API ya guarda `videoFileNames`, así que
      es decidir cómo se muestra. Queda pendiente de esa definición.

- [ ] **31. Sumá tu coop: cuatro definiciones de contenido.**
      1. Los compromisos muestran cuatro tarjetas pero la maqueta solo escribe
         dos textos y los repite: faltan los otros dos.
      2. La URL del código de conducta ("Ver Código" hoy apunta al sitio
         actual de FACTTIC).
      3. En mobile la sección de las tarjetas numeradas se titula "Tenemos
         código de conducta" —repetido de la anterior, parece error— y en
         desktop "Elegí tu camino al cooperativismo"; se usó esta última.
      4. Faltan las URLs de **Semillero** y del **Club de Formación
         Cooperativa**, que las tarjetas de "Elegí tu camino" enlazan al
         pasar el mouse; hoy las tres van a Contacto.
      5. La primera pregunta dice "¿Querés sumarte a una cooperativa?" en
         desktop y "¿Querés sumarte a FACTTIC?" en mobile; se usó la desktop,
         que es la que coincide con el texto de Semillero.

- [ ] **32. La animación del 404 no coincide con el fotograma de la maqueta.**
      `fondo-error404.json` trae toda la decoración —arco, planetas, sol lila y
      estrella naranja— pero son 161 fotogramas con los cuerpos en movimiento, y
      su composición (1000×887) los ubica en otro lugar y a otra escala que el
      instante dibujado en las maquetas. Se respetó la estructura de cada una
      —decoración arriba en mobile, al costado en desktop— y se dejó correr la
      animación. Si diseño quiere que el reposo coincida con la maqueta, hay que
      reexportarla.

- [ ] **33. Contacto: color de la animación y copy de un motivo.**
      1. `fondo-contacto.json` no tiene ninguna capa naranja —su círculo grande
         es violeta— pero las dos maquetas dibujan un resplandor naranja. Se usa
         la animación tal como vino.
      2. El tercer motivo dice "Quiero formar una coope" en desktop y "…una
         cooperativa" en mobile. Va la corta, que es la que entra en la fila de
         desktop y hace juego con "Quiero sumar mi coope".
      3. Falta una dirección de correo de contacto para ofrecer como
         alternativa cuando el envío falla.

- [ ] **34. Sobre Facttic.**
      1. **Las tres cooperativas de prueba** ("Cooperativa A/B/C") ahora se
         listan en público, mezcladas con las 37 reales que se cargaron desde
         la maqueta. Conviene borrarlas —es parte del ítem 12—.
      2. **Autoridades**: se cargaron las dos de la maqueta —Manuel Leiva y
         Cecilia Muñoz Cancela—. Faltan las demás y toda la Sindicatura, cuya
         solapa no se muestra hasta que haya alguien.
      3. **¿A dónde linkea cada cooperativa?** La anotación pide que la lista
         "linkee a la página de cada coop", pero en el prototipo esos nombres
         no tienen enlace —al hacer clic no pasa nada y no se resalta ninguna
         zona activa— y en el archivo no hay ninguna pantalla de cooperativa.
         Por cómo está redactada parece ser el sitio propio de cada una, que
         sería un enlace externo; el modelo no tiene ese campo. Hoy llevan a
         Nuestra Red. Hace falta definir el destino y, si es el sitio propio,
         agregar el campo y cargarlo.
      4. **La foto del plenario en alta**: se recortó de la maqueta mobile, así
         que va a 393 de ancho y se ve blanda a pantalla completa.
      5. **Los logos de "Somos parte de otros espacios cooperativos"**: la
         maqueta muestra Cooperar, patio, un centro cultural y mut_, pero el
         recurso `organizaciones` hoy tiene los aliados de la Home. Confirmar
         si son la misma lista o hacen falta dos.

- [x] ~~**35. La API era demasiado lenta para compilar**~~ → resuelto con los
      GET públicos: sin el login de por medio las lecturas tardan ~0,2s y
      `next build` pasa a 9 segundos.
- [ ] **Doc con la información de las cooperativas.** Diseño lo mencionó el 4/8
      ("ese contenido está en el doc"). Si trae la provincia de cada una,
      **desbloquea Nuestra Red sin esperar al backend**: se cargan por el
      backoffice y el mapa sale de ahí. Es el mismo dato del ítem 9.
- [ ] **Aclaración pendiente sobre el mapa.** La consulta por los "ids" salió de
      la lista del backend, no de la de diseño: los ids eran los de los proyectos
      de prueba a borrar (ítem 21). Del mapa lo único que hace falta es la
      provincia de cada cooperativa.

### Decisiones de contenido

- [ ] **"Finanzas" vs "Financiero".** El Home dice una cosa, Nuestros servicios
      otra, y la API tiene cargado "Financiero". Hay que elegir uno.
- [ ] **Lorem ipsum en Proyectos - Detalle**, en el bloque "¿De qué se trató?".
- [x] ~~**¿Dónde entra Comunicados?**~~ → se entra solo desde el footer, como
      está hoy.
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
