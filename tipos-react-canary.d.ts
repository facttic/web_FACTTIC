/**
 * Tipos del canal canary de React.
 *
 * `ViewTransition` —el componente que envuelve lo que se transforma al navegar—
 * todavía no está en los tipos estables, pero el runtime lo trae Next cuando se
 * activa `experimental.viewTransition` en `next.config.ts`.
 *
 * Va como referencia y no como `import {} from "react/canary"`: ese módulo no
 * existe en disco, así que el import compila en TypeScript pero rompe el
 * bundler.
 */
/// <reference types="react/canary" />
