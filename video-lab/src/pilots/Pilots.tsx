import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Word } from '../lib/Captions';
import { Appear, at, C, Card, ReelShell, Sfx } from './ReelShell';
import w1 from '../data/pilot1.words.json';
import w2 from '../data/pilot2.words.json';
import w3 from '../data/pilot3.words.json';

export const W1 = w1 as Word[];
export const W2 = w2 as Word[];
export const W3 = w3 as Word[];

const big: React.CSSProperties = { fontSize: 92, fontWeight: 800, color: C.teal, textAlign: 'center', lineHeight: 1.25 };
const line: React.CSSProperties = { fontSize: 56, fontWeight: 700, color: C.ink, lineHeight: 1.5 };
const center: React.CSSProperties = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: 24 };

// ═══ 1) حقك تعرف: الاستقالة بعد 3 سنين ═══
export const Pilot1: React.FC = () => {
  const t = (i: number) => at(W1, i);
  return (
    <ReelShell series="حقك تعرف" voice="character/vo/pilot1.mp3" words={W1}
      chunks={[[0, 1], [2, 3], [4, 6], [7, 9], [10, 10], [11, 13], [14, 16], [17, 20], [21, 23], [24, 26], [27, 28], [29, 30], [31, 32], [33, 35], [36, 37], [38, 39], [40, 41], [42, 44], [45, 47], [48, 49], [50, 51], [52, 53], [54, 55], [56, 57], [58, 59]]}>
      <Appear from={0.1} until={t(10) - 0.2} kind="pop" style={center}>
        <div style={big}>استقلت بعد<br /><span style={{ color: C.sand }}>3 سنين</span>؟</div>
        <div style={{ ...line, textAlign: 'center', color: '#4E7C7F' }}>كم نهاية خدمتك؟</div>
      </Appear>
      <Appear from={t(10)} until={t(14) - 0.2} kind="pop" style={center}>
        <div style={{ ...big, fontSize: 150, color: C.red }}>لحظة!</div>
      </Appear>
      <Appear from={t(14)} until={t(24) - 0.2} style={center}>
        <Card>
          <div style={{ ...line, fontSize: 44, color: '#4E7C7F' }}>نظام العمل · المادة 84</div>
          <div style={{ ...line, fontSize: 62 }}>عن كل سنة من أول 5 سنين</div>
          <div style={{ ...line, fontSize: 70, color: C.teal }}>= نص راتب</div>
        </Card>
      </Appear>
      <Appear from={t(24)} until={t(33) - 0.2} style={center}>
        <Card>
          <Appear from={t(26)}><div style={line}>الراتب: <b style={{ color: C.teal }}>8,000</b></div></Appear>
          <Appear from={t(29)}><div style={line}>× 3 سنين × ½ راتب</div></Appear>
          <Appear from={t(31)} kind="pop"><div style={{ ...line, fontSize: 76, color: C.teal }}>= 12,000 ريال</div></Appear>
        </Card>
      </Appear>
      <Appear from={t(33)} until={t(48) - 0.2} style={center}>
        <Card accent={C.sand}>
          <div style={{ ...line, fontSize: 48 }}>استقالة · خدمة بين 2 و 5 سنين</div>
          <div style={{ ...line, fontSize: 60, color: C.teal }}>تاخذ الثلث فقط</div>
          <Appear from={t(42)}>
            <div style={{ ...line, fontSize: 48, color: '#98A2B3', textDecoration: 'line-through' }}>12,000 ريال</div>
          </Appear>
          <Appear from={t(45)} kind="pop">
            <div style={{ ...big, fontSize: 110, background: C.sand, color: C.ink, borderRadius: 28, padding: '6px 0', marginTop: 10 }}>4,000 ريال</div>
          </Appear>
        </Card>
      </Appear>
      <Appear from={t(48)} until={t(54) - 0.2} style={center}>
        <Card>
          {[['أقل من سنتين', 'لا شيء'], ['2 إلى 5 سنين', 'الثلث'], ['5 إلى 10 سنين', 'الثلثين'], ['10 سنين وأكثر', 'كاملة']].map(([a, b], i) => (
            <div key={a} style={{ display: 'flex', justifyContent: 'space-between', ...line, fontSize: 50, padding: '6px 16px', borderRadius: 16, background: i === 3 ? `${C.green}22` : i === 1 ? `${C.sand}33` : 'transparent' }}>
              <span>{a}</span><b style={{ color: i === 3 ? C.green : C.teal }}>{b}</b>
            </div>
          ))}
        </Card>
      </Appear>
      <Appear from={t(54)} kind="pop" style={center}>
        <div style={{ ...big, fontSize: 84 }}>احفظ المقطع</div>
        <div style={{ ...line, textAlign: 'center', color: '#4E7C7F' }}>وتابع عشان تعرف حقك</div>
      </Appear>
      <Sfx at={t(10)} name="pop-high" /><Sfx at={t(31)} name="ding" volume={0.3} /><Sfx at={t(45)} name="ding" volume={0.35} /><Sfx at={t(54)} name="pop" />
    </ReelShell>
  );
};

// ═══ 2) مواقف الدوام: تعال مكتبي الساعة 4:59 ═══
const Clock: React.FC<{ text: string; color?: string }> = ({ text, color = C.teal }) => (
  <div style={{ fontSize: 210, fontWeight: 800, color, textAlign: 'center', direction: 'ltr', letterSpacing: 6 }}>{text}</div>
);
const Notif: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ background: '#fff', borderRadius: 34, padding: '26px 34px', boxShadow: '0 24px 60px rgba(11,46,48,0.22)', display: 'flex', gap: 24, alignItems: 'center' }}>
    <div style={{ flex: 'none', width: 104, height: 104, borderRadius: 26, background: C.teal, color: C.cream, fontSize: 52, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>م</div>
    <div>
      <div style={{ fontSize: 38, fontWeight: 600, color: '#667085' }}>المدير · الآن</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: C.ink, lineHeight: 1.35 }}>{text}</div>
    </div>
  </div>
);
export const Pilot2: React.FC = () => {
  const t = (i: number) => at(W2, i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = frame / fps > t(8) && frame / fps < t(8) + 0.5 ? Math.sin(frame * 2.2) * 10 : 0;
  return (
    <ReelShell series="مواقف الدوام" voice="character/vo/pilot2.mp3" words={W2}
      chunks={[[0, 1], [2, 3], [4, 5], [6, 7], [8, 10], [11, 13], [14, 14], [15, 17], [18, 20], [21, 23], [24, 26], [27, 28], [29, 31], [32, 33]]}>
      <Appear from={0.1} until={t(8) - 0.1} kind="pop" style={center}>
        <Clock text="4:59" />
        <Appear from={t(4)}><div style={{ ...line, textAlign: 'center' }}>الشنطة جاهزة · المفتاح بيدك</div></Appear>
      </Appear>
      <Appear from={t(8)} until={t(14) - 0.1} kind="right" style={{ ...center, transform: `translateX(${shake}px)` }}>
        <Notif text="تعال مكتبي دقيقة" />
      </Appear>
      <Appear from={t(14)} until={t(18) - 0.1} kind="pop" style={center}>
        <Appear from={t(14)} until={t(15) - 0.05}><Clock text="4:59" /></Appear>
        <Appear from={t(15)} kind="pop"><Clock text="5:59" color={C.red} /></Appear>
        <Appear from={t(15)}><div style={{ ...line, textAlign: 'center' }}>"الدقيقة" صارت ساعة</div></Appear>
      </Appear>
      <Appear from={t(18)} until={t(27) - 0.1} kind="right" style={center}>
        <Notif text="وش رايك نسوي اجتماع بكرة الصبح؟" />
      </Appear>
      <Appear from={t(27)} kind="pop" style={center}>
        <div style={{ ...big, fontSize: 84 }}>منشن واحد</div>
        <div style={{ ...line, textAlign: 'center', color: '#4E7C7F' }}>يصير معه كذا كل يوم</div>
      </Appear>
      <Sfx at={t(8)} name="pop-high" volume={0.5} /><Sfx at={t(15)} name="whoosh" /><Sfx at={t(18)} name="pop-high" volume={0.5} /><Sfx at={t(27)} name="pop" />
    </ReelShell>
  );
};

// ═══ 3) سنّع سيرتك: 3 أخطاء ═══
const Mistake: React.FC<{ n: number; bad: string; good: string; goodAt: number; ltr?: boolean }> = ({ n, bad, good, goodAt, ltr }) => (
  <Card accent={C.sand}>
    <div style={{ ...line, fontSize: 40, color: '#98A2B3' }}>الخطأ {n}</div>
    <div style={{ ...line, fontSize: 56, color: C.red, direction: ltr ? 'ltr' : 'rtl', textAlign: 'right' }}>✕ {bad}</div>
    <Appear from={goodAt} kind="pop">
      <div style={{ ...line, fontSize: 56, color: C.green, direction: ltr ? 'ltr' : 'rtl', textAlign: 'right', marginTop: 12 }}>✓ {good}</div>
    </Appear>
  </Card>
);
export const Pilot3: React.FC = () => {
  const t = (i: number) => at(W3, i);
  return (
    <ReelShell series="سنّع سيرتك" voice="character/vo/pilot3.mp3" words={W3}
      chunks={[[0, 2], [3, 5], [6, 7], [8, 8], [9, 12], [13, 14], [15, 17], [18, 18], [19, 22], [23, 26], [27, 27], [28, 31], [32, 34], [35, 38], [39, 40], [41, 42], [43, 44]]}>
      <Appear from={0.1} until={t(8) - 0.15} kind="pop" style={center}>
        <div style={big}>3 أخطاء</div>
        <div style={{ ...line, textAlign: 'center' }}>تخلي سيرتك الذاتية تنرفض</div>
      </Appear>
      <Appear from={t(8)} until={t(18) - 0.15} kind="right" style={center}>
        <Mistake n={1} bad="سيرة من 4 صفحات" good="صفحة، أو صفحتين بالكثير" goodAt={t(13)} />
      </Appear>
      <Appear from={t(18)} until={t(27) - 0.15} kind="right" style={center}>
        <Mistake n={2} bad="king_2000@mail.com" good="ahmed.alharbi@mail.com" goodAt={t(23)} ltr />
      </Appear>
      <Appear from={t(27)} until={t(39) - 0.15} kind="right" style={center}>
        <Mistake n={3} bad="نفس السيرة لكل وظيفة" good="عدّلها حسب الإعلان" goodAt={t(32)} />
      </Appear>
      <Appear from={t(39)} kind="pop" style={center}>
        <div style={{ ...big, fontSize: 84 }}>احفظ المقطع</div>
        <div style={{ ...line, textAlign: 'center', color: '#4E7C7F' }}>وأرسله لواحد يدوّر وظيفة</div>
      </Appear>
      <Sfx at={t(8)} name="whoosh" /><Sfx at={t(13)} name="pop-high" /><Sfx at={t(18)} name="whoosh" /><Sfx at={t(23)} name="pop-high" />
      <Sfx at={t(27)} name="whoosh" /><Sfx at={t(32)} name="pop-high" /><Sfx at={t(39)} name="pop" />
    </ReelShell>
  );
};

