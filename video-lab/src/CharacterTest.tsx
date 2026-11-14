import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from 'remotion';
import { useGsap } from './lib/useGsap';
import { Portrait } from './characters/Portrait';

// ألوان سنعها
// indigo = اللون الأساسي (تركوازي) · saffron = لون التمييز (رملي)
export const SANAHA = { indigo: '#0F5E63', saffron: '#E9A35B', cream: '#F7F3EC', mint: '#3BB273', ink: '#0B2E30' };

const VOICE = 'audio/voice-sample.wav'; // ← بيتبدّل بتسجيلك
const LINE = ['تعبت', 'من', 'حساب', 'نهاية', 'الخدمة؟', 'سنّعها', 'بملف', 'واحد!'];

// تجربة الشخصية — ستوري 1080×1920
export const CharacterTest: React.FC = () => {
  const scope = useGsap((tl) => {
    tl.from('.logo', { y: -100, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0)
      .from('.char', { y: 700, duration: 1, ease: 'back.out(1.2)' }, 0.1)
      .from('.bubble', { scale: 0, transformOrigin: '70% 100%', duration: 0.6, ease: 'back.out(2)' }, 0.7)
      .from('.w', { opacity: 0, y: 30, duration: 0.35, ease: 'power2.out', stagger: 0.55 }, 0.9)
      .to('.w-hl', { color: SANAHA.saffron, scale: 1.06, duration: 0.3 }, 4.0);
  });

  return (
    <AbsoluteFill ref={scope} style={{ background: SANAHA.cream, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', background: SANAHA.indigo, left: -160, top: 1080 }} />
      <Img className="logo" src={staticFile('logos/sanaha-horizontal.svg')} style={{ position: 'absolute', top: 90, left: '50%', marginLeft: -190, width: 380 }} />

      {/* فقاعة الكلام */}
      <div
        className="bubble"
        style={{
          position: 'absolute', top: 330, left: 90, right: 90, background: '#fff', borderRadius: 50, padding: '50px 60px',
          boxShadow: '0 20px 60px rgba(15,94,99,0.15)', display: 'flex', flexWrap: 'wrap', gap: '10px 22px', justifyContent: 'center',
        }}
      >
        {LINE.map((w, i) => (
          <span
            key={i}
            className={`w ${i >= 5 ? 'w-hl' : ''}`}
            style={{ display: 'inline-block', fontSize: 78, fontWeight: 800, color: SANAHA.indigo, padding: i >= 5 ? '0 8px' : 0 }}
          >
            {w}
          </span>
        ))}
        <div style={{ position: 'absolute', bottom: -38, right: 360, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderTop: '44px solid #fff' }} />
      </div>

      <div className="char" style={{ position: 'absolute', bottom: -60, left: 0 }}>
        <Portrait voice={VOICE} width={1080} delay={15} />
      </div>

      <Sequence from={15}>
        <Audio src={staticFile(VOICE)} />
      </Sequence>
      <Audio src={staticFile('audio/music.wav')} volume={0.12} />
    </AbsoluteFill>
  );
};
