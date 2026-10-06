import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { contenido } from "@/lib/contenido";
import { esIdioma, IDIOMA_POR_DEFECTO, type Idioma } from "@/lib/idioma";

/**
 * La imagen que se ve al compartir un enlace del sitio.
 *
 * Faltaba, y por eso un enlace pegado en Telegram o en WhatsApp salía como dos
 * renglones de texto gris: el `og:title` y la bajada, sin nada que mirar.
 *
 * Se dibuja acá en vez de ser un archivo: así sale en el idioma de la pantalla
 * y se actualiza sola si cambia el lema, sin tener que reexportar un PNG cada
 * vez. Las pantallas que tienen imagen propia —un proyecto, una novedad— la
 * pisan con la suya; esta es la de la casa.
 *
 * Los 1200x630 son la medida que esperan las redes.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FACTTIC";

/* Los tokens de `globals.css`, escritos acá: esto no pasa por Tailwind. */
const NEGRO = "#222222";
const BLANCO = "#f2f2f2";
const GRIS = "#3c3c3c";
const LILA = "#d6bbf2";

export default async function Imagen({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  const lang: Idioma = esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;
  const T = contenido(lang);

  /* El logo va embebido: la imagen se arma en el servidor y no puede salir a
     buscar sus propios recursos por la red. */
  const logo = await readFile(
    join(process.cwd(), "public", "marca", "logo-facttic.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: NEGRO,
        padding: "72px 80px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} alt="" width={352} height={89} />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            color: BLANCO,
            letterSpacing: "-0.02em",
            maxWidth: 940,
          }}
        >
          {T.HOME.lema.texto}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.35,
            color: "#b9b9b9",
            maxWidth: 900,
          }}
        >
          {lang === "en"
            ? "Argentine Federation of Technology, Innovation and Knowledge Worker Co-operatives"
            : "Federación Argentina de Cooperativas de Trabajo de Tecnología, Innovación y Conocimiento"}
        </div>
      </div>

      {/* La línea de abajo, en el violeta de la identidad. */}
      <div
        style={{
          display: "flex",
          height: 10,
          width: "100%",
          background: `linear-gradient(90deg, ${GRIS} 0%, ${LILA} 100%)`,
        }}
      />
    </div>,
    size,
  );
}
