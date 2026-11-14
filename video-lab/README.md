# مختبر الفيديو بالكود (video-lab)

بيئة جاهزة لصناعة الفيديو بالكود، مع مثال يشتغل لكل أداة.

## الأدوات

| الفئة | الأداة | وين تنكتب | المثال |
|---|---|---|---|
| البناء | Remotion | `src/` | `npm run render` ← `out/arabic-gsap.mp4` |
| البناء | HyperFrames | `hyperframes-demo/` | `npx hyperframes render hyperframes-demo` |
| البناء | Motion Canvas | `motion-canvas/` (مجلد مستقل) | `cd motion-canvas && npx vite` ثم زر Render |
| الشكل | Three.js · Rough.js | `tests/browser-libs.html` | `PW=$(npm root -g)/playwright npm run test:libs` |
| الحركة | GSAP · anime.js · mo.js | `tests/browser-libs.html` | نفس الأمر اللي فوق |
| الشكل | Manim (Python) | `tests/manim_demo.py` | `.venv/bin/manim -ql tests/manim_demo.py Demo` |
| الصوت | FFmpeg | النظام | `ffmpeg -version` |
| الصوت | auto-editor | `.venv` | `.venv/bin/auto-editor فيديو.mp4 --no-open` |
| الصوت | WhisperX | `.venv` | `.venv/bin/whisperx صوت.wav --language ar` |

## المشروع التجريبي: فيديو Remotion + GSAP

- الملف: `src/ArabicGsap.tsx`: ‏10 ثواني، 1920×1080، و30 فريم بالثانية.
- الفكرة: نبني خط GSAP الزمني **متوقف** (`paused: true`)، وفي كل فريم نقفز فيه للحظة `frame / fps`.
  كذا Remotion هو اللي يتحكم بالوقت، والتصدير يطلع مضبوط فريم بفريم.
- النص العربي يتحرك **كلمة كلمة** (مو حرف حرف) عشان الحروف تبقى متصلة.
- الخط Alexandria موجود في `public/fonts/`، وألوان الراجحية في أعلى الملف.

```bash
npm run studio   # معاينة وتعديل في المتصفح
npm run render   # تصدير MP4
```

## ملاحظات للنص العربي

- **Remotion و HyperFrames (HTML):** يكفي تحط `direction: rtl`.
- **Motion Canvas (canvas):** النص المختلط (عربي وإنجليزي) لفّه بالعلامتين `⁧ … ⁩` عشان يترتب من اليمين.
- **Manim:** `Text("…", font="Alexandria")` يعرض العربي صح، والخط مثبّت على مستوى النظام.
- **Motion Canvas** محطوط في مجلد لحاله لأنه يحتاج Vite 4، وهذا يتعارض مع حزم المشروع الرئيسي.

## WhisperX (تفريغ الصوت إلى ترجمة)

```bash
HF_HUB_DISABLE_XET=1 .venv/bin/whisperx صوت.wav --model large-v3 --language ar \
  --device cpu --compute_type int8 --output_format srt --output_dir out/whisperx
```

- أول تشغيل ينزّل النماذج من Hugging Face، وبيئة **video-lab** فيها صلاحية الوصول له.
- إذا طلب بيانات NLTK: `NLTK_ALLOW_PROXIED_URLOPEN=1 .venv/bin/python -c "import nltk; nltk.download('punkt_tab')"`
- المثال `out/arabic-speech.wav` صوت آلي (espeak)، فالتفريغ منه ضعيف. مع صوت بشري تطلع النتيجة دقيقة.

## إعادة التثبيت في جلسة جديدة

```bash
npm install
(cd motion-canvas && npm install)
python3 -m venv .venv
.venv/bin/pip install manim auto-editor
.venv/bin/pip install whisperx
apt-get install -y libpango1.0-dev espeak-ng   # Manim + صوت تجريبي
```

## ريلز سنعها: من النص إلى الفيديو

1. **الصوت** (بصوت "ابو وهب" المنسوخ في ElevenLabs، نموذج Multilingual v2):
   ```bash
   .venv/bin/python tools/tts.py "النص باللهجة السعودية" public/character/vo/reel02
   cp public/character/vo/reel02.words.json src/data/
   ```
   يطلع ملف mp3، وتوقيت كل كلمة للترجمة.
2. **الفيديو:** انسخ `src/Reel01.tsx` إلى `Reel02.tsx`، وعدّل المقاطع (`CHUNKS`) والمشاهد، وسجّله في `Root.tsx`.
3. **التصدير:** `npx remotion render src/index.ts Reel02 out/private/Reel02.mp4`

> صور الكاركتر وملفات الصوت في `public/character/` ما تنرفع على GitHub (خاصة).
> مفتاح ElevenLabs محفوظ في بيئة السحابة video-lab، وما ينكتب في الكود.

### الكاركتر الحي (المعتمد)
1. ولّد مقطع للكاركتر في Dreamina (Image to Video) من `sanaha-9x16-1080x1920.png`، بوصف "listening and reacting, mouth closed".
2. احفظه في `public/character/dreamina/` وجهّزه:
   ```bash
   .venv/bin/python tools/cutout_video.py public/character/dreamina/idle02.mp4
   ```
3. في الريل: `live={{ dir: 'character/dreamina/idle02-frames', count: عدد_الفريمات }}`

> قبل النشر التجاري: تأكد من شروط Dreamina لاستخدام المقاطع تجارياً.
