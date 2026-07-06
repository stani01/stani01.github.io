"""Generate the TV Tracker PWA/tab icons from the "T for Tracker" design.

Run:  python gen_icons.py
Produces PNG app icons + a multi-size favicon.ico that match icons/icon.svg:
a dark navy rounded tile with a bold "T" (warm accent fading to mint) and a
mint baseline. Re-run any time to regenerate. Safe to delete this script; it is
not needed at runtime.
"""
import os
from PIL import Image, ImageDraw

OUT = os.path.dirname(os.path.abspath(__file__))

# Theme colours (match tv/css/tv.css custom properties).
TILE_TOP = (19, 35, 63)     # #13233f
TILE_BOT = (6, 11, 24)      # #060b18
T_TOP = (255, 178, 122)     # #ffb27a
T_MID = (255, 138, 91)      # #ff8a5b (accent)
MINT = (46, 196, 182)       # #2ec4b6

BASE = 512  # design coordinate space (matches icon.svg viewBox)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgradient(px, top, bot):
    grad = Image.new("RGB", (1, px))
    for y in range(px):
        grad.putpixel((0, y), lerp(top, bot, y / max(1, px - 1)))
    return grad.resize((px, px)).convert("RGBA")


def tee_gradient(px):
    """Vertical orange -> accent -> mint gradient used to fill the T."""
    grad = Image.new("RGB", (1, px))
    for y in range(px):
        t = y / max(1, px - 1)
        grad.putpixel((0, y), lerp(T_TOP, T_MID, t * 2) if t < 0.5 else lerp(T_MID, MINT, (t - 0.5) * 2))
    return grad.resize((px, px)).convert("RGBA")


def scaled(px, *coords):
    s = px / BASE
    return [c * s for c in coords]


def rounded_mask(px, radius):
    m = Image.new("L", (px, px), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, px - 1, px - 1], radius=radius, fill=255)
    return m


def make_icon(px, rounded=True, baseline=True):
    img = vgradient(px, TILE_TOP, TILE_BOT)

    # T-shape mask (crossbar + stem) in the 512 design space, scaled to px.
    tmask = Image.new("L", (px, px), 0)
    md = ImageDraw.Draw(tmask)
    x0, y0, x1, y1 = scaled(px, 118, 122, 118 + 276, 122 + 66)
    md.rounded_rectangle([x0, y0, x1, y1], radius=max(2, px * 20 / BASE), fill=255)
    x0, y0, x1, y1 = scaled(px, 223, 122, 223 + 66, 122 + 244)
    md.rounded_rectangle([x0, y0, x1, y1], radius=max(2, px * 20 / BASE), fill=255)

    img = Image.composite(tee_gradient(px), img, tmask)

    if baseline:
        overlay = Image.new("RGBA", (px, px), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        x0, y0, x1, y1 = scaled(px, 196, 382, 196 + 120, 382 + 16)
        od.rounded_rectangle([x0, y0, x1, y1], radius=max(1, px * 8 / BASE), fill=MINT + (230,))
        img = Image.alpha_composite(img, overlay)

    if rounded:
        img.putalpha(rounded_mask(px, int(px * 0.22)))
    return img


def save(img, name):
    img.save(os.path.join(OUT, name))
    print("wrote", name)


# Rounded app icons for the manifest (purpose: any).
save(make_icon(192), "icon-192.png")
save(make_icon(512), "icon-512.png")
# Maskable: full-bleed square tile (platform applies its own mask). Content
# stays inside the safe zone, so keep the same layout without rounding.
save(make_icon(512, rounded=False), "maskable-512.png")
# Apple touch icon: full-bleed (iOS rounds the corners itself).
save(make_icon(180, rounded=False), "apple-touch-icon.png")
# Tab favicon PNG fallback (SVG is preferred by modern browsers).
save(make_icon(32, baseline=False), "favicon-32.png")

# Multi-size favicon.ico placed at the tv/ root.
ico = make_icon(64, baseline=False)
ico.save(os.path.join(OUT, "..", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote ../favicon.ico")
print("Done.")
