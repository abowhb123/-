import React from 'react';

/**
 * كاركتر "سنعها" — نسخة شبه واقعية مستوحاة من صور أبو فواز
 * شعر مموّج مسرّح لجنب، حواجب عريضة، أنف بارز، شنب كثيف، سكسوكة عريضة،
 * ثوب أبيض بياقة مدببة وقلم ذهبي.
 * نفس خصائص النسخة المسطحة: mouth / blink / look / brow
 */
export type SaudiRealProps = {
  mouth?: number;
  blink?: number;
  look?: number;
  brow?: number;
  width?: number;
  style?: React.CSSProperties;
};

const HAIR = '#141010';
const HAIR_MID = '#2A211E';
const HAIR_HI = '#4A3A33';

export const SaudiReal: React.FC<SaudiRealProps> = ({ mouth = 0, blink = 0, look = 0, brow = 0, width = 600, style }) => {
  const eyeScale = Math.max(0.06, 1 - blink);
  const lx = look * 4.5;
  const by = -brow * 9;
  const open = Math.max(0, Math.min(1, mouth));

  const eye = (cx: number, flip: 1 | -1) => {
    const cy = 318;
    return (
      <g>
        {/* ظل محجر العين */}
        <ellipse cx={cx} cy={cy - 4} rx={30} ry={17} fill="#9C6440" opacity={0.18} />
        <g transform={`translate(${cx} ${cy}) scale(1 ${eyeScale}) translate(${-cx} ${-cy})`}>
          {/* بياض العين */}
          <path d={`M${cx - 22} ${cy + 1} Q${cx - 6 * flip} ${cy - 15} ${cx + 22} ${cy} Q${cx + 4 * flip} ${cy + 12} ${cx - 22} ${cy + 1} Z`} fill="url(#sclera)" />
          {/* القزحية */}
          <clipPath id={`eyeClip${cx}`}>
            <path d={`M${cx - 22} ${cy + 1} Q${cx - 6 * flip} ${cy - 15} ${cx + 22} ${cy} Q${cx + 4 * flip} ${cy + 12} ${cx - 22} ${cy + 1} Z`} />
          </clipPath>
          <g clipPath={`url(#eyeClip${cx})`}>
            <circle cx={cx + lx} cy={cy - 1} r={10.5} fill="url(#iris)" />
            <circle cx={cx + lx} cy={cy - 1} r={4.6} fill="#0B0605" />
            <circle cx={cx + lx + 3.6} cy={cy - 4.6} r={2.6} fill="#fff" opacity={0.95} />
            <circle cx={cx + lx - 3} cy={cy + 3} r={1.2} fill="#fff" opacity={0.5} />
            {/* ظل الجفن العلوي على العين */}
            <path d={`M${cx - 24} ${cy - 16} H${cx + 24} V${cy - 5} Q${cx} ${cy - 11} ${cx - 24} ${cy - 5} Z`} fill="#000" opacity={0.18} />
          </g>
          {/* الجفن العلوي والرموش */}
          <path d={`M${cx - 23} ${cy + 1} Q${cx - 6 * flip} ${cy - 16} ${cx + 23} ${cy}`} stroke="#1A0F0B" strokeWidth={3.6} fill="none" strokeLinecap="round" />
          {/* الجفن السفلي */}
          <path d={`M${cx - 18} ${cy + 5} Q${cx + 2 * flip} ${cy + 12} ${cx + 19} ${cy + 3}`} stroke="#8A5536" strokeWidth={1.4} fill="none" opacity={0.7} />
        </g>
        {/* ثنية الجفن */}
        <path d={`M${cx - 20} ${cy - 11} Q${cx - 4 * flip} ${cy - 23} ${cx + 21} ${cy - 10}`} stroke="#A26A45" strokeWidth={2} fill="none" opacity={0.7} />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 600 760" width={width} style={style}>
      <defs>
        <radialGradient id="skin" cx="0.48" cy="0.38" r="0.62">
          <stop offset="0" stopColor="#EBC19E" />
          <stop offset="0.55" stopColor="#DDA982" />
          <stop offset="1" stopColor="#B97E57" />
        </radialGradient>
        <radialGradient id="ear" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#D49B74" />
          <stop offset="1" stopColor="#B07650" />
        </radialGradient>
        <linearGradient id="neck" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#A9714C" />
          <stop offset="0.5" stopColor="#C68E66" />
        </linearGradient>
        <radialGradient id="iris" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#7A4A2A" />
          <stop offset="0.7" stopColor="#4A2A16" />
          <stop offset="1" stopColor="#24130A" />
        </radialGradient>
        <radialGradient id="sclera" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0.5" stopColor="#FBF7F3" />
          <stop offset="1" stopColor="#E3D3C6" />
        </radialGradient>
        <linearGradient id="hair" x1="0.2" x2="0.8" y1="0" y2="1">
          <stop offset="0" stopColor={HAIR_MID} />
          <stop offset="0.45" stopColor={HAIR} />
          <stop offset="1" stopColor="#0A0808" />
        </linearGradient>
        <linearGradient id="noseShade" x1="0" x2="1">
          <stop offset="0" stopColor="#A86E48" stopOpacity="0.55" />
          <stop offset="1" stopColor="#A86E48" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="stubble" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#3B3A44" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3B3A44" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id="thobe" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7E8EF" />
        </linearGradient>
        <linearGradient id="pen" x1="0" x2="1">
          <stop offset="0" stopColor="#A87A22" />
          <stop offset="0.5" stopColor="#F4D47E" />
          <stop offset="1" stopColor="#A87A22" />
        </linearGradient>
        <linearGradient id="lip" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#B56A5C" />
          <stop offset="1" stopColor="#9B5145" />
        </linearGradient>
        {/* ملمس الشعر واللحية */}
        <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="a">
            <feFuncA type="table" tableValues="0 0.35" />
          </feComponentTransfer>
          <feComposite in="a" in2="SourceGraphic" operator="in" result="t" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="t" />
          </feMerge>
        </filter>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ── الثوب ── */}
      <path d="M40 760 C 52 606 160 552 300 548 C 440 552 548 606 560 760 Z" fill="url(#thobe)" />
      {/* طيّات خفيفة */}
      <path d="M150 640 Q170 700 162 760 M450 640 Q430 700 438 760" stroke="#D9DAE4" strokeWidth="6" fill="none" filter="url(#soft)" />
      {/* المرد (الصدر) */}
      <path d="M284 590 L284 760 L316 760 L316 590 Z" fill="#F7F7FA" stroke="#DCDDE7" strokeWidth="2" />
      {/* الجيب والقلم */}
      <path d="M370 668 H450 V736 Q410 744 370 736 Z" fill="none" stroke="#D6D7E2" strokeWidth="2.5" />
      <rect x={392} y={626} width={7} height={58} rx={3} fill="url(#pen)" />
      <rect x={389.5} y={622} width={12} height={11} rx={3} fill="#C99A35" />

      {/* ── الرقبة ── */}
      <path d="M262 430 L260 548 Q300 572 340 548 L338 430 Z" fill="url(#neck)" />
      <path d="M262 470 Q300 520 338 470 L338 500 Q300 540 262 500 Z" fill="#8F5C3C" opacity={0.35} filter="url(#soft)" />

      {/* ── الياقة المدببة ── */}
      <path d="M254 520 L300 560 L346 520 L352 548 L300 592 L248 548 Z" fill="#FDFDFE" stroke="#D7D8E3" strokeWidth="2" />
      <path d="M248 540 L222 604 L290 586 L300 568 Z" fill="#FFFFFF" stroke="#D3D4DF" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M352 540 L378 604 L310 586 L300 568 Z" fill="#FFFFFF" stroke="#D3D4DF" strokeWidth="2.5" strokeLinejoin="round" />

      {/* ── الأذنين ── */}
      <path d="M200 300 C 176 292 168 318 174 344 C 178 366 190 384 206 384 Z" fill="url(#ear)" />
      <path d="M400 300 C 424 292 432 318 426 344 C 422 366 410 384 394 384 Z" fill="url(#ear)" />
      <path d="M186 316 Q180 340 194 366 M414 316 Q420 340 406 366" stroke="#9A6342" strokeWidth="3" fill="none" opacity={0.7} />

      {/* ── الوجه ── */}
      <path
        d="M198 296 C 198 222 244 188 300 188 C 356 188 402 222 402 296 C 402 386 386 448 354 482 C 336 500 318 508 300 508 C 282 508 264 500 246 482 C 214 448 198 386 198 296 Z"
        fill="url(#skin)"
      />
      {/* تظليل جوانب الوجه */}
      <path d="M198 296 C 198 380 212 440 246 482 C 230 440 222 380 226 300 Z" fill="#A46B45" opacity={0.28} filter="url(#soft)" />
      <path d="M402 296 C 402 380 388 440 354 482 C 370 440 378 380 374 300 Z" fill="#A46B45" opacity={0.28} filter="url(#soft)" />
      {/* ظل اللحية المحلوقة */}
      <path d="M214 392 C 226 450 262 500 300 504 C 338 500 374 450 386 392 C 370 430 340 446 300 446 C 260 446 230 430 214 392 Z" fill="url(#stubble)" />
      {/* خدود */}
      <ellipse cx={242} cy={378} rx={26} ry={15} fill="#E08A6E" opacity={0.18} filter="url(#soft)" />
      <ellipse cx={358} cy={378} rx={26} ry={15} fill="#E08A6E" opacity={0.18} filter="url(#soft)" />

      {/* ── الأنف ── */}
      <path d="M288 312 C 286 340 282 360 276 376 C 284 386 292 388 300 388 Z" fill="url(#noseShade)" />
      <path d="M292 316 C 290 344 286 362 280 374" stroke="#A86E48" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.75} />
      <ellipse cx={302} cy={372} rx={13} ry={10} fill="#F0C9A8" opacity={0.55} filter="url(#soft)" />
      <path d="M276 378 Q284 392 296 388 M324 378 Q316 392 304 388" stroke="#93593A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx={289} cy={388} rx={5} ry={2.6} fill="#5C3424" opacity={0.75} />
      <ellipse cx={311} cy={388} rx={5} ry={2.6} fill="#5C3424" opacity={0.75} />
      {/* خطوط الابتسامة */}
      <path d="M262 392 Q246 420 254 446 M338 392 Q354 420 346 446" stroke="#A46B45" strokeWidth="2.6" fill="none" opacity={0.45} />

      {/* ── الفم ── */}
      {open < 0.08 ? (
        <g>
          <path d="M266 426 Q300 458 334 426 Q300 436 266 426 Z" fill="#4E1A16" />
          <path d="M270 427 Q300 438 330 427 L327 436 Q300 446 273 436 Z" fill="#F4EEE8" />
          <path d="M280 436 V442 M290 438 V445 M300 439 V446 M310 438 V445 M320 436 V442" stroke="#D8CFC6" strokeWidth="1" />
          <path d="M272 446 Q300 462 328 446 Q300 456 272 446 Z" fill="url(#lip)" opacity={0.85} />
        </g>
      ) : (
        <g>
          <ellipse cx={300} cy={434} rx={23 + open * 3} ry={5 + open * 15} fill="#3E1210" />
          <rect x={283} y={434 - (5 + open * 15)} width={34} height={Math.min(9, 3 + open * 8)} rx={3} fill="#F4EEE8" />
          <ellipse cx={300} cy={441 + open * 8} rx={13 + open * 3} ry={2 + open * 5} fill="#B9524F" />
          <path d={`M${276 - open * 2} ${440 + open * 14} Q300 ${452 + open * 20} ${324 + open * 2} ${440 + open * 14}`} stroke="url(#lip)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* ── الشنب الكثيف ── */}
      <g>
        <path
          d="M244 424 Q252 396 282 394 Q296 396 300 402 Q304 396 318 394 Q348 396 356 424 Q360 438 350 442 Q342 422 320 420 Q306 420 300 424 Q294 420 280 420 Q258 422 250 442 Q240 438 244 424 Z"
          fill={HAIR}
        />
        {[258, 270, 282, 294, 306, 318, 330, 342].map((x, i) => (
          <path key={i} d={`M${x} ${404 + Math.abs(x - 300) * 0.12} l${(x - 300) * 0.06} 14`} stroke={HAIR_HI} strokeWidth={1.4} opacity={0.6} />
        ))}
      </g>

      {/* ── السكسوكة العريضة ── */}
      <g>
        <path d="M284 462 Q300 456 316 462 L313 476 Q300 480 287 476 Z" fill={HAIR} />
        <path
          d="M252 470 Q276 482 300 482 Q324 482 348 470 Q354 496 338 512 Q322 528 300 530 Q278 528 262 512 Q246 496 252 470 Z"
          fill={HAIR}
        />
        <path d="M262 512 l-4 8 M276 524 l-2 8 M300 530 v8 M324 524 l2 8 M338 512 l4 8" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
        <path d="M270 486 q4 14 2 26 M286 490 q2 16 0 30 M300 492 v32 M314 490 q-2 16 0 30 M330 486 q-4 14 -2 26" stroke={HAIR_HI} strokeWidth="1.4" fill="none" opacity={0.5} />
      </g>

      {/* ── الشعر المموّج المسرّح ── */}
      <g transform="translate(300 320) scale(1.03 1.06) translate(-300 -340)">
        <path
          d="M196 320 C 182 270 178 216 202 178 Q 206 150 234 138 Q 250 114 284 116 Q 308 98 338 110 Q 370 106 390 128 Q 418 138 420 172 Q 440 206 426 252 Q 422 288 410 314 C 404 272 394 248 374 234 C 344 218 300 212 262 220 C 230 228 206 264 196 320 Z"
          fill="url(#hair)"
        />
        {/* الموجة المسرّحة على الجبهة */}
        <path d="M412 258 Q 392 214 330 208 Q 272 206 232 236 Q 264 224 306 226 Q 356 230 388 254 Z" fill={HAIR} />
        <path d="M236 240 Q 270 214 318 214 Q 362 218 392 248" stroke={HAIR_MID} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* خصل ولمعة */}
        {[
          'M214 200 Q 250 160 300 152 Q 346 148 388 172',
          'M222 176 Q 258 136 304 132 Q 344 132 374 150',
          'M206 236 Q 236 196 286 186 Q 340 180 404 210',
          'M254 128 Q 286 116 322 120',
          'M402 196 Q 414 226 410 262',
          'M200 250 Q 194 280 200 306',
        ].map((d, i) => (
          <path key={i} d={d} stroke={i < 2 ? '#5A4840' : HAIR_HI} strokeWidth={i < 2 ? 3 : 4} fill="none" strokeLinecap="round" opacity={0.55} />
        ))}
        {/* السوالف */}
        <path d="M198 300 L200 344 L208 344 L210 290 Z M402 300 L400 344 L392 344 L390 290 Z" fill={HAIR} opacity={0.92} />
      </g>

      {/* ── العيون والحواجب ── */}
      {eye(252, 1)}
      {eye(348, -1)}
      <g transform={`translate(0 ${by})`}>
        <path d="M212 296 C 226 272 258 266 290 278 L288 291 C 262 284 236 288 216 304 Z" fill={HAIR} />
        <path d="M388 296 C 374 272 342 266 310 278 L312 291 C 338 284 364 288 384 304 Z" fill={HAIR} />
      </g>
    </svg>
  );
};
