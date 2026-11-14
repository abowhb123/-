"""
تسجيل أبو فواز (فيديو أو صوت) ← Voice Changer (صوت "ابو وهب" بلهجته ومخارجه هو) ← توقيت الكلمات للترجمة
التشغيل:
  .venv/bin/python tools/voice_changer.py recording.mp4 public/character/vo/itsharo-02 [--script "نص السكربت"]
الناتج: <out>.mp3 و <out>.words.json
--script (اختياري): يصحّح كلمات الترجمة حسب النص المكتوب، مع الحفاظ على توقيت التفريغ
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import tempfile
import urllib.request
import uuid

import numpy as np

VOICE_ID = 'eZLVMA6wnkWDKeL1JDhx'  # ابو وهب
API = 'https://api.elevenlabs.io/v1'


def sts(in_mp3, out_mp3):
    boundary = uuid.uuid4().hex
    parts = []
    fields = {
        'model_id': 'eleven_multilingual_sts_v2',
        'voice_settings': json.dumps({'stability': 0.5, 'similarity_boost': 0.75, 'style': 0}),
        'remove_background_noise': 'true',
    }
    for k, v in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    with open(in_mp3, 'rb') as f:
        audio = f.read()
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="audio"; filename="in.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode() + audio + b'\r\n')
    parts.append(f'--{boundary}--\r\n'.encode())
    req = urllib.request.Request(
        f'{API}/speech-to-speech/{VOICE_ID}?output_format=mp3_44100_128',
        data=b''.join(parts),
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            # داخل السحابة الـ proxy يستبدل هذي القيمة بالمفتاح الحقيقي
            'xi-api-key': os.environ.get('ELEVENLABS_API_KEY', 'proxy-injected'),
        },
    )
    with urllib.request.urlopen(req, timeout=300) as r, open(out_mp3, 'wb') as f:
        f.write(r.read())


DIAC = re.compile(r'[ً-ْٰـ]')


def norm(w):
    w = DIAC.sub('', w)
    w = re.sub(r'[إأآا]', 'ا', w).replace('ى', 'ي').replace('ة', 'ه')
    return re.sub(r'[^ء-ي0-9]', '', w)


def words_of(mp3):
    from faster_whisper import WhisperModel

    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    wm = WhisperModel('small', device='cpu', compute_type='int8')
    segs, _ = wm.transcribe(audio, language='ar', beam_size=5, word_timestamps=True)
    return [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in s.words if w.word.strip()]


def align_to_script(heard, script):
    """يستبدل الكلمات المسموعة بكلمات النص المكتوب (إملاء صحيح)، ويوزّع التوقيت"""
    ref = script.split()
    a = [norm(x['w']) for x in heard]
    b = [norm(x) for x in ref]
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal':
            out += [{'w': ref[j1 + k], 's': heard[i1 + k]['s'], 'e': heard[i1 + k]['e']} for k in range(i2 - i1)]
        elif j2 > j1:
            s = heard[i1]['s'] if i1 < len(heard) else (out[-1]['e'] if out else 0)
            e = heard[i2 - 1]['e'] if i2 > i1 else s + 0.25 * (j2 - j1)
            step = (e - s) / (j2 - j1)
            out += [{'w': ref[j1 + k], 's': round(s + k * step, 3), 'e': round(s + (k + 1) * step, 3)} for k in range(j2 - j1)]
    return out


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('recording')
    p.add_argument('out_base')
    p.add_argument('--script', default=None)
    a = p.parse_args()
    os.makedirs(os.path.dirname(a.out_base) or '.', exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, 'in.mp3')
        # صوت الجوال ← mp3 أحادي نظيف
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.recording, '-vn', '-ac', '1', '-ar', '44100', '-b:a', '192k', src], check=True)
        sts(src, a.out_base + '.mp3')
    words = words_of(a.out_base + '.mp3')
    if a.script:
        words = align_to_script(words, a.script)
    with open(a.out_base + '.words.json', 'w') as f:
        json.dump(words, f, ensure_ascii=False)
    print(f'✓ {a.out_base}.mp3 · {len(words)} كلمة · {words[-1]["e"]:.1f} ثانية')
