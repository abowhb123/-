import React from 'react';
import { Composition } from 'remotion';
import { ArabicGsap } from './ArabicGsap';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ArabicGsap"
    component={ArabicGsap}
    durationInFrames={300} // 10 ثواني × 30 فريم
    fps={30}
    width={1920}
    height={1080}
  />
);
