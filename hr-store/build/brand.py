"""
هوية "سنعها" النهائية — الشعار (ب): نقطة النون صارت ✓
النص محوّل لمسارات (ما يحتاج الخط عند أحد)

التشغيل: video-lab/.venv/bin/python hr-store/build/brand.py
الناتج: hr-store/brand/
"""
import os

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'brand')
FONT = os.path.join(ROOT, '..', 'video-lab', 'public', 'fonts', 'Alexandria.ttf')
os.makedirs(OUT, exist_ok=True)

TEAL = '#0F5E63'   # الأساسي
SAND = '#E9A35B'   # التمييز (علامة ✓)
CREAM = '#F7F3EC'
INK = '#0B2E30'
TAG_LIGHT = '#4E7C7F'
TAG_DARK = '#CFE3E2'

face = hb.Face(hb.Blob.from_file_path(FONT))
UPEM = face.upem


def _contours(font, gid):
    rec = RecordingPen()
    font.draw_glyph_with_pen(gid, rec)
    out, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            out.append(cur)
            cur = []
    return out


def _bbox(c):
    bp, r = BoundsPen(None), RecordingPen()
    r.value = c
    r.replay(bp)
    return bp.bounds


def text_path(text, size, weight=800, dot_cluster=None):
    """يرجّع: المسار، العرض، ومكان النقطة المحذوفة (x, y, عرضها) إذا طلبنا"""
    font = hb.Font(face)
    font.set_variations({'wght': weight})
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {})
    s = size / UPEM
    pen = SVGPathPen(None)
    x, dot = 0, None
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        cs = _contours(font, info.codepoint)
        if dot_cluster is not None and info.cluster == dot_cluster and len(cs) > 1:
            bbs = [_bbox(c) for c in cs]
            k = max(range(len(bbs)), key=lambda j: bbs[j][1])  # الأعلى = النقطة
            b = bbs[k]
            dot = ((x + pos.x_offset + (b[0] + b[2]) / 2) * s, -(b[1] + b[3]) / 2 * s, (b[2] - b[0]) * s)
            cs = cs[:k] + cs[k + 1:]
        tp = TransformPen(pen, (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s))
        for c in cs:
            r = RecordingPen()
            r.value = c
            r.replay(tp)
        x += pos.x_advance
    return pen.getCommands(), x * s, dot


def check(cx, cy, w, color):
    sw = w * 0.24
    return (f'<path d="M{cx - w * 0.5:.1f} {cy:.1f} L{cx - w * 0.12:.1f} {cy + w * 0.38:.1f} L{cx + w * 0.55:.1f} {cy - w * 0.42:.1f}" '
            f'fill="none" stroke="{color}" stroke-width="{sw:.1f}" stroke-linecap="round" stroke-linejoin="round"/>')


def wordmark(x, base, size, color, check_color):
    """كلمة سنعها ونقطة النون ✓. x = بداية الكلمة، base = خط الكتابة"""
    d, w, dot = text_path('سنعها', size, 800, dot_cluster=1)
    cx, cy, dw = x + dot[0], base + dot[1], dot[2]
    body = f'<path transform="translate({x:.1f},{base:.1f})" d="{d}" fill="{color}"/>'
    body += check(cx + dw * 0.15, cy - dw * 0.45, dw * 2.3, check_color)
    return body, w


def svg(name, w, h, body, bg=None):
    rect = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ''
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">{rect}{body}\n</svg>\n')
    print('✓', name, f'{w:.0f}×{h:.0f}')


# 1) الشعار الأساسي
for name, col, chk in [('logo.svg', TEAL, SAND), ('logo-dark.svg', CREAM, SAND)]:
    _, w, _ = text_path('سنعها', 200)
    body, _ = wordmark(40, 250, 200, col, chk)
    svg(name, w + 80, 330, body)

# 2) الشعار مع العبارة
for name, col, tagc in [('logo-tagline.svg', TEAL, TAG_LIGHT), ('logo-tagline-dark.svg', CREAM, TAG_DARK)]:
    _, w, _ = text_path('سنعها', 200)
    tag, tw, _ = text_path('أدوات الموارد البشرية جاهزة', 400 * 0 + 46, 400)
    W = max(w, tw) + 80
    body, _ = wordmark((W - w) / 2, 250, 200, col, SAND)
    body += f'<path transform="translate({(W - tw) / 2:.1f},356)" d="{tag}" fill="{tagc}"/>'
    svg(name, W, 390, body)

# 3) صورة الحساب: دائرة فيها الكلمة
S = 512
_, w, _ = text_path('سنعها', 118)
body = f'<circle cx="{S / 2}" cy="{S / 2}" r="{S / 2}" fill="{TEAL}"/>'
b, _ = wordmark((S - w) / 2, S / 2 + 58, 118, CREAM, SAND)
svg('avatar.svg', S, S, body + b)

# 4) العلامة المختصرة: "ن" ونقطتها ✓
d, w, dot = text_path('ن', 330, 800, dot_cluster=0)
body = f'<rect width="{S}" height="{S}" rx="120" fill="{TEAL}"/>'
x, base = (S - w) / 2, S / 2 + 40
body += f'<path transform="translate({x:.1f},{base:.1f})" d="{d}" fill="{CREAM}"/>'
body += check(x + dot[0] + dot[2] * 0.15, base + dot[1] - dot[2] * 0.3, dot[2] * 2.0, SAND)
svg('mark.svg', S, S, body)
