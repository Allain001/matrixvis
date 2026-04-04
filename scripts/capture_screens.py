from __future__ import annotations

import http.server
import os
import socketserver
import subprocess
import threading
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIST_DIR = ROOT / "dist"
OUT_DIR = ROOT / "docs" / "screens"
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")

SECTIONS = [
  ("01-hero.png", "#hero"),
  ("02-innovation.png", "#innovation"),
  ("03-visualization.png", "#visualization"),
  ("04-lab.png", "#lab"),
  ("05-learning.png", "#learning"),
  ("06-cta.png", "#cta"),
]


class SilentHandler(http.server.SimpleHTTPRequestHandler):
  def log_message(self, format: str, *args) -> None:
    return


def run_server(port: int) -> socketserver.TCPServer:
  os.chdir(DIST_DIR)
  httpd = socketserver.TCPServer(("127.0.0.1", port), SilentHandler)
  thread = threading.Thread(target=httpd.serve_forever, daemon=True)
  thread.start()
  return httpd


def capture(url: str, output: Path) -> None:
  output.parent.mkdir(parents=True, exist_ok=True)
  cmd = [
    str(EDGE),
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1920,1080",
    "--virtual-time-budget=4000",
    f"--screenshot={output}",
    url,
  ]
  subprocess.run(cmd, check=True)


def main() -> None:
  if not EDGE.exists():
    raise SystemExit("Microsoft Edge not found.")
  if not DIST_DIR.exists():
    raise SystemExit("dist/ not found. Run npm run build:streamlit first.")

  server = run_server(4173)
  time.sleep(1.0)

  try:
    for name, anchor in SECTIONS:
      url = f"http://127.0.0.1:4173/{anchor}"
      capture(url, OUT_DIR / name)
  finally:
    server.shutdown()


if __name__ == "__main__":
  main()
