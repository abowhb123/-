"""
يولّد عدة نسخ صوتية لنفس النص، ويفرّغها، ويختار النسخة اللي نطقها أقرب للنص.
التشغيل:
  .venv/bin/python tools/tts_best.py "النص" public/character/vo/pilot1 --takes 3
الناتج: <out>.mp3 و <out>.words.json (أفضل نسخة) + تقرير الدرجات
"""
import argparse
import difflib
import json
import os
import re
import shutil
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from tts import tts  # noqa: E402

DIAC = re.compile(r'[ً-ْٰـ]')


def norm(t):
    t = DIAC.sub('', t)
    t = re.sub(r'[إأآا]', 'ا', t)
    t = t.replace('ى', 'ي').replace('ة', 'ه').replace('گ', 'ق')
    t = re.sub(r'[^ء-ي0-9 ]', ' ', t)
    return t.split()


def score(ref, hyp):
    return difflib.SequenceMatcher(None, norm(ref), norm(hyp)).ratio()


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('text')
    p.add_argument('out_base')
    p.add_argument('--takes', type=int, default=3)
    p.add_argument('--model', default='eleven_multilingual_v2')
    a = p.parse_args()

    from faster_whisper import WhisperModel

    wm = WhisperModel('small', device='cpu', compute_type='int8')
    results = []
    for k in range(a.takes):
        base = f'{a.out_base}.take{k + 1}'
        # تنويع بسيط في الإعدادات بين النسخ
        stab = [0.5, 0.55, 0.45][k % 3]
        tts(a.text, base, a.model, stability=stab, similarity=0.75, style=0.0)
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', base + '.mp3', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
        audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
        segs, _ = wm.transcribe(audio, language='ar', beam_size=5)
        hyp = ' '.join(s.text for s in segs)
        sc = score(a.text, hyp)
        results.append((sc, base, hyp))
        print(f'  نسخة {k + 1} · دقة {sc:.0%} · {hyp[:90]}…', flush=True)
    best = max(results)
    shutil.copy(best[1] + '.mp3', a.out_base + '.mp3')
    shutil.copy(best[1] + '.words.json', a.out_base + '.words.json')
    with open(a.out_base + '.report.json', 'w') as f:
        json.dump([{'score': round(s, 3), 'take': b, 'heard': h} for s, b, h in results], f, ensure_ascii=False, indent=1)
    print(f'✓ الأفضل: {os.path.basename(best[1])} ({best[0]:.0%})')
