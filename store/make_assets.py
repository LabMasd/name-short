#!/usr/bin/env python3
"""Generate Chrome Web Store assets for name.short (masd.cc design language)."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(OUT, "screenshots"); os.makedirs(SHOTS, exist_ok=True)
ASSETS = os.path.join(OUT, "assets");     os.makedirs(ASSETS, exist_ok=True)

# palette
BG      = (17, 17, 17)
PANEL   = (26, 26, 26)
CARD    = (31, 31, 31)
BTN     = (37, 37, 37)
BORDER  = (51, 51, 51)
ACCENT  = (206, 210, 161)
WHITE   = (255, 255, 255)
TEXT    = (224, 224, 224)
DIM     = (136, 136, 136)

HN   = "/System/Library/Fonts/HelveticaNeue.ttc"
MONO = "/System/Library/Fonts/Menlo.ttc"
def f(path, size, idx=0):
    try: return ImageFont.truetype(path, size, index=idx)
    except Exception: return ImageFont.truetype(path, size)

def text_w(d, s, font):
    b = d.textbbox((0,0), s, font=font); return b[2]-b[0]

def center_pair(d, y, a, af, b, bf, w, ca=ACCENT, cb=WHITE):
    """draw 'a'+'b' horizontally centered on width w, return total width."""
    wa, wb = text_w(d,a,af), text_w(d,b,bf)
    x = (w - (wa+wb))//2
    # baseline align: use same anchor top
    d.text((x, y), a, font=af, fill=ca)
    d.text((x+wa, y), b, font=bf, fill=cb)

def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def draw_line_left(d, x, y, segs):
    for t,fn,c in segs:
        d.text((x,y), t, font=fn, fill=c); x += text_w(d,t,fn)

def draw_segments(d, y, segments, W):
    """segments: list of (text, font, color); draw centered as one line on width W.
    Arrows use Menlo so the glyph renders instead of tofu."""
    total = sum(text_w(d,t,fn) for t,fn,_ in segments)
    x = (W-total)//2
    for t,fn,c in segments:
        d.text((x,y), t, font=fn, fill=c); x += text_w(d,t,fn)

def wordmark(d, cx, y, size):
    big = f(HN, size);
    a, b = "name", ".short"
    wa, wb = text_w(d,a,big), text_w(d,b,big)
    x = cx - (wa+wb)//2
    d.text((x,y), a, font=big, fill=ACCENT)
    d.text((x+wa,y), b, font=big, fill=WHITE)

# ---------------------------------------------------------------- screenshot 1
def shot1():
    W,H = 1280,800
    img = Image.new("RGB",(W,H),BG); d = ImageDraw.Draw(img)
    rrect(d,(40,40,W-40,H-40), 24, outline=(34,34,34), width=2)
    wordmark(d, W//2, 150, 96)
    tag = f(HN, 32); arr = f(MONO, 30)
    draw_segments(d, 280, [("long names   ",tag,DIM),("→",arr,ACCENT),("   tidy, folder-safe slugs",tag,DIM)], W)
    # before/after card
    cx0,cy0,cx1,cy1 = 250,380,W-250,650
    rrect(d,(cx0,cy0,cx1,cy1), 18, fill=CARD, outline=BORDER, width=2)
    lbl = f(HN, 20)
    mono_in  = f(MONO, 30)
    mono_out = f(MONO, 52)
    d.text((cx0+40, cy0+34), "BEFORE", font=lbl, fill=DIM)
    d.text((cx0+40, cy0+70), "Perfume Campaign Final Delivery 2026", font=mono_in, fill=DIM)
    d.line((cx0+40, cy0+130, cx1-40, cy0+130), fill=(40,40,40), width=2)
    d.text((cx0+40, cy0+150), "AFTER", font=lbl, fill=ACCENT)
    d.text((cx0+40, cy0+182), "perfume-campaign-2026", font=mono_out, fill=WHITE)
    foot = f(HN, 24)
    s = "runs entirely in your browser · nothing leaves the page"
    d.text(((W-text_w(d,s,foot))//2, 700), s, font=foot, fill=DIM)
    img.save(os.path.join(SHOTS,"screenshot-1.png"))

# ---------------------------------------------------------------- screenshot 2
def shot2():
    W,H = 1280,800
    img = Image.new("RGB",(W,H),BG); d = ImageDraw.Draw(img)
    rrect(d,(40,40,W-40,H-40), 24, outline=(34,34,34), width=2)
    title = f(HN, 56)
    d.text((100, 90), "five ways to shorten", font=title, fill=WHITE)
    sub = f(HN, 26)
    d.text((103, 168), "pick the strategy that fits — every case style supported", font=sub, fill=DIM)
    rows = [
        ("smart",        "Client Brand Identity Working Files", "client-brand-identity"),
        ("initials",     "Quarterly Business Review Deck",      "qbrd"),
        ("drop vowels",  "Summer Photoshoot Raw Exports",       "summr-phtsht-rw"),
        ("truncate",     "Website Redesign Master Assets",      "webs-rede-mast-asse"),
    ]
    mono_in  = f(MONO, 24)
    mono_out = f(MONO, 28)
    chip = f(HN, 22)
    def fit(s, font, maxw):
        if text_w(d,s,font) <= maxw: return s
        while s and text_w(d,s+"…",font) > maxw: s = s[:-1]
        return s+"…"
    y = 250
    for strat, src, dst in rows:
        rrect(d,(100,y,W-100,y+96), 14, fill=PANEL, outline=BORDER, width=2)
        # strategy chip
        cw = text_w(d,strat,chip)+36
        rrect(d,(124,y+30,124+cw,y+66), 18, fill=BTN, outline=BORDER, width=1)
        d.text((124+18,y+36), strat, font=chip, fill=ACCENT)
        out_x = W-100-text_w(d,dst,mono_out)-30
        in_x  = 124+cw+34
        d.text((in_x, y+37), fit(src, mono_in, out_x-in_x-40), font=mono_in, fill=DIM)
        d.text((out_x, y+35), dst, font=mono_out, fill=WHITE)
        y += 116
    img.save(os.path.join(SHOTS,"screenshot-2.png"))

# ---------------------------------------------------------------- screenshot 3
def shot3():
    W,H = 1280,800
    img = Image.new("RGB",(W,H),BG); d = ImageDraw.Draw(img)
    rrect(d,(40,40,W-40,H-40), 24, outline=(34,34,34), width=2)
    # left copy
    title = f(HN, 50)
    d.text((100,150), "right-click to shorten", font=title, fill=WHITE)
    body = f(HN, 27); arr = f(MONO, 25)
    yy=240
    d.text((103,yy),"Select any text on any page,",font=body,fill=DIM); yy+=42
    draw_line_left(d,103,yy,[("then “Shorten ",body,DIM),("→",arr,ACCENT),(" copy slug”.",body,DIM)]); yy+=84
    d.text((103,yy),"Smart filler-drop · date stamps",font=body,fill=DIM); yy+=42
    d.text((103,yy),"max-length · ascii-safe.",font=body,fill=DIM); yy+=84
    d.text((103,yy),"100% local. No tracking. Free.",font=body,fill=DIM)
    # right: faux context menu
    mx,my = 720,250
    rrect(d,(mx,my,mx+440,my+250), 14, fill=(24,24,24), outline=BORDER, width=2)
    item = f(HN, 24); mono=f(MONO,24); marr=f(MONO,24)
    d.text((mx+28,my+30), "Copy", font=item, fill=DIM)
    d.text((mx+28,my+74), "Paste", font=item, fill=DIM)
    d.line((mx+16,my+120,mx+424,my+120), fill=BORDER, width=1)
    rrect(d,(mx+10,my+134,mx+430,my+186), 8, fill=BTN)
    draw_line_left(d,mx+28,my+148,[("Shorten “Final…” ",item,ACCENT),("→",marr,ACCENT),(" copy slug",item,ACCENT)])
    draw_line_left(d,mx+28,my+206,[("→",mono,WHITE),("  final-delivery",mono,WHITE)])
    wordmark(d, W//2, 640, 56)
    img.save(os.path.join(SHOTS,"screenshot-3.png"))

# ---------------------------------------------------------------- promo tiles
def small_tile():
    W,H = 440,280
    img = Image.new("RGB",(W,H),BG); d = ImageDraw.Draw(img)
    rrect(d,(0,0,W-1,H-1), 0, outline=(34,34,34), width=2)
    wordmark(d, W//2, 96, 44)
    tag=f(HN,18); arr=f(MONO,17)
    draw_segments(d,164,[("long names  ",tag,DIM),("→",arr,ACCENT),("  tidy slugs",tag,DIM)],W)
    mono=f(MONO,16)
    s="perfume-campaign-2026"
    rrect(d,(70,200,W-70,236), 10, fill=CARD, outline=BORDER, width=1)
    d.text(((W-text_w(d,s,mono))//2,209), s, font=mono, fill=ACCENT)
    img.save(os.path.join(ASSETS,"small-tile-440x280.png"))

def marquee():
    W,H = 1400,560
    img = Image.new("RGB",(W,H),BG); d = ImageDraw.Draw(img)
    rrect(d,(0,0,W-1,H-1), 0, outline=(34,34,34), width=2)
    wordmark(d, W//2, 180, 120)
    tag=f(HN,40)
    s="turn long names into short, folder-safe slugs"
    d.text(((W-text_w(d,s,tag))//2,360), s, font=tag, fill=DIM)
    img.save(os.path.join(ASSETS,"marquee-1400x560.png"))

for fn in (shot1, shot2, shot3, small_tile, marquee):
    fn(); print("✓", fn.__name__)
print("done")
