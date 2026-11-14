"""
يولّد صوت "ابو وهب" من نص عبر ElevenLabs، ويحفظ:
  - ملف الصوت mp3
  - توقيت كل كلمة (json) للترجمة كلمة بكلمة

التشغيل:
  .venv/bin/python tools/tts.py "النص هنا" public/character/vo/reel01 [--model eleven_v3]

المفتاح لا يُكتب هنا: بيئة السحابة تضيفه تلقائياً لطلبات api.elevenlabs.io
(خارج السحابة: ضع المفتاح في متغير ELEVENLABS_API_KEY)
"""
import argparse
import base64
import json
import os
import urllib.request

VOICE_ID = 'eZLVMA6wnkWDKeL1JDhx'  # ابو وهب
API = 'https://api.elevenlabs.io/v1'


# الافتراضي = إعدادات صوت "ابو وهب" في ElevenLabs (الأقرب للصوت الأصلي ومخارج الحروف)
def tts(text, out_base, model='eleven_multilingual_v2', stability=0.5, similarity=0.75, style=0.0):
    body = {
        'text': text,
        'model_id': model,
        'voice_settings': {'stability': stability, 'similarity_boost': similarity, 'style': style, 'use_speaker_boost': True},
    }
    req = urllib.request.Request(
        f'{API}/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_128',
        data=json.dumps(body).encode(),
        headers={
            'Content-Type': 'application/json',
            # داخل السحابة الـ proxy يستبدل هذي القيمة بالمفتاح الحقيقي
            'xi-api-key': os.environ.get('ELEVENLABS_API_KEY', 'proxy-injected'),
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)

    os.makedirs(os.path.dirname(out_base) or '.', exist_ok=True)
    with open(out_base + '.mp3', 'wb') as f:
        f.write(base64.b64decode(d['audio_base64']))

    # من توقيت الحروف ← توقيت الكلمات
    a = d.get('normalized_alignment') or d['alignment']
    words, cur, start, end = [], '', None, None
    for ch, s, e in zip(a['characters'], a['character_start_times_seconds'], a['character_end_times_seconds']):
        if ch.isspace():
            if cur:
                words.append({'w': cur, 's': round(start, 3), 'e': round(end, 3)})
            cur, start = '', None
            continue
        if start is None:
            start = s
        cur += ch
        end = e
    if cur:
        words.append({'w': cur, 's': round(start, 3), 'e': round(end, 3)})
    with open(out_base + '.words.json', 'w') as f:
        json.dump(words, f, ensure_ascii=False)
    print(f'✓ {out_base}.mp3  ({len(words)} كلمة، {words[-1]["e"]:.2f} ثانية) · {model}')
    return words


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('text')
    p.add_argument('out_base')
    p.add_argument('--model', default='eleven_multilingual_v2')
    a = p.parse_args()
    tts(a.text, a.out_base, a.model)
