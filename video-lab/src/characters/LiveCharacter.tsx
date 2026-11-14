import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';

/**
 * كاركتر حي من مقطع (Dreamina أو غيره) بعد قص خلفيته فريم فريم.
 * dir: مجلد الفريمات داخل public/ (cut-0001.png ...)
 * count: عدد الفريمات (30 فريم بالثانية)
 * لو الريل أطول من المقطع، يرجع المقطع لورا ثم يكمل (ذهاب وإياب) بدل ما يوقف.
 */
export const LiveCharacter: React.FC<{ dir: string; count: number; width?: number; offset?: number }> = ({
  dir,
  count,
  width = 1080,
  offset = 0,
}) => {
  const frame = Math.max(0, useCurrentFrame() - offset);
  const cycle = (count - 1) * 2;
  const p = frame % cycle;
  const idx = (p < count ? p : cycle - p) + 1;
  return (
    <Img
      src={staticFile(`${dir}/cut-${String(idx).padStart(4, '0')}.png`)}
      style={{ width, height: width, display: 'block' }}
    />
  );
};
