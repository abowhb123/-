import React from 'react';

/**
 * شخصية "سنعها": شاب سعودي بثوب وشماغ — رسم SVG قابل للتحريك
 *
 * mouth: فتحة الفم من 0 (مسكّر/ابتسامة) إلى 1 (مفتوح)
 * blink: 0 = عيون مفتوحة، 1 = مغمضة
 * look:  اتجاه النظر من -1 (يمين الشاشة) إلى 1 (يسار)
 * brow:  رفع الحواجب من 0 إلى 1 (تعجّب)
 */
export type SaudiProps = {
  mouth?: number;
  blink?: number;
  look?: number;
  brow?: number;
  width?: number;
  style?: React.CSSProperties;
};

const SKIN = '#C98E65';
const SKIN_SHADE = '#B07650';
const HAIR = '#2B1D16';
const THOBE = '#FBFBFD';
const THOBE_SHADE = '#E4E5EE';
const RED = '#C8102E';

export const Saudi: React.FC<SaudiProps> = ({ mouth = 0, blink = 0, look = 0, brow = 0, width = 600, style }) => {
  const eyeScale = Math.max(0.08, 1 - blink);
  const lx = look * 5;
  const by = -brow * 10;
  const open = Math.max(0, Math.min(1, mouth));

  const eye = (cx: number) => (
    <g transform={`translate(${cx} 308) scale(1 ${eyeScale}) translate(${-cx} -308)`}>
      <ellipse cx={cx} cy={308} rx={17} ry={12.5} fill="#fff" />
      <circle cx={cx + lx} cy={309} r={8.5} fill="#3B2416" />
      <circle cx={cx + lx} cy={309} r={4} fill="#140b06" />
      <circle cx={cx + lx + 3} cy={305.5} r={2.6} fill="#fff" />
    </g>
  );

  return (
    <svg viewBox="0 0 600 760" width={width} style={style}>
      <defs>
        {/* نقشة الشماغ */}
        <pattern id="shmagh" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill="#fff" />
          <rect x="0" y="0" width="11" height="11" fill={RED} />
          <rect x="14" y="14" width="5" height="5" fill={RED} opacity="0.9" />
          <path d="M0 16.5H22M16.5 0V22" stroke={RED} strokeWidth="1.4" opacity="0.6" />
        </pattern>
        <linearGradient id="thobeShade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={THOBE} />
          <stop offset="1" stopColor={THOBE_SHADE} />
        </linearGradient>
        <radialGradient id="cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E07A5F" stopOpacity="0.35" />
          <stop offset="1" stopColor="#E07A5F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* الثوب */}
      <path d="M60 760 C 70 610 170 565 300 565 C 430 565 530 610 540 760 Z" fill="url(#thobeShade)" />
      <path d="M300 590 V760" stroke={THOBE_SHADE} strokeWidth="5" />
      {[620, 662, 704].map((y) => (
        <circle key={y} cx={309} cy={y} r={4.5} fill="#D5D6E2" />
      ))}

      {/* الرقبة */}
      <path d="M255 430 L255 560 Q300 590 345 560 L345 430 Z" fill={SKIN_SHADE} />
      {/* ياقة الثوب */}
      <path d="M248 548 Q300 600 352 548 L360 572 Q300 625 240 572 Z" fill={THOBE} stroke={THOBE_SHADE} strokeWidth="3" />

      {/* الشماغ (الخلفي والأطراف النازلة) */}
      <path
        d="M300 150 C 205 150 162 222 158 320 C 154 420 148 525 112 650 L 212 672 C 232 565 226 470 236 402 L 364 402 C 374 470 368 565 388 672 L 488 650 C 452 525 446 420 442 320 C 438 222 395 150 300 150 Z"
        fill="url(#shmagh)"
      />
      <path d="M112 650 L212 672 M488 650 L388 672" stroke="#fff" strokeWidth="6" opacity="0.8" />

      {/* الوجه */}
      <ellipse cx={300} cy={330} rx={113} ry={140} fill={SKIN} />
      <ellipse cx={240} cy={365} rx={28} ry={18} fill="url(#cheek)" />
      <ellipse cx={360} cy={365} rx={28} ry={18} fill="url(#cheek)" />

      {/* اللحية */}
      <path
        d="M190 330 C 194 425 240 478 300 481 C 360 478 406 425 410 330 C 398 392 372 424 346 424 C 330 409 270 409 254 424 C 228 424 202 392 190 330 Z"
        fill={HAIR}
      />

      {/* الفم */}
      {open < 0.08 ? (
        <path d="M278 414 Q300 428 322 414" stroke="#5A1F1F" strokeWidth="5" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx={300} cy={417} rx={20 + open * 4} ry={3 + open * 15} fill="#4A1515" />
          <ellipse cx={300} cy={423 + open * 7} rx={11 + open * 3} ry={2 + open * 5} fill="#C9545A" />
          <rect x={287} y={416 - (3 + open * 15)} width={26} height={Math.min(6, 2 + open * 6)} rx={2} fill="#fff" opacity={0.9} />
        </g>
      )}
      {/* الشنب */}
      <path d="M258 396 Q300 380 342 396 Q322 408 300 402 Q278 408 258 396 Z" fill={HAIR} />

      {/* الأنف */}
      <path d="M300 318 Q290 352 298 363 Q309 367 317 358" stroke={SKIN_SHADE} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* العيون والحواجب */}
      {eye(250)}
      {eye(350)}
      <g transform={`translate(0 ${by})`}>
        <path d="M222 283 Q249 266 277 279" stroke={HAIR} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M323 279 Q351 266 378 283" stroke={HAIR} strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>

      {/* الشماغ فوق الجبهة */}
      <path d="M168 305 C 166 200 228 158 300 158 C 372 158 434 200 432 305 C 402 245 362 232 300 232 C 238 232 198 245 168 305 Z" fill="url(#shmagh)" />
      <path d="M168 305 C 198 245 238 232 300 232 C 362 232 402 245 432 305" stroke="#fff" strokeWidth="5" fill="none" opacity="0.85" />

      {/* العقال */}
      <path d="M184 196 Q300 150 416 196" stroke="#111" strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M176 214 Q300 262 424 214" stroke="#111" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M180 233 Q300 282 420 233" stroke="#111" strokeWidth="13" fill="none" strokeLinecap="round" />
    </svg>
  );
};
