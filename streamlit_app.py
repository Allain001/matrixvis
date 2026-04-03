from __future__ import annotations

import re
from pathlib import Path

import streamlit as st


APP_DIR = Path(__file__).parent
DIST_DIR = APP_DIR / "dist"
INDEX_FILE = DIST_DIR / "index.html"


def _normalize_asset_path(path: str) -> Path:
  asset_path = path.strip()
  if asset_path.startswith("./"):
    asset_path = asset_path[2:]
  if asset_path.startswith("/"):
    asset_path = asset_path[1:]
  return DIST_DIR / asset_path


def _inline_assets(html: str) -> str:
  def replace_css(match: re.Match[str]) -> str:
    href = match.group(1)
    css_path = _normalize_asset_path(href)
    if not css_path.exists():
      return match.group(0)
    css = css_path.read_text(encoding="utf-8")
    return f"<style>{css}</style>"

  def replace_js(match: re.Match[str]) -> str:
    src = match.group(1)
    js_path = _normalize_asset_path(src)
    if not js_path.exists():
      return match.group(0)
    js = js_path.read_text(encoding="utf-8")
    return f'<script type="module">{js}</script>'

  html = re.sub(
    r'<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>',
    replace_css,
    html,
  )
  html = re.sub(
    r'<script\s+[^>]*type="module"[^>]*src="([^"]+)"[^>]*>\s*</script>',
    replace_js,
    html,
  )
  html = re.sub(r'<link\s+[^>]*rel="modulepreload"[^>]*>', "", html)
  return html


st.set_page_config(page_title="LineaVis", layout="wide")

st.title("LineaVis")
st.caption("React + Vite build embedded in Streamlit")

if not INDEX_FILE.exists():
  st.error("未找到 dist/index.html。请先运行：npm run build:streamlit")
  st.stop()

html = INDEX_FILE.read_text(encoding="utf-8")
html = _inline_assets(html)

st.components.v1.html(html, height=900, scrolling=True)
