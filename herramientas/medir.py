#!/usr/bin/env python3
"""Chrome headless por CDP: mide el sitio al ancho real y saca capturas.

Sirve para contrastar contra las maquetas: la extensión del browser dice que
redimensiona pero no cambia el viewport, así que para revisar mobile hace falta
un Chrome propio con el ancho fijado de verdad.

  ANCHO=393  python3 herramientas/medir.py shot home-mobile.png
  ANCHO=1440 URL=http://localhost:3000/proyectos python3 herramientas/medir.py js "document.title"
  IDIOMA=en-US python3 herramientas/medir.py js "navigator.languages"

Con un tercer argumento, `shot` y `vista` corren ese JavaScript antes de
capturar: sirve para fotografiar lo que solo existe después de tocar algo —un
panel, una solapa, un desplegable—.

  python3 herramientas/medir.py vista panel.png "document.querySelector('button').click()"

`vista` saca solo lo que entra en pantalla; `shot`, la página entera. Para algo
que flota sobre el resto —un diálogo— va `vista`: la página entera lo deja
diminuto arriba de todo.
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

URL = os.environ.get("URL", "http://localhost:3000/")
#
# El idioma del navegador. Lo pide `IDIOMA=en-US`, y Chrome lo refleja en
# `navigator.languages` y en la cabecera `Accept-Language`. Hace falta para
# probar lo que depende de eso: la autodetección de idioma del sitio y el
# saludo de la consola, que habla el del navegador y no el de la URL.
#
IDIOMA = os.environ.get("IDIOMA", "es-AR")
ANCHO, ALTO = int(os.environ.get("ANCHO", 393)), 900
PUERTO = 9333
PERFIL = "/tmp/claude-1000/chrome-perfil-facttic"


#
# Chrome headless se declara táctil: `(hover: hover)` y `(pointer: fine)` dan
# falso. Tailwind envuelve **todas** las variantes `hover:` en
# `@media (hover: hover)`, así que sin esto ningún hover del sitio se puede
# verificar: la clase aparece en el DOM, la regla está en el CSS y aun así no
# aplica, que parece un error del proyecto y no lo es.
#
# `Emulation.setEmulatedMedia` no sirve —no acepta `hover` ni `pointer`—; hay
# que decírselo a Blink al arrancar. Los valores son los del enum: hover=2,
# pointer fino=4.
#
HOVER_DE_MOUSE = (
    "--blink-settings=primaryHoverType=2,availableHoverTypes=2,"
    "primaryPointerType=4,availablePointerTypes=4"
)


def arrancar():
    proc = subprocess.Popen(
        [
            "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", f"--remote-debugging-port={PUERTO}",
            "--remote-allow-origins=*", HOVER_DE_MOUSE,
            f"--lang={IDIOMA}", f"--accept-lang={IDIOMA}",
            f"--user-data-dir={PERFIL}", f"--window-size={ANCHO},{ALTO}",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    for _ in range(50):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PUERTO}/json/version", timeout=1):
                return proc
        except Exception:
            time.sleep(0.2)
    raise RuntimeError("Chrome no levantó")


class Sesion:
    def __init__(self):
        # Chrome moderno exige PUT para abrir pestaña por HTTP.
        pedido = urllib.request.Request(
            f"http://127.0.0.1:{PUERTO}/json/new?about:blank", method="PUT"
        )
        with urllib.request.urlopen(pedido) as r:
            objetivo = json.load(r)
        self.ws = websocket.create_connection(objetivo["webSocketDebuggerUrl"], timeout=60)
        self.n = 0

    def cmd(self, metodo, **params):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError(msg["error"])
                return msg.get("result", {})

    def cargar(self):
        self.cmd("Emulation.setDeviceMetricsOverride", width=ANCHO, height=ALTO,
                 deviceScaleFactor=1, mobile=True)
        self.cmd("Page.enable")
        self.cmd("Page.navigate", url=URL)
        time.sleep(6)

    def js(self, expr):
        r = self.cmd("Runtime.evaluate", expression=expr, returnByValue=True,
                     awaitPromise=True)
        return r.get("result", {}).get("value")

    def vista(self, salida):
        """Solo lo que entra en pantalla, sin recorrer la página.

        Es lo que corresponde para un diálogo o cualquier cosa que flote: la
        captura de página completa la dibuja del tamaño del viewport arriba de
        todo y deja debajo metros de fondo.
        """
        r = self.cmd("Page.captureScreenshot", format="png")
        with open(salida, "wb") as f:
            f.write(base64.b64decode(r["data"]))
        return ANCHO, ALTO

    def captura(self, salida):
        """Captura la página entera SIN agrandar el viewport.

        Agrandarlo falsea el resultado: el hero usa `min-h-svh`, así que crece
        con la ventana y la captura sale al doble de largo. Con `clip` se pide
        el área completa manteniendo el viewport en su alto real.
        """
        # Las animaciones y los contadores arrancan con IntersectionObserver, así
        # que hay que recorrer la página antes de capturar: si no, todo lo que
        # nunca entró en pantalla sale vacío.
        m = self.cmd("Page.getLayoutMetrics")
        alto = int(m["cssContentSize"]["height"])
        for y in range(0, alto, ALTO // 2):
            self.js(f"window.scrollTo(0, {y})")
            time.sleep(0.35)
        self.js("window.scrollTo(0, 0)")
        time.sleep(2.5)

        # Las entradas usan `animation-timeline: view()`, que no "queda hecha":
        # el progreso lo marca la posición de scroll, así que todo lo que está
        # lejos del viewport vuelve a su estado inicial —invisible— apenas se
        # sube al tope. Para la captura completa se apagan y se deja el final.
        self.js("""
          const sel = '.revelar-al-entrar,.crecer-al-entrar,[data-revelar],'
            + '[class*=revelar],[class*=entrar]';
          const e = document.createElement('style');
          e.textContent = sel + '{animation-timeline:none !important;'
            + 'animation-name:none !important;opacity:1 !important;'
            + 'transform:none !important;filter:none !important}';
          document.head.appendChild(e);
          document.querySelectorAll(sel).forEach(n => {
            n.style.setProperty('opacity', '1', 'important');
            n.style.setProperty('transform', 'none', 'important');
            n.style.setProperty('filter', 'none', 'important');
          });
        """)
        time.sleep(0.6)

        m = self.cmd("Page.getLayoutMetrics")
        alto = int(m["cssContentSize"]["height"])
        r = self.cmd(
            "Page.captureScreenshot", format="png", captureBeyondViewport=True,
            clip={"x": 0, "y": 0, "width": ANCHO, "height": alto, "scale": 1},
        )
        with open(salida, "wb") as f:
            f.write(base64.b64decode(r["data"]))
        return ANCHO, alto


if __name__ == "__main__":
    proc = arrancar()
    try:
        s = Sesion()
        s.cargar()
        if sys.argv[1] == "js":
            print(json.dumps(s.js(sys.argv[2]), indent=1, ensure_ascii=False))
        else:
            if len(sys.argv) > 3:
                s.js(sys.argv[3])
                time.sleep(1.2)
            if sys.argv[1] == "vista":
                print("capturado:", s.vista(sys.argv[2]))
            else:
                print("capturado:", s.captura(sys.argv[2]))
    finally:
        proc.terminate()
