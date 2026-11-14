import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SaudiReal } from './characters/SaudiReal';

// لوحة الكاركتر (شبه واقعي): مبتسم، يتكلم، يرمش
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: '#F7F3EC', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 20 }}>
    <SaudiReal width={560} />
    <SaudiReal width={560} mouth={0.7} brow={0.5} look={-0.6} />
    <SaudiReal width={560} blink={1} look={0.5} />
  </AbsoluteFill>
);
