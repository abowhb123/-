import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Captions, Word } from '../lib/Captions';
import { autoChunks } from '../pilots/Engine';
import poses from '../data/itsharo-poses.json';

/**
 * قالب إتشارو (النسخة 3)
 * - إتشارو بجسمه الكامل يمين الشاشة، ووضعيته تتغير حسب المشهد (يشرح، يأشّر، يبتسم، يمشي)
 * - المحتوى الرئيسي فوق، والترجمة تحته، وصندوق جانبي يسار يأشّر عليه إتشارو
 * - خطّاف بهزّة، وتقريب على الكلمات المهمة، وشريط تقدّم، وانتقالات بصوت
 */
export const C = { teal: '#0F5E63', sand: '#E9A35B', cream: '#F7F3EC', green: '#3BB273', ink: '#0B2E30', red: '#C2410C', muted: '#4E7C7F', navy: '#1B2A4A' };
export const D = 0.35;
export const TAIL = 1.6;
export const framesFor = (w: Word[]) => Math.ceil((D + w[w.length - 1].e + TAIL) * 30);

export type Pose = 'stand' | 'point' | 'explain' | 'walk';
export type IScene = { at: number; pose: Pose; full?: boolean; main?: React.ReactNode; side?: React.ReactNode };

const CH = 1320; // طول إتشارو على الشاشة (يظهر من الركبة وفوق)
const FEET = 2200;
const BODY_X = 770;

// ── عناصر مساعدة ──
export const In: React.FC<{ at: number; kind?: 'up' | 'pop' | 'whip' | 'drop'; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, kind = 'up', style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps - 1) return null;
  const s = spring({ frame: frame - at * fps, fps, config: { damping: 11, stiffness: 160 } });
  const tr =
    kind === 'pop' ? `scale(${0.3 + 0.7 * s}) rotate(${(1 - s) * -8}deg)` :
    kind === 'whip' ? `translateX(${(1 - s) * 520}px)` :
    kind === 'drop' ? `translateY(${(1 - s) * -220}px)` : `translateY(${(1 - s) * 70}px)`;
  return <div style={{ opacity: Math.min(1, s * 1.6), transform: tr, filter: kind === 'whip' && s < 0.9 ? `blur(${(1 - s) * 14}px)` : undefined, ...style }}>{children}</div>;
};

export const Card: React.FC<{ children: React.ReactNode; accent?: string; style?: React.CSSProperties }> = ({ children, accent = C.teal, style }) => (
  <div style={{ background: '#fff', borderRadius: 42, padding: '34px 46px', boxShadow: '0 30px 70px rgba(15,94,99,0.22)', borderRight: `18px solid ${accent}`, ...style }}>{children}</div>
);

export const T = {
  big: { fontSize: 104, fontWeight: 800, color: C.teal, textAlign: 'center', lineHeight: 1.2 } as React.CSSProperties,
  line: { fontSize: 60, fontWeight: 700, color: C.ink, lineHeight: 1.45 } as React.CSSProperties,
  sub: { fontSize: 50, fontWeight: 500, color: C.muted, textAlign: 'center', lineHeight: 1.45 } as React.CSSProperties,
};

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({ children, bg = C.sand, color = C.ink }) => (
  <span style={{ background: bg, color, borderRadius: 26, padding: '0 22px', display: 'inline-block' }}>{children}</span>
);

// ملصقات مرسومة (بدون إيموجي)
export const Sticker: React.FC<{ kind: 'check' | 'cross' | 'alert' | 'coin' | 'clock' | 'question'; size?: number }> = ({ kind, size = 200 }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 9) * 4;
  const bg = { check: C.green, cross: C.red, alert: C.sand, coin: '#F2C14E', clock: C.teal, question: C.teal }[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${wob}deg)`, filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))' }}>
      <circle cx="50" cy="50" r="46" fill={bg} stroke="#fff" strokeWidth="6" />
      {kind === 'check' && <path d="M28 52 L44 67 L73 35" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />}
      {kind === 'cross' && <path d="M33 33 L67 67 M67 33 L33 67" stroke="#fff" strokeWidth="11" strokeLinecap="round" />}
      {kind === 'alert' && <><path d="M50 24 V58" stroke={C.ink} strokeWidth="11" strokeLinecap="round" /><circle cx="50" cy="74" r="6.5" fill={C.ink} /></>}
      {kind === 'coin' && <><circle cx="50" cy="50" r="32" fill="none" stroke="#B8862B" strokeWidth="5" /><text x="50" y="62" textAnchor="middle" fontSize="34" fontWeight="800" fill="#7A5410" fontFamily="Alexandria">ر.س</text></>}
      {kind === 'clock' && <><circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="6" /><path d="M50 32 V50 L63 58" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" /></>}
      {kind === 'question' && <text x="50" y="70" textAnchor="middle" fontSize="60" fontWeight="800" fill="#fff" fontFamily="Alexandria">؟</text>}
    </svg>
  );
};

export const Sfx: React.FC<{ at: number; name: 'pop' | 'pop-high' | 'whoosh' | 'ding'; volume?: number }> = ({ at, name, volume = 0.4 }) => (
  <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={45}>
    <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
  </Sequence>
);

// ── إتشارو ──
const Character: React.FC<{ pose: Pose; changedAt: number; enterEnd: number }> = ({ pose, changedAt, enterEnd }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const walking = t < enterEnd;
  const p = (walking ? 'walk' : pose) as Pose;
  const info = (poses as Record<string, { w: number; h: number; cx: number }>)[p];
  const w = (CH * info.w) / info.h;
  // دخول ماشي من اليمين
  const enter = interpolate(t, [0, enterEnd], [620, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const step = walking ? Math.abs(Math.sin(t * 9)) * -14 : 0;
  // نطّة خفيفة عند تغيير الوضعية
  const dt = t - Math.max(changedAt, enterEnd);
  const pop = dt >= 0 && dt < 0.45 ? Math.sin((dt / 0.45) * Math.PI) : 0;
  const breathe = Math.sin(frame / 22) * 0.006;
  return (
    <div style={{ position: 'absolute', left: BODY_X - info.cx * w + enter, top: FEET - CH + step - pop * 16, width: w, height: CH, transformOrigin: '50% 100%', transform: `scale(${1 + pop * 0.035}, ${1 + breathe + pop * 0.035})` }}>
      <div style={{ position: 'absolute', bottom: -18, left: '50%', width: 260, height: 40, marginLeft: -130, borderRadius: '50%', background: 'rgba(11,46,48,0.18)', filter: 'blur(6px)' }} />
      <Img src={staticFile(`character/itsharo/${p}.png`)} style={{ width: '100%', height: '100%', position: 'relative' }} />
    </div>
  );
};

export const ItsharoReel: React.FC<{ series: string; voice: string; words: Word[]; scenes: IScene[]; punch?: number[]; sfx?: React.ReactNode }> = ({ series, voice, words, scenes, punch = [], sfx }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const at = (i: number) => D + words[i].s;
  const starts = scenes.map((s) => (s.at === 0 ? 0 : at(s.at)));
  let k = 0;
  starts.forEach((s, i) => { if (t >= s) k = i; });
  const sc = scenes[k];
  const fullP = (i: number) => (scenes[i].full ? 1 : 0);
  const bgMix = k === 0 ? fullP(0) : interpolate(t, [starts[k], starts[k] + 0.3], [fullP(k - 1), fullP(k)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const onTeal = bgMix > 0.5;

  // هزّة الخطّاف + تقريب على الكلمات المهمة
  const shake = t < 0.7 ? Math.sin(frame * 2.1) * (0.7 - t) * 14 : 0;
  const punchAmt = punch.reduce((m, i) => {
    const d = t - at(i);
    return d >= 0 && d < 0.45 ? Math.max(m, Math.sin((d / 0.45) * Math.PI) * 0.05) : m;
  }, 0);
  const lastWord = words[words.length - 1].e;
  const progress = frame / durationInFrames;
  // آخر وقت تغيّرت فيه الوضعية (للنطّة)
  let changedAt = 0;
  for (let i = 1; i <= k; i++) if (scenes[i].pose !== scenes[i - 1].pose) changedAt = starts[i];
  const badge = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden', color: C.ink }}>
      <AbsoluteFill style={{ background: C.teal, opacity: bgMix }} />
      {/* زخرفة خلفية خفيفة */}
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: `40px solid ${onTeal ? 'rgba(247,243,236,0.06)' : 'rgba(15,94,99,0.06)'}`, right: -380, top: 980 }} />
      <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: onTeal ? 'rgba(233,163,91,0.12)' : 'rgba(233,163,91,0.16)', left: -160, top: 1150 }} />

      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${1 + punchAmt})`, transformOrigin: '50% 40%' }}>
        {/* المحتوى الرئيسي والجانبي لكل مشهد */}
        {scenes.map((s, i) => {
          const s0 = starts[i];
          const s1 = i + 1 < scenes.length ? starts[i + 1] : 1e9;
          if (t < s0 - 0.05 || t > s1 + 0.22) return null;
          const out = interpolate(t, [s1, s1 + 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <AbsoluteFill key={i} style={{ opacity: 1 - out, transform: `translateY(${-out * 60}px)` }}>
              {s.main && <div style={{ position: 'absolute', top: 175, left: 50, right: 50, height: 540, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: 22 }}>{s.main}</div>}
              {s.side && <div style={{ position: 'absolute', top: 1020, left: 30, width: 400, height: 640, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>{s.side}</div>}
            </AbsoluteFill>
          );
        })}
        <Character pose={sc.pose} changedAt={changedAt} enterEnd={0.85} />
      </AbsoluteFill>

      {/* اسم السلسلة + اسم إتشارو */}
      <div style={{ position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${badge})` }}>
        <div style={{ background: onTeal ? C.cream : C.teal, color: onTeal ? C.teal : C.cream, fontSize: 42, fontWeight: 800, padding: '10px 34px', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: C.sand }} />
          {series}
        </div>
      </div>

      {/* الترجمة */}
      <Captions words={words} chunks={autoChunks(words)} delay={D} until={lastWord + 0.3} color={onTeal ? C.cream : C.teal} highlight={C.sand}
        style={{ position: 'absolute', top: 735, left: 40, right: 40 }} />

      {/* شريط التقدّم */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 14, background: 'rgba(11,46,48,0.12)' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: C.sand }} />
      </div>

      <Sequence from={Math.round(D * fps)}>
        <Audio src={staticFile(voice)} />
      </Sequence>
      <Audio src={staticFile('audio/music.wav')} volume={0.07} loop />
      <Sfx at={0.05} name="whoosh" volume={0.35} />
      {starts.slice(1).map((s, i) => <Sfx key={i} at={s - 0.04} name="whoosh" volume={0.2} />)}
      {sfx}
    </AbsoluteFill>
  );
};
