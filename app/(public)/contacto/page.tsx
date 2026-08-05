import type { Metadata } from "next";
import { Seccion } from "@/components/ui/seccion";
import { Animacion } from "@/components/ui/animacion";
import { FormularioContacto } from "@/components/secciones/formulario-contacto";
import { FONDOS } from "@/lib/animaciones";
import { CONTACTO as T } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Contacto",
  description: T.hero.bajada,
};

/**
 * Contacto.
 *
 * La esfera con el resplandor naranja es la animación que entregó diseño, con
 * el acercamiento que piden sus tres anotaciones ("Animación: Zoom in en la
 * img"). Va detrás de la tarjeta y asomando por la derecha, como en la
 * maqueta —por eso la sección recorta: la esfera se sale a propósito—.
 *
 * El título se centra en desktop y se alinea a la izquierda en mobile, que es
 * lo que hace cada maqueta.
 */
export default function ContactoPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <Animacion
        nombre={FONDOS.contacto}
        className="pointer-events-none absolute top-0 right-0 -z-10 aspect-square w-[420px] animate-acercar md:top-24 md:w-[620px]"
      />

      <Seccion className="pt-24 md:pt-32">
        <h1 className="text-h1 whitespace-pre-line md:text-center">
          {T.hero.titulo}
        </h1>
        {/* La bajada cambia de tipografía entre maquetas: Inter en mobile,
            DM Mono en desktop. */}
        <p className="text-h4 mt-6 max-w-2xl text-blanco md:text-p1 md:mx-auto md:text-center md:text-blanco/80">
          {T.hero.bajada}
        </p>

        {/* La tarjeta de vidrio con el formulario, centrada bajo el título. */}
        <div className="borde-degradado textura-ruido relative mt-12 rounded-2xl bg-superficie/60 p-6 py-10 backdrop-blur-xl md:mx-auto md:mt-16 md:w-[640px] md:p-12">
          <FormularioContacto />
        </div>
      </Seccion>
    </section>
  );
}
