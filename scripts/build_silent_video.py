from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SCREEN_DIR = ROOT / "docs" / "screens"
OUT_FILE = ROOT / "docs" / "demo_silent.mp4"

SEQUENCE = [
  ("01-hero.png", 25),
  ("02-innovation.png", 20),
  ("03-visualization.png", 25),
  ("04-lab.png", 25),
  ("05-learning.png", 20),
  ("06-cta.png", 15),
]


def read_image(path: Path):
  data = np.fromfile(str(path), dtype=np.uint8)
  if data.size == 0:
    return None
  return cv2.imdecode(data, cv2.IMREAD_COLOR)


def main() -> None:
  first = read_image(SCREEN_DIR / SEQUENCE[0][0])
  if first is None:
    raise SystemExit("Screenshots not found. Run scripts/capture_screens.py first.")

  height, width, _ = first.shape
  fps = 25
  writer = cv2.VideoWriter(
    str(OUT_FILE),
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps,
    (width, height),
  )

  for name, duration in SEQUENCE:
    frame = read_image(SCREEN_DIR / name)
    if frame is None:
      raise SystemExit(f"Missing frame: {name}")
    if frame.shape[:2] != (height, width):
      frame = cv2.resize(frame, (width, height))
    for _ in range(duration * fps):
      writer.write(frame)

  writer.release()


if __name__ == "__main__":
  main()
