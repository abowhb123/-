import React from 'react';
import { Word } from '../lib/Captions';
import { C, Card, D, In, Scene, SceneReel, Sfx, T } from './Engine';
import w1 from '../data/v2-pilot1.words.json';
import w2 from '../data/v2-pilot2.words.json';
import w3 from '../data/v2-pilot3.words.json';

export const V1 = w1 as Word[];
export const V2 = w2 as Word[];
export const V3 = w3 as Word[];

// مكان المحتوى حسب التخطيط
const AREA: Record<string, React.CSSProperties> = {
  hook: { position: 'absolute', top: 190, left: 60, right: 60, height: 530, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 },
  card: { position: 'absolute', top: 200, left: 60, right: 60, height: 820, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 },
  side: { position: 'absolute', top: 400, left: 460, right: 50, height: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 },
  full: { position: 'absolute', top: 260, left: 70, right: 70, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 },
};
const Area: React.FC<{ l: keyof typeof AREA; children: React.ReactNode }> = ({ l, children }) => <div style={AREA[l]}>{children}</div>;
const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({ children, bg = C.sand, color = C.ink }) => (
  <span style={{ background: bg, color, borderRadius: 24, padding: '0 22px' }}>{children}</span>
);
const Row: React.FC<{ a: string; b: string; hl?: string }> = ({ a, b, hl }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', ...T.line, fontSize: 50, padding: '14px 24px', borderRadius: 20, background: hl ? `${hl}2A` : '#fff', boxShadow: '0 10px 30px rgba(15,94,99,0.1)' }}>
    <span>{a}</span><b style={{ color: hl || C.teal }}>{b}</b>
  </div>
);
const Bubble: React.FC<{ who: string; text: string; side?: 'r' | 'l'; color?: string }> = ({ who, text, side = 'r', color = C.teal }) => (
  <div style={{ alignSelf: side === 'r' ? 'flex-start' : 'flex-end', maxWidth: '86%', background: side === 'r' ? '#fff' : color, color: side === 'r' ? C.ink : C.cream, borderRadius: 36, padding: '22px 34px', boxShadow: '0 18px 44px rgba(15,94,99,0.18)' }}>
    <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.7 }}>{who}</div>
    <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.35 }}>{text}</div>
  </div>
);
const Notif: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ width: '100%', background: '#fff', borderRadius: 40, padding: '30px 38px', boxShadow: '0 30px 70px rgba(0,0,0,0.3)', display: 'flex', gap: 26, alignItems: 'center' }}>
    <div style={{ flex: 'none', width: 116, height: 116, borderRadius: 30, background: C.sand, color: C.ink, fontSize: 58, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>م</div>
    <div>
      <div style={{ fontSize: 38, fontWeight: 600, color: '#667085' }}>المدير · الآن</div>
      <div style={{ fontSize: 60, fontWeight: 800, color: C.ink, lineHeight: 1.35 }}>{text}</div>
    </div>
  </div>
);
const Clock: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.teal, size = 230 }) => (
  <div style={{ fontSize: size, fontWeight: 800, color, textAlign: 'center', direction: 'ltr', lineHeight: 1 }}>{text}</div>
);
const ends = (w: Word[]) => (i: number) => D + w[i].s;

// ═══ 1) حقك تعرف ═══
export const PilotV1: React.FC = () => {
  const t = ends(V1);
  const scenes: Scene[] = [
    { at: 0, layout: 'hook', content: <Area l="hook"><In at={0.15} kind="pop"><div style={T.big}>لو استقلت بعد<br /><Pill>3 سنين</Pill>…</div></In><In at={t(5)}><div style={T.sub}>كم بتاخذ نهاية خدمة؟</div></In></Area> },
    { at: 10, layout: 'full', content: <Area l="full"><In at={t(10)} kind="pop"><div style={{ ...T.big, color: C.cream, fontSize: 110 }}>أغلب الناس<br /><span style={{ color: C.sand }}>تحسبها غلط</span></div></In></Area> },
    { at: 14, layout: 'card', content: <Area l="card"><In at={t(14)} kind="whip"><Card><div style={{ ...T.sub, textAlign: 'right' }}>نظام العمل · المادة 84</div><div style={{ ...T.line, fontSize: 64 }}>أول 5 سنين</div><div style={{ ...T.line, fontSize: 64 }}>عن كل سنة</div><In at={t(24)} kind="pop"><div style={{ ...T.line, fontSize: 84, color: C.teal }}>= نص راتب</div></In></Card></In></Area> },
    { at: 26, layout: 'card', content: <Area l="card"><In at={t(26)} kind="whip"><Card><div style={{ ...T.sub, textAlign: 'right' }}>خلنا نحسبها</div><In at={t(28)}><div style={{ ...T.line, fontSize: 66 }}>الراتب <b style={{ color: C.teal }}>8,000</b></div></In><In at={t(31)}><div style={{ ...T.line, fontSize: 66 }}>× 3 سنين × ½ راتب</div></In><In at={t(36)} kind="pop"><div style={{ ...T.big, fontSize: 104, marginTop: 10 }}>= 12,000 ريال</div></In></Card></In></Area> },
    { at: 39, layout: 'full', content: <Area l="full"><In at={t(39)} kind="pop"><div style={{ ...T.big, fontSize: 170, color: C.sand }}>بس انتبه!</div></In></Area> },
    { at: 41, layout: 'card', content: <Area l="card"><In at={t(41)} kind="whip"><Card accent={C.sand}><div style={{ ...T.line, fontSize: 56 }}>أنت اللي <Pill>استقلت</Pill></div><In at={t(45)}><div style={{ ...T.line, fontSize: 56 }}>وخدمتك بين 2 و 5 سنين</div></In><In at={t(49)}><div style={{ ...T.line, fontSize: 66, color: C.teal }}>تاخذ الثلث بس</div><div style={{ ...T.line, fontSize: 50, color: '#98A2B3', textDecoration: 'line-through' }}>12,000 ريال</div></In><In at={t(52)} kind="pop"><div style={{ ...T.big, fontSize: 120, background: C.sand, color: C.ink, borderRadius: 30, marginTop: 10 }}>4,000 ريال</div></In></Card></In></Area> },
    { at: 56, layout: 'side', content: <Area l="side"><In at={t(57)}><Row a="2 – 5 سنين" b="الثلث" /></In><In at={t(59)}><Row a="5 – 10 سنين" b="الثلثين" hl={C.sand} /></In><In at={t(65)} kind="pop"><Row a="10 سنين +" b="كاملة" hl={C.green} /></In></Area> },
    { at: 70, layout: 'cta', content: <Area l="hook"><In at={t(70)} kind="pop"><div style={{ ...T.big, fontSize: 96 }}>احفظ المقطع</div></In><In at={t(72)}><div style={T.sub}>وأرسله لصاحبك اللي ناوي يستقيل</div></In></Area> },
  ];
  return <SceneReel series="حقك تعرف" voice="character/vo/v2-pilot1.mp3" words={V1} scenes={scenes} punch={[13, 36, 40, 53, 69]}
    sfx={<><Sfx at={t(36)} name="ding" volume={0.3} /><Sfx at={t(52)} name="ding" volume={0.35} /><Sfx at={t(65)} name="pop-high" /></>} />;
};

// ═══ 2) مواقف الدوام ═══
export const PilotV2: React.FC = () => {
  const t = ends(V2);
  const scenes: Scene[] = [
    { at: 0, layout: 'hook', content: <Area l="hook"><In at={0.15} kind="pop"><Clock text="4:59" /></In><In at={t(1)}><div style={T.sub}>دقيقة وتطلع…</div></In></Area> },
    { at: 4, layout: 'side', content: <Area l="side"><In at={t(4)} kind="whip"><Row a="الشنطة على كتفك" b="✓" /></In><In at={t(7)} kind="whip"><Row a="المفتاح بيدك" b="✓" /></In><In at={t(9)} kind="whip"><Row a="قلبك برّا المكتب" b="✓" hl={C.green} /></In></Area> },
    { at: 12, layout: 'full', content: <Area l="full"><In at={t(12)} kind="pop"><div style={{ ...T.big, color: C.sand, fontSize: 130 }}>وفجأة…</div></In><In at={t(13)} kind="whip" style={{ width: '100%' }}><Notif text="تعال مكتبي دقيقة" /></In></Area> },
    { at: 19, layout: 'card', content: <Area l="card"><In at={t(20)} kind="right"><Bubble who="أنت" text="خير يا طويل العمر؟" /></In><In at={t(25)} kind="right"><Bubble who="المدير" text="اقعد اقعد…" side="l" /></In><In at={t(28)}><div style={{ ...T.sub, fontSize: 46 }}>ويبدأ يسولف…</div></In></Area> },
    { at: 30, layout: 'card', content: <Area l="card"><In at={t(30)} kind="pop"><Clock text="4:59" size={200} /></In><In at={t(32)}><Clock text="5:14" size={140} color={C.muted} /></In><In at={t(34)}><Clock text="5:29" size={140} color={C.sand} /></In><In at={t(36)} kind="pop"><Clock text="5:59" size={200} color={C.red} /></In></Area> },
    { at: 38, layout: 'full', content: <Area l="full"><In at={t(38)}><div style={{ ...T.sub, color: C.cream }}>وأنت طالع…</div></In><In at={t(43)} kind="whip" style={{ width: '100%' }}><Notif text="وش رايك نسوي اجتماع بكرة 7 الصبح؟" /></In></Area> },
    { at: 51, layout: 'cta', content: <Area l="hook"><In at={t(51)} kind="pop"><div style={{ ...T.big, fontSize: 104 }}>منشن</div></In><In at={t(52)}><div style={T.sub}>الشخص اللي يصير معه هالموقف كل يوم</div></In></Area> },
  ];
  return <SceneReel series="مواقف الدوام" voice="character/vo/v2-pilot2.mp3" words={V2} scenes={scenes} punch={[12, 36, 46, 50]}
    sfx={<><Sfx at={t(13)} name="pop-high" volume={0.55} /><Sfx at={t(43)} name="pop-high" volume={0.55} /><Sfx at={t(36)} name="ding" volume={0.3} /></>} />;
};

// ═══ 3) سنّع سيرتك ═══
const Mistake: React.FC<{ n: number; bad: string; good: string; badAt: number; goodAt: number; ltr?: boolean }> = ({ n, bad, good, badAt, goodAt, ltr }) => (
  <Card accent={C.sand}>
    <div style={{ ...T.sub, textAlign: 'right' }}>الخطأ {n}</div>
    <In at={badAt}><div style={{ ...T.line, fontSize: 60, color: C.red, direction: ltr ? 'ltr' : 'rtl', textAlign: 'right' }}>✕ {bad}</div></In>
    <In at={goodAt} kind="pop"><div style={{ ...T.line, fontSize: 60, color: C.green, direction: ltr ? 'ltr' : 'rtl', textAlign: 'right', marginTop: 14 }}>✓ {good}</div></In>
  </Card>
);
export const PilotV3: React.FC = () => {
  const t = ends(V3);
  const scenes: Scene[] = [
    { at: 0, layout: 'hook', content: <Area l="hook"><In at={0.15} kind="pop"><div style={T.big}>سيرتك ممكن<br /><Pill>تنرفض</Pill></div></In><In at={t(5)}><div style={T.sub}>في أقل من 10 ثواني</div></In></Area> },
    { at: 9, layout: 'full', content: <Area l="full"><In at={t(9)} kind="pop"><div style={{ ...T.big, color: C.cream, fontSize: 200 }}>3</div></In><In at={t(12)}><div style={{ ...T.big, color: C.cream, fontSize: 84 }}>أخطاء نشوفها<br /><span style={{ color: C.sand }}>في الموارد البشرية</span></div></In></Area> },
    { at: 17, layout: 'card', content: <Area l="card"><In at={t(17)} kind="whip"><Mistake n={1} bad="سيرة من 4 صفحات" good="صفحة، أو صفحتين بالكثير" badAt={t(18)} goodAt={t(24)} /></In></Area> },
    { at: 29, layout: 'card', content: <Area l="card"><In at={t(29)} kind="whip"><Mistake n={2} bad="king_2000@mail.com" good="ahmed.alharbi@mail.com" badAt={t(30)} goodAt={t(34)} ltr /></In></Area> },
    { at: 40, layout: 'card', content: <Area l="card"><In at={t(40)} kind="whip"><Mistake n={3} bad="نفس السيرة لكل وظيفة" good="خذ كلمات الإعلان وحطها في سيرتك" badAt={t(41)} goodAt={t(46)} /></In></Area> },
    { at: 54, layout: 'cta', content: <Area l="hook"><In at={t(54)} kind="pop"><div style={{ ...T.big, fontSize: 96 }}>احفظ المقطع</div></In><In at={t(56)}><div style={T.sub}>وأرسله لواحد يدوّر وظيفة</div></In><In at={t(60)}><div style={{ ...T.sub, color: C.sand, fontWeight: 700 }}>يمكن تكون سبب توظيفه</div></In></Area> },
  ];
  return <SceneReel series="سنّع سيرتك" voice="character/vo/v2-pilot3.mp3" words={V3} scenes={scenes} punch={[3, 11, 22, 33, 63]}
    sfx={<><Sfx at={t(24)} name="pop-high" /><Sfx at={t(34)} name="pop-high" /><Sfx at={t(46)} name="pop-high" /></>} />;
};
