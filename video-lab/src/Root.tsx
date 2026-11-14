import React from 'react';
import { Composition } from 'remotion';
import { ArabicGsap } from './ArabicGsap';
import { JobAd } from './JobAd';
import { Welcome } from './Welcome';
import { CharacterTest } from './CharacterTest';
import { CharacterSheet } from './CharacterSheet';
import { VoiceTest } from './VoiceTest';
import { Reel01, REEL01_FRAMES } from './Reel01';
import words from './data/voice-preview.words.json';

export const RemotionRoot: React.FC = () => (
  <>
    {/* الفيديو التجريبي الأول */}
    <Composition id="ArabicGsap" component={ArabicGsap} durationInFrames={300} fps={30} width={1920} height={1080} />
    {/* إعلان وظيفة — ستوري */}
    <Composition id="JobAd" component={JobAd} durationInFrames={450} fps={30} width={1080} height={1920} />
    {/* ترحيب بالموظفين الجدد */}
    <Composition id="Welcome" component={Welcome} durationInFrames={450} fps={30} width={1920} height={1080} />
    {/* تجربة شخصية سنعها */}
    <Composition id="CharacterTest" component={CharacterTest} durationInFrames={270} fps={30} width={1080} height={1920} />
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={30} width={1760} height={720} />
    <Composition id="VoiceTestHair" component={VoiceTest} durationInFrames={420} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'hair' as const, words }} />
    <Composition id="VoiceTestShmagh" component={VoiceTest} durationInFrames={420} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'shmagh' as const, words }} />
    {/* ريلز سنعها */}
    <Composition id="Reel01" component={Reel01} durationInFrames={REEL01_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'shmagh' as const }} />
    <Composition id="Reel01Hair" component={Reel01} durationInFrames={REEL01_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'hair' as const }} />
  </>
);
