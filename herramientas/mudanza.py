#!/usr/bin/env python3
"""
La mudanza del dominio, en vivo.

Mira al mismo tiempo los servidores autoritativos del dominio y un puñado de
resolvers públicos repartidos por el mundo, y muestra cuáles ya contestan la
dirección nueva. Abajo, qué responde el sitio.

Sirve para hacerlo con pantalla compartida: el cambio en el autoritativo se ve
en el acto, y los resolvers van cayendo de a uno mientras se vence el TTL. Es
el minuto que hay que llenar hablando.

    python3 herramientas/mudanza.py

Para ensayarlo antes, con un dominio que ya está mudado:

    python3 herramientas/mudanza.py --ensayo

No necesita instalar nada: usa `dig` y `curl`, que ya están.
"""

import concurrent.futures
import os
import re
import shutil
import ssl
import socket
import subprocess
import sys
import time
from datetime import datetime, timezone

DOMINIO = "facttic.org.ar"
VIEJO = "138.197.219.63"
NUEVO = "76.76.21.21"
# Un dominio puede contestar más de una dirección; alcanza con que sea una.
NUEVOS = {NUEVO}

# El que manda: acá el cambio aparece apenas se guarda, sin caché de por medio.
AUTORITATIVOS = [("ns3.hostmar.com", "ns3"), ("ns4.hostmar.com", "ns4")]

# Resolvers públicos, que son los que tardan lo que diga el TTL.
RESOLVERS = [
    ("8.8.8.8", "Google"),
    ("1.1.1.1", "Cloudflare"),
    ("9.9.9.9", "Quad9"),
    ("208.67.222.222", "OpenDNS"),
    ("94.140.14.14", "AdGuard"),
    ("77.88.8.8", "Yandex"),
    ("185.228.168.9", "CleanBrowsing"),
    ("76.76.2.0", "ControlD"),
]

VERDE, ROJO, GRIS, AMARILLO = "\033[32m", "\033[31m", "\033[90m", "\033[33m"
NEGRITA, FIN = "\033[1m", "\033[0m"
INICIO = "\033[H"
BORRAR_HASTA_EL_FINAL = "\033[J"


def consultar(servidor: str) -> str:
    """La dirección que contesta un servidor, o '' si no contesta."""
    try:
        salida = subprocess.run(
            ["dig", f"@{servidor}", "+short", DOMINIO, "A", "+time=3", "+tries=2"],
            capture_output=True, text=True, timeout=9,
        ).stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return ""
    direcciones = [l for l in salida.split() if re.fullmatch(r"[\d.]+", l)]
    return direcciones[0] if direcciones else ""


def sitio() -> dict:
    """Qué responde el dominio: código, quién lo sirve y cuánto tarda."""
    try:
        salida = subprocess.run(
            ["curl", "-sI", "--max-time", "4", f"https://{DOMINIO}/",
             "-w", "\n%{http_code} %{time_total}"],
            capture_output=True, text=True, timeout=6,
        ).stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return {}
    codigo, _, demora = salida.strip().split("\n")[-1].partition(" ")
    titulo = ""
    try:
        cuerpo = subprocess.run(
            ["curl", "-s", "--max-time", "4", f"https://{DOMINIO}/"],
            capture_output=True, text=True, timeout=6,
        ).stdout
        encontrado = re.search(r"(?is)<title>(.*?)</title>", cuerpo)
        titulo = encontrado.group(1).strip() if encontrado else ""
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    servidor = re.search(r"(?im)^server:\s*(.+)$", salida)
    return {
        "codigo": codigo,
        "titulo": titulo,
        "demora": f"{float(demora or 0) * 1000:.0f} ms",
        "servidor": servidor.group(1).strip() if servidor else "—",
        # Mientras no sea el dominio de verdad, el sitio se pide no indexar.
        "noindex": bool(re.search(r"(?im)^x-robots-tag:", salida)),
    }


def certificado() -> str:
    try:
        contexto = ssl.create_default_context()
        with socket.create_connection((DOMINIO, 443), timeout=4) as cruda:
            with contexto.wrap_socket(cruda, server_hostname=DOMINIO) as tls:
                vence = tls.getpeercert()["notAfter"]
        fecha = datetime.strptime(vence, "%b %d %H:%M:%S %Y %Z")
        dias = (fecha.replace(tzinfo=timezone.utc) - datetime.now(timezone.utc)).days
        return f"válido hasta {fecha:%d/%m/%Y} ({dias} días)"
    except Exception:
        return "no se pudo leer"


def barra(hechos: int, total: int, ancho: int = 28) -> str:
    lleno = round(ancho * hechos / total) if total else 0
    color = VERDE if hechos == total else AMARILLO if hechos else GRIS
    return f"{color}{'█' * lleno}{GRIS}{'░' * (ancho - lleno)}{FIN}"


def main() -> None:
    arranque = time.monotonic()
    mudados: dict[str, float] = {}
    todos = [(s, n, "autoritativo") for s, n in AUTORITATIVOS]
    todos += [(s, n, "resolver") for s, n in RESOLVERS]

    print("\033[?25l", end="")  # Sin cursor: titila menos en pantalla compartida.
    try:
        while True:
            with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
                respuestas = dict(zip(
                    [s for s, _, _ in todos],
                    pool.map(lambda t: consultar(t[0]), todos),
                ))
            estado = sitio()
            ahora = time.monotonic() - arranque
            for servidor, direccion in respuestas.items():
                if direccion in NUEVOS and servidor not in mudados:
                    mudados[servidor] = ahora

            ancho = min(shutil.get_terminal_size((80, 24)).columns, 78)
            l = [f"{INICIO}"]
            titulo = f"MUDANZA DE {DOMINIO.upper()}"
            reloj = f"{datetime.now():%H:%M:%S}"
            hueco = max(ancho - 2 - len(titulo) - len(reloj), 1)
            l.append(f"  {NEGRITA}{titulo}{FIN}{' ' * hueco}{GRIS}{reloj}{FIN}")
            l.append(f"  {GRIS}{'─' * (ancho - 2)}{FIN}")
            l.append(f"  {ROJO}●{FIN} {VIEJO:<16} servidor viejo"
                     f"      {VERDE}●{FIN} {NUEVO:<14} Vercel")
            l.append("")

            for titulo, clase, nota in [
                ("SERVIDORES DEL DOMINIO", "autoritativo", "cambian al instante"),
                ("RESOLVERS DEL MUNDO", "resolver", "tardan lo que diga el TTL"),
            ]:
                l.append(f"  {NEGRITA}{titulo}{FIN}  {GRIS}{nota}{FIN}")
                for servidor, nombre, propia in todos:
                    if propia != clase:
                        continue
                    direccion = respuestas.get(servidor, "")
                    if direccion in NUEVOS:
                        marca = f"{VERDE}● NUEVO{FIN}"
                        cuando = f"{GRIS}+{mudados[servidor]:.0f} s{FIN}"
                    elif direccion == VIEJO:
                        marca, cuando = f"{ROJO}● viejo{FIN}", ""
                    elif direccion:
                        marca, cuando = f"{AMARILLO}● otra{FIN}", ""
                    else:
                        marca, cuando = f"{GRIS}· sin respuesta{FIN}", ""
                    l.append(f"    {nombre:<14} {GRIS}{servidor:<16}{FIN}"
                             f"{direccion or '—':<17}{marca} {cuando}")
                l.append("")

            hechos = sum(1 for s, _ in RESOLVERS if respuestas.get(s) in NUEVOS)
            l.append(f"    {barra(hechos, len(RESOLVERS))}  "
                     f"{NEGRITA}{hechos} de {len(RESOLVERS)}{FIN} resolvers mudados")
            l.append("")

            l.append(f"  {NEGRITA}EL SITIO{FIN}")
            if estado:
                quien = estado["servidor"]
                color = VERDE if "vercel" in quien.lower() else ROJO
                l.append(f"    https://{DOMINIO:<22}{estado['codigo']}   "
                         f"{color}{quien:<22}{FIN}{GRIS}{estado['demora']}{FIN}")
                l.append(f"    título{'':<24}{estado['titulo'][:46] or '—'}")
                indexa = (f"{ROJO}pide no indexarse{FIN}" if estado["noindex"]
                          else f"{VERDE}indexable{FIN}")
                l.append(f"    buscadores{'':<20}{indexa}")
            else:
                l.append(f"    {GRIS}sin respuesta todavía{FIN}")
            l.append(f"    certificado{'':<19}{GRIS}{certificado()}{FIN}")
            l.append("")

            if hechos == len(RESOLVERS):
                tardanza = max(mudados.values()) if mudados else 0
                l.append(f"  {VERDE}{NEGRITA}EL DOMINIO ESTÁ EN EL AIRE{FIN}"
                         f"   {GRIS}todo el mundo lo ve en {tardanza:.0f} segundos{FIN}")
            else:
                l.append(f"  {GRIS}corriendo hace {ahora:.0f} s"
                         f"   ·   Ctrl-C para salir{FIN}")

            print("\n".join(l) + BORRAR_HASTA_EL_FINAL, flush=True)
            time.sleep(2)
    except KeyboardInterrupt:
        pass
    finally:
        print("\033[?25h")  # Devolver el cursor.


if __name__ == "__main__":
    if "--ensayo" in sys.argv:
        # El subdominio que ya está en Vercel, para ver cómo se ve todo en verde
        # antes de hacerlo en vivo. Contesta más de una dirección, así que valen
        # todas las que devuelva hoy.
        DOMINIO = "dev.facttic.org.ar"
        NUEVOS = set(socket.gethostbyname_ex(DOMINIO)[2])
        NUEVO = sorted(NUEVOS)[0]
    os.system("")  # Enciende los colores en terminales que arrancan sin ellos.
    main()
