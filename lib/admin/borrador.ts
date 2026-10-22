"use client";

/**
 * El borrador de un formulario, guardado en el navegador.
 *
 * Existe porque guardar puede fallar por motivos que no tienen nada que ver con
 * lo que la persona cargó —la sesión venció, la API rechazó el pedido— y hasta
 * ahora eso se llevaba puesto el trabajo. Una cooperativa completó su ficha
 * entera y la perdió.
 *
 * Que viva en el navegador y no en el servidor es la decisión importante:
 * cuando el guardado falla es justamente porque el servidor no nos está
 * atendiendo, así que un autoguardado contra la API fallaría por lo mismo. Acá
 * también cubre cerrar la pestaña, quedarse sin batería o navegar sin querer.
 *
 * Se guarda **solo lo que se escribe**: texto, números y casillas. Los campos
 * que dibuja React desde su propio estado —el mapa, los buscadores de servicios
 * y sectores— no se tocan, porque sobreviven solos al redibujado y escribirles
 * por encima sería pelearle a React. Los archivos tampoco: no entran y
 * reponerlos a mano no se puede.
 */

/** Dónde vive cada borrador. La clave la pone quien dibuja el formulario. */
function donde(clave: string): string {
  return `facttic:borrador:${clave}`;
}

export interface Borrador {
  campos: Record<string, string | boolean>;
  cuando: number;
}

/** Los campos que tiene sentido recordar, por su `name`. */
function anotables(form: HTMLFormElement): HTMLElement[] {
  return [...form.elements].filter((el): el is HTMLElement => {
    const n = el as HTMLInputElement;
    if (!n.name || n.name.startsWith("$")) return false;
    if (n.tagName === "TEXTAREA") return true;
    if (n.tagName === "SELECT") return true;
    if (n.tagName !== "INPUT") return false;
    /* Ocultos no: son los que React dibuja desde su estado. Archivos tampoco. */
    return !["hidden", "file", "submit", "button"].includes(n.type);
  });
}

export function leerDelFormulario(form: HTMLFormElement): Borrador["campos"] {
  const campos: Borrador["campos"] = {};
  for (const el of anotables(form)) {
    const n = el as HTMLInputElement;
    campos[n.name] = n.type === "checkbox" ? n.checked : n.value;
  }
  return campos;
}

export function guardar(clave: string, form: HTMLFormElement): void {
  try {
    const campos = leerDelFormulario(form);
    const borrador: Borrador = { campos, cuando: Date.now() };
    localStorage.setItem(donde(clave), JSON.stringify(borrador));
  } catch {
    /* Sin espacio o en una ventana privada. El formulario sigue andando. */
  }
}

export function leer(clave: string): Borrador | null {
  try {
    const crudo = localStorage.getItem(donde(clave));
    if (!crudo) return null;
    const b = JSON.parse(crudo) as Borrador;
    return b && typeof b.cuando === "number" && b.campos ? b : null;
  } catch {
    return null;
  }
}

export function olvidar(clave: string): void {
  try {
    localStorage.removeItem(donde(clave));
  } catch {
    /* Ídem. */
  }
}

/** Vuelca el borrador en el formulario. Devuelve cuántos campos cambió. */
export function aplicar(form: HTMLFormElement, campos: Borrador["campos"]): number {
  let cambiados = 0;
  for (const el of anotables(form)) {
    const n = el as HTMLInputElement;
    const guardado = campos[n.name];
    if (guardado === undefined) continue;
    if (n.type === "checkbox") {
      if (n.checked === guardado) continue;
      n.checked = Boolean(guardado);
    } else {
      if (n.value === guardado) continue;
      n.value = String(guardado);
    }
    /* React escucha el evento, no la asignación: sin esto, lo que dependa del
       valor —un contador de caracteres, un botón que se habilita— no se entera. */
    n.dispatchEvent(new Event("input", { bubbles: true }));
    cambiados++;
  }
  return cambiados;
}

/** Si lo guardado dice algo distinto de lo que hoy muestra el formulario. */
export function difiere(form: HTMLFormElement, campos: Borrador["campos"]): boolean {
  const ahora = leerDelFormulario(form);
  return Object.keys(campos).some((k) => k in ahora && ahora[k] !== campos[k]);
}

/** "hace 3 minutos", para el aviso. */
export function hace(cuando: number): string {
  const minutos = Math.round((Date.now() - cuando) / 60000);
  if (minutos < 1) return "recién";
  if (minutos === 1) return "hace un minuto";
  if (minutos < 60) return `hace ${minutos} minutos`;
  const horas = Math.round(minutos / 60);
  return horas === 1 ? "hace una hora" : `hace ${horas} horas`;
}
