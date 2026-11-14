import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Portrait } from './characters/Portrait';
import { SANAHA } from './CharacterTest';

type Word = { w: string; s: number; e: number };

// تجربة صوت أبو فواز (المنسوخ) على الكاركتر + ترجمة كلمة بكلمة
export const VoiceTest: React.FC<{ headwear: 'hair' | 'shmagh'; words: Word[] }> = ({ headwear, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 12;
  const t = (frame - delay) / fps;
  // نعرض سطر من 5 كلمات حول الكلمة الحالية
  const idx = Math.max(0, words.findIndex((w) => t < w.e));
  const start = Math.floor((idx === -1 ? words.length - 1 : idx) / 5) * 5;
  const line = words.slice(start, start + 5);

  return (
    <AbsoluteFill style={{ background: SANAHA.cream, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', background: SANAHA.indigo, left: -210, top: 900 }} />
      <Img src={staticFile('logos/sanaha-horizontal.svg')} style={{ position: 'absolute', top: 90, left: '50%', marginLeft: -260, width: 520 }} />
      <div style={{ position: 'absolute', bottom: -40, left: 0 }}>
        <Portrait
          voice="character/voice-preview.mp3"
          delay={delay}
          width={1080}
          base={headwear === 'shmagh' ? 'character/portrait-shmagh-cutout.png' : 'character/portrait-cutout.png'}
          mouthOpen="character/mouth-open.png"
          eyesClosed="character/eyes-closed.png"
        />
      </div>
      {/* الترجمة */}
      <div style={{ position: 'absolute', top: 330, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px' }}>
        {line.map((w, i) => {
          const active = t >= w.s && t < w.e + 0.05;
          const said = t >= w.s;
          return (
            <span
              key={start + i}
              style={{
                fontSize: 74, fontWeight: 800, padding: '4px 14px', borderRadius: 18,
                color: active ? SANAHA.indigo : said ? SANAHA.indigo : 'rgba(43,45,110,0.3)',
                background: active ? SANAHA.saffron : 'transparent',
                transform: `scale(${active ? 1.08 : 1})`,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
      <Sequence from={delay}>
        <Audio src={staticFile('character/voice-preview.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
