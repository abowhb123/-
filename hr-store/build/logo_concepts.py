"""
أفكار بديلة لشعار سنعها (الخطوة 3)
التشغيل: video-lab/.venv/bin/python hr-store/build/logo_concepts.py
الناتج: hr-store/brand/concepts/*.svg
"""
import math
import os

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'brand', 'concepts')
FONT = os.path.join(ROOT, '..', 'video-lab', 'public', 'fonts', 'Alexandria.ttf')
os.makedirs(OUT, exist_ok=True)

TEAL, SAND, CREAM, GREEN, INK = '#0F5E63', '#E9A35B', '#F7F3EC', '#3BB273', '#0B2E30'

face = hb.Face(hb.Blob.from_file_path(FONT))
UPEM = face.upem


def shape(text, weight=800):
    font = hb.Font(face)
    font.set_variations({'wght': weight})
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {})
    return font, buf


def contours_of(font, gid):
    rec = RecordingPen()
    font.draw_glyph_with_pen(gid, rec)
    out, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            out.append(cur)
            cur = []
    return out


def word_path(text, size, weight=800, drop_dot_of=None):
    """مسار النص. drop_dot_of: رقم الحرف اللي نشيل نقطته (ونرجّع مكانها)"""
    font, buf = shape(text, weight)
    s = size / UPEM
    pen = SVGPathPen(None)
    x = 0
    dot_center = None
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        tf = (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s)
        cs = contours_of(font, info.codepoint)
        if drop_dot_of is not None and info.cluster == drop_dot_of and len(cs) > 1:
            # أصغر شكل مغلق فوق الحرف = النقطة
            def bbox(c):
                bp = BoundsPen(None)
                r = RecordingPen()
                r.value = c
                r.replay(bp)
                return bp.bounds

            bbs = [bbox(c) for c in cs]
            # النقطة = الشكل اللي أسفله أعلى من باقي الأشكال (مرفوع فوق جسم الحرف)
            k = max(range(len(bbs)), key=lambda j: bbs[j][1])
            b = bbs[k]
            dot_center = ((x + pos.x_offset + (b[0] + b[2]) / 2) * s, -(b[1] + b[3]) / 2 * s, (b[2] - b[0]) * s)
            cs = cs[:k] + cs[k + 1:]
        tp = TransformPen(pen, tf)
        for c in cs:
            r = RecordingPen()
            r.value = c
            r.replay(tp)
        x += pos.x_advance
    ext = font.get_font_extents('ltr')
    return pen.getCommands(), x * s, ext.ascender * s, dot_center


def check(cx, cy, w, color, sw):
    return (f'<path d="M{cx - w * 0.5} {cy} L{cx - w * 0.12} {cy + w * 0.38} L{cx + w * 0.55} {cy - w * 0.42}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')


def save(name, w, h, body):
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">{body}</svg>\n')
    print('✓', name)


# ── ب) النقطة صارت ✓ : نقطة النون في "سنعها" تتحول لعلامة صح ──
d, ww, asc, dot = word_path('سنعها', 200, 800, drop_dot_of=1)
pad = 40
W, H = ww + pad * 2, 330
base = 250
body = f'<path transform="translate({pad},{base})" d="{d}" fill="{TEAL}"/>'
if dot:
    cx, cy, dw = pad + dot[0], base + dot[1], dot[2]
    body += check(cx + 6, cy - 14, dw * 2.6, SAND, dw * 0.62)
save('b-dot-check.svg', W, H, body)

# ── ج) الختم: "مُسنّع" مثل ختم الاعتماد ──
d2, w2, a2, _ = word_path('سنعها', 78, 800)
R = 200
body = f'''
<circle cx="{R}" cy="{R}" r="{R - 6}" fill="{CREAM}" stroke="{TEAL}" stroke-width="12"/>
<circle cx="{R}" cy="{R}" r="{R - 66}" fill="none" stroke="{TEAL}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
<defs><path id="ring" d="M {R - 160} {R} A 160 160 0 1 1 {R + 160} {R}"/></defs>
<text font-family="Alexandria" font-weight="600" font-size="27" fill="{TEAL}" letter-spacing="0.5"><textPath href="#ring" startOffset="50%" text-anchor="middle">أدوات الموارد البشرية · جاهزة</textPath></text>
<path transform="translate({R - w2 / 2},{R + 86})" d="{d2}" fill="{TEAL}"/>
{check(R, R - 22, 78, SAND, 20)}
'''
save('c-stamp.svg', R * 2, R * 2, body)

# ── د) الملف المسنّع: ملف بزاوية مطوية وعليه ✓ ──
d3, w3, a3, _ = word_path('سنعها', 150, 800)
fw, fh = 150, 186
fold = 46
gap = 34
W = 40 + w3 + gap + fw + 40
H = 260
fx = W - 40 - fw
fy = (H - fh) / 2
body = f'''
<path d="M{fx + 22} {fy} H{fx + fw - fold} L{fx + fw} {fy + fold} V{fy + fh - 22} Q{fx + fw} {fy + fh} {fx + fw - 22} {fy + fh} H{fx + 22} Q{fx} {fy + fh} {fx} {fy + fh - 22} V{fy + 22} Q{fx} {fy} {fx + 22} {fy} Z" fill="{TEAL}"/>
<path d="M{fx + fw - fold} {fy} V{fy + fold - 10} Q{fx + fw - fold} {fy + fold} {fx + fw - fold + 10} {fy + fold} H{fx + fw} Z" fill="{SAND}"/>
<path d="M{fx + 30} {fy + fh - 40} H{fx + fw - 30}" stroke="rgba(255,255,255,0.25)" stroke-width="8" stroke-linecap="round"/>
{check(fx + fw / 2, fy + fh / 2 - 6, 74, SAND, 17)}
<path transform="translate(40,{H / 2 + 52})" d="{d3}" fill="{TEAL}"/>
'''
save('d-file.svg', W, H, body)

# ── هـ) الحرف "س": أسنان السين أعمدة رسم بياني صاعدة، وآخرها ✓ ──
S = 300
body = f'<rect width="{S}" height="{S}" rx="72" fill="{TEAL}"/>'
bars = [(70, 150), (122, 118), (174, 86)]
for x, top in bars:
    body += f'<rect x="{x}" y="{top}" width="34" height="{196 - top}" rx="17" fill="{CREAM}"/>'
body += f'<path d="M58 196 Q 58 238 100 238 H 236" fill="none" stroke="{CREAM}" stroke-width="34" stroke-linecap="round"/>'
body += check(236, 92, 70, SAND, 22)
save('e-seen-chart.svg', S, S, body)

d4, w4, a4, _ = word_path('سنعها', 150, 800)
W = 40 + w4 + 30 + 210 + 30
H = 260
mark = body.replace(f'<rect width="{S}" height="{S}" rx="72"', f'<rect width="{S}" height="{S}" rx="72"')
body5 = f'<g transform="translate({W - 30 - 210},{(H - 210) / 2}) scale({210 / S})">{mark}</g>'
body5 += f'<path transform="translate(40,{H / 2 + 52})" d="{d4}" fill="{TEAL}"/>'
save('e-seen-chart-horizontal.svg', W, H, body5)
