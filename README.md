# Sitio de FACTTIC

Sitio público y backoffice de la **Federación Argentina de Cooperativas de
Trabajo de Tecnología, Innovación y Conocimiento**.

El contenido —cooperativas, proyectos, novedades, servicios— vive en una API
propia; este repositorio es solo el frontend y el panel para cargarlo.

```
/                      sitio público
/admin                 backoffice, detrás de login
/componentes           catálogo de componentes con datos reales
```

## Levantarlo

Hace falta **Node 20 o superior** y **pnpm**.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Queda en <http://localhost:3000>.

### Variables de entorno

Las tres viven en `.env.local`, que no se versiona.

| Variable | Para qué | ¿Obligatoria? |
|---|---|---|
| `FACTTIC_API_URL` | Dónde está la API | No: el código trae el valor por defecto |
| `FACTTIC_API_USER` | Credencial de servicio | Solo para el formulario de contacto |
| `FACTTIC_API_PASS` | Idem | Solo para el formulario de contacto |

El sitio lee sin credencial —los GET de la API son públicos— y el panel usa el
usuario y la contraseña que escribe cada persona al entrar, así que se puede
trabajar con `.env.local` casi vacío. Las dos credenciales de servicio solo
hacen falta para que el formulario de contacto envíe.

### Entrar al panel

`/admin` pide usuario y contraseña de la API. La sesión dura quince minutos,
que es lo que vive el token que devuelve el backend.

## Cómo está organizado

```
app/(public)/          las páginas del sitio
app/admin/             el backoffice: un ABM por recurso
app/api/               lo poco que necesita servidor propio
components/ui/         primitivos: botón, chip, campo, tarjeta…
components/tarjetas/   componentes de dominio
components/secciones/  bloques grandes de página
components/admin/      las piezas del panel
lib/api/               transporte: habla HTTP y autentica
lib/dominio/           traducción: de la forma de la API al modelo del sitio
lib/datos/             acceso: lo único que importan las vistas
lib/contenido.ts       los textos fijos
app/globals.css        tokens de color y escala tipográfica
```

La capa de datos está partida en tres a propósito, para que un cambio del
backend se resuelva en un solo archivo. Está explicado en
[`lib/README.md`](lib/README.md); los componentes, en
[`components/README.md`](components/README.md).

## Trampas conocidas

- **Los datos vienen cacheados.** Después de tocar contenido por API hay que
  reiniciar para verlo, o esperar el TTL.
- **Clases nuevas de Tailwind no aparecen sin reiniciar.** Si se usa una
  utilidad que no existía en el proyecto, el dev server no regenera el CSS: la
  clase queda en el DOM sin regla. Hay que matar el server, borrar `.next` y
  arrancar de nuevo, en ese orden.
- **Toda utilidad tipográfica nueva va también a `lib/cn.ts`**, o
  tailwind-merge la toma por una clase de color y la descarta.
- **El token de la API dura quince minutos.** Un `curl` sin `-i` devuelve 401
  sin que se note y parece que la escritura funcionó.

## Herramientas

`herramientas/medir.py` levanta un Chrome headless al ancho real, mide el DOM y
saca capturas de página completa. Sirve para contrastar contra las maquetas: la
extensión del navegador dice que redimensiona pero no cambia el viewport.

```bash
ANCHO=393 python3 herramientas/medir.py shot home-mobile.png
```

## Otros documentos

- [`AGENTS.md`](AGENTS.md) — cómo se trabaja en este repositorio: de dónde
  salen las medidas, en qué orden se construye cada pantalla.
- [`PENDIENTES.md`](PENDIENTES.md) — lo que falta de terceros: cambios pedidos
  al backend, assets de diseño, contenido real por cargar.
