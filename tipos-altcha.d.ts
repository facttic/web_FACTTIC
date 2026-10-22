/**
 * El widget de ALTCHA es un custom element, así que TypeScript no lo conoce
 * hasta que se lo declara.
 */
import type {} from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        challenge?: string;
        name?: string;
        auto?: "onfocus" | "onload" | "onsubmit";
        display?: "standard" | "bar" | "floating" | "overlay" | "invisible";
        language?: string;
      };
    }
  }
}
