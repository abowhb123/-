import React from 'react';
import { continueRender, delayRender, Img, staticFile } from 'remotion';

// ألوان الراجحية
export const RAPCO = {
  green: '#165d4a',
  greenDark: '#0e4436',
  beige: '#cdb69e',
  grey: '#e6e7e8',
  white: '#ffffff',
};

// تحميل خط Alexandria مرة وحدة قبل الرسم
const handle = delayRender('تحميل خط Alexandria');
new FontFace('Alexandria', `url(${staticFile('fonts/Alexandria.ttf')})`, { weight: '100 900' })
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(handle);
  })
  .catch(() => continueRender(handle));

/**
 * الشعار: إذا انحط ملف في public/ (مثلاً logo.png) ومرّرنا اسمه، يظهر الشعار الحقيقي.
 * وإذا ما فيه ملف، يظهر شعار نصي مؤقت.
 */
export const Logo: React.FC<{ src?: string | null; height: number; color?: string; className?: string }> = ({
  src,
  height,
  color = RAPCO.grey,
  className,
}) =>
  src ? (
    <Img className={className} src={staticFile(src)} style={{ height, objectFit: 'contain' }} />
  ) : (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color, lineHeight: 1.1 }}>
      <span style={{ fontSize: height * 0.55, fontWeight: 800 }}>الراجحية</span>
      <span style={{ fontSize: height * 0.18, fontWeight: 400, letterSpacing: 1, opacity: 0.85 }}>
        مصنع تمور الراجحية للإنتاج الزراعي
      </span>
    </div>
  );

export const center: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
