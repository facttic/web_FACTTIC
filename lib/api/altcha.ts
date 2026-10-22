import "server-only";

import { CappedMap, createChallenge, verifySolution } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import type { Challenge, Solution } from "altcha-lib";

/**
 * Prueba de trabajo para el formulario de contacto.
 *
 * ALTCHA es software libre (MIT) y se hospeda acá: el desafío lo firma este
 * servidor con un secreto propio y la solución la verifica este servidor. **No
 * hay un tercero en el medio.** Eso importa en este sitio más que en otros,
 * porque la política de contenido no deja cargar nada de afuera y porque no
 * tiene sentido que una federación de cooperativas le entregue a un servicio
 * ajeno la lista de quién entra a su página de contacto.
 *
 * Qué resuelve y qué no: encarece mandar. El navegador tiene que calcular algo
 * antes de que el mensaje salga, así que inundar la casilla desde un script
 * deja de ser gratis. **No distingue humano de bot**: uno dirigido, con
 * navegador de verdad, resuelve la prueba igual. Contra eso lo que sirve es
 * mirar el contenido, no el captcha.
 *
 * PBKDF2 y no Argon2 ni scrypt: es el único que hacen nativo tanto el
 * navegador como este servidor, sin WebAssembly ni dependencias de más. Los
 * otros dos obligarían a cargar un módulo aparte de los dos lados.
 */

/* El nombre lleva el hash adentro: el widget hace `algorithm.slice("PBKDF2/".length)`
   para saber con cuál derivar. Con "PBKDF2" a secas trae el desafío, no lo puede
   resolver y dice "verification failed", que no se parece a la causa. */
const ALGORITMO = "PBKDF2/SHA-256";

/**
 * Cuánto cuesta resolver. `coste` son las iteraciones de PBKDF2 y el prefijo
 * decide cuántos intentos hacen falta en promedio.
 *
 * Los números salieron de medir en Chrome, no de estimar. Con `coste` 30.000
 * las seis corridas dieron 752, 1007, 752, 2003, 752 y 3004 ms: la mediana
 * está bien pero la cola no, y en un teléfono viejo esos tres segundos son
 * diez. Con 10.000 las seis dieron 752 ms clavados, porque el trabajo entra
 * entero debajo del medio segundo de espera que el widget impone igual
 * (`minDuration`). O sea: se paga el costo sin que nadie lo note.
 *
 * Probar con el prefijo en 1 y el coste en 400.000 —mismo trabajo en teoría—
 * dio 15 s. No es lineal: lo que domina es el coste por intento.
 *
 * Son 2,5 millones de iteraciones por mensaje. No es una muralla: es hacer que
 * mandar cueste algo. El que corta el volumen de verdad es el tope por IP de
 * al lado.
 */
const COSTE = 10_000;
const LARGO_DEL_PREFIJO = 2;

/** Cuánto vale un desafío. Lo que tarda alguien en escribir un mensaje. */
const VIGENCIA_MS = 30 * 60 * 1000;

/*
 * Acá iba una trampa de tiempo: rechazar lo que llegara demasiado rápido
 * después de pedir el desafío. Se sacó midiendo, y conviene dejar escrito por
 * qué para que no vuelva.
 *
 * Para tener un payload válido hay que haber resuelto la prueba, y eso tarda
 * alrededor de un segundo —el widget además impone medio segundo de piso—. O
 * sea que ningún envío válido puede llegar "demasiado rápido": el umbral solo
 * alcanza a gente real que completa rápido. La primera medición lo mostró en
 * seco, rechazando un envío legítimo hecho a mano.
 *
 * La prueba de trabajo ya es el costo, y la firma de un solo uso ya cubre el
 * reenvío. Un reloj encima no agrega defensa y sí agrega falsos positivos.
 */

/**
 * Las firmas ya usadas, para que una solución no sirva dos veces.
 *
 * `CappedMap` se olvida de las viejas sola, así que no crece sin límite. Vive
 * en memoria del proceso: en Vercel hay varias instancias, así que no es una
 * barrera dura —igual que el tope por IP de al lado—, pero corta el reenvío
 * simple del mismo payload, que es lo que de verdad pasa.
 */
const usadas = new CappedMap<string, number>({ maxSize: 10_000 });

function secreto(): string {
  const valor = process.env.ALTCHA_SECRETO;
  if (!valor) {
    throw new Error(
      "Falta ALTCHA_SECRETO. Sin eso el formulario de contacto queda sin prueba de trabajo.",
    );
  }
  return valor;
}

export async function nuevoDesafio(): Promise<Challenge> {
  return createChallenge({
    algorithm: ALGORITMO,
    cost: COSTE,
    keyPrefixLength: LARGO_DEL_PREFIJO,
    deriveKey,
    hmacSignatureSecret: secreto(),
    expiresAt: new Date(Date.now() + VIGENCIA_MS),
  });
}

interface Payload {
  challenge: Challenge;
  solution: Solution;
}

/** Por qué no pasó, para poder distinguir un bot de un problema nuestro. */
export type FalloAltcha =
  | "sinPrueba"
  | "ilegible"
  | "invalida"
  | "repetida";

export async function verificarDesafio(
  valor: string | null,
): Promise<{ ok: true } | { ok: false; motivo: FalloAltcha }> {
  if (!valor) return { ok: false, motivo: "sinPrueba" };

  let payload: Payload;
  try {
    payload = JSON.parse(
      Buffer.from(valor, "base64").toString("utf8"),
    ) as Payload;
    if (!payload?.challenge || !payload?.solution) throw new Error("incompleto");
  } catch {
    return { ok: false, motivo: "ilegible" };
  }

  const firma = payload.challenge.signature;
  if (firma && usadas.has(firma)) return { ok: false, motivo: "repetida" };

  const resultado = await verifySolution({
    challenge: payload.challenge,
    solution: payload.solution,
    deriveKey,
    hmacSignatureSecret: secreto(),
  });
  if (!resultado?.verified) return { ok: false, motivo: "invalida" };

  /* Recién acá se marca como usada: si la firma no era válida, anotarla
     dejaría que cualquiera queme firmas ajenas mandando basura. */
  if (firma) usadas.set(firma, Date.now());

  return { ok: true };
}
