import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useGsap } from './lib/useGsap';
import { center, Logo, RAPCO, Watermark } from './lib/brand';
import { JOB_AD, LOGO, WATERMARK } from './content';

// إعلان وظيفة — ستوري 1080×1920 — 15 ثانية
export const JobAd: React.FC = () => {
  const scope = useGsap((tl) => {
    // خلفية: دوائر تدخل ثم تتحرك ببطء طول الفيديو
    tl.from('.blob', { scale: 0, duration: 1.4, ease: 'expo.out', stagger: 0.15 }, 0)
      .to('.blob-a', { x: -120, y: 160, duration: 15, ease: 'none' }, 0)
      .to('.blob-b', { x: 140, y: -200, duration: 15, ease: 'none' }, 0)
      .from('.watermark', { opacity: 0, scale: 0.6, duration: 1.5, ease: 'power2.out' }, 0)
      .to('.watermark', { rotate: 90, duration: 15, ease: 'none' }, 0)
      .from('.top-logo', { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
      .from('.bottom-bar', { scaleX: 0, transformOrigin: 'right', duration: 1, ease: 'power3.inOut' }, 0.3);

    // المشهد 1 (0 → 2.8ث): "نبحث عنك"
    tl.from('.hl-word', { y: 260, opacity: 0, rotate: -8, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.25 }, 0.3)
      .from('.hl-line', { scaleX: 0, transformOrigin: 'right', duration: 0.7, ease: 'power3.inOut' }, 1.0)
      .from('.hl-intro', { opacity: 0, y: 40, duration: 0.6 }, 1.3)
      .to('.s1', { opacity: 0, y: -120, duration: 0.5, ease: 'power2.in' }, 2.8);

    // المشهد 2 (3.1 → 6ث): المسمى الوظيفي
    tl.from('.tag', { scale: 0, duration: 0.6, ease: 'back.out(2.5)' }, 3.1)
      .from('.title-word', { y: 160, opacity: 0, duration: 0.8, ease: 'power4.out', stagger: 0.18 }, 3.4)
      .from('.title-card', { scaleY: 0, transformOrigin: 'center bottom', duration: 0.7, ease: 'power3.out' }, 3.2)
      .to('.title-card', { scale: 1.04, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 4.6)
      .to('.s2', { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power2.in' }, 6.0);

    // المشهد 3 (6.3 → 10.8ث): المتطلبات
    tl.from('.req-head', { opacity: 0, y: -50, duration: 0.6, ease: 'power3.out' }, 6.3)
      .from('.req', { x: 400, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.45 }, 6.7)
      .from('.req-check', { scale: 0, rotate: -90, duration: 0.5, ease: 'back.out(3)', stagger: 0.45 }, 7.0)
      .to('.s3', { opacity: 0, x: -200, duration: 0.5, ease: 'power2.in' }, 10.8);

    // المشهد 4 (11.1 → 15ث): قدّم الآن
    tl.from('.cta-btn', { scale: 0, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, 11.1)
      .from('.cta-note', { opacity: 0, y: 40, duration: 0.6 }, 11.7)
      .from('.cta-arrow', { y: -40, opacity: 0, duration: 0.5 }, 12.0)
      .to('.cta-arrow', { y: 30, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 12.5)
      .to('.cta-btn', { scale: 1.07, duration: 0.45, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 12.1);
  });

  return (
    <AbsoluteFill
      ref={scope}
      style={{ background: RAPCO.green, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden', color: RAPCO.grey }}
    >
      {/* الخلفية */}
      <div className="blob blob-a" style={blob(1100, -380, -260, 'rgba(205,182,158,0.14)')} />
      <div className="blob blob-b" style={blob(900, 420, 1350, 'rgba(230,231,232,0.07)')} />
      <div className="blob" style={blob(260, 820, 520, 'rgba(205,182,158,0.18)')} />

      <Watermark src={WATERMARK} size={1300} left={-200} top={560} />

      {/* الشعار أعلى الشاشة */}
      <div className="top-logo" style={{ position: 'absolute', top: 120, width: '100%', ...center }}>
        <Logo src={LOGO} height={160} />
      </div>
      <div className="bottom-bar" style={{ position: 'absolute', bottom: 140, left: 140, right: 140, height: 10, borderRadius: 5, background: RAPCO.beige }} />

      {/* المشهد 1 */}
      <AbsoluteFill className="s1" style={center}>
        <div style={{ display: 'flex', gap: 36 }}>
          {JOB_AD.headline.map((w) => (
            <span key={w} className="hl-word" style={{ display: 'inline-block', fontSize: 175, fontWeight: 800 }}>
              {w}
            </span>
          ))}
        </div>
        <div className="hl-line" style={{ width: 640, height: 16, borderRadius: 8, background: RAPCO.beige, marginTop: 10 }} />
        <div className="hl-intro" style={{ fontSize: 66, color: RAPCO.beige, marginTop: 60, fontWeight: 500 }}>
          {JOB_AD.intro}
        </div>
      </AbsoluteFill>

      {/* المشهد 2 */}
      <AbsoluteFill className="s2" style={center}>
        <div
          className="tag"
          style={{ background: RAPCO.beige, color: RAPCO.green, fontSize: 52, fontWeight: 700, padding: '18px 60px', borderRadius: 60, marginBottom: 60 }}
        >
          {JOB_AD.tag}
        </div>
        <div
          className="title-card"
          style={{ background: RAPCO.grey, borderRadius: 50, padding: '56px 70px', boxShadow: '0 30px 80px rgba(0,0,0,0.3)', display: 'flex', gap: 28, overflow: 'hidden' }}
        >
          {JOB_AD.title.split(' ').map((w) => (
            <span key={w} className="title-word" style={{ display: 'inline-block', fontSize: 112, fontWeight: 800, color: RAPCO.green }}>
              {w}
            </span>
          ))}
        </div>
      </AbsoluteFill>

      {/* المشهد 3 */}
      <AbsoluteFill className="s3" style={{ ...center, padding: '0 80px', alignItems: 'stretch' }}>
        <div className="req-head" style={{ fontSize: 96, fontWeight: 800, marginBottom: 70, textAlign: 'center' }}>
          {JOB_AD.requirementsTitle}
        </div>
        {JOB_AD.requirements.map((r) => (
          <div
            key={r}
            className="req"
            style={{
              display: 'flex', alignItems: 'center', gap: 36, background: 'rgba(230,231,232,0.1)',
              border: '2px solid rgba(205,182,158,0.4)', borderRadius: 32, padding: '38px 44px', marginBottom: 34,
            }}
          >
            <span
              className="req-check"
              style={{
                flex: '0 0 auto', width: 84, height: 84, borderRadius: '50%', background: RAPCO.beige, color: RAPCO.green,
                fontSize: 52, fontWeight: 800, ...center,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 50, fontWeight: 500, lineHeight: 1.4 }}>{r}</span>
          </div>
        ))}
      </AbsoluteFill>

      {/* المشهد 4 */}
      <AbsoluteFill style={center}>
        <div
          className="cta-btn"
          style={{
            background: RAPCO.beige, color: RAPCO.green, fontSize: 130, fontWeight: 800, padding: '50px 120px',
            borderRadius: 120, boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          }}
        >
          {JOB_AD.cta}
        </div>
        <div className="cta-note" style={{ fontSize: 60, marginTop: 80, fontWeight: 500 }}>
          {JOB_AD.ctaNote}
        </div>
        <div className="cta-arrow" style={{ fontSize: 110, marginTop: 40, color: RAPCO.beige }}>
          ↓
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const blob = (size: number, left: number, top: number, bg: string): React.CSSProperties => ({
  position: 'absolute', width: size, height: size, left, top, borderRadius: '50%', background: bg,
});
