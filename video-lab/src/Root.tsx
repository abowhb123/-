import React from 'react';
import { Composition } from 'remotion';
import { ArabicGsap } from './ArabicGsap';
import { JobAd } from './JobAd';
import { Welcome } from './Welcome';
import { CharacterTest } from './CharacterTest';
import { CharacterSheet } from './CharacterSheet';
import { VoiceTest } from './VoiceTest';
import { Reel01, REEL01_FRAMES } from './Reel01';
import { Pilot1, Pilot2, Pilot3, W1, W2, W3 } from './pilots/Pilots';
import { framesFor } from './pilots/ReelShell';
import { PilotV1, PilotV2, PilotV3, V1, V2, V3 } from './pilots/PilotsV2';
import { framesFor as framesV2 } from './pilots/Engine';
import { Itsharo01, I1 } from './itsharo/Reels';
import { framesFor as framesI } from './itsharo/Itsharo';
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
    <Composition id="Reel01Presenter" component={Reel01} durationInFrames={REEL01_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'shmagh' as const }} />
    <Composition id="Reel01Hair" component={Reel01} durationInFrames={REEL01_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'hair' as const }} />
    <Composition id="Reel01" component={Reel01} durationInFrames={REEL01_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ headwear: 'shmagh' as const, live: { dir: 'character/dreamina/idle01-frames', count: 447 } }} />
    {/* نماذج حساب المحتوى */}
    <Composition id="Pilot1" component={Pilot1} durationInFrames={framesFor(W1)} fps={30} width={1080} height={1920} />
    <Composition id="Pilot2" component={Pilot2} durationInFrames={framesFor(W2)} fps={30} width={1080} height={1920} />
    <Composition id="Pilot3" component={Pilot3} durationInFrames={framesFor(W3)} fps={30} width={1080} height={1920} />
    <Composition id="PilotV1" component={PilotV1} durationInFrames={framesV2(V1)} fps={30} width={1080} height={1920} />
    <Composition id="PilotV2" component={PilotV2} durationInFrames={framesV2(V2)} fps={30} width={1080} height={1920} />
    <Composition id="PilotV3" component={PilotV3} durationInFrames={framesV2(V3)} fps={30} width={1080} height={1920} />
    {/* إتشارو */}
    <Composition id="Itsharo01" component={Itsharo01} durationInFrames={framesI(I1)} fps={30} width={1080} height={1920} />
  </>
);
