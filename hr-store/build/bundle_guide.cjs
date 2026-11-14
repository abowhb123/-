// دليل حزمة إنهاء الخدمة (PDF بهوية سنعها)
// التشغيل: PW=$(npm root -g)/playwright node hr-store/build/bundle_guide.cjs
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const logo = fs.readFileSync(path.join(root, 'brand/logo-tagline.svg'), 'utf8').replace(/width="\d+" height="\d+"/, 'style="height:80px"');
const font = 'file://' + path.join(root, '../video-lab/public/fonts/Alexandria.ttf');
const items = [
  ['1', 'خطاب قبول استقالة', 'رد رسمي على الاستقالة يحدد آخر يوم عمل، ومعه إقرار استلام من الموظف.'],
  ['2', 'نموذج إخلاء طرف', 'جدول بالجهات (المدير، والتقنية، والمالية، والموارد البشرية، والأمن) وتوقيع كل جهة.'],
  ['3', 'شهادة خدمة', 'بالعناصر اللي يطلبها نظام العمل (المادة 64): تاريخ المباشرة والانتهاء، والمهنة، وآخر أجر.'],
  ['4', 'مخالصة نهائية', 'تفصيل المستحقات والخصومات والصافي، مع إقرار استلام موقّع من الموظف.'],
  ['5', 'قائمة إجراءات إنهاء الخدمة', 'كل خطوة من الاستقالة لين حفظ الملف: قوى، والتأمينات، ومقيم، والمدد النظامية.'],
  ['🎁', 'حاسبة مكافأة نهاية الخدمة (Excel)', 'تحسب المكافأة وتعويض الإجازات، وتنقل أرقامها مباشرة للمخالصة.'],
];
const html = `<html dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url(${font})}
@page{size:A4;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:A;color:#0B2E30}
.page{width:210mm;min-height:297mm;padding:14mm 16mm 12mm;position:relative}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0F5E63;padding-bottom:5mm}
h1{font-size:28px;margin:6mm 0 1mm;color:#0F5E63}.sub{color:#4E7C7F;font-size:15px;margin-bottom:4mm}
h2{font-size:17px;color:#0F5E63;margin:5mm 0 2mm;display:flex;align-items:center;gap:8px}h2:before{content:'';width:8px;height:22px;background:#E9A35B;border-radius:4px}
.item{display:flex;gap:12px;align-items:flex-start;background:#F7F3EC;border-radius:12px;padding:7px 12px;margin-bottom:6px}
.n{flex:none;width:34px;height:34px;border-radius:10px;background:#0F5E63;color:#F7F3EC;display:flex;align-items:center;justify-content:center;font-weight:800}
.item b{font-size:15px}.item p{margin:2px 0 0;font-size:12.5px;color:#475467;line-height:1.7}
ol,ul{margin:0;padding-right:20px;font-size:12.5px;line-height:1.85}
.ph{background:#FBE7D0;padding:0 6px;border-radius:4px}
.note{background:#FFF7ED;border:1px solid #F5D0A9;border-radius:12px;padding:10px 14px;font-size:12px;line-height:1.9;color:#7A4A12;margin-top:5mm}
.foot{position:absolute;bottom:10mm;left:18mm;right:18mm;text-align:center;color:#98A2B3;font-size:11px}
</style></head><body><div class="page">
<div class="top">${logo}<div style="text-align:left;color:#4E7C7F;font-size:13px">دليل الحزمة</div></div>
<h1>حزمة إنهاء الخدمة</h1><div class="sub">كل المستندات اللي تحتاجها لما يطلع موظف من منشأتك، جاهزة ومرتبة.</div>
<h2>محتويات الحزمة</h2>
${items.map(i => `<div class="item"><div class="n">${i[0]}</div><div><b>${i[1]}</b><p>${i[2]}</p></div></div>`).join('')}
<h2>طريقة التعبئة</h2>
<ol>
<li>افتح المستند في Word (أو Google Docs، أو Pages).</li>
<li>الخانات المطلوبة مكتوبة هكذا: <span class="ph">«اسم الموظف»</span>. استبدلها ببياناتك.</li>
<li>لاستبدال خانة متكررة مرة وحدة: <b>Ctrl + H</b> (في الماك ⌘ + Shift + H)، واكتب الخانة ثم البيان الصحيح.</li>
<li>احذف التظليل بعد التعبئة: حدد النص ← لون التظليل ← بلا لون.</li>
<li>اطبع على ورق المنشأة الرسمي، أو احفظ PDF ووقّعه.</li>
</ol>
<h2>نصائح نظامية</h2>
<ul>
<li>شهادة الخدمة تُعطى للموظف <b>مجاناً</b> عند طلبه، ولا يُكتب فيها ما يسيء لسمعته (المادة 64).</li>
<li>المستحقات تُصرف خلال <b>أسبوع</b> إذا أنهى صاحب العمل العقد، وخلال <b>أسبوعين</b> إذا كان الإنهاء من العامل (المادة 88).</li>
<li>احسب المستحقات بالحاسبة المرفقة أولاً، ثم انقل الأرقام للمخالصة.</li>
<li>احفظ نسخة موقعة من كل مستند في ملف الموظف.</li>
</ul>
<div class="note"><b>إخلاء مسؤولية:</b> هذه النماذج أدوات تنظيمية مبنية على نظام العمل السعودي وقت إعدادها، ولا تُعد استشارة قانونية. الأنظمة قد تتغير، فتحقق من آخر التعديلات في المصادر الرسمية، وراجع مختصاً في الحالات الخاصة أو عند وجود نزاع.</div>
<div class="foot">سنعها · أدوات الموارد البشرية جاهزة</div>
</div></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html); await p.waitForTimeout(400);
  const out = path.join(root, 'products/حزمة-إنهاء-الخدمة/0-دليل-الحزمة.pdf');
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('✓', out);
})();
