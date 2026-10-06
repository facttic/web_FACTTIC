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
- [ ] **5. Multipart de proyectos incompleto.** `servicios`, `tecnologias` y
      `cooperativas` **dependen de cuántos valores se manden**: con dos o más
      partes del mismo nombre se guardan bien, pero con una sola el validador
      responde `400 invalidType — Expected array, received string`, porque el
      parser de formularios solo arma un array cuando el campo se repite. Un
      proyecto con un único servicio es lo más común, así que en la práctica no
      se puede usar.
      **Además el spec miente en el nombre del campo de imágenes**: documenta
      `imageFiles[]` y con eso responde 500 (`MulterError: Unexpected field`);
      el que funciona es `imageFiles`, sin corchetes. Lo mismo habría que
      revisar en `videoFiles`.

      Mientras tanto el backoffice guarda los proyectos en dos pasos: los datos
      y las relaciones por JSON, y las imágenes en un PUT multipart aparte, que
      deja lo demás intacto. Si esto se arregla, se puede volver a un solo
      envío.

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
- [x] ~~**9. Ubicación de las cooperativas**~~ → **las 37 cargadas**, a partir
      de la ciudad que indicó FACTTIC. Dan nueve provincias: CABA (12), Buenos
      Aires (11), Santa Fe (7), Córdoba (2), y una cada una en Tucumán,
      Neuquén, Chaco, Entre Ríos y Río Negro.

      Dos cosas por confirmar:
      1. **Boot Coop, Nayra y Proyecto wow** se indicaron como "BsAs", escrito
         distinto de "CABA" en el resto de la lista, así que se tomaron como
         provincia de Buenos Aires y llevan el punto de La Plata. Si son de la
         ciudad, hay que corregirlas —CABA pasaría a 15—.
      2. **El material de FACTTIC dice "+10 provincias" y son nueve.** La Home
         muestra el número derivado de los datos, así que hoy dice nueve. O
         falta cargar alguna cooperativa, o hay que corregir el número.

      Las coordenadas son las de la ciudad, no la dirección exacta: alcanzan
      para agrupar por provincia, que es lo que hace el mapa.

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
- [ ] **13 bis. Los archivos se guardan con el nombre original y se pisan entre
      sí.** `POST /api/files` deja el archivo en `/api/files/{nombre original}`,
      sin prefijo ni hash, y sin avisar si ya existía: subir un `logo.png` a una
      cooperativa reemplaza el `logo.png` de otro recurso cualquiera, y el
      registro anterior pasa a mostrar la imagen nueva. Nos pasó: una prueba con
      un `p.png` sobrescribió el que usaban "Cooperativa A" y una autoridad del
      consejo. Hace falta que el backend genere un nombre único al guardar.
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
- [x] **19 bis. `destacado` en servicios.** Desde el backoffice, una cooperativa
      puede dar de alta un servicio propio mientras completa su ficha. Hoy
      `GET /api/servicios` es una lista sola, así que todo lo que se cree cae
      igual en la vitrina de FACTTIC: las solapas de la Home, el bloque
      "Soluciones" de Nuestros servicios y el filtro de Proyectos. Con dos
      cooperativas cargando su vocabulario, esos tres lugares se llenan de
      variantes del mismo servicio.

      **Acordado:** el backend agrega `destacado` a `Servicio`. Los destacados
      son el catálogo de la federación y son los únicos que salen en la Home y
      en Nuestros servicios; el resto queda como especialidad de esa
      cooperativa, visible en su ficha y en el panel de provincia de Nuestra
      Red. Conviene que solo la federación pueda marcarlo: si lo marca quien
      crea el servicio, el filtro no sirve de nada.

      **Hecho.** El campo existe y está en producción (`esDestacado`, verificado
      el 6/10/2026): los cinco del catálogo vienen en `true`. En el sitio,
      `getServiciosDestacados()` es lo que usan la Home, Nuestros servicios y el
      filtro de Proyectos; el ABM muestra la columna y la casilla, que solo
      escribe quien es admin. Lo que crea una cooperativa sigue viéndose donde
      corresponde: en su ficha y en el panel de provincia de Nuestra Red, que
      leen los servicios de la propia cooperativa y no el catálogo.

      Los **sectores** siguen la misma regla: `getSectoresDestacados()` en la
      Home, en Nuestros servicios y en el filtro de Proyectos.

- [ ] **44. Clientes y tecnologías por cooperativa** → **MR !7**
      (`clientes-y-tecnologias-por-cooperativa`), sin mergear. Una cooperativa
      ya podía crearlos al vuelo desde el formulario de un proyecto, pero no
      corregirlos: el PUT pedía `admin:all`, así que un nombre mal escrito había
      que pedírselo a la Federación. El MR les pone la misma regla que a
      sectores y servicios: quedan a nombre de quien los crea, cada cooperativa
      edita los suyos, y lo que no tiene dueño es del catálogo común.

      **Cuando se mergee y despliegue**, del lado del sitio es sumar
      `/admin/clientes` y `/admin/tecnologias` a `DE_LAS_COOPERATIVAS` en
      `components/admin/secciones.ts` y filtrar los dos listados por
      `cooperativa`, igual que hacen hoy sectores y servicios. Antes de eso no,
      o cada "Editar" termina en 403.

- [ ] **43. Optimizar las imágenes del contenido.** Las portadas se sirven
      crudas, como las sube el backoffice. Medido el 6/10/2026 sobre lo que
      publica Proyectos: tres miniaturas que se dibujan a ~391px de ancho pesan
      **1,8 MB** entre las tres. La peor es una foto de celular sin tocar
      —3024x4032, 867 KB— mostrada en una caja de 391x310: sesenta veces los
      píxeles que se ven. Reescaladas a 400px y en WebP dan **33 KB en total**,
      un 98% menos.

      Dos caminos, no excluyentes:
      1. **`next/image`**: pide `images.remotePatterns` con el host de la API y
         convertir unos diez `<img>`. Da `srcset` por ancho, AVIF/WebP y
         reserva de espacio —menos CLS—. El trabajo real es que varias usan
         `object-cover` en posición absoluta y hay que pasarlas a `fill`
         revisando el recorte en los dos anchos.
      2. **Achicar al subir**, desde el backoffice. Ataca el grueso sin tocar
         las vistas, pero no da `srcset` ni formato moderno.

### Nuevos (sin enviar)

- [ ] **41. Filtrar proyectos por "sector que no es del catálogo".** El filtro
      de sectores de Proyectos muestra las tres verticales de la Federación más
      "Otros", y "Otros" es `sinSector=true`: los proyectos que **no tienen**
      sector. Cuando una cooperativa cargue un proyecto con un sector propio,
      ese proyecto no va a caer en ninguna opción del filtro —se lo encuentra
      por cooperativa, por búsqueda o en la lista completa, pero no por sector—.
      Alcanzaría con que `GET /api/proyectos` acepte algo como
      `sectorNoDestacado=true`, o que `sector` admita varios ids. Hoy no
      molesta: los tres sectores cargados son todos destacados.

- [ ] **40. Rotar la clave del correo.** Las credenciales de Gmail estaban
      escritas en `resources/auth/helpers/send-email.js`, versionadas en claro.
      El MR !3 las sacó del código y hoy salen de `config.email`, que lee
      `EMAIL_USER` y `EMAIL_PASS_APP` —no `SMTP_USER`/`SMTP_PASS`, que fue el
      primer nombre y quedó atrás en dos commits posteriores de `dev`—. Están
      **cargadas en el servidor y andan**: la invitación de prueba llegó.

      Cuidado con una cosa: `config.email` tiene valores por omisión
      (`your-email@gmail.com`), así que si las variables faltan el envío ya no
      falla con `emailNotConfigured`, lo intenta con una cuenta inventada y se
      pierde en silencio.

- [ ] **42. `DOMAIN_HOST` en el servidor de la API.** Sin esa variable,
      `config.domain` cae a `http://localhost` y **el botón del correo de
      invitación apunta ahí**: la invitación que recibió Emi el 6/10/2026 era
      inservible. Hay que cargar `DOMAIN_HOST=https://facttic-web.vercel.app`,
      sin barra final —el enlace se arma como `${DOMAIN_HOST}/admin/...` y la
      variable alimenta además el CORS, que compara contra un `Origin`, que
      nunca la lleva—. De ahí sale también la dirección del logo del correo.

      Quedan dos cosas: **la clave vieja sigue en el historial del
      repositorio**, así que hay que rotarla desde la cuenta de Gmail si no se
      hizo —tener la variable cargada no la invalida—; y **probar que la
      invitación llega**, mandando una desde la ficha de una cooperativa a una
      casilla propia. Hasta que eso se verifique, nadie sabe si el correo sale.

      El **aspecto** del correo está en el **MR !6** (`correo-de-invitacion`,
      contra `dev`), sin mergear: le da la identidad del sitio a la invitación
      —era la plantilla genérica del scaffold— y arregla dos cosas rotas. El
      logo se pedía a `/api/public/logo.webp`, que da 404 en los dos dominios,
      así que **los tres correos llegaban con la imagen rota**; y la invitación
      mostraba una caja vacía rotulada "Código de verificación", heredada de
      los correos de registro, cuando acá el token viaja en el enlace.

- [ ] **36. Usuarios por cooperativa.** El plan es que cada coop pueda darse de
      alta sus propios sectores y servicios —los que no son del catálogo de la
      Federación— y asignárselos. Hoy no se puede: el usuario de la API tiene
      solo `_id`, `username` y `email`, sin rol ni vínculo con una cooperativa,
      así que cualquiera que entre al backoffice edita el catálogo entero. Hace
      falta que el backend agregue el vínculo y los permisos; recién ahí se
      puede armar la pantalla en `/admin`.

      **Resuelto por el MR !3** (`editores-por-cooperativa`), mergeado a `dev` y
      en producción: el permiso sale de la lista de mails de cada cooperativa y
      se consulta en cada pedido. El panel ya filtra lo que ve cada quien y la
      Federación invita por correo desde la ficha.

      Lo que faltaba —que cada cooperativa pueda dar de alta sus propios
      **sectores**— entró con el **MR !5** (`sectores-por-cooperativa`),
      mergeado a `dev`: abre `POST /sectores` a quien edita alguna cooperativa,
      fuerza `esDestacado` en falso, deja el sector a nombre de su cooperativa y
      reserva imagen y animación para la Federación. El panel ya lo usaba, así
      que no hubo nada que tocar del lado del sitio.

      **Falta probarlo con una cuenta de cooperativa**: desde afuera no se puede
      distinguir si el servidor ya tomó el merge —la ruta responde 401 sin token
      en las dos versiones—. La prueba es entrar al panel con un editor de
      cooperativa y crear un sector al vuelo desde el formulario de proyectos:
      si responde 403, falta desplegar.

- [x] ~~**38. `sinSector` en `GET /api/proyectos`.**~~ → mergeado y en
      producción. Verificado el 6/10/2026 contra la API: sin el parámetro
      devuelve 10 proyectos y con `?sinSector=true`, 7.

- [ ] **39. Traducciones del contenido al inglés.** La API ya acepta
      `traducciones.en` en proyectos, sectores, servicios y novedades (MR !2,
      mergeado), y el backoffice muestra cada campo con su par en inglés. Falta
      **escribir los textos**: hasta que se carguen, el sitio en inglés muestra
      el español campo por campo.

      Los subservicios ya se editan en inglés en el mismo formulario, y las
      secciones tienen dirección propia (`/en/projects`). Lo que sigue en
      español en los dos idiomas son los **slugs** de proyectos y verticales,
      para no romper las direcciones que ya circulan.

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
- [ ] **24. Textos de Servicios: queda un renglón.** El documento de contenido
      del 27/8 trajo los de metodologías y los dos motivos que faltaban, así que
      ya no son nuestros. Sigue sin validar: - **Subservicios de cuatro servicios** (Datos e IA, Diseño, Capacitación,
      Ingeniería), cargados en la API. Los de "Desarrollo de software" sí
      salen de la maqueta. El documento los lista con diferencias: dice `ML`
      donde la API guarda "Modelos de lenguaje" —que además está mal, ML es
      machine learning— y "Diseño UI/UX" donde la API tiene "UX/UI".
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

- [ ] **36. Novedades: contenido y filtro.** 1. Las cuatro cargadas son **de ejemplo**, redactadas a partir de los
      títulos de la maqueta para poder ver la pantalla. Hay que reemplazarlas
      por las reales. 2. Las portadas son provisorias. El archivo solo dibuja dos imágenes —la
      foto del plenario y el arte de "Crónicas del porvenir"—, así que esas
      dos se recortaron de la maqueta mobile (van a 346px de ancho y se ven
      blandas a tamaño completo) y las otras dos se generaron con la paleta
      de la identidad para que la grilla no quedara repetida. Hacen falta
      las reales. 3. `GET /api/novedades` **no filtra por `tipo`**: el sitio trae de más y
      filtra en el front. Con un `?tipo=` se resolvería en la consulta. 4. `fecha` exige un ISO completo con hora: `2025-11-04` responde 400
      (`invalidString`). Conviene aceptar la fecha sola o documentarlo.

- [ ] **37. Datos de las cooperativas para Nuestra Red.** 1. **`asociados`, `servicios` y `sectores` están cargados con datos
      inventados** para poder ver la pantalla: el panel de provincia muestra
      cuántas cooperativas y asociadxs hay, y qué industrias y servicios
      concentra. Hay que reemplazarlos por los reales. 2. **El sitio web ya es un campo de la cooperativa** (MR !4 de la API,
      mergeado a `dev` y en producción desde el 6/10/2026), y con él
      descripción, correo, teléfono, año de fundación y redes. El formulario
      del panel ya los manda con esos nombres, así que lo que se guarde
      ahora persiste. Falta que cada cooperativa los cargue: hasta entonces
      el enlace sale de la tabla de reserva `lib/datos/sitios-cooperativas.ts`,
      armada con lo que FACTTIC publicaba en su sitio anterior —18 de 37—.
      Cuando estén cargados, esa tabla se borra. 4. **Sin ubicación una cooperativa no aparece en ninguna parte**: Nuestra
      Red agrupa por provincia y la provincia se calcula con las
      coordenadas. Hoy las 33 la tienen; el panel además la exige al
      guardar, para que una ficha nueva no quede invisible. 3. ~~**Ninguna cooperativa tiene logo cargado.**~~ Ya están las 33, igual
      que la ubicación: Nuestra Red se dibuja completa.

---

## Diseño

### Assets

- [x] ~~**Icono `08-Icono_Oportunidades-Continuidad` en JSON**~~ → llegó el 4/8
      y ya está en uso; las cuatro tarjetas de beneficio tienen su animación.
- [x] ~~**Icono `04`**~~ → no existe, es un error de numeración de la entrega.
- [ ] **`images/img_0.png` de `07-Icono_Oportunidades-Trabajo`.** El Lottie lo
      referencia y no vino. Se quitó esa capa (59×59) para que no se viera roto;
      puede faltarle un detalle al sol naranja.
- [ ] **Fondos de las páginas que no vinieron**: Sumá tu coop, Proyectos,
      Nuestra Red y Comunicados. La entrega trajo cinco (Home, Servicios, Sobre Facttic,
      Contacto, Error 404). El que más se nota es el **resplandor azul** detrás
      de la banda "Cada cooperativa que se suma…" del board mobile de Sumá tu
      coop, que hoy queda sin fondo. (El sol naranja de la banda "¿Cuál es el
      modelo ideal…?" ya no hace falta: el board nuevo dejó ese bloque liso.)
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

### Revisión de la vista mobile (agosto/septiembre 2026)

El archivo de Figma cambió bastante en mobile y se está rehaciendo pantalla por
pantalla contra las maquetas exportadas de `Material/mobile/`. **La Home,
Nuestros servicios, las verticales, Sumá tu coop, Proyectos, el detalle de
proyecto, Nuestra red, Sobre FACTTIC, Contacto, Comunicados, el detalle de
Comunicados y el 404 ya están**: la revisión mobile está completa. Lo que sigue
son las preguntas de abajo.

Lo que salió de la Home y vale para todo el sitio:

- Los títulos de sección en mobile van en `H2/Mobile` (26px), no en 34.
  Resuelto en `EncabezadoSeccion` con `text-h2 md:text-h1`.
- Entre el pie de una sección y el rótulo de la siguiente hay 54-62px, no 96:
  `Seccion` pasó a `py-7 md:py-16`.
- La barra superior mide 68 en mobile —no 90—, el ícono del menú es de 42x26 y
  no hay separador punteado abajo.
- El botón del hero mide 60 de alto en mobile; en desktop sigue en 53.
- Las redes del pie van en blanco pleno y a 18px, igual que el ©.

De **Nuestros servicios** salió además:

- El hero de la pantalla usa `P1/Bold` —DM Mono 16— para la bajada, no los 18
  de `P1/Regular`. Confirmado en el inspector de Figma.
- La banda "¿Cuál es el modelo ideal…" ya no va sobre el sol naranja ni
  alineada a la izquierda: el board la deja punteada y centrada como las otras,
  con el título un escalón más chico.
- "¿Cómo trabajamos?" en mobile es una tarjeta pintada con el color de la
  modalidad y las flechas debajo, no una solapa con subrayado.
- Las tarjetas de "¿Por qué elegirnos?" van sobre el fondo de la página con
  borde blanco pleno, no en gris.
- El mazo de sectores muestra la misma cara que en la Home y de las tapadas
  asoman 37px, sin texto.

De las **verticales** salió además:

- "¿Cómo trabajamos?" se dibuja **distinto en cada pantalla**: tarjeta pintada
  en Nuestros servicios y solapa subrayada acá. Por eso `secciones/metodologias`
  tiene las dos variantes; no es una sola con un ajuste.
- La sección "¿Por qué elegirnos?" lleva bajada en mobile aunque el prototipo
  de desktop vaya directo del título a las tarjetas.
- Las tarjetas del stack miden 160x82 en mobile y 180x90 en desktop.

De **Sumá tu coop** salió además:

- El título del hero va en `H1/Mobile` (34) y no en el display, y el sol con su
  órbita —que en el código estaba solo en desktop— también va en mobile, de 196
  arriba a la derecha.
- "Elegí tu camino al cooperativismo" es un carrusel de una tarjeta por vez,
  pintada y con la explicación y el enlace a la vista; no las tres apiladas y
  cerradas.
- Los compromisos van en `H3/Mobile` y con el texto a 48 del borde de arriba.

De **Proyectos** salió además:

- La tarjeta de proyecto tiene **dos caras distintas en mobile**: la del
  carrusel de destacados —imagen de 204, título y etiquetas— y la del listado
  —imagen de 276 y solo el título, sin etiquetas—. De ahí el prop `caraMobile`.
- En "Últimos proyectos" el nombre va en la sans en negrita en mobile y en mono
  en la tabla de desktop.

Del **detalle de proyecto** salió además:

- La portada arranca pegada al borde de arriba —por detrás de la barra— y mide
  488 con las esquinas de abajo redondeadas.
- La ficha se resuelve con dos etiquetas arriba del título y la lista de
  servicios debajo; los rótulos "Sector"/"Servicios"/"Cliente" son de desktop.
- "Stack tecnológico" y "Cooperativas" van como tarjetas con isologo de 184x92
  en una fila que se desplaza, sin las líneas punteadas.
- La galería va **antes** del stack, y "Últimos proyectos" no existe en mobile:
  la pantalla cierra con los relacionados, que ahí son un carrusel con flechas.

De **Nuestra red** salió además:

- El panel de la provincia se apoya **encima** del mapa, tapándole el tercio de
  abajo; no va debajo. El mapa mide 607 de alto y va centrado.
- Las solapas de provincia llevan flechas a la derecha, por encima de la línea.
- Las tarjetas de cooperativa se apilan a lo ancho, no en carrusel.
- Se arregló de paso el desborde horizontal que arrastraba la pantalla: el
  panel es `relative` también en mobile y el `left: 68%` con el que se cuelga
  de la provincia lo empujaba fuera de la pantalla. Ahora el corrimiento va por
  variable y solo se aplica desde `md`.

De **Sobre FACTTIC** salió además:

- Las tarjetas "01. / 02." van en el mismo carrusel de una tarjeta desplegada
  por vez que Sumá tu coop.
- Las solapas "Consejo de administración / Sindicatura" van chicas en mobile,
  para que entren las dos en un renglón.
- La anotación del frame pide "Zoom in en la foto" sobre la del plenario. Ahí
  está puesto el efecto de escaneo que pediste vos, que es más que un zoom, así
  que la dejé como está.

De **Contacto** salió además:

- Las dos anotaciones del frame están cumplidas: el mensaje se estira con lo que
  se escribe (ya estaba) y **la línea del campo pasa de punteada a entera apenas
  hay algo escrito** (nuevo, con `:placeholder-shown`, sin estado de React).
- La bajada va en mono 18, no en la sans en negrita.

Del **detalle de Comunicados** salió: el título va en `H2/Mobile` (26) y no en
los 34 de desktop; la tarjeta arranca a 32 de la barra y no a 96; y la pantalla
cierra con "Recomendaciones / También te puede interesar" más un "Ver todo" en
vez de la banda "¿Sos parte de una cooperativa?", que es de desktop.

Del **404** salió: el título "Esta conexión no existe" se escribe a máquina
—confirmado en el archivo, la anotación está puesta sobre ese texto—. Las otras
dos anotaciones del frame ("el chiste sería que este elemento nunca entre al
sistema, que rebote y gravite por fuera" y "el resto de los elementos sí
graviten sobre el eje") describen el movimiento del Lottie que entregó diseño,
que ya está en uso: son 161 fotogramas y los cuerpos se desplazan solos.

Del **listado de Comunicados** salió además:

- Las solapas llevan flechas a la derecha. Como el filtro anda sin JavaScript
  —son enlaces—, las flechas también son enlaces: de ahí `BotonFlechaLink`.
- La foto de la tarjeta mide 345x174 —proporción 2:1, radio 12— contra la
  proporción más apaisada de desktop.

Abierto, para preguntar:

- [ ] **El copy de la banda de cierre de proyectos.** El board mobile dice
      "¿Tenés **algún** proyecto en mente?" y el sitio "¿Tenés un proyecto en
      mente?", que es lo que quedó del documento de contenido.
- [ ] **Las descripciones de beneficios no entran en la tarjeta del board.** Es
      de 346x403 fijos y el texto del archivo es más corto que el que está
      cargado; hoy se recorta contra el borde de la tarjeta. O se acorta el
      copy o la tarjeta crece.
- [ ] **El copy del cierre de Nuestros servicios.** El board dice "¿Tenés algún
      proyecto en mente?" y el sitio "¿Tenés un proyecto?". Va con lo de la
      banda de la Home, que tiene la misma diferencia.
- [ ] **Los proyectos de la vertical.** El board mobile tiene _dos_ bloques
      —"Nuestra experiencia en el sector" con tres tarjetas con foto y, más
      abajo, "Últimos proyectos" como lista— y el sitio tiene uno solo, en
      lista. Además las tres tarjetas aparecen superpuestas entre sí, con el
      título de las dos primeras tapado por la que sigue: no queda claro si es
      una pila a propósito o un descuido del archivo.
- [ ] **La anotación "Animación: Zoom in" de la galería del detalle no tiene
      disparador en mobile.** Hoy el acercamiento está en el hover, que en una
      pantalla táctil no existe. ¿Va al entrar en pantalla, o queda solo en
      desktop?
- [ ] **Dos títulos que en el board miden 30 y no 26.** "El cooperativismo se
      multiplica" (Sobre FACTTIC) y "Envíanos un mensaje" (Contacto) miden un
      15% más que el resto de los títulos de sección, que son todos 26 —lo
      verifiqué comparando la misma cadena—. Puede ser que ahí esté aplicado
      `H2/Desktop` por error. Los dejé en 26 para no meter un cuerpo fuera de
      escala; confirmar cuál va.
- [ ] **La esfera de Contacto no coincide en color.** El board la muestra gris
      virando a naranja y el Lottie que llegó (`fondo-contacto`) la dibuja lila
      con una órbita punteada. Puede ser otro fotograma de la misma animación o
      un asset cambiado.
- [ ] **El orden de las tarjetas.** El board pone los sectores como
      Organizaciones · Financiero · Agro y los servicios empezando por
      Desarrollo · Diseño · IA y Datos; la API los devuelve en otro orden. Se
      arregla desde el backoffice, no desde el código.
- [ ] **El título de Nuestra red y el copy de las bandas de cierre.** El board
      mobile dice "Somos una red federal" a secas —ya está puesto como
      `tituloMobile`— y en las bandas usa "¿Tenés algún proyecto en mente?" y
      "Trabajá con Facttic" donde el sitio dice otra cosa. Todo eso viene del
      documento de contenido que ya validamos, así que probablemente el board
      esté atrasado: confirmar.

### Anotaciones del archivo pendientes de definir

Las anotaciones verdes de "Desarrollo" en Figma —distintas de los comentarios—
llevan indicaciones de implementación. Estado de las encontradas:

- [ ] **"Habrá que poner máximo de caracteres a los títulos"** (board
      Componentes). **Falta definir el número.** Por ahora los títulos de
      proyecto se acotan a dos líneas para que no desalineen la grilla, pero
      convendría validarlo también en el backoffice al cargar.
- [ ] **Revisar las anotaciones del resto de las pantallas.** Se leyeron las de
      la Home —desktop y mobile— y las del board de Componentes; faltan
      Proyectos, Sumá tu coop, Nuestra Red, Sobre Facttic, Comunicados,
      Contacto y 404.

      Las cinco de la Home mobile están hechas: máquina de escribir en el
      título (`Typewriter`), Scroll reveal en la bajada (`RevelarPalabras`),
      Spotlight Card en las tarjetas de sector (`ui/foco-puntero`) y animación
      de superposición en los dos mazos —servicios y beneficios— con el
      `porScroll` de `ui/mazo`.

- [ ] **"Ver si va ese texto en el botón, o qué va mejor"** (anotación de
      Contenido, Home, 10/8). Es el botón nuevo del bloque de Sectores, que hoy
      dice "Conocé nuestros servicios" —el texto que está puesto en el
      archivo—. El copy queda a confirmar; vive en `HOME.sectores.cta`.
- [x] ~~"Nuevo, va a sección 'nuestros servicios'"~~ (Home, bloque de Sectores)
      → implementado: botón a la derecha del título en desktop y al pie de las
      tarjetas, a lo ancho, en mobile.
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
- [x] ~~**28. Textos de las verticales escritos por nosotros.**~~ → los trajo el
      documento de contenido del 27/8, y con un juego propio por vertical: los
      cuatro motivos de "¿Por qué elegirnos?" dejaron de ser compartidos entre
      Organizaciones, Agro y Financiero. Las descripciones también son suyas.

- [ ] **29. Maqueta mobile del detalle de proyecto.** No existe en el archivo
      —hay desktop (03.A) y de mobile solo la grilla—. El orden apilado, la
      galería a una columna y la ficha en vertical son criterio propio.
- [ ] **30. Video en la galería del detalle.** La anotación del diseño pregunta
      "¿se podría incorporar video?": la API ya guarda `videoFileNames`, así que
      es decidir cómo se muestra. Queda pendiente de esa definición.

- [ ] **31. Sumá tu coop: queda una URL.**
      El documento de contenido del 27/8 cerró los otros cuatro puntos: los seis
      compromisos, las URLs de Semillero y del Club, el título de las tarjetas
      numeradas y la primera pregunta, que quedó "¿Querés sumarte a una coope?". 1. Falta la URL del código de conducta: "Ver Código" apunta todavía al
      sitio actual de FACTTIC. El documento nombra el botón pero no da
      dirección.

- [ ] **31 bis. Firefox le corta el vidrio a la tarjeta de Contacto.**
      Aparece una línea horizontal que interrumpe el difuminado a media tarjeta,
      con el resplandor del fondo pasando por detrás. **No se reproduce a
      pedido**: ocho tarjetas idénticas fallaron todas en una recarga y la misma
      configuración anduvo en la siguiente. Es estado del compositor, no una
      propiedad CSS.

      Ya se descartó, con dos muestras por variante y el orden intercalado para
      que la posición no sesgue: `isolation: isolate` y `overflow-hidden` en la
      sección, `will-change: backdrop-filter`, `transform: translateZ(0)`,
      `contain: paint` y `backface-visibility: hidden` sobre la tarjeta,
      `textura-ruido`, `borde-degradado`, la animación `animate-acercar` del
      fondo, y el tamaño de la tarjeta —que parecía mandar hasta que una de 644
      anduvo—.

      Lo único aplicado es `will-change: transform` en la esfera del fondo, que
      es correcto de por sí porque la esfera se anima con `transform`, y de paso
      la deja en su propia capa. **No está confirmado que alcance.**

      Si vuelve a aparecer, lo que queda es subir la opacidad del fondo de la
      tarjeta —de `bg-superficie/60` a `/85`—: se filtra menos, así que el corte
      deja de notarse aunque Firefox lo siga haciendo. Cuesta translucidez.
      El mismo patrón —vidrio grande sobre animación— está en el panel de
      Nuestra Red y en la tarjeta de Sumá tu coop, donde nadie lo reportó.

      La herramienta no sirve para esto: `medir.py` levanta Chrome, y Firefox
      headless saca la captura antes de que React hidrate, así que hay que
      mirarlo a ojo en un Firefox de verdad.

- [ ] **32. La animación del 404 no coincide con el fotograma de la maqueta.**
      `fondo-error404.json` trae toda la decoración —arco, planetas, sol lila y
      estrella naranja— pero son 161 fotogramas con los cuerpos en movimiento, y
      su composición (1000×887) los ubica en otro lugar y a otra escala que el
      instante dibujado en las maquetas. Se respetó la estructura de cada una
      —decoración arriba en mobile, al costado en desktop— y se dejó correr la
      animación. Si diseño quiere que el reposo coincida con la maqueta, hay que
      reexportarla.

- [ ] **33. Contacto: color de la animación y copy de un motivo.** 1. `fondo-contacto.json` no tiene ninguna capa naranja —su círculo grande
      es violeta— pero las dos maquetas dibujan un resplandor naranja. Se usa
      la animación tal como vino. 2. ~~El tercer motivo difiere entre las maquetas.~~ → el documento de
      contenido lo cerró en "Quiero armar una coope". 3. Falta una dirección de correo de contacto para ofrecer como
      alternativa cuando el envío falla.

- [ ] **34. Sobre Facttic.** 1. **Las tres cooperativas de prueba** ("Cooperativa A/B/C") ahora se
      listan en público, mezcladas con las 37 reales que se cargaron desde
      la maqueta. Conviene borrarlas —es parte del ítem 12—. 2. **Autoridades**: hoy hay cuatro cargadas —Manuel Leiva, Cecilia Muñoz
      Cancela, María Cecilia Beccaria y Laura Arcuri—, todas del Consejo.
      Falta toda la Sindicatura, cuya solapa no se muestra hasta que haya
      alguien: **QA lo marcó el 10/8** ("falta la sindicatura"). Se resuelve
      cargándola por el backoffice, con el cargo escrito "Síndica titular" /
      "Síndico suplente", que es de donde el sitio deduce el órgano. 3. **¿A dónde linkea cada cooperativa?** La anotación pide que la lista
      "linkee a la página de cada coop", pero en el prototipo esos nombres
      no tienen enlace —al hacer clic no pasa nada y no se resalta ninguna
      zona activa— y en el archivo no hay ninguna pantalla de cooperativa.
      Por cómo está redactada parece ser el sitio propio de cada una, que
      sería un enlace externo; el modelo no tiene ese campo. Hoy llevan a
      Nuestra Red. Hace falta definir el destino y, si es el sitio propio,
      agregar el campo y cargarlo. 4. ~~**La foto del plenario en alta**~~ → llegó la original. Va a 2880 de
      ancho, el doble de los 1440 a los que se muestra, guardada como JPEG
      de 380 KB; el PNG original pesaba 2 MB y no tenía transparencia. 5. **Los logos de "Somos parte de otros espacios cooperativos"**: la
      maqueta muestra Cooperar, patio, un centro cultural y mut_, pero el
      recurso `organizaciones` hoy tiene los aliados de la Home. **QA lo
      confirmó el 10/8: van los cuatro del archivo**, así que son dos listas
      distintas. Hacen falta los logos y un recurso propio —o un campo que
      separe aliados de espacios— porque hoy las dos secciones leen
      `/api/organizaciones`.

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
      actualiza o se descarta como referencia. **El documento de contenido se
      contradice a sí mismo en lo mismo**: su tabla de títulos recomienda "Para
      empresas" y "Para cooperativas" —con argumento: "indica el público"— pero
      su "Menú elegido" mantiene "Nuestros servicios" y "Sumá tu coop". Cambiarlo
      toca la navegación, las URLs y el footer.

- [ ] **Lo que dejó abierto el documento de contenido (27/8).** Se aplicó todo lo
      que era copy; queda esto: 1. **Las oportunidades, ¿un texto o dos?** Hoy la Home y Sumá tu coop
      comparten los cuatro textos (`HOME.beneficios.items`). El documento
      lista en Inicio solo los títulos y pone las descripciones largas —hasta
      200— únicamente en Para cooperativas. Con las largas, en la Home tres de
      las cuatro tarjetas se comen el padding inferior en mobile: la cara de
      hover pide 237px y la caja da 214. Entran en desktop. 2. **La MIT no tiene dónde ir.** El documento le da texto ("la mutual de
      quienes trabajan en informática y conocimiento: una organización amiga
      de FACTTIC") y enlace a `https://mit.org.ar/`, pero la sección de
      espacios cooperativos es una fila de logos que salen de la API. Hace
      falta una definición de diseño, no de copy. 3. **Un párrafo sin sección.** El documento cierra con un texto de 336
      caracteres —"Más de 30 cooperativas de 10 provincias forman parte de
      nuestra Federación…"— sin decir dónde va. Por el contenido parece de
      Nuestra Red. 4. **Los títulos con barra siguen sin resolver** en las tres verticales:
      "Nuestros proyectos destacados / Nuestros casos de éxito" y "Ver
      proyectos destacados / ¿Tenés un proyecto?". 5. **Financiero está marcado "completar"** en el propio documento, aunque
      trae los cuatro motivos, que ya se cargaron. 6. **Nombres de servicios y sectores, que salen de la API.** El documento
      dice "Inteligencia artificial y Datos" y "Diseño y comunicación
      digital"; la API tiene "Datos e inteligencia artificial" y "Diseño y
      comunicación". En las etiquetas, el documento dice `ML` y la API guarda
      "Modelos de lenguaje", que además es un error: ML es machine learning y
      "LLMs" ya está al lado. La frase del sector Agro mide 83 caracteres
      contra el límite de 70 que el documento fija para ese lugar. 7. **Faltan cuatro proyectos destacados**, que son carga por API: Coopcycle
      y Humanitarian OpenStreetMap en Organizaciones, Skyloop en Agro y
      BuenBit en Financiero. Sin proyectos la sección no se renderiza, que es
      lo que hoy les pasa a Agro y Financiero. 8. **Límites que el documento incumple**: "¿Qué es FACTTIC?" mide 355 sobre
      300; dos de las cuatro oportunidades pasan los 200 (205 y 208); tres de
      los seis compromisos pasan los 40 (48, 58 y 82); el bloque de tres
      párrafos del modelo cooperativo mide 626 sobre 600; y "Equipos sin
      rotación" mide 164 sobre los 160 de esa pantalla. Ninguno rompe el
      diseño: se midió el DOM a 1440 y 393. Es material para devolverle a
      quien escribió el documento.
- [ ] **Copys definitivos** de las páginas que todavía no se construyeron.

### Ideas probadas y dejadas para después

- [ ] **Palabras del vocabulario cooperativo viajando de fondo.** Probado dos
      veces con el "On-Scroll Text Motion" de Codrops (MIT,
      `codrops/ScrollTextMotion`) y descartado las dos. **No insistir sin un
      cambio de enfoque.**

      La segunda vez llegó a andar —las diez palabras recorrían entre 559 y
      1008px, sin romper el encabezado, la grilla ni los revelados— y aun así
      no se parecía al demo. Ahí está el punto: el problema no era técnico.

      1. **El demo es una página que existe para el efecto.** Sus palabras *son*
         el contenido, ocupan la pantalla entera, no hay nada opaco encima y
         nada más se mueve. De fondo en la Home compiten con el hero a pantalla
         completa, con bloques que las tapan, con la grilla de puntos y con los
         revelados: se ven a retazos, y a retazos el efecto no se lee.
      2. **La mecánica no es mover una coordenada.** Cada palabra tiene dos
         clases de posición y Flip interpola margen, opacidad y desenfoque a la
         vez, en dos animaciones encadenadas. Reimplementarlo a mano da otra
         cosa; hay que usar Flip.
      3. **ScrollSmoother no entra sin reestructurar el layout.** Mueve el
         contenido con `transform` y ahí adentro `position: fixed` deja de
         anclarse a la ventana: encabezado, menú de mobile, grilla y sticky.
      4. **Cuesta 168 KB de GSAP** en cuatro plugins.

      Si se retoma, el camino es una **pantalla propia** donde el efecto sea el
      protagonista —un manifiesto, una landing de campaña—, no el fondo de una
      pantalla llena. Con eso el demo se puede usar casi tal cual.

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
