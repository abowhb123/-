import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Word } from '../lib/Captions';

/**
 * مطابقة الشفايف بالحروف (Visemes)
 * توقيت الكلمات من ElevenLabs ← يتوزع على حروف الكلمة ← كل حرف له شكل فم ← انتقال ناعم بين الأشكال.
 */
type Viseme = 'rest' | 'closed' | 'round' | 'open' | 'teeth';

const MAP: Record<string, Viseme> = {};
'مبف'.split('').forEach((c) => (MAP[c] = 'closed'));
'وؤض'.split('').forEach((c) => (MAP[c] = 'round'));
'اأإآىعحهةغخرلء'.split('').forEach((c) => (MAP[c] = 'open'));
'سشصزثذتدطظنيئكقجگ'.split('').forEach((c) => (MAP[c] = 'teeth'));
const LONG = new Set(['ا', 'و', 'ي', 'ى', 'آ']);

type Seg = { s: number; e: number; v: Viseme };

// يحوّل الكلمات إلى مقاطع زمنية لكل حرف
export const visemeTrack = (words: Word[]): Seg[] => {
  const out: Seg[] = [];
  for (const w of words) {
    const letters = [...w.w].filter((c) => MAP[c]);
    if (!letters.length) continue;
    const weights = letters.map((c) => (LONG.has(c) ? 1.4 : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let t = w.s;
    letters.forEach((c, i) => {
      const d = ((w.e - w.s) * weights[i]) / total;
      out.push({ s: t, e: t + d, v: MAP[c] });
      t += d;
    });
  }
  return out;
};

const visemeAt = (track: Seg[], t: number): Viseme => {
  // بحث ثنائي
  let lo = 0;
  let hi = track.length - 1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (t < track[m].s) hi = m - 1;
    else if (t >= track[m].e) lo = m + 1;
    else return track[m].v;
  }
  return 'rest';
};

const LAYERS: Exclude<Viseme, 'rest'>[] = ['closed', 'teeth', 'open', 'round'];
const FILE: Record<Exclude<Viseme, 'rest'>, string> = {
  closed: 'character/mouth-closed.png',
  teeth: 'character/mouth-teeth.png',
  open: 'character/mouth-open.png',
  round: 'character/mouth-round.png',
};

export const LipSyncPortrait: React.FC<{
  words: Word[];
  delay: number; // ثواني قبل بداية الصوت
  width?: number;
  base?: string;
  eyesClosed?: string | null;
}> = ({ words, delay, width = 1080, base = 'character/portrait-shmagh-cutout.png', eyesClosed = 'character/eyes-closed.png' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const track = React.useMemo(() => visemeTrack(words), [words]);

  // تبديل حاد ونظيف (بدون مزج يسبب ظل مزدوج)، وكل شكل يثبت فريمين على الأقل عشان ما يرجف
  const seq = React.useMemo(() => {
    const total = Math.ceil((delay + (words.length ? words[words.length - 1].e : 0) + 3) * fps);
    const out: Viseme[] = [];
    let cur: Viseme = 'rest';
    let held = 99;
    for (let f = 0; f < total; f++) {
      const v = visemeAt(track, f / fps - delay + 0.02); // سبق بسيط: الفم يتحرك قبل الصوت بلحظة مثل الواقع
      if (v !== cur && held >= 2) {
        cur = v;
        held = 0;
      }
      held++;
      out.push(cur);
    }
    return out;
  }, [track, delay, fps, words]);
  const current: Viseme = seq[Math.min(frame, seq.length - 1)] ?? 'rest';
  const weights: Record<Viseme, number> = { rest: 0, closed: 0, round: 0, open: 0, teeth: 0 };
  weights[current] = 1;
  // مقدار الكلام في آخر نص ثانية (لحركة الراس)
  let talkCount = 0;
  for (let k = 0; k < 15; k++) if ((seq[frame - k] ?? 'rest') !== 'rest') talkCount++;
  const talking = talkCount / 15;

  // رمشة كل 3.6 ثانية تقريباً
  const blink = frame % Math.round(fps * 3.6) < 3;
  // حركة الراس: تنفّس + إيماءة خفيفة وقت الكلام
  const nod = Math.sin(frame / 7) * 1.6 * talking;
  const sway = Math.sin(frame / 50) * 0.9 + Math.sin(frame / 13) * 0.5 * talking;
  const breathe = 1 + Math.sin(frame / 30) * 0.006;
  const layer: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

  return (
    <div style={{ position: 'relative', width, height: width, transform: `translateY(${nod}px) rotate(${sway}deg) scale(${breathe})`, transformOrigin: '50% 85%' }}>
      <Img src={staticFile(base)} style={layer} />
      {LAYERS.map((v) => (weights[v] > 0 ? <Img key={v} src={staticFile(FILE[v])} style={{ ...layer, opacity: weights[v] }} /> : null))}
      {eyesClosed && blink && <Img src={staticFile(eyesClosed)} style={layer} />}
    </div>
  );
};
