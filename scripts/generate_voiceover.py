from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
TEXT_FILE = ROOT / "docs" / "voiceover.txt"
OUT_FILE = ROOT / "docs" / "voiceover.mp3"


async def main() -> None:
  text = TEXT_FILE.read_text(encoding="utf-8")
  communicate = edge_tts.Communicate(text, voice="zh-CN-XiaoxiaoNeural")
  await communicate.save(str(OUT_FILE))


if __name__ == "__main__":
  asyncio.run(main())
