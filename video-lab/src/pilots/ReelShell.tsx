import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Captions, Word } from '../lib/Captions';
import { LiveCharacter } from '../characters/LiveCharacter';

// ألوان الهوية (تركوازي ورملي)
export const C = { teal: '#0F5E63', sand: '#E9A35B', cream: '#F7F3EC', green: '#3BB273', ink: '#0B2E30', red: '#C2410C' };
export const D = 0.4; // الصوت يبدأ بعد هذي الثواني
export const TAIL = 1.6; // ثواني بعد نهاية الكلام
export const framesFor = (w: Word[]) => Math.ceil((D + w[w.length - 1].e + TAIL) * 30);

/** وقت كلمة رقم i بالثواني (من بداية الفيديو) */
export const at = (w: Word[], i: number) => D + w[i].s;

/** عنصر يظهر عند ثانية معيّنة ويختفي (اختياري) عند ثانية ثانية */
export const Appear: React.FC<{
  from: number;
  until?: number;
  kind?: 'up' | 'pop' | 'right';
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ from, until, kind = 'up', style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from * fps, fps, config: { damping: 14, stiffness: 140 } });
  const out = until === undefined ? 0 : interpolate(frame, [until * fps, until * fps + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < from * fps - 1) return null;
  if (until !== undefined && frame > until * fps + 8) return null;
  const t =
    kind === 'pop' ? `scale(${0.4 + 0.6 * s})` : kind === 'right' ? `translateX(${(1 - s) * 160}px)` : `translateY(${(1 - s) * 60}px)`;
  return <div style={{ opacity: Math.min(1, s * 1.4) * (1 - out), transform: t, ...style }}>{children}</div>;
};

/** بطاقة بيضاء بإطار */
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent = C.teal }) => (
  <div
    style={{
      background: '#fff', borderRadius: 36, padding: '34px 44px', boxShadow: '0 24px 60px rgba(15,94,99,0.18)',
      borderRight: `14px solid ${accent}`, ...style,
    }}
  >
    {children}
  </div>
);

export const ReelShell: React.FC<{
  series: string;
  voice: string;
  words: Word[];
  chunks: [number, number][];
  children: React.ReactNode;
}> = ({ series, voice, words, chunks, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden', color: C.ink }}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', background: C.teal, left: -210, top: 1000 }} />

      {/* اسم السلسلة */}
      <div style={{ position: 'absolute', top: 90, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${badge})` }}>
        <div style={{ background: C.teal, color: C.cream, fontSize: 46, fontWeight: 800, padding: '12px 40px', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: C.sand }} />
          {series}
        </div>
      </div>

      {/* المشاهد الخاصة بكل ريل */}
      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 540 }}>{children}</div>

      {/* الكاركتر */}
      <div style={{ position: 'absolute', bottom: -60, left: 0 }}>
        <LiveCharacter dir="character/dreamina/idle01-frames" count={447} width={1080} />
      </div>

      {/* الترجمة */}
      <Captions words={words} chunks={chunks} delay={D} until={words[words.length - 1].e + 0.3} color={C.teal} highlight={C.sand} style={{ position: 'absolute', top: 770, left: 40, right: 40 }} />

      <Sequence from={Math.round(D * fps)}>
        <Audio src={staticFile(voice)} />
      </Sequence>
      <Audio src={staticFile('audio/music.wav')} volume={0.08} loop />
    </AbsoluteFill>
  );
};

/** مؤثر صوتي عند ثانية معيّنة */
export const Sfx: React.FC<{ at: number; name: 'pop' | 'pop-high' | 'whoosh' | 'ding'; volume?: number }> = ({ at: t, name, volume = 0.4 }) => (
  <Sequence from={Math.round(t * 30)} durationInFrames={45}>
    <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
  </Sequence>
);
