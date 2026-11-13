import React from 'react';
import { staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { Saudi } from './Saudi';

/**
 * الشخصية وهي تتكلم: الفم يتبع الصوت تلقائياً، والعيون ترمش، والرأس يتمايل.
 * voice: مسار ملف الصوت داخل public/ (تسجيلك بصوتك)
 */
export const TalkingSaudi: React.FC<{ voice: string; width?: number; delay?: number }> = ({ voice, width = 900, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile(voice));

  // قوة الصوت في هذا الفريم ← فتحة الفم
  let level = 0;
  const f = frame - delay;
  if (audioData && f >= 0) {
    const bins = visualizeAudio({ fps, frame: f, audioData, numberOfSamples: 32, optimizeFor: 'speed' });
    // الترددات المنخفضة والمتوسطة هي اللي فيها الكلام
    level = bins.slice(1, 10).reduce((a, b) => a + b, 0) / 9;
  }
  const mouth = Math.min(1, Math.max(0, (level - 0.012) * 14));

  // رمشة كل 3.2 ثانية تقريباً
  const cycle = Math.round(fps * 3.2);
  const t = frame % cycle;
  const blink = t < 3 ? t / 2 : t < 6 ? (6 - t) / 3 : 0;

  // تمايل خفيف + هزّة مع الكلام
  const sway = Math.sin(frame / 22) * 2.2 + mouth * 1.5;
  const bob = Math.sin(frame / 15) * 4 - mouth * 6;
  const brow = Math.max(0, mouth - 0.6);

  return (
    <div style={{ transform: `translateY(${bob}px) rotate(${sway}deg)`, transformOrigin: '50% 85%' }}>
      <Saudi width={width} mouth={mouth} blink={Math.min(1, blink)} brow={brow} look={Math.sin(frame / 40) * 0.6} />
    </div>
  );
};
