import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useGsap } from './lib/useGsap';
import { center, Logo, RAPCO, Watermark } from './lib/brand';
import { LOGO, MUSIC, WATERMARK, WELCOME } from './content';
import { Cue, SoundTrack } from './lib/SoundTrack';

// ترحيب بالموظفين الجدد — 1920×1080 — 15 ثانية
export const Welcome: React.FC = () => {
  const n = WELCOME.employees.length;
  const gap = Math.min(1.3, 6.5 / n); // الفاصل بين ظهور كل اسم

  // المؤثرات الصوتية (بالثواني) — نفس توقيت الحركات
  const cues: Cue[] = [
    { at: 0.2, sfx: 'whoosh', volume: 0.6 },
    { at: 1.0, sfx: 'ding', volume: 0.5 },
    { at: 3.0, sfx: 'whoosh', volume: 0.4 },
    ...WELCOME.employees.map((_, i): Cue => ({ at: 4.35 + i * gap, sfx: 'pop' })),
    { at: 12.0, sfx: 'whoosh', volume: 0.45 },
    { at: 12.5, sfx: 'ding', volume: 0.55 },
  ];

  const scope = useGsap((tl) => {
    // الخلفية
    tl.from('.ring', { scale: 0, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12 }, 0)
      .to('.ring', { rotate: 40, duration: 15, ease: 'none' }, 0)
      .from('.watermark', { opacity: 0, scale: 0.6, duration: 1.5, ease: 'power2.out' }, 0)
      .to('.watermark', { rotate: -90, duration: 15, ease: 'none' }, 0);

    // المشهد 1 (0 → 3.2ث): الشعار + أهلاً وسهلاً
    tl.from('.logo-wrap', { scale: 0.3, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.2)
      .from('.greet-word', { y: 120, opacity: 0, duration: 0.8, ease: 'power4.out', stagger: 0.2 }, 1.0)
      .to('.greet', { opacity: 0, y: 60, duration: 0.4, ease: 'power2.in' }, 2.9)
      // الشعار يصغر ويروح للزاوية العلوية اليمنى
      .to('.logo-wrap', { x: 640, y: -345, scale: 0.5, duration: 0.9, ease: 'power3.inOut' }, 3.0);

    // المشهد 2 (3.5 → 12ث): الأسماء واحد واحد
    tl.from('.intro', { opacity: 0, y: -40, duration: 0.6, ease: 'power3.out' }, 3.5)
      .from('.intro-line', { scaleX: 0, duration: 0.6, ease: 'power3.inOut' }, 3.8);
    WELCOME.employees.forEach((_, i) => {
      const t = 4.2 + i * gap;
      tl.from(`.card-${i}`, { y: 120, opacity: 0, duration: 0.7, ease: 'power3.out' }, t)
        .from(`.card-${i} .avatar`, { scale: 0, rotate: -120, duration: 0.7, ease: 'back.out(2)' }, t + 0.15)
        .from(`.card-${i} .name-word`, { y: '110%', duration: 0.6, ease: 'power4.out', stagger: 0.12 }, t + 0.3)
        .from(`.card-${i} .role`, { opacity: 0, x: 60, duration: 0.5 }, t + 0.6);
    });
    tl.to('.card', { y: -12, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut', stagger: 0.1 }, 10.6)
      .to('.s2', { opacity: 0, scale: 0.92, duration: 0.5, ease: 'power2.in' }, 12.0);

    // المشهد 3 (12.3 → 15ث): الختام
    tl.to('.logo-wrap', { x: 0, y: 200, scale: 0.85, duration: 1, ease: 'power3.inOut' }, 12.1)
      .from('.close-word', { y: 100, opacity: 0, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.12 }, 12.5)
      .from('.close-line', { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, 13.2);
  });

  return (
    <AbsoluteFill ref={scope} style={{ background: RAPCO.green, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden', color: RAPCO.grey }}>
      <SoundTrack music={MUSIC} cues={cues} />

      {/* الخلفية: حلقات */}
      <div className="ring" style={ring(1500, -500, -700)} />
      <div className="ring" style={ring(1000, 1250, 450)} />
      <div className="ring" style={ring(520, 1500, -160)} />

      <Watermark src={WATERMARK} size={1100} left={-330} top={-120} />

      {/* الشعار (يتحرك بين المشاهد) */}
      <AbsoluteFill style={{ ...center, marginTop: -120 }}>
        <div className="logo-wrap">
          <Logo src={LOGO} height={200} />
        </div>
      </AbsoluteFill>

      {/* المشهد 1 */}
      <AbsoluteFill className="greet" style={{ ...center, paddingTop: 420 }}>
        <div style={{ display: 'flex', gap: 34 }}>
          {WELCOME.greeting.split(' ').map((w) => (
            <span key={w} className="greet-word" style={{ display: 'inline-block', fontSize: 120, fontWeight: 700, color: RAPCO.beige }}>
              {w}
            </span>
          ))}
        </div>
      </AbsoluteFill>

      {/* المشهد 2 */}
      <AbsoluteFill className="s2" style={{ alignItems: 'center', paddingTop: 110 }}>
        <div className="intro" style={{ fontSize: 84, fontWeight: 800 }}>{WELCOME.intro}</div>
        <div className="intro-line" style={{ width: 420, height: 10, borderRadius: 5, background: RAPCO.beige, margin: '26px 0 70px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: n > 2 ? '1fr 1fr' : '1fr', gap: '44px 60px', width: 1560 }}>
          {WELCOME.employees.map((e, i) => (
            <div
              key={e.name}
              className={`card card-${i}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 40, background: RAPCO.grey, color: RAPCO.green,
                borderRadius: 36, padding: '36px 46px', boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              }}
            >
              <div
                className="avatar"
                style={{ flex: '0 0 auto', width: 130, height: 130, borderRadius: '50%', background: RAPCO.green, color: RAPCO.beige, fontSize: 66, fontWeight: 800, ...center }}
              >
                {e.name.trim()[0]}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 18, overflow: 'hidden', paddingBottom: 6 }}>
                  {e.name.split(' ').map((w) => (
                    <span key={w} className="name-word" style={{ display: 'inline-block', fontSize: 64, fontWeight: 800 }}>
                      {w}
                    </span>
                  ))}
                </div>
                <div className="role" style={{ fontSize: 40, fontWeight: 500, color: '#8a6f55', marginTop: 6 }}>
                  {e.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* المشهد 3 */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 260 }}>
        <div style={{ display: 'flex', gap: 30 }}>
          {WELCOME.closing.split(' ').map((w, i) => (
            <span key={i} className="close-word" style={{ display: 'inline-block', fontSize: 100, fontWeight: 800 }}>
              {w}
            </span>
          ))}
        </div>
        <div className="close-line" style={{ width: 560, height: 12, borderRadius: 6, background: RAPCO.beige, marginTop: 30 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ring = (size: number, left: number, top: number): React.CSSProperties => ({
  position: 'absolute', width: size, height: size, left, top, borderRadius: '50%',
  border: '3px solid rgba(205,182,158,0.18)', boxShadow: 'inset 0 0 0 60px rgba(205,182,158,0.04)',
});
