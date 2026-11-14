import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Captions, Word } from '../lib/Captions';
import { LiveCharacter } from '../characters/LiveCharacter';
import { LipSyncPortrait } from '../characters/LipSync';

/**
 * محرّك ريلز المشاهد (النسخة 2)
 * كل ريل = مشاهد، وكل مشهد يبدأ عند كلمة، وله تخطيط:
 *  hook: الكاركتر كبير في النص · card: الكاركتر صغير بالزاوية والبطاقة كبيرة
 *  full: شاشة تركوازية كاملة بدون كاركتر · side: الكاركتر يسار والقائمة يمين · cta: الختام
 */
export const C = { teal: '#0F5E63', sand: '#E9A35B', cream: '#F7F3EC', green: '#3BB273', ink: '#0B2E30', red: '#C2410C', muted: '#4E7C7F' };
export const D = 0.4;
export const TAIL = 1.8;
export const framesFor = (w: Word[]) => Math.ceil((D + w[w.length - 1].e + TAIL) * 30);

export type Layout = 'hook' | 'card' | 'full' | 'side' | 'cta';
export type Scene = { at: number; layout: Layout; content: React.ReactNode };

// موضع الكاركتر وحجمه، ومكان الترجمة ولونها، لكل تخطيط
const LAYOUT: Record<Layout, { w: number; x: number; y: number; o: number; cap: number; capColor: string; bg: string; circle: number }> = {
  hook: { w: 1200, x: -60, y: 900, o: 1, cap: 745, capColor: C.teal, bg: C.cream, circle: 1 },
  cta: { w: 1200, x: -60, y: 900, o: 1, cap: 745, capColor: C.teal, bg: C.cream, circle: 1 },
  card: { w: 700, x: -110, y: 1350, o: 1, cap: 1185, capColor: C.teal, bg: C.cream, circle: 1 },
  side: { w: 900, x: -250, y: 1080, o: 1, cap: 230, capColor: C.teal, bg: C.cream, circle: 1 },
  full: { w: 900, x: 90, y: 2100, o: 0, cap: 1420, capColor: C.cream, bg: C.teal, circle: 0 },
};

/** يقسّم الترجمة: عند علامات الوقف، أو كل 3 كلمات */
export const autoChunks = (w: Word[], max = 3): [number, number][] => {
  const out: [number, number][] = [];
  let s = 0;
  w.forEach((x, i) => {
    const stop = /[.،,!؟?…:]$|\.\.\.$/.test(x.w);
    if (stop || i - s + 1 >= max || i === w.length - 1) {
      out.push([s, i]);
      s = i + 1;
    }
  });
  return out;
};

const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const mixColor = (a: string, b: string, p: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], p))).join(',')})`;
};

/** عنصر يظهر بنعومة عند ثانية */
export const In: React.FC<{ at: number; kind?: 'up' | 'pop' | 'right' | 'whip'; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, kind = 'up', style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps - 1) return null;
  const s = spring({ frame: frame - at * fps, fps, config: { damping: 14, stiffness: 150 } });
  const blur = kind === 'whip' ? (1 - s) * 18 : 0;
  const t = kind === 'pop' ? `scale(${0.5 + 0.5 * s})` : kind === 'right' || kind === 'whip' ? `translateX(${(1 - s) * (kind === 'whip' ? 500 : 160)}px)` : `translateY(${(1 - s) * 60}px)`;
  return <div style={{ opacity: Math.min(1, s * 1.5), transform: t, filter: blur ? `blur(${blur}px)` : undefined, ...style }}>{children}</div>;
};

export const Card: React.FC<{ children: React.ReactNode; accent?: string; style?: React.CSSProperties }> = ({ children, accent = C.teal, style }) => (
  <div style={{ background: '#fff', borderRadius: 40, padding: '38px 48px', boxShadow: '0 28px 70px rgba(15,94,99,0.2)', borderRight: `16px solid ${accent}`, ...style }}>{children}</div>
);

export const T = {
  big: { fontSize: 100, fontWeight: 800, color: C.teal, textAlign: 'center', lineHeight: 1.22 } as React.CSSProperties,
  line: { fontSize: 58, fontWeight: 700, color: C.ink, lineHeight: 1.5 } as React.CSSProperties,
  sub: { fontSize: 50, fontWeight: 500, color: C.muted, textAlign: 'center', lineHeight: 1.5 } as React.CSSProperties,
};

export const Sfx: React.FC<{ at: number; name: 'pop' | 'pop-high' | 'whoosh' | 'ding'; volume?: number }> = ({ at, name, volume = 0.4 }) => (
  <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={45}>
    <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const SceneReel: React.FC<{
  series: string;
  voice: string;
  words: Word[];
  scenes: Scene[];
  punch?: number[]; // كلمات فيها تقريب سريع
  sfx?: React.ReactNode;
  character?: 'lipsync' | 'live'; // lipsync: الفم يطابق الكلام · live: حركة Dreamina
}> = ({ series, voice, words, scenes, punch = [], sfx, character = 'lipsync' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const at = (i: number) => D + words[i].s;
  const starts = scenes.map((s) => (s.at === 0 ? 0 : at(s.at)));
  let k = 0;
  starts.forEach((s, i) => { if (t >= s) k = i; });
  const cur = LAYOUT[scenes[k].layout];
  const prev = LAYOUT[scenes[Math.max(0, k - 1)].layout];
  const p = k === 0 ? 1 : interpolate(t, [starts[k], starts[k] + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 1, 0.68, 1) });
  const L = (key: 'w' | 'x' | 'y' | 'o' | 'cap' | 'circle') => mix(prev[key], cur[key], p);

  // تقريب سريع على الكلمات المهمة + زوم بطيء في مشهد الافتتاح
  const punchAmt = punch.reduce((m, i) => {
    const d = t - at(i);
    return d >= 0 && d < 0.5 ? Math.max(m, Math.sin((d / 0.5) * Math.PI) * 0.045) : m;
  }, 0);
  const drift = scenes[k].layout === 'hook' ? (t - starts[k]) * 0.006 : 0;
  const zoom = 1 + punchAmt + Math.min(drift, 0.05);

  // ومضة خفيفة عند تغيير المشهد
  const flash = k > 0 ? interpolate(t, [starts[k], starts[k] + 0.18], [0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const badge = spring({ frame, fps, config: { damping: 12 } });
  const lastWord = words[words.length - 1].e;
  const titleColor = mixColor(prev.bg === C.teal ? C.cream : C.teal, cur.bg === C.teal ? C.cream : C.teal, p);

  return (
    <AbsoluteFill style={{ background: mixColor(prev.bg, cur.bg, p), fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden', color: C.ink }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 45%' }}>
        {/* الدائرة التركوازية */}
        <div style={{ position: 'absolute', width: 1600, height: 1600, borderRadius: '50%', background: C.teal, left: -260, top: 1150, opacity: L('circle') }} />

        {/* المشاهد */}
        {scenes.map((s, i) => {
          const s0 = starts[i];
          const s1 = i + 1 < scenes.length ? starts[i + 1] : 1e9;
          if (t < s0 - 0.05 || t > s1 + 0.25) return null;
          const out = interpolate(t, [s1, s1 + 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <AbsoluteFill key={i} style={{ opacity: 1 - out, transform: `translateX(${-out * 120}px)` }}>
              {s.content}
            </AbsoluteFill>
          );
        })}

        {/* الكاركتر */}
        <div style={{ position: 'absolute', left: L('x'), top: L('y'), opacity: L('o') }}>
          {character === 'live' ? (
            <LiveCharacter dir="character/dreamina/idle01-frames" count={447} width={L('w')} />
          ) : (
            <LipSyncPortrait words={words} delay={D} width={L('w')} />
          )}
        </div>
      </AbsoluteFill>

      {/* اسم السلسلة */}
      <div style={{ position: 'absolute', top: 80, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${badge})` }}>
        <div style={{ background: cur.bg === C.teal && p > 0.5 ? C.cream : C.teal, color: cur.bg === C.teal && p > 0.5 ? C.teal : C.cream, fontSize: 44, fontWeight: 800, padding: '10px 38px', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: C.sand }} />
          {series}
        </div>
      </div>

      {/* الترجمة */}
      <Captions words={words} chunks={autoChunks(words)} delay={D} until={lastWord + 0.3} color={titleColor} highlight={C.sand}
        style={{ position: 'absolute', top: L('cap'), left: 40, right: 40 }} />

      <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />

      <Sequence from={Math.round(D * fps)}>
        <Audio src={staticFile(voice)} />
      </Sequence>
      <Audio src={staticFile('audio/music.wav')} volume={0.07} loop />
      {starts.slice(1).map((s, i) => <Sfx key={i} at={s - 0.05} name="whoosh" volume={0.22} />)}
      {sfx}
    </AbsoluteFill>
  );
};
