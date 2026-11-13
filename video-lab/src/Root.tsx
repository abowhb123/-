import React from 'react';
import { Composition } from 'remotion';
import { ArabicGsap } from './ArabicGsap';
import { JobAd } from './JobAd';
import { Welcome } from './Welcome';
import { CharacterTest } from './CharacterTest';

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
  </>
);
