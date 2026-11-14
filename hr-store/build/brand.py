"""
يبني هوية "سنعها": الشعار بصيغ SVG (النص محوّل لمسارات، فما يحتاج الخط)
التشغيل: video-lab/.venv/bin/python hr-store/build/brand.py
الناتج: hr-store/brand/
"""
import os

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'brand')
FONT = os.path.join(ROOT, '..', 'video-lab', 'public', 'fonts', 'Alexandria.ttf')
os.makedirs(OUT, exist_ok=True)

C = {
    'indigo': '#0F5E63',   # تركوازي (اللون الأساسي)
    'saffron': '#E9A35B',  # رملي (لون التمييز)
    'cream': '#F7F3EC',
    'mint': '#3BB273',
    'ink': '#0B2E30',
}

blob = hb.Blob.from_file_path(FONT)
face = hb.Face(blob)
UPEM = face.upem


def text_path(text, weight=800, size=100):
    """يرجّع (مسار SVG، العرض، الارتفاع فوق الخط، النزول) لنص عربي مشكّل صح"""
    font = hb.Font(face)
    font.set_variations({'wght': weight})
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {})
    scale = size / UPEM
    pen = SVGPathPen(None)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        tp = TransformPen(pen, (scale, 0, 0, -scale, (x + pos.x_offset) * scale, -pos.y_offset * scale))
        font.draw_glyph_with_pen(info.codepoint, tp)
        x += pos.x_advance
    ext = font.get_font_extents('ltr')
    return pen.getCommands(), x * scale, ext.ascender * scale, -ext.descender * scale


def mark(x, y, s, bg=C['indigo'], check=C['saffron'], grid='rgba(255,255,255,0.14)'):
    """العلامة: خانة Excel فيها ✓"""
    r = s * 0.24
    w = s * 0.085
    return f'''
  <g transform="translate({x},{y})">
    <rect width="{s}" height="{s}" rx="{r}" fill="{bg}"/>
    <path d="M{s*0.36} {s*0.08}V{s*0.92}M{s*0.08} {s*0.36}H{s*0.92}" stroke="{grid}" stroke-width="{s*0.025}"/>
    <path d="M{s*0.27} {s*0.53} L{s*0.44} {s*0.70} L{s*0.75} {s*0.32}" fill="none" stroke="{check}"
          stroke-width="{w*1.6}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>'''


def svg(w, h, body, bg=None):
    bg_rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{bg_rect}{body}\n</svg>\n'


def horizontal(text_color, tag_color, mark_bg, check, bg=None, name='logo-horizontal'):
    word, ww, asc, desc = text_path('سنعها', 800, 150)
    tag, tw, tasc, tdesc = text_path('أدوات الموارد البشرية جاهزة', 400, 40)
    pad, m = 40, 170
    gap = 36
    text_w = max(ww, tw)
    W = pad + text_w + gap + m + pad
    H = pad + 150 + 120 + pad
    # RTL: العلامة يمين، والنص يسارها
    mx = W - pad - m
    base = pad + 128
    body = mark(mx, (H - m) / 2, m, mark_bg, check)
    body += f'\n  <path transform="translate({mx - gap - ww},{base})" d="{word}" fill="{text_color}"/>'
    body += f'\n  <path transform="translate({mx - gap - tw},{base + 108})" d="{tag}" fill="{tag_color}"/>'
    open(os.path.join(OUT, f'{name}.svg'), 'w').write(svg(round(W), round(H), body, bg))
    print('✓', name, round(W), round(H))


def stacked(text_color, mark_bg, check, bg=None, name='logo-stacked'):
    word, ww, asc, desc = text_path('سنعها', 800, 170)
    m, pad = 220, 50
    W = max(ww, m) + pad * 2
    H = pad + m + 40 + 200 + pad
    body = mark((W - m) / 2, pad, m, mark_bg, check)
    body += f'\n  <path transform="translate({(W - ww) / 2},{pad + m + 40 + 150})" d="{word}" fill="{text_color}"/>'
    open(os.path.join(OUT, f'{name}.svg'), 'w').write(svg(round(W), round(H), body, bg))
    print('✓', name, round(W), round(H))


# على الخلفيات الفاتحة
horizontal(C['indigo'], '#4E7C7F', C['indigo'], C['saffron'], name='logo-horizontal')
stacked(C['indigo'], C['indigo'], C['saffron'], name='logo-stacked')
# على الخلفيات الداكنة
horizontal(C['cream'], '#CFE3E2', C['saffron'], C['indigo'], name='logo-horizontal-dark')
stacked(C['cream'], C['saffron'], C['indigo'], name='logo-stacked-dark')
# العلامة لحالها (أيقونة الحساب والمتجر)
open(os.path.join(OUT, 'mark.svg'), 'w').write(svg(512, 512, mark(0, 0, 512)))
open(os.path.join(OUT, 'mark-saffron.svg'), 'w').write(svg(512, 512, mark(0, 0, 512, C['saffron'], C['indigo'], 'rgba(15,94,99,0.14)')))
print('✓ marks')
