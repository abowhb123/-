import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from 'remotion';
import { useGsap } from './lib/useGsap';
import { Captions, Word } from './lib/Captions';
import { Portrait } from './characters/Portrait';
import { SANAHA } from './CharacterTest';
import words from './data/reel01.words.json';

// ريل 01: حاسبة نهاية الخدمة — ستوري 1080×1920
const D = 0.5; // الصوت يبدأ بعد نص ثانية
const W = words as Word[];
const at = (i: number) => D + W[i].s;
const CHUNKS: [number, number][] = [[0, 2], [3, 4], [5, 7], [8, 9], [10, 12], [13, 15], [16, 18], [19, 19], [20, 21], [22, 23], [24, 26]];
export const REEL01_FRAMES = Math.ceil((D + W[W.length - 1].e + 3.2) * 30);

export const Reel01: React.FC<{ headwear?: 'hair' | 'shmagh' }> = ({ headwear = 'shmagh' }) => {
  const scope = useGsap((tl) => {
    tl.from('.logo', { y: -80, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0)
      .from('.char', { y: 500, duration: 0.9, ease: 'back.out(1.3)' }, 0)
      // بطاقة الحاسبة: تدخل مع "تكتب"
      .from('.card', { y: -60, scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, at(10) - 0.15)
      // تمرير من البيانات إلى النتيجة
      .to('.sheet', { y: -1028, duration: at(18) - at(11), ease: 'power1.inOut' }, at(11))
      .from('.result-glow', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)' }, at(18))
      .to('.result-glow', { opacity: 0.35, duration: 0.35, yoyo: true, repeat: 3 }, at(18) + 0.4)
      .to('.card', { y: -60, opacity: 0, scale: 0.9, duration: 0.45, ease: 'power2.in' }, at(23) + 0.1)
      // الختام
      .from('.cta', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' }, at(26) + 0.2)
      .from('.cta-line', { scaleX: 0, duration: 0.5, ease: 'power3.out' }, at(26) + 0.6)
      .from('.soon', { y: 30, opacity: 0, duration: 0.5 }, at(26) + 0.8);
  });

  return (
    <AbsoluteFill ref={scope} style={{ background: SANAHA.cream, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1500, height: 1500, borderRadius: '50%', background: SANAHA.indigo, left: -210, top: 1000 }} />
      <Img className="logo" src={staticFile('logos/sanaha-horizontal.svg')} style={{ position: 'absolute', top: 70, left: '50%', marginLeft: -170, width: 340 }} />

      {/* بطاقة الحاسبة */}
      <div
        className="card"
        style={{
          position: 'absolute', top: 250, left: 80, right: 80, height: 470, borderRadius: 36, overflow: 'hidden',
          background: '#fff', boxShadow: '0 30px 70px rgba(15,94,99,0.25)', border: `6px solid ${SANAHA.indigo}`,
        }}
      >
        <div className="sheet" style={{ position: 'absolute', top: 0, right: 0, width: 1460, marginRight: -40 }}>
          <Img src={staticFile('product/eos-calculator.png')} style={{ width: '100%' }} />
        </div>
        <div
          className="result-glow"
          style={{ position: 'absolute', bottom: 18, left: 18, right: 18, height: 96, borderRadius: 20, border: `6px solid ${SANAHA.saffron}`, boxShadow: `0 0 40px ${SANAHA.saffron}` }}
        />
      </div>

      {/* الختام */}
      <div className="cta" style={{ position: 'absolute', top: 300, left: 80, right: 80, textAlign: 'center', color: SANAHA.indigo }}>
        <div style={{ fontSize: 60, fontWeight: 500 }}>حاسبة</div>
        <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1.15 }}>مكافأة نهاية الخدمة</div>
        <div className="cta-line" style={{ width: 380, height: 12, borderRadius: 6, background: SANAHA.saffron, margin: '26px auto' }} />
        <div className="soon" style={{ fontSize: 56, fontWeight: 600, background: SANAHA.indigo, color: SANAHA.cream, display: 'inline-block', padding: '16px 44px', borderRadius: 60 }}>
          قريباً في متجر سنعها
        </div>
      </div>

      {/* الكاركتر */}
      <div className="char" style={{ position: 'absolute', bottom: -60, left: 0 }}>
        <Portrait
          voice="character/vo/reel01.mp3"
          delay={Math.round(D * 30)}
          width={1080}
          base={headwear === 'shmagh' ? 'character/portrait-shmagh-cutout.png' : 'character/portrait-cutout.png'}
          mouthOpen="character/mouth-open.png"
          eyesClosed="character/eyes-closed.png"
        />
      </div>

      {/* الترجمة */}
      <Captions
        words={W}
        chunks={CHUNKS}
        delay={D}
        until={W[W.length - 1].e + 0.3}
        color={SANAHA.indigo}
        highlight={SANAHA.saffron}
        style={{ position: 'absolute', top: 770, left: 40, right: 40 }}
      />

      <Sequence from={Math.round(D * 30)}>
        <Audio src={staticFile('character/vo/reel01.mp3')} />
      </Sequence>
      <Audio src={staticFile('audio/music.wav')} volume={0.1} loop />
      <Sequence from={Math.round((at(10) - 0.15) * 30)} durationInFrames={30}>
        <Audio src={staticFile('audio/whoosh.wav')} volume={0.35} />
      </Sequence>
      <Sequence from={Math.round(at(18) * 30)} durationInFrames={45}>
        <Audio src={staticFile('audio/ding.wav')} volume={0.35} />
      </Sequence>
      <Sequence from={Math.round((at(26) + 0.2) * 30)} durationInFrames={45}>
        <Audio src={staticFile('audio/pop.wav')} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
