import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export type Word = { w: string; s: number; e: number };

/**
 * ترجمة كلمة بكلمة: يعرض المقطع الحالي، والكلمة المنطوقة تتلوّن
 * chunks: حدود المقاطع [من، إلى] بأرقام الكلمات (شاملة)
 */
export const Captions: React.FC<{
  words: Word[];
  chunks: [number, number][];
  delay?: number; // ثواني قبل بداية الصوت
  until?: number; // يختفي بعد هذي الثانية (اختياري)
  color: string;
  highlight: string;
  style?: React.CSSProperties;
}> = ({ words, chunks, delay = 0, until, color, highlight, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - delay;
  if (t < 0 || (until !== undefined && t > until)) return null;

  const chunk = chunks.find(([a, b]) => t >= words[a].s - 0.15 && t <= words[b].e + 0.12) ??
    [...chunks].reverse().find(([a]) => t >= words[a].s) ?? chunks[0];
  const [a, b] = chunk;
  const enter = Math.min(1, (t - (words[a].s - 0.15)) / 0.15);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', ...style }}>
      {words.slice(a, b + 1).map((w, i) => {
        const active = t >= w.s && t < w.e + 0.04;
        const said = t >= w.s;
        return (
          <span
            key={a + i}
            style={{
              display: 'inline-block',
              fontSize: 80,
              fontWeight: 800,
              padding: '2px 16px',
              borderRadius: 20,
              color,
              opacity: said ? 1 : 0.35,
              background: active ? highlight : 'transparent',
              transform: `translateY(${(1 - enter) * 20}px) scale(${active ? 1.07 : 1})`,
            }}
          >
            {w.w.replace(/[.،!؟?]+$/, (m) => (m.includes('؟') || m.includes('!') ? m : ''))}
          </span>
        );
      })}
    </div>
  );
};
