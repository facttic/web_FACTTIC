import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, DM_Mono } from "next/font/google";
import "../globals.css";
import { contenido } from "@/lib/contenido";
import { recortar } from "@/lib/seo";
import {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  esIdioma,
  type Idioma,
} from "@/lib/idioma";

/**
 * Las dos tipografías del diseño. Ambas están en Google Fonts, así que no hay
 * licencias que gestionar ni archivos que hospedar.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

/**
 * Las dos versiones del sitio se generan de antemano. El idioma es el primer
 * segmento de la ruta —el español además va sin prefijo, y de eso se encarga
 * `proxy.ts`—, así que acá llega siempre uno de los dos.
 */
export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

/**
 * Metadatos de base, por idioma.
 *
 * `alternates` es lo que le dice a los buscadores que las dos versiones son la
 * misma pantalla en otro idioma —y no contenido duplicado—. Las rutas de abajo
 * agregan su propio título y su bajada; esto queda como fondo.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  const lang: Idioma = esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;
  const T = contenido(lang);

  return {
    /* Sin esto, `hreflang` y la canónica salen relativas y los buscadores no
       las resuelven. En Vercel la URL del deploy llega por entorno. */
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITIO_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000"),
    ),
    title: {
      default:
        lang === "en"
          ? "FACTTIC — Argentine Federation of Technology Worker Co-operatives"
          : "FACTTIC — Federación Argentina de Cooperativas de Trabajo de Tecnología",
      template: "%s · FACTTIC",
    },
    description: recortar(T.HOME.hero.bajada),
    /*
     * Acá **no** va `alternates`. La metadata del layout se mezcla con la de
     * cada página, así que una canónica fija —`/` o `/en`— se heredaba en todas
     * las que no declaraban la suya: ciento treinta páginas diciéndole a Google
     * que eran copias de la portada. Cada pantalla arma la suya con
     * `metadatosDe`, a partir de su propia ruta.
     */
    openGraph: {
      type: "website",
      siteName: "FACTTIC",
      locale: lang === "en" ? "en_US" : "es_AR",
      alternateLocale: lang === "en" ? "es_AR" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  /*
   * Un idioma que no existe es un 404 y no la versión en español.
   *
   * El proxy deja pasar sin reescribir todo lo que termina en extensión —para
   * no meterse con los archivos—, así que una dirección inventada como
   * `/algo.png` caía acá con el idioma valiendo "algo.png". Antes se la tomaba
   * como español y la pantalla reventaba más abajo, al pedirle un texto al
   * diccionario: la respuesta era un 500 donde correspondía un 404.
   */
  if (!esIdioma(idioma)) notFound();
  const lang: Idioma = idioma;

  return (
    <html lang={lang} className={`${inter.variable} ${dmMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
