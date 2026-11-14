import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

/**
 * كاركتر سنعها (صورة ثلاثية الأبعاد) وهو حي:
 * - تنفّس وتمايل هادئ دايماً
 * - يتفاعل مع الصوت (هزّة وتقريب خفيف)
 * - إذا توفرت صور الفم المفتوح والعيون المغمضة، يبدّل بينها:
 *   الفم يتبع الصوت، والعيون ترمش
 *
 * كل الصور لازم تكون بنفس المقاس والإطار (مقصوصة الخلفية)
 */
export type PortraitProps = {
  voice?: string | null; // مسار الصوت داخل public/
  delay?: number; // متى يبدأ الصوت (بالفريمات)
  width?: number;
  base?: string;
  mouthOpen?: string | null; // صورة الفم مفتوح (اختياري)
  eyesClosed?: string | null; // صورة العيون مغمضة (اختياري)
};

export const Portrait: React.FC<PortraitProps> = ({
  voice = null,
  delay = 0,
  width = 1000,
  base = 'character/portrait-cutout.png',
  mouthOpen = null,
  eyesClosed = null,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(voice ? staticFile(voice) : staticFile('audio/pop.wav'));

  let level = 0;
  const f = frame - delay;
  if (voice && audioData && f >= 0) {
    const bins = visualizeAudio({ fps, frame: f, audioData, numberOfSamples: 32, optimizeFor: 'speed' });
    level = bins.slice(1, 10).reduce((a, b) => a + b, 0) / 9;
  }
  const talk = Math.min(1, Math.max(0, (level - 0.012) * 14));

  // رمشة كل 3.4 ثانية تقريباً (فريمين)
  const blinking = frame % Math.round(fps * 3.4) < 3;

  const breathe = 1 + Math.sin(frame / 28) * 0.006 + talk * 0.012;
  const sway = Math.sin(frame / 45) * 0.8 + talk * Math.sin(frame / 3) * 0.6;
  const bob = Math.sin(frame / 28) * 3 - talk * 5;

  const layer: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%' };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: width,
        transform: `translateY(${bob}px) rotate(${sway}deg) scale(${breathe})`,
        transformOrigin: '50% 90%',
      }}
    >
      <Img src={staticFile(base)} style={layer} />
      {mouthOpen && <Img src={staticFile(mouthOpen)} style={{ ...layer, opacity: talk > 0.35 ? 1 : 0 }} />}
      {eyesClosed && <Img src={staticFile(eyesClosed)} style={{ ...layer, opacity: blinking ? 1 : 0 }} />}
    </div>
  );
};
