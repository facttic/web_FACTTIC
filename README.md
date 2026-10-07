<div align="center">

# FACT[TIC]

**Federación Argentina de Cooperativas de Trabajo de Tecnología, Innovación y
Conocimiento**

Una red federal de cooperativas argentinas que diseña, desarrolla e implementa
soluciones digitales.

[**facttic-web.vercel.app**](https://facttic-web.vercel.app) ·
[Sumá tu cooperativa](https://facttic-web.vercel.app/suma-tu-coop) ·
[Proyectos](https://facttic-web.vercel.app/proyectos) ·
[Contacto](https://facttic-web.vercel.app/contacto)

[![Licencia: AGPL v3](https://img.shields.io/badge/licencia-AGPL--3.0--or--later-6c4f9c)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Software libre](https://img.shields.io/badge/software-libre-57c3c8)](#licencia)

![La portada del sitio de FACTTIC](docs/portada.jpg)

</div>

## Qué es FACTTIC

Una federación de **33 cooperativas de trabajo** repartidas en **9 provincias**
de Argentina, que producen tecnología de otra manera: sin dueños, con decisiones
tomadas en asamblea y con los ingresos distribuidos entre quienes hacen el
trabajo.

Lo que la vuelve una federación y no una lista es el sexto principio
cooperativo, el de cooperación entre cooperativas: para un proyecto grande se
arma un **equipo intercoop** entre varias, cada una aportando lo suyo, en vez de
competir por él.

**Trabaja en cinco líneas** —desarrollo de software, diseño y comunicación,
datos e inteligencia artificial, capacitación y consultoría, e ingeniería e
infraestructura— **y en tres verticales**: organizaciones, agro y financiero.

> ¿Tu cooperativa hace tecnología? [Sumate a la red](https://facttic-web.vercel.app/suma-tu-coop).
> ¿Tenés un proyecto? [Escribinos](https://facttic-web.vercel.app/contacto).

## Qué hay en este repositorio

El sitio público y el backoffice para cargarlo. El contenido —cooperativas,
proyectos, novedades, servicios— vive en una API propia; esto es el frontend.

```
/                      sitio público, en español e inglés
/admin                 backoffice, detrás de login
/componentes           catálogo de componentes con datos reales
```

El sitio sale en dos idiomas: el español sin prefijo y el inglés bajo `/en`, con
los nombres de sección traducidos —`/proyectos` se publica como `/en/projects`—.

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

| Variable           | Para qué               | ¿Obligatoria?                           |
| ------------------ | ---------------------- | --------------------------------------- |
| `FACTTIC_API_URL`  | Dónde está la API      | No: el código trae el valor por defecto |
| `FACTTIC_API_USER` | Credencial de servicio | Solo para el formulario de contacto     |
| `FACTTIC_API_PASS` | Idem                   | Solo para el formulario de contacto     |

El sitio lee sin credencial —los GET de la API son públicos— y el panel usa el
correo y la contraseña que escribe cada persona al entrar, así que se puede
trabajar con `.env.local` casi vacío. Las dos credenciales de servicio solo
hacen falta para que el formulario de contacto envíe.

### Entrar al panel

`/admin` pide correo —o usuario— y contraseña. La sesión dura quince minutos,
que es lo que vive el token que devuelve el backend.

Cada cooperativa edita lo suyo: su ficha, sus proyectos y los sectores y
servicios que ella misma dé de alta. El resto del catálogo es de la Federación.

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
lib/contenido/         los textos fijos, uno por idioma
lib/mapa/              los límites de las provincias, para Nuestra Red
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
- **Chrome headless se declara táctil**, así que ningún `hover:` de Tailwind
  aplica al medir. `herramientas/medir.py` ya arranca con los flags que lo
  corrigen.

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

## Licencia

Este sitio es software libre, bajo la **GNU Affero General Public License v3.0
o posterior** ([AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0.html)).
El texto completo está en [`LICENSE`](LICENSE).

Se eligió la AGPL y no la GPL porque esto es una página web: la GPL obliga a
publicar los cambios a quien **distribuye** el código, y servir un sitio no
cuenta como distribuirlo. Con la AGPL, quien tome este código, lo modifique y lo
ponga online tiene que publicar sus cambios igual. Es la misma razón por la que
el panel traduce con LibreTranslate y no con un servicio cerrado.

<div align="center">

Hecho de forma intercooperativa 🤝

</div>
