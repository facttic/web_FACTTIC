import { Suspense } from "react";
import { requerirSesion } from "@/lib/api/guardia";
import {
  traerCooperativa,
  traerCooperativas,
  traerCuentas,
} from "@/lib/datos/admin";
import { provinciaDe } from "@/lib/mapa/provincias";
import {
  BotonBorrar,
  Celda,
  Encabezado,
  EnlaceAdmin,
  Fila,
  Tabla,
} from "@/components/admin/piezas";
import { borrarCooperativa } from "./acciones";

export const metadata = { title: "Cooperativas" };

/**
 * Listado de cooperativas.
 *
 * Muestra de un vistazo qué le falta a cada una, que es lo que hoy tiene el
 * sitio a medio cargar: sin ubicación no aparece en el mapa federal, sin logo
 * la tarjeta muestra el nombre, y sin servicios ni sectores el panel de
 * provincia queda flojo.
 */
export default async function CooperativasPage() {
  const sesion = await requerirSesion();
  const todas = await traerCooperativas();
  /* Una cooperativa ve la suya; la Federación, todas. */
  const cooperativas = sesion.esAdmin
    ? todas
    : todas.filter((coop) =>
        sesion.cooperativas.some((suya) => suya.id === coop.id),
      );

  return (
    <div>
      <Encabezado
        titulo="Cooperativas"
        cantidad={cooperativas.length}
        /* Dar de alta una cooperativa es de la Federación: a una cooperativa
           el botón solo le daría un 403 al guardar. */
        accion={
          sesion.esAdmin ? (
            <EnlaceAdmin href="/admin/cooperativas/nueva">
              Agregar cooperativa
            </EnlaceAdmin>
          ) : null
        }
      />

      <Tabla
        columnas={[
          "Nombre",
          "Provincia",
          "Asociadxs",
          "Servicios",
          "Logo",
          "Editoras",
          "",
        ]}
      >
        {cooperativas.map((cooperativa) => {
          const provincia = cooperativa.ubicacion
            ? provinciaDe(cooperativa.ubicacion.lat, cooperativa.ubicacion.lng)
            : null;

          return (
            <Fila key={cooperativa.id}>
              <Celda className="text-p2">{cooperativa.nombre}</Celda>
              <Celda apagado={!provincia}>{provincia ?? "sin ubicación"}</Celda>
              <Celda apagado={!cooperativa.asociados}>
                {cooperativa.asociados || "—"}
              </Celda>
              <Celda apagado={cooperativa.servicios.length === 0}>
                {cooperativa.servicios.length || "—"}
              </Celda>
              <Celda apagado={!cooperativa.logo}>
                {cooperativa.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cooperativa.logo}
                    loading="lazy"
                    alt=""
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  "falta"
                )}
              </Celda>
              {/*
                Cada estado llega por su cuenta.

                El dato no está en el listado: los correos de las editoras
                salieron de ahí cuando se cerró el agujero que los dejaba a la
                vista de cualquiera, así que hay que pedir la ficha de cada
                cooperativa. Son treinta y tres pedidos, y esperarlos todos
                para dibujar la tabla sería cambiar una pantalla inmediata por
                una que tarda.

                Con un `Suspense` por fila, la tabla aparece entera y cada
                celda se completa cuando llega la suya. Y van en paralelo: no
                hay un `await` que las ponga en fila.
              */}
              <Celda>
                <Suspense fallback={<Esperando />}>
                  <EstadoEditoras id={cooperativa.id} />
                </Suspense>
              </Celda>

              <Celda className="text-right">
                <span className="flex justify-end gap-2">
                  <EnlaceAdmin
                    href={`/admin/cooperativas/${cooperativa.id}`}
                    className="bg-transparent text-blanco/70 hover:bg-superficie hover:text-blanco"
                  >
                    Editar
                  </EnlaceAdmin>
                  {sesion.esAdmin ? (
                    <BotonBorrar
                      accion={borrarCooperativa}
                      id={cooperativa.id}
                      que={cooperativa.nombre}
                    />
                  ) : null}
                </span>
              </Celda>
            </Fila>
          );
        })}
      </Tabla>
    </div>
  );
}

/** El lugar que va a ocupar el estado, para que la fila no cambie de alto. */
function Esperando() {
  return (
    <span
      aria-hidden
      className="block h-3 w-24 animate-pulse rounded bg-superficie-alta"
    />
  );
}

/**
 * Quiénes pueden editar una cooperativa y en qué anda cada una.
 *
 * Tres cosas en una línea: cuántas fueron invitadas, cuántas de esas ya
 * crearon su cuenta, y cuándo se usó por última vez.
 *
 * Lo del último acceso es lo que la API permite hoy: el login escribe
 * `updatedAt` sobre la cuenta, pero cualquier otro cambio también. Es el
 * último ingreso casi siempre; un campo propio sería un cambio en la API.
 */
async function EstadoEditoras({ id }: { id: string }) {
  const [cooperativa, cuentas] = await Promise.all([
    traerCooperativa(id),
    traerCuentas(),
  ]);

  const editoras = cooperativa?.editores ?? [];
  if (!editoras.length) {
    return <span className="text-blanco/40">sin invitar</span>;
  }

  const conCuenta = editoras
    .map((correo) => cuentas.get(correo.toLowerCase()))
    .filter((cuenta) => cuenta !== undefined);

  const ultima = conCuenta
    .map((cuenta) => cuenta.ultimaActividad)
    .filter((fecha): fecha is string => !!fecha)
    .sort()
    .at(-1);

  return (
    <span className="flex flex-col gap-0.5">
      <span>
        {conCuenta.length} de {editoras.length}{" "}
        {editoras.length === 1 ? "invitada" : "invitadas"}
        {conCuenta.length ? " con cuenta" : " sin cuenta"}
      </span>
      {ultima ? (
        <span className="text-blanco/40">
          última vez {new Date(ultima).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "short",
          })}
        </span>
      ) : null}
    </span>
  );
}
