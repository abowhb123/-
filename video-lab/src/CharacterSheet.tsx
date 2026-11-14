import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Saudi } from './characters/Saudi';

// لوحة الكاركتر: الحالات جنب بعض للمراجعة
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: '#FFF8EC', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 20 }}>
    <Saudi width={560} />
    <Saudi width={560} mouth={0.7} brow={0.5} look={-0.6} />
    <Saudi width={560} headwear="shmagh" />
  </AbsoluteFill>
);
