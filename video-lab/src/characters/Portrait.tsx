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
  lipSync?: boolean; // تبديل صورة الفم مع الصوت (مطفّى افتراضياً: الحركة غير واقعية)
};

export const Portrait: React.FC<PortraitProps> = ({
  voice = null,
  delay = 0,
  width = 1000,
  base = 'character/portrait-cutout.png',
  mouthOpen = null,
  eyesClosed = null,
  lipSync = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(voice ? staticFile(voice) : staticFile('audio/pop.wav'));

  // قوة الصوت بمتوسط آخر 6 فريمات، عشان الحركة تكون ناعمة بدون اهتزاز
  const levelAt = (fr: number) => {
    if (!voice || !audioData || fr < 0) return 0;
    const bins = visualizeAudio({ fps, frame: fr, audioData, numberOfSamples: 32, optimizeFor: 'speed' });
    return bins.slice(1, 10).reduce((a, b) => a + b, 0) / 9;
  };
  const f = frame - delay;
  let level = 0;
  for (let k = 0; k < 6; k++) level += levelAt(f - k) / 6;
  const talk = Math.min(1, Math.max(0, (level - 0.01) * 16));

  // رمشة كل 3.4 ثانية تقريباً (فريمين)
  const blinking = frame % Math.round(fps * 3.4) < 3;

  const breathe = 1 + Math.sin(frame / 28) * 0.006 + talk * 0.012;
  // إيماءة رأس هادئة مع الكلام
  const sway = Math.sin(frame / 45) * 0.8 + talk * Math.sin(frame / 11) * 0.7;
  const bob = Math.sin(frame / 28) * 3 - talk * 4;

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
      {lipSync && mouthOpen && <Img src={staticFile(mouthOpen)} style={{ ...layer, opacity: Math.min(1, Math.max(0, (talk - 0.12) / 0.4)) }} />}
      {eyesClosed && <Img src={staticFile(eyesClosed)} style={{ ...layer, opacity: blinking ? 1 : 0 }} />}
    </div>
  );
};
