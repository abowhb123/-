import React from 'react';

/**
 * كاركتر "سنعها" — مستوحى من صورة أبو فواز
 * شعر أسود كيرلي، حواجب عريضة، شنب وسكسوكة، ابتسامة عريضة، ثوب بياقة واقفة وقلم.
 *
 * mouth:    فتحة الفم من 0 (ابتسامة) إلى 1 (مفتوح بالكلام)
 * blink:    0 = عيون مفتوحة، 1 = مغمضة
 * look:     اتجاه النظر من -1 إلى 1
 * brow:     رفع الحواجب من 0 إلى 1
 * headwear: 'hair' (الشعر، الأساسي) أو 'shmagh' (شماغ وعقال)
 */
export type SaudiProps = {
  mouth?: number;
  blink?: number;
  look?: number;
  brow?: number;
  headwear?: 'hair' | 'shmagh';
  width?: number;
  style?: React.CSSProperties;
};

const SKIN = '#D6A27B';
const SKIN_SHADE = '#BC855C';
const SKIN_DEEP = '#A8714B';
const HAIR = '#1B1311';
const HAIR_HI = '#3A2A24';
const THOBE = '#FBFBFD';
const THOBE_SHADE = '#DEDFEA';
const RED = '#C8102E';

// تجعيدات الشعر: [x, y, نصف القطر]
const CURLS: [number, number, number][] = [
  [206, 232, 26], [228, 186, 33], [266, 152, 37], [312, 140, 38], [356, 150, 36], [390, 180, 32],
  [404, 226, 25], [250, 208, 24], [292, 190, 27], [336, 192, 27], [372, 212, 23], [276, 222, 18],
  [320, 218, 17],
];

export const Saudi: React.FC<SaudiProps> = ({
  mouth = 0,
  blink = 0,
  look = 0,
  brow = 0,
  headwear = 'hair',
  width = 600,
  style,
}) => {
  const eyeScale = Math.max(0.08, 1 - blink);
  const lx = look * 5;
  const by = -brow * 10;
  const open = Math.max(0, Math.min(1, mouth));
  const shmagh = headwear === 'shmagh';

  const eye = (cx: number) => (
    <g>
      <g transform={`translate(${cx} 314) scale(1 ${eyeScale}) translate(${-cx} -314)`}>
        <path d={`M${cx - 19} 315 Q${cx} 300 ${cx + 19} 315 Q${cx} 326 ${cx - 19} 315 Z`} fill="#fff" />
        <circle cx={cx + lx} cy={314} r={8.5} fill="#4A2C1A" />
        <circle cx={cx + lx} cy={314} r={4.2} fill="#120a06" />
        <circle cx={cx + lx + 3} cy={310.5} r={2.6} fill="#fff" />
        <path d={`M${cx - 20} 314 Q${cx} 298 ${cx + 20} 314`} stroke="#2a1a14" strokeWidth={3.2} fill="none" strokeLinecap="round" />
      </g>
      {/* خط الابتسامة تحت العين */}
      <path d={`M${cx - 14} 330 Q${cx} 336 ${cx + 14} 330`} stroke={SKIN_SHADE} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );

  return (
    <svg viewBox="0 0 600 760" width={width} style={style}>
      <defs>
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
          <stop offset="0" stopColor="#E07A5F" stopOpacity="0.28" />
          <stop offset="1" stopColor="#E07A5F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pen" x1="0" x2="1">
          <stop offset="0" stopColor="#B8862B" />
          <stop offset="0.5" stopColor="#F2CF75" />
          <stop offset="1" stopColor="#B8862B" />
        </linearGradient>
      </defs>

      {/* ── الثوب ── */}
      <path d="M50 760 C 62 598 168 544 300 544 C 432 544 538 598 550 760 Z" fill="url(#thobeShade)" />
      {/* فتحة الصدر والأزرار */}
      <path d="M300 578 V760" stroke={THOBE_SHADE} strokeWidth="4" />
      <path d="M288 582 V760 M312 582 V760" stroke="#ECEDF4" strokeWidth="2" />
      {[616, 662, 708].map((y) => (
        <circle key={y} cx={300} cy={y} r={4.2} fill="#D3D4E0" />
      ))}
      {/* الجيب والقلم */}
      <path d="M372 664 H448 V728 Q410 738 372 728 Z" fill="none" stroke={THOBE_SHADE} strokeWidth="3" />
      <rect x={392} y={624} width={7} height={56} rx={3} fill="url(#pen)" />
      <rect x={390} y={622} width={11} height={10} rx={3} fill="#C9972F" />

      {/* ── الرقبة والياقة الواقفة ── */}
      <path d="M264 440 L264 536 Q300 556 336 536 L336 440 Z" fill={SKIN_SHADE} />
      <path d="M238 516 Q300 546 362 516 L366 568 Q300 594 234 568 Z" fill={THOBE} stroke={THOBE_SHADE} strokeWidth="3" />
      <path d="M296 544 L300 580 L304 544" stroke={THOBE_SHADE} strokeWidth="3" fill="none" />

      {shmagh && (
        <path
          d="M300 150 C 205 150 162 222 158 320 C 154 420 148 525 112 650 L 212 672 C 232 565 226 470 236 402 L 364 402 C 374 470 368 565 388 672 L 488 650 C 452 525 446 420 442 320 C 438 222 395 150 300 150 Z"
          fill="url(#shmagh)"
        />
      )}

      {/* ── الأذنين ── */}
      {!shmagh && (
        <g>
          <ellipse cx={184} cy={334} rx={17} ry={29} fill={SKIN_SHADE} />
          <ellipse cx={416} cy={334} rx={17} ry={29} fill={SKIN_SHADE} />
          <path d="M180 322 Q188 334 182 348 M420 322 Q412 334 418 348" stroke={SKIN_DEEP} strokeWidth="3" fill="none" />
        </g>
      )}

      {/* ── الوجه ── */}
      <path d="M188 300 C 188 228 236 194 300 194 C 364 194 412 228 412 300 C 412 394 388 456 300 482 C 212 456 188 394 188 300 Z" fill={SKIN} />
      <ellipse cx={240} cy={372} rx={26} ry={16} fill="url(#cheek)" />
      <ellipse cx={360} cy={372} rx={26} ry={16} fill="url(#cheek)" />
      {/* ظل خفيف للحية المحلوقة */}
      <path d="M204 392 C 220 446 256 474 300 482 C 344 474 380 446 396 392 C 378 436 344 462 300 466 C 256 462 222 436 204 392 Z" fill={SKIN_DEEP} opacity={0.22} />

      {/* ── الشعر الكيرلي ── */}
      {!shmagh && (
        <g>
          <path d="M190 300 C 180 236 202 160 264 132 C 314 112 380 124 406 166 C 428 204 426 262 412 300 C 404 262 392 240 366 228 C 328 214 270 214 236 228 C 210 240 196 266 190 300 Z" fill={HAIR} />
          {/* سوالف قصيرة */}
          <path d="M191 290 L193 318 L201 318 L205 282 Z M409 290 L407 318 L399 318 L395 282 Z" fill={HAIR} opacity={0.9} />
          {CURLS.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={HAIR} />
              <path d={`M${x - r * 0.55} ${y - r * 0.1} Q${x} ${y - r * 0.75} ${x + r * 0.5} ${y - r * 0.2}`} stroke={HAIR_HI} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}

      {/* ── الفم ── */}
      {open < 0.08 ? (
        // ابتسامة عريضة بالأسنان
        <g>
          <path d="M260 420 Q300 464 340 420 Q300 432 260 420 Z" fill="#5A1A1A" />
          <path d="M265 421 Q300 434 335 421 L332 432 Q300 444 268 432 Z" fill="#fff" />
        </g>
      ) : (
        <g>
          <ellipse cx={300} cy={428} rx={22 + open * 3} ry={5 + open * 15} fill="#4A1515" />
          <rect x={284} y={428 - (5 + open * 15)} width={32} height={Math.min(8, 3 + open * 7)} rx={2} fill="#fff" />
          <ellipse cx={300} cy={434 + open * 8} rx={12 + open * 3} ry={2 + open * 5} fill="#C9545A" />
        </g>
      )}

      {/* ── الشنب العريض ── */}
      <path
        d="M240 420 Q250 390 282 390 Q296 392 300 398 Q304 392 318 390 Q350 390 360 420 Q364 436 354 440 Q346 416 320 414 Q306 414 300 418 Q294 414 280 414 Q254 416 246 440 Q236 436 240 420 Z"
        fill={HAIR}
      />
      {/* ── السكسوكة ── */}
      <path d="M286 452 Q300 446 314 452 L311 464 Q300 468 289 464 Z" fill={HAIR} />
      <path d="M258 462 Q300 476 342 462 Q346 496 300 510 Q254 496 258 462 Z" fill={HAIR} />

      {/* ── الأنف ── */}
      <path d="M291 322 Q289 348 287 364" stroke={SKIN_SHADE} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M280 370 Q290 382 300 379 Q310 382 320 370" stroke={SKIN_DEEP} strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ── العيون والحواجب العريضة ── */}
      {eye(252)}
      {eye(348)}
      <g transform={`translate(0 ${by})`}>
        <path d="M218 290 Q244 262 284 276 L282 290 Q250 280 224 300 Z" fill={HAIR} />
        <path d="M382 290 Q356 262 316 276 L318 290 Q350 280 376 300 Z" fill={HAIR} />
      </g>

      {/* ── الشماغ فوق الجبهة (نسخة الشماغ) ── */}
      {shmagh && (
        <g>
          <path d="M168 305 C 166 200 228 158 300 158 C 372 158 434 200 432 305 C 402 245 362 232 300 232 C 238 232 198 245 168 305 Z" fill="url(#shmagh)" />
          <path d="M168 305 C 198 245 238 232 300 232 C 362 232 402 245 432 305" stroke="#fff" strokeWidth="5" fill="none" opacity="0.85" />
          <path d="M184 196 Q300 150 416 196" stroke="#111" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d="M176 214 Q300 262 424 214" stroke="#111" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M180 233 Q300 282 420 233" stroke="#111" strokeWidth="13" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
