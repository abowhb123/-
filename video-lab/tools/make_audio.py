"""
يولّد موسيقى خلفية ومؤثرات صوتية بالكود (بدون حقوق).
التشغيل: .venv/bin/python tools/make_audio.py
الناتج في public/audio/
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def note(n):  # رقم MIDI ← تردد
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n_samples, attack, release):
    e = np.ones(n_samples)
    a, r = int(attack * SR), int(release * SR)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def lowpass(x, cutoff):
    # فلتر بسيط من الدرجة الأولى
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def save(name, x, stereo_width=0.0):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    left = x
    right = np.roll(x, int(stereo_width * SR)) if stereo_width else x
    data = (np.stack([left, right], axis=1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print('✓', name, f'{len(x) / SR:.2f}s')


# ───────── الموسيقى: 96 BPM، تسلسل Am – F – C – G ─────────
def music(duration=15.0, bpm=96):
    beat = 60 / bpm
    bar = beat * 4
    total = int(SR * duration)
    mix = np.zeros(total)
    chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    bars = int(np.ceil(duration / bar))

    for b in range(bars):
        start = int(b * bar * SR)
        ch = chords[b % 4]
        # pad: نغمات ناعمة بهارمونيات خفيفة
        tt = t_(bar + 0.8)  # أطول من الـ bar عشان يتداخل مع اللي بعده
        pad = sum(
            np.sin(2 * np.pi * note(n) * tt) + 0.3 * np.sin(2 * np.pi * note(n) * 2 * tt + 0.5)
            for n in ch
        )
        pad *= env(len(tt), 0.5, 1.0) * 0.16
        # bass
        bass = np.sin(2 * np.pi * note(ch[0] - 12) * tt) * env(len(tt), 0.02, 0.9) * 0.32
        # arpeggio: نغمات بالثُمن
        arp = np.zeros(len(tt))
        step = beat / 2
        for k in range(8):
            n = ch[k % 3] + (12 if k % 4 == 3 else 0)
            st = t_(step * 0.9)
            pl = np.sin(2 * np.pi * note(n + 12) * st) * np.exp(-st * 9) * 0.12
            i = int(k * step * SR)
            arp[i:i + len(pl)] += pl[: len(arp) - i]
        seg = pad + bass + arp
        end = min(start + len(seg), total)
        mix[start:end] += seg[: end - start]

    # إيقاع: kick على كل نبضة + hi-hat على النصف (يبدأ من الـ bar الثاني)
    kick_t = t_(0.25)
    kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-kick_t * 30)) * kick_t) * np.exp(-kick_t * 14) * 0.5
    hat_t = t_(0.05)
    hat = rng.standard_normal(len(hat_t)) * np.exp(-hat_t * 90) * 0.07
    hat = hat - lowpass(hat, 6000)
    n_beats = int(duration / beat)
    for k in range(n_beats):
        if k < 4:
            continue
        i = int(k * beat * SR)
        mix[i:i + len(kick)] += kick[: total - i]
        j = int((k + 0.5) * beat * SR)
        if j < total:
            mix[j:j + len(hat)] += hat[: total - j]

    mix = lowpass(mix, 9000)
    mix *= env(total, 0.8, 1.5)
    return mix


# ───────── المؤثرات ─────────
def whoosh(dur=0.6):
    tt = t_(dur)
    noise = rng.standard_normal(len(tt))
    # نويز يمر عبر فلتر يتحرك تردده للأعلى ثم للأسفل
    out = np.empty_like(noise)
    acc = 0.0
    for i, v in enumerate(noise):
        p = i / len(noise)
        cutoff = 300 + 3500 * np.sin(np.pi * p)
        a = np.exp(-2 * np.pi * cutoff / SR)
        acc = (1 - a) * v + a * acc
        out[i] = acc
    return out * np.sin(np.pi * tt / dur) ** 2


def pop(freq=880, dur=0.15):
    tt = t_(dur)
    f = freq * (1 + 0.6 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 28)


def ding(dur=1.4):
    tt = t_(dur)
    base = note(84)
    return sum(
        amp * np.sin(2 * np.pi * base * ratio * tt) * np.exp(-tt * decay)
        for ratio, amp, decay in [(1, 1, 3), (2.76, 0.4, 5), (5.4, 0.2, 8)]
    )


if __name__ == '__main__':
    save('music.wav', music(15.0), stereo_width=0.004)
    save('whoosh.wav', whoosh())
    save('pop.wav', pop())
    save('pop-high.wav', pop(1320))
    save('ding.wav', ding())
