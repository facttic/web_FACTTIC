# Capa de datos

La conexión con la API está partida en tres capas para que un cambio del backend
se resuelva en un solo lugar y no obligue a tocar las vistas.

```
lib/api/       transporte    ← habla HTTP, autentica, no sabe de negocio
lib/dominio/   traducción    ← convierte la forma de la API al modelo del sitio
lib/datos/     acceso        ← lo único que importan las páginas y componentes
```

## Regla

**Las vistas solo importan de `lib/datos` y usan los tipos de
`lib/dominio/tipos.ts`.** Nada en `app/` ni en `components/` debería importar de
`lib/api/`. Si aparece un `_id` o un `imageFileNames` dentro de un componente, es
que se saltó una capa.

## Dónde tocar cuando cambie la API

| Cambio en el backend | Se toca |
|---|---|
| Se abren los GET públicos | `lib/api/tokens.ts` (dejar de pedir token) |
| Cambia el login o la vida del token | `lib/api/tokens.ts` |
| Se renombra o agrega un campo | `lib/dominio/adaptadores.ts` |
| Se unifica la paginación | `lib/api/client.ts` → `normalizePage` |
| Aparece `slug` en proyectos | `adaptadores.ts` → `slugDeProyecto()` |
| Aparece `provincia` en cooperativas | `adaptadores.ts` → `provinciaDe()` |
| Aparece `logo` en cooperativas | `adaptadores.ts` → `aCooperativa()` |
| Cambian los nombres de los query params | `lib/datos/proyectos.ts` → `aQueryParams()` |
| Aparece un endpoint de estadísticas | `lib/datos/catalogos.ts` → `getMetricasRed()` |
| Aparecen novedades y contacto | recursos nuevos en `lib/datos/` |

En todos esos casos el modelo de `lib/dominio/tipos.ts` no cambia, así que las
páginas y los componentes quedan igual.

## Por qué el modelo no espeja a la API

`lib/dominio/tipos.ts` describe el sitio, no la base de datos. Por eso:

- `id` en lugar de `_id`, y `slug` para las URLs.
- Las relaciones llegan resueltas: nunca un `Ref<T>` que a veces es un string y
  a veces un objeto.
- Las imágenes llegan como URL lista para un `<img>`, ya pasada por el proxy;
  los componentes no saben que la API sirve archivos con autenticación.
- Los campos que la API no tiene todavía (`provincia`, `logo` de cooperativa)
  existen en el modelo devolviendo `null`, así las vistas ya los contemplan y el
  día que el backend los agregue solo cambia el adaptador.

## Cacheo

Se cachea en `lib/datos`, no en el `fetch`. El header `Authorization` forma parte
de la cache key de Next y el token se renueva cada 15 minutos: cachear abajo
haría que cada renovación invalidara todo el contenido. Los TTL están en
`lib/datos/cache.ts`.
