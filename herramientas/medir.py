#!/usr/bin/env python3
"""Chrome headless por CDP: mide el sitio al ancho real y saca capturas.

Sirve para contrastar contra las maquetas: la extensión del browser dice que
redimensiona pero no cambia el viewport, así que para revisar mobile hace falta
un Chrome propio con el ancho fijado de verdad.

  ANCHO=393  python3 herramientas/medir.py shot home-mobile.png
  ANCHO=1440 URL=http://localhost:3000/proyectos python3 herramientas/medir.py js "document.title"
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
ANCHO, ALTO = int(os.environ.get("ANCHO", 393)), 900
PUERTO = 9333
PERFIL = "/tmp/claude-1000/chrome-perfil-facttic"


def arrancar():
    proc = subprocess.Popen(
        [
            "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", f"--remote-debugging-port={PUERTO}",
            "--remote-allow-origins=*",
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
            print("capturado:", s.captura(sys.argv[2]))
    finally:
        proc.terminate()
