import "server-only";

/**
 * Token de servicio para el sitio público.
 *
 * La API no expone endpoints públicos: hasta los GET devuelven 401 sin JWT. El
 * sitio se autentica con una credencial guardada en el entorno del servidor,
 * que nunca llega al browser.
 *
 * El access_token vive 15 minutos (exp - iat = 900s), así que se cachea en
 * memoria del proceso y se renueva antes de vencer. Las llamadas concurrentes
 * comparten una única promesa de login para no disparar una estampida de
 * requests contra /api/login cuando el token expira bajo carga.
 */

export const API_URL =
  process.env.FACTTIC_API_URL ?? "https://facttic-web.it10.com.ar";

/** Margen antes del vencimiento real, para no usar un token a punto de morir. */
const EXPIRY_MARGIN_MS = 60_000;

interface CachedToken {
  value: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;
let inFlight: Promise<CachedToken> | null = null;

/** Lee el `exp` del JWT sin verificar la firma — solo para saber cuándo renovar. */
function readExpiry(jwt: string): number | null {
  const payload = jwt.split(".")[1];
  if (!payload) return null;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

async function login(): Promise<CachedToken> {
  const username = process.env.FACTTIC_API_USER;
  const password = process.env.FACTTIC_API_PASS;

  if (!username || !password) {
    throw new Error(
      "Faltan FACTTIC_API_USER / FACTTIC_API_PASS. Copiá .env.example a .env.local y completalos.",
    );
  }

  // La API espera `username`, no `email`, pese a que el spec sugiera lo contrario.
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Login contra la API falló: ${res.status} ${res.statusText}`,
    );
  }

  const { access_token: value } = (await res.json()) as {
    access_token?: string;
  };
  if (!value) throw new Error("La API no devolvió access_token");

  // Si el JWT no trae `exp` legible, asumimos los 15 minutos documentados.
  const expiresAt = readExpiry(value) ?? Date.now() + 15 * 60_000;
  return { value, expiresAt };
}

/** Devuelve un token válido, renovándolo si está por vencer. */
export async function getServiceToken(): Promise<string> {
  if (cached && cached.expiresAt - EXPIRY_MARGIN_MS > Date.now()) {
    return cached.value;
  }

  // Una sola renovación a la vez, compartida por todas las llamadas en curso.
  inFlight ??= login()
    .then((token) => {
      cached = token;
      return token;
    })
    .finally(() => {
      inFlight = null;
    });

  return (await inFlight).value;
}

/** Descarta el token cacheado. Se llama al recibir un 401 inesperado. */
export function invalidateServiceToken(): void {
  cached = null;
}
