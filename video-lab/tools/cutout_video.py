"""
يجهّز مقطع كاركتر (Dreamina أو غيره) للريلز: يقص الخلفية فريم فريم وينظّف الجسم.
التشغيل:
  .venv/bin/python tools/cutout_video.py public/character/dreamina/idle02.mp4
الناتج: مجلد <اسم المقطع>-frames فيه cut-0001.png ... (30 فريم بالثانية)
ثم في الريل: <LiveCharacter dir="character/dreamina/idle02-frames" count={عدد الفريمات} />
"""
import glob, os, subprocess, sys, time
import numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session
from scipy.ndimage import binary_fill_holes

src = sys.argv[1]
d = os.path.splitext(src)[0] + '-frames'
os.makedirs(d, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'fps=30', os.path.join(d, 'raw-%04d.png')], check=True)
raws = sorted(glob.glob(os.path.join(d, 'raw-*.png')))

# 1) قص الخلفية
s, t = new_session('isnet-general-use'), time.time()
for i, f in enumerate(raws):
    out = f.replace('raw-', 'cut-')
    if not os.path.exists(out):
        remove(Image.open(f), session=s, post_process_mask=True).save(out)
    if i % 50 == 0:
        print(f'قص {i}/{len(raws)} · {time.time() - t:.0f}ث', flush=True)
cuts = [f.replace('raw-', 'cut-') for f in raws]

# 2) تعبئة الفراغات داخل الجسم (الثوب الأبيض يتلخبط مع الخلفية الفاتحة)
masks = []
for f in cuts:
    a = np.asarray(Image.open(f).getchannel('A'))
    m = binary_fill_holes(a > 128)
    H = m.shape[0]
    for y in range(int(H * 0.55), H):
        xs = np.where(m[y])[0]
        if len(xs) > 1:
            m[y, xs[0]:xs[-1] + 1] = True
    masks.append((a, m))

# 3) شكل الجسم الثابت من كل الفريمات (يسد الأطراف المتعرجة تحت)
body = np.stack([m for _, m in masks]).mean(0) > 0.5
y0 = int(body.shape[0] * 0.6)
body[:y0] = False
for y in range(y0 + 1, body.shape[0]):
    xs = np.where(body[y - 1])[0]
    if len(xs):
        body[y, xs[0]:xs[-1] + 1] = True

blur = lambda m: np.asarray(Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.3)))
body_s = blur(body)
for f, raw, (a, m) in zip(cuts, raws, masks):
    alpha = np.maximum.reduce([a, blur(m), body_s]).astype('uint8')
    im = Image.open(raw).convert('RGBA')
    im.putalpha(Image.fromarray(alpha))
    im.save(f)
for f in raws:
    os.remove(f)
print(f'✓ {len(cuts)} فريم جاهز في {d}')
