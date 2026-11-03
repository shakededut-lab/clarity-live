"""Crop Procreate companion layers to the shared square box and save as 512px webp.
Usage: python3 scripts/crop-companion.py input.png output-name
"""
import sys
from PIL import Image

BOX = (66, 565, 2342, 2841)  # same box for every layer, so layers stay aligned

src, name = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA").crop(BOX).resize((512, 512), Image.LANCZOS)
img.save(f"public/companion/{name}.webp", quality=90)
print(f"saved public/companion/{name}.webp")
