import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import gsap from 'gsap';

// ألوان الراجحية
const GREEN = '#165d4a';
const BEIGE = '#cdb69e';
const GREY = '#e6e7e8';

// تحميل خط Alexandria قبل ما يبدأ الرسم
const fontHandle = delayRender('تحميل خط Alexandria');
const font = new FontFace('Alexandria', `url(${staticFile('fonts/Alexandria.ttf')})`, {
  weight: '100 900',
});
font
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(fontHandle);
  })
  .catch(() => continueRender(fontHandle));

// نحرّك الكلمات كاملة (مو الحروف) عشان الحروف العربية تبقى متصلة
const TITLE = ['صناعة', 'الفيديو', 'بالكود'];
const TOOLS = [
  { name: 'Remotion', role: 'البناء' },
  { name: 'GSAP', role: 'الحركة' },
  { name: 'FFmpeg', role: 'التصدير' },
];

export const ArabicGsap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const root = useRef<HTMLDivElement>(null);
  const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

  // نبني الخط الزمني مرة وحدة وهو متوقف (paused)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });

      // المشهد 1 (0 → 3.4ث): العنوان كلمة كلمة + خط بيج
      t.from('.bg-circle', { scale: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15 }, 0)
        .from('.title-word', { y: 140, opacity: 0, rotate: -6, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.22 }, 0.3)
        .from('.underline', { scaleX: 0, transformOrigin: 'right center', duration: 0.8, ease: 'power3.inOut' }, 1.3)
        .from('.subtitle', { opacity: 0, y: 30, duration: 0.6 }, 1.8)
        .to('.scene1', { opacity: 0, y: -80, duration: 0.6, ease: 'power2.in' }, 3.4);

      // المشهد 2 (3.8 → 7ث): بطاقات الأدوات
      t.from('.card', { x: 300, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.3 }, 3.8)
        .from('.card-name', { scale: 0.4, duration: 0.6, ease: 'elastic.out(1, 0.5)', stagger: 0.3 }, 4.0)
        .to('.card', { y: -20, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut', stagger: 0.12 }, 5.6)
        .to('.scene2', { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, 6.9);

      // المشهد 3 (7.3 → 10ث): الختام
      t.from('.final-badge', { scale: 0, rotate: 180, duration: 0.9, ease: 'back.out(2)' }, 7.3)
        .from('.final-text', { opacity: 0, y: 50, duration: 0.7, ease: 'power3.out' }, 7.7)
        .to('.final-text', { letterSpacing: '6px', duration: 1.5, ease: 'sine.inOut' }, 8.2)
        .to('.fade', { opacity: 1, duration: 0.5 }, 9.5);

      setTl(t);
    }, root);
    return () => ctx.revert();
  }, []);

  // كل فريم: نقفز بالخط الزمني لنفس اللحظة بالضبط
  useLayoutEffect(() => {
    tl?.seek(frame / fps, false);
  }, [tl, frame, fps]);

  return (
    <AbsoluteFill
      ref={root}
      style={{ backgroundColor: GREEN, fontFamily: 'Alexandria', direction: 'rtl', overflow: 'hidden' }}
    >
      {/* دوائر خلفية */}
      <div className="bg-circle" style={circle(900, -250, -300, 'rgba(205,182,158,0.12)')} />
      <div className="bg-circle" style={circle(600, 1500, 650, 'rgba(230,231,232,0.08)')} />

      {/* المشهد 1 */}
      <AbsoluteFill className="scene1" style={center}>
        <div style={{ display: 'flex', gap: 40 }}>
          {TITLE.map((w) => (
            <span key={w} className="title-word" style={{ display: 'inline-block', fontSize: 150, fontWeight: 800, color: GREY }}>
              {w}
            </span>
          ))}
        </div>
        <div className="underline" style={{ width: 900, height: 14, borderRadius: 7, background: BEIGE, marginTop: 20 }} />
        <div className="subtitle" style={{ fontSize: 48, color: BEIGE, marginTop: 40, fontWeight: 400 }}>
          تجربة نص عربي متحرك بـ GSAP داخل Remotion
        </div>
      </AbsoluteFill>

      {/* المشهد 2 */}
      <AbsoluteFill className="scene2" style={{ ...center, gap: 36 }}>
        {TOOLS.map((t) => (
          <div
            key={t.name}
            className="card"
            style={{
              width: 1100, height: 170, borderRadius: 28, background: GREY,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 70px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 700, color: GREEN }}>{t.role}</span>
            <span className="card-name" style={{ display: 'inline-block', fontSize: 64, fontWeight: 600, color: '#8a6f55', direction: 'ltr' }}>
              {t.name}
            </span>
          </div>
        ))}
      </AbsoluteFill>

      {/* المشهد 3 */}
      <AbsoluteFill style={center}>
        <div
          className="final-badge"
          style={{
            width: 220, height: 220, borderRadius: '50%', background: BEIGE, color: GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 130, fontWeight: 800,
          }}
        >
          ✓
        </div>
        <div className="final-text" style={{ fontSize: 110, fontWeight: 700, color: GREY, marginTop: 50 }}>
          البيئة جاهزة يا أبو فواز
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="fade" style={{ background: '#0b2e25', opacity: 0 }} />
    </AbsoluteFill>
  );
};

const center: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

const circle = (size: number, left: number, top: number, bg: string): React.CSSProperties => ({
  position: 'absolute', width: size, height: size, left, top, borderRadius: '50%', background: bg,
});
