# Componentes

`/componentes` renderiza el catálogo completo con datos reales de la API. Es el
equivalente del board **Componentes** del archivo de Figma.

## Cómo se organizan

```
components/ui/         primitivos: botón, chip, campo, iconos, tarjeta…
components/tarjetas/   componentes de dominio, compuestos a partir de los primitivos
components/layout/     encabezado, pie y logo
components/catalogo/   andamiaje de la página /componentes
```

Los componentes de dominio **no repiten estilos**: se apoyan en `Tarjeta` para la
caja, en `BotonTexto` para los enlaces, en `iconos.tsx` para los trazos y en la
constante `FOCO` para el anillo de foco. Si un componente nuevo escribe
`rounded-xl border border-borde bg-superficie` a mano, es que le falta usar
`Tarjeta`.

Ninguno conoce la forma de la API: reciben tipos de `lib/dominio/tipos.ts`, con
las imágenes ya resueltas a URL y las relaciones ya expandidas.

## Cobertura del board de Figma

| Componente en Figma | Implementación |
|---|---|
| Boton | `ui/boton.tsx` → `Boton`, `BotonLink` |
| Botón texto | `ui/boton.tsx` → `BotonTexto` |
| Botón Idioma | `ui/boton.tsx` → `BotonIdioma` * |
| Botón flecha | `ui/boton.tsx` → `BotonFlecha` |
| _Badge base · Tag cliente / coope | `ui/chip.tsx` → `Chip` |
| Tags Industrias | `ui/chip.tsx` → `ChipSector` |
| Tags Novedades | `ui/chip.tsx` → `Chip tono="lila"` |
| Tag ubicación | `ui/chip.tsx` → `ChipUbicacion` |
| Selector servicios | `ui/tabs.tsx` + `tarjetas/servicios.tsx` |
| Card servicio DS / Diseño / IA | `tarjetas/servicios.tsx` → `CardServicio` |
| Card por qué elegirnos 01-03 | `tarjetas/servicios.tsx` → `CardServicio` |
| Card metodologías | `tarjetas/servicios.tsx` → `CardMetodologia` |
| Card obligaciones | `tarjetas/servicios.tsx` → `CardRequisito` |
| Carg organizaciones · Card Agro · Card Finanzas | `tarjetas/sector.tsx` → `CardSector`, `CardSectorDetalle` |
| Card proyecto | `tarjetas/proyecto.tsx` → `CardProyecto` |
| Card proyecto destacado | `tarjetas/proyecto.tsx` → `CardProyectoDetalle` |
| Últimos proyectos | `tarjetas/proyecto.tsx` → `FilaProyecto` |
| Card sumada 1-3 | `tarjetas/bloques.tsx` → `CardOportunidad` |
| Component 2/3/7/8 (beneficios) | `tarjetas/bloques.tsx` → `CardBeneficio` |
| Red contador 1-3 | `tarjetas/bloques.tsx` → `CardMetrica` |
| Card autoridades | `tarjetas/red.tsx` → `CardAutoridad` |
| Card logo | `tarjetas/red.tsx` → `CardLogo`, `GrillaLogos` |
| Call to action | `ui/seccion.tsx` → `BandaCta` |
| Nav bar/Predeterminada | `layout/header.tsx` |
| Footer | `layout/footer.tsx` |
| Card logo (wordmark) | `layout/logo.tsx` * |

\* `BotonIdioma` está hecho pero sin usar: la v1 sale solo en español.
El wordmark está compuesto tipográficamente hasta que se exporte el SVG.

## Lo que todavía no está

- **Ilustraciones de sectores y beneficios**: se muestran marcadores hasta que
  se exporten los SVG desde Figma.
- **Mapa federal**: se resuelve con GeoJSON público, no con el SVG del diseño.
- **Estados interactivos** que no aparecen maquetados (hover de tarjetas,
  validación del formulario): se resolvieron con criterio propio.
