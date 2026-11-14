import React from 'react';
import { Word } from '../lib/Captions';
import { C, Card, D, In, IScene, ItsharoReel, Pill, Sfx, Sticker, T } from './Itsharo';
import w1 from '../data/itsharo-01.words.json';

export const I1 = w1 as Word[];
const at = (w: Word[]) => (i: number) => D + w[i].s;

const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = C.teal, size = 150 }) => (
  <div style={{ fontSize: size, fontWeight: 800, color, textAlign: 'center', lineHeight: 1.05, direction: 'rtl' }}>{children}</div>
);
const Row: React.FC<{ a: string; b: string; hl?: string }> = ({ a, b, hl }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', ...T.line, fontSize: 56, padding: '14px 28px', borderRadius: 22, background: hl ? `${hl}30` : '#fff', boxShadow: '0 10px 30px rgba(15,94,99,0.12)' }}>
    <span>{a}</span><b style={{ color: hl || C.teal }}>{b}</b>
  </div>
);

// ═══ إتشارو 01 · حقك تعرف: الاستقالة بعد 3 سنين ═══
export const Itsharo01: React.FC = () => {
  const t = at(I1);
  const scenes: IScene[] = [
    { at: 0, pose: 'stand',
      main: <><In at={0.1} kind="pop"><div style={T.big}>لو استقلت بعد<br /><Pill>3 سنين</Pill>…</div></In><In at={t(5)}><div style={T.sub}>كم بتاخذ نهاية خدمة؟</div></In></>,
      side: <In at={t(5)} kind="pop"><Sticker kind="question" size={260} /></In> },
    { at: 10, pose: 'explain', full: true,
      main: <In at={t(10)} kind="pop"><div style={{ ...T.big, color: C.cream, fontSize: 112 }}>أغلب الناس<br /><span style={{ color: C.sand }}>تحسبها غلط!</span></div></In>,
      side: <In at={t(12)} kind="pop"><Sticker kind="cross" size={260} /></In> },
    { at: 14, pose: 'point',
      main: <In at={t(14)} kind="whip"><Card><div style={{ ...T.sub, textAlign: 'right' }}>نظام العمل · المادة 84</div><div style={{ ...T.line, fontSize: 66 }}>أول 5 سنين</div><div style={{ ...T.line, fontSize: 66 }}>عن كل سنة</div></Card></In>,
      side: <In at={t(24)} kind="pop"><Big size={130}>½</Big><div style={{ ...T.line, fontSize: 54, textAlign: 'center', color: C.teal }}>راتب</div></In> },
    { at: 26, pose: 'explain',
      main: <In at={t(26)} kind="whip"><Card><div style={{ ...T.sub, textAlign: 'right' }}>خلنا نحسبها</div><In at={t(28)}><div style={{ ...T.line, fontSize: 68 }}>الراتب <b style={{ color: C.teal }}>8,000</b></div></In><In at={t(31)}><div style={{ ...T.line, fontSize: 68 }}>× 3 سنين × ½</div></In></Card></In>,
      side: <In at={t(36)} kind="pop"><Sticker kind="coin" size={200} /><Big size={96}>12,000</Big></In> },
    { at: 39, pose: 'stand', full: true,
      main: <In at={t(39)} kind="drop"><div style={{ ...T.big, fontSize: 176, color: C.sand }}>بس انتبه!</div></In>,
      side: <In at={t(39)} kind="pop"><Sticker kind="alert" size={280} /></In> },
    { at: 41, pose: 'point',
      main: <In at={t(41)} kind="whip"><Card accent={C.sand}><div style={{ ...T.line, fontSize: 60 }}>أنت اللي <Pill>استقلت</Pill></div><In at={t(45)}><div style={{ ...T.line, fontSize: 58 }}>وخدمتك بين 2 و 5 سنين</div></In><In at={t(49)}><div style={{ ...T.line, fontSize: 68, color: C.teal }}>تاخذ الثلث بس</div></In></Card></In>,
      side: <><In at={t(49)}><div style={{ ...T.line, fontSize: 56, color: '#98A2B3', textDecoration: 'line-through', textAlign: 'center' }}>12,000</div></In><In at={t(52)} kind="pop"><div style={{ background: C.sand, borderRadius: 34, padding: '10px 26px' }}><Big size={104} color={C.ink}>4,000</Big><div style={{ ...T.line, fontSize: 48, textAlign: 'center' }}>ريال</div></div></In></> },
    { at: 56, pose: 'explain',
      main: <><In at={t(56)} kind="whip"><Row a="2 – 5 سنين" b="الثلث" /></In><In at={t(59)} kind="whip"><Row a="5 – 10 سنين" b="الثلثين" hl={C.sand} /></In><In at={t(65)} kind="whip"><Row a="10 سنين +" b="كاملة" hl={C.green} /></In></>,
      side: <In at={t(68)} kind="pop"><Sticker kind="check" size={260} /></In> },
    { at: 70, pose: 'stand',
      main: <><In at={t(70)} kind="pop"><div style={{ ...T.sub, fontSize: 54 }}>معك</div><div style={{ ...T.big, fontSize: 150 }}>إتشارو</div></In><In at={t(72)}><div style={T.sub}>احفظ المقطع، و<b style={{ color: C.sand }}>سنّعها!</b></div></In></>,
      side: <In at={t(74)} kind="pop"><Sticker kind="check" size={240} /></In> },
  ];
  return <ItsharoReel series="حقك تعرف" voice="character/vo/itsharo-01.mp3" words={I1} scenes={scenes} punch={[13, 36, 40, 53, 71, 74]}
    sfx={<><Sfx at={t(12)} name="pop-high" /><Sfx at={t(36)} name="ding" volume={0.3} /><Sfx at={t(52)} name="ding" volume={0.35} /><Sfx at={t(68)} name="pop-high" /><Sfx at={t(74)} name="ding" volume={0.35} /></>} />;
};

// ═══ تجربة الصوت (15 ثانية): مقطع من تسجيل أبو فواز بعد Voice Changer ═══
import wvt from '../data/itsharo-voicetest.words.json';
export const IVT = wvt as Word[];
export const ItsharoVoiceTest: React.FC = () => {
  const t = at(IVT);
  const end = D + IVT[IVT.length - 1].e;
  const scenes: IScene[] = [
    { at: 0, pose: 'stand',
      main: <><In at={0.1} kind="pop"><div style={T.big}>عندك <Pill>مشروع</Pill><br />أو فكرة؟</div></In></>,
      side: <In at={t(4)} kind="pop"><Sticker kind="question" size={250} /></In> },
    { at: 8, pose: 'explain', full: true,
      main: <In at={t(8)} kind="pop"><div style={{ ...T.big, color: C.cream, fontSize: 110 }}>لا تنتظر<br /><span style={{ color: C.sand }}>الظروف المثالية</span></div></In>,
      side: <In at={t(10)} kind="pop"><Sticker kind="cross" size={250} /></In> },
    { at: 13, pose: 'point',
      main: <In at={t(13)} kind="whip"><Card accent={C.sand}><div style={{ ...T.line, fontSize: 70, textAlign: 'center' }}>لأنها ما راح تكون<br /><span style={{ color: C.red }}>أبداً</span></div></Card></In>,
      side: <In at={t(17)} kind="pop"><Sticker kind="alert" size={250} /></In> },
    { at: 18, pose: 'explain',
      main: <>
        <In at={t(18)} kind="whip"><Card style={{ padding: '22px 40px' }}><div style={{ ...T.line, fontSize: 62 }}>✓ ابدأ باللي عندك</div></Card></In>
        <In at={t(22)} kind="whip"><Card style={{ padding: '22px 40px' }}><div style={{ ...T.line, fontSize: 62 }}>✓ تعلّم من أخطائك</div></Card></In>
        <In at={t(25)} kind="whip"><Card accent={C.green} style={{ padding: '22px 40px' }}><div style={{ ...T.line, fontSize: 62 }}>✓ خطوة بخطوة</div></Card></In>
      </>,
      side: <><In at={t(27)} kind="pop"><Sticker kind="check" size={230} /></In><In at={end + 0.1} kind="pop"><div style={{ ...T.big, fontSize: 64 }}>معك إتشارو</div><div style={{ ...T.sub, color: C.sand, fontWeight: 800 }}>سنّعها!</div></In></> },
  ];
  return <ItsharoReel series="إتشارو" voice="character/vo/itsharo-voicetest.mp3" words={IVT} scenes={scenes} punch={[3, 9, 17, 28]}
    sfx={<><Sfx at={t(10)} name="pop-high" /><Sfx at={t(17)} name="ding" volume={0.3} /><Sfx at={t(27)} name="pop-high" /><Sfx at={end + 0.1} name="ding" volume={0.3} /></>} />;
};
