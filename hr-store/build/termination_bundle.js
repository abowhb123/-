/**
 * حزمة سنعها: إنهاء الخدمة (5 مستندات Word قابلة للتعديل)
 * التشغيل: NODE_PATH=$(npm root -g) node hr-store/build/termination_bundle.js
 * الناتج: hr-store/products/حزمة-إنهاء-الخدمة/
 *
 * المستندات بدون شعار سنعها (العميل يطبعها باسم منشأته).
 * الخانات المطلوب تعبئتها بين «» ومظللة.
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, VerticalAlign, Footer, PageNumber,
} = require('docx');

const OUT = path.join(__dirname, '..', 'products', 'حزمة-إنهاء-الخدمة');
fs.mkdirSync(OUT, { recursive: true });

const FONT = 'Alexandria';
const INK = '1D2939';
const MUTED = '667085';
const LINE = 'D0D5DD';
const HEAD_BG = 'EEF2F2';
const PH_BG = 'FBE7D0'; // تظليل الخانات المطلوبة
const PAGE_W = 11906 - 2 * 1134; // A4 مع هوامش 2 سم

// ── أدوات النص ──
const run = (text, o = {}) =>
  new TextRun({
    text,
    font: { ascii: FONT, hAnsi: FONT, cs: FONT, eastAsia: FONT },
    size: o.size || 22,
    sizeComplexScript: o.size || 22,
    bold: !!o.bold,
    boldComplexScript: !!o.bold,
    color: o.color || INK,
    rightToLeft: true,
    shading: o.ph ? { type: ShadingType.CLEAR, fill: PH_BG, color: 'auto' } : undefined,
  });

// يحوّل "نص «خانة» نص" إلى أجزاء، والخانات مظللة
const runs = (text, o = {}) =>
  text.split(/(«[^»]*»)/).filter(Boolean).map((t) => run(t, { ...o, ph: t.startsWith('«') || o.ph }));

const para = (text, o = {}) =>
  new Paragraph({
    bidirectional: true,
    alignment: o.align || AlignmentType.RIGHT,
    spacing: { before: o.before ?? 0, after: o.after ?? 120, line: o.line || 340 },
    keepNext: !!o.keepNext,
    border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: o.ruleColor || LINE, space: 6 } } : undefined,
    children: Array.isArray(text) ? text : runs(text, o),
  });

const blank = (n = 1) => Array.from({ length: n }, () => para('', { after: 0 }));

// ── الجداول (من اليمين لليسار) ──
const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const cell = (content, width, o = {}) => // o.tight: هوامش أصغر
 
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    margins: o.tight ? { top: 50, bottom: 50, left: 90, right: 90 } : { top: 90, bottom: 90, left: 120, right: 120 },
    shading: o.bg ? { type: ShadingType.CLEAR, fill: o.bg, color: 'auto' } : undefined,
    borders: o.noBorder ? { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder } : { top: border, bottom: border, left: border, right: border },
    columnSpan: o.span,
    children: (Array.isArray(content) ? content : [content]).map((c) =>
      typeof c === 'string' ? para(c, { after: 0, bold: o.bold, size: o.size || 20, align: o.align, color: o.color }) : c,
    ),
  });

const table = (rows, widths, o = {}) =>
  new Table({
    visuallyRightToLeft: true,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      (r, i) =>
        new TableRow({
          tableHeader: o.header && i === 0,
          cantSplit: true,
          children: r.map((c, j) =>
            cell(c, widths[j], {
              bg: (o.header && i === 0) || (o.labelCols || []).includes(j) ? HEAD_BG : undefined,
              bold: (o.header && i === 0) || (o.labelCols || []).includes(j),
              noBorder: o.noBorder,
              tight: o.tight,
              align: o.center && !(o.labelCols || []).includes(j) ? AlignmentType.CENTER : undefined,
            }),
          ),
        }),
    ),
  });

// ── رأس المستند (اسم المنشأة، التاريخ، الرقم) ──
const header = (title) => [
  table(
    [[
      [para('«اسم المنشأة»', { bold: true, size: 30, after: 40 }), para('سجل تجاري: «رقم السجل التجاري»', { size: 18, color: MUTED, after: 0 })],
      [para('التاريخ: «  /  /    »', { size: 20, after: 40, align: AlignmentType.END }), para('الرقم: «رقم المرجع»', { size: 20, after: 0, align: AlignmentType.END })],
    ]],
    [PAGE_W * 0.6, PAGE_W * 0.4],
    { noBorder: true },
  ),
  para('', { rule: true, after: 240, ruleColor: '98A2B3' }),
  para(title, { bold: true, size: 36, align: AlignmentType.CENTER, after: 240 }),
];

const signatures = (cols, tight = false) =>
  table(
    [cols.map((c) => c[0]), ...['الاسم: ', 'التوقيع: ', 'التاريخ: '].map((l) => cols.map((c) => (l === 'الاسم: ' && c[1] ? l + c[1] : l + '……………………')))],
    cols.map(() => PAGE_W / cols.length),
    { header: true, tight },
  );

const footer = new Footer({
  children: [
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      children: [run('صفحة ', { size: 16, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED })],
    }),
  ],
});

const save = async (name, children) => {
  const doc = new Document({
    creator: 'سنعها',
    title: name,
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      footers: { default: footer },
      children,
    }],
  });
  fs.writeFileSync(path.join(OUT, `${name}.docx`), await Packer.toBuffer(doc));
  console.log('✓', name);
};

const empInfo = () =>
  table(
    [
      ['اسم الموظف', '«اسم الموظف»', 'الرقم الوظيفي', '«الرقم الوظيفي»'],
      ['المسمى الوظيفي', '«المسمى الوظيفي»', 'الإدارة', '«الإدارة»'],
      ['تاريخ المباشرة', '«  /  /    »', 'آخر يوم عمل', '«  /  /    »'],
    ],
    [PAGE_W * 0.18, PAGE_W * 0.32, PAGE_W * 0.18, PAGE_W * 0.32],
    { labelCols: [0, 2] },
  );

(async () => {
  // ═══ 1) قبول استقالة ═══
  await save('1-خطاب-قبول-استقالة', [
    ...header('قبول استقالة'),
    para('المكرم/ «اسم الموظف»                                المحترم', { bold: true, size: 24 }),
    para('الرقم الوظيفي: «الرقم الوظيفي»   ·   المسمى الوظيفي: «المسمى الوظيفي»   ·   الإدارة: «الإدارة»', { size: 20, color: MUTED, after: 240 }),
    para('السلام عليكم ورحمة الله وبركاته،', { after: 200 }),
    para('إشارةً إلى خطاب استقالتكم المقدَّم بتاريخ «تاريخ تقديم الاستقالة»، نفيدكم بقبول استقالتكم، على أن يكون آخر يوم عمل لكم هو «تاريخ آخر يوم عمل»، وفقاً لمدة الإشعار المتفق عليها في عقد العمل ونظام العمل.', { after: 200 }),
    para('وعليه، نأمل منكم استكمال إجراءات إخلاء الطرف وتسليم ما بعهدتكم قبل آخر يوم عمل، وسيتم صرف مستحقاتكم النظامية خلال المدة المحددة في نظام العمل.', { after: 200 }),
    para('شاكرين لكم ما بذلتموه من جهد خلال فترة عملكم معنا، ونتمنى لكم التوفيق في مسيرتكم القادمة.', { after: 200 }),
    para('وتقبلوا خالص التحية،', { after: 400 }),
    signatures([['مدير الموارد البشرية', '«الاسم»'], ['ختم المنشأة', '']]),
    ...blank(1),
    para('إقرار استلام', { bold: true, size: 24, before: 300, rule: true }),
    para('أقر أنا الموظف المذكور أعلاه باستلام أصل هذا الخطاب.', { after: 200 }),
    signatures([['الموظف', '«اسم الموظف»']]),
  ]);

  // ═══ 2) إخلاء طرف ═══
  const W = [PAGE_W * 0.14, PAGE_W * 0.3, PAGE_W * 0.12, PAGE_W * 0.16, PAGE_W * 0.16, PAGE_W * 0.12];
  await save('2-نموذج-إخلاء-طرف', [
    ...header('نموذج إخلاء طرف'),
    para('أولاً: بيانات الموظف', { bold: true, size: 24, after: 120, keepNext: true }),
    empInfo(),
    para('سبب انتهاء العلاقة:   ☐ استقالة    ☐ انتهاء مدة العقد    ☐ إنهاء من صاحب العمل    ☐ أخرى: «  »', { before: 120, after: 160, size: 20 }),
    para('ثانياً: إخلاء الطرف من الجهات', { bold: true, size: 24, after: 120, keepNext: true }),
    table(
      [
        ['الجهة', 'البنود المطلوب تسليمها أو تسويتها', 'لا توجد مطالبات', 'المطالبات (إن وُجدت)', 'الاسم والتوقيع', 'التاريخ'],
        ['المدير المباشر', 'تسليم المهام والملفات وبيانات الدخول الخاصة بالعمل', '☐', '', '', ''],
        ['تقنية المعلومات', 'الأجهزة (حاسب، جوال)، وإيقاف البريد والحسابات والصلاحيات', '☐', '', '', ''],
        ['المالية', 'السلف، والعهد المالية، وبطاقات المنشأة', '☐', '', '', ''],
        ['الموارد البشرية', 'بطاقة الموظف، والتأمين الطبي، والوثائق الأصلية', '☐', '', '', ''],
        ['الأمن والخدمات', 'بطاقة الدخول، والمفاتيح، والسيارة، والسكن', '☐', '', '', ''],
        ['«جهة أخرى»', '«البنود»', '☐', '', '', ''],
      ],
      W,
      { header: true, labelCols: [0], tight: true },
    ),
    para('ثالثاً: الاعتماد', { bold: true, size: 24, before: 180, after: 80, keepNext: true }),
    para('نقر بأن الموظف المذكور أعلاه قد أخلى طرفه من جميع الجهات، باستثناء المطالبات المذكورة أعلاه (إن وُجدت)، وتُسوّى ضمن المخالصة النهائية.', { after: 160 }),
    signatures([['مدير الموارد البشرية', '«الاسم»'], ['الموظف', '«اسم الموظف»']], true),
  ]);

  // ═══ 3) شهادة خدمة ═══
  await save('3-شهادة-خدمة', [
    ...header('شهادة خدمة'),
    ...blank(1),
    para('تشهد «اسم المنشأة» بأن السيد/ـة «اسم الموظف»، «الجنسية» الجنسية، بموجب هوية/إقامة رقم «رقم الهوية أو الإقامة»، قد عمل/ـت لديها في وظيفة «المسمى الوظيفي»، خلال الفترة من «تاريخ المباشرة» إلى «تاريخ انتهاء الخدمة»، وكان آخر أجر شهري يتقاضاه «آخر أجر» ريال سعودي.', { size: 26, line: 480, after: 300 }),
    para('وقد أُعطيت هذه الشهادة بناءً على طلبه/ـا، دون أدنى مسؤولية على المنشأة تجاه الغير.', { size: 26, line: 480, after: 600 }),
    signatures([['مدير الموارد البشرية', '«الاسم»'], ['ختم المنشأة', '']]),
  ]);

  // ═══ 4) مخالصة نهائية ═══
  const A = [PAGE_W * 0.62, PAGE_W * 0.38];
  await save('4-مخالصة-نهائية', [
    ...header('مخالصة نهائية'),
    para('أولاً: بيانات الموظف', { bold: true, size: 24, after: 120, keepNext: true }),
    empInfo(),
    para('ثانياً: تفصيل المستحقات', { bold: true, size: 24, before: 300, after: 120, keepNext: true }),
    table(
      [
        ['البند', 'المبلغ (ريال)'],
        ['الراتب عن أيام العمل في الشهر الأخير («عدد الأيام» يوم)', '«  »'],
        ['تعويض رصيد الإجازات («عدد الأيام» يوم)', '«  »'],
        ['مكافأة نهاية الخدمة', '«  »'],
        ['مستحقات أخرى («اذكرها»)', '«  »'],
        ['إجمالي المستحقات', '«  »'],
      ],
      A,
      { header: true, center: true },
    ),
    para('ثالثاً: الخصومات', { bold: true, size: 24, before: 300, after: 120, keepNext: true }),
    table(
      [
        ['البند', 'المبلغ (ريال)'],
        ['السلف غير المسددة', '«  »'],
        ['عهد غير مسلّمة (إن وُجدت)', '«  »'],
        ['خصومات أخرى («اذكرها»)', '«  »'],
        ['إجمالي الخصومات', '«  »'],
      ],
      A,
      { header: true, center: true },
    ),
    table([['صافي المستحق للموظف', '«  »']], A, { labelCols: [0, 1], center: true }),
    para('طريقة الصرف:   ☐ تحويل بنكي    ☐ شيك    ☐ أخرى: «  »        رقم الحساب أو المرجع: «  »', { before: 200, after: 300, size: 20 }),
    para('رابعاً: إقرار ومخالصة', { bold: true, size: 24, after: 120, rule: true, keepNext: true }),
    para('أقر أنا الموقع أدناه «اسم الموظف» بأنني استلمت من «اسم المنشأة» مبلغاً وقدره «صافي المستحق» ريال سعودي («المبلغ كتابةً»)، وهو كامل مستحقاتي الناتجة عن عقد العمل وانتهائه وفق التفصيل أعلاه، وأقر بعدم وجود أي مطالبات أخرى لي تجاه المنشأة فيما يخص عقد العمل المذكور.', { line: 420, after: 300 }),
    signatures([['الموظف', '«اسم الموظف»'], ['عن المنشأة', '«الاسم»'], ['شاهد (اختياري)', '']]),
  ]);

  // ═══ 5) قائمة الإجراءات ═══
  const CW = [PAGE_W * 0.07, PAGE_W * 0.45, PAGE_W * 0.18, PAGE_W * 0.15, PAGE_W * 0.15];
  const section = (t) => para(t, { bold: true, size: 24, before: 260, after: 120, keepNext: true });
  const steps = (rows) => table([['تم', 'الإجراء', 'الجهة / المنصة', 'المسؤول', 'التاريخ'], ...rows.map((r) => ['☐', r[0], r[1], '', ''])], CW, { header: true });
  await save('5-قائمة-إجراءات-إنهاء-الخدمة', [
    ...header('قائمة إجراءات إنهاء الخدمة'),
    para('الموظف: «اسم الموظف»   ·   الرقم الوظيفي: «الرقم الوظيفي»   ·   آخر يوم عمل: «  /  /    »', { size: 20, after: 120 }),
    section('قبل آخر يوم عمل'),
    steps([
      ['استلام خطاب الاستقالة أو إصدار خطاب الإنهاء، وتوثيق تاريخه', 'داخلي'],
      ['الرد على الاستقالة وتحديد آخر يوم عمل (خطاب قبول الاستقالة)', 'داخلي'],
      ['إبلاغ المدير المباشر ووضع خطة تسليم المهام', 'داخلي'],
      ['تعبئة نموذج إخلاء الطرف مع الجهات', 'داخلي'],
      ['حساب المستحقات: الراتب، ورصيد الإجازات، ومكافأة نهاية الخدمة', 'حاسبة نهاية الخدمة'],
    ]),
    section('عند انتهاء العلاقة'),
    steps([
      ['إنهاء العلاقة التعاقدية وتوثيقها', 'منصة قوى'],
      ['استبعاد الموظف من التأمينات الاجتماعية', 'التأمينات الاجتماعية'],
      ['لغير السعودي: خروج نهائي أو نقل خدمات', 'مقيم / أبشر أعمال'],
      ['إلغاء التأمين الطبي', 'شركة التأمين'],
      ['إيقاف الحسابات والصلاحيات والبريد', 'تقنية المعلومات'],
    ]),
    section('بعد انتهاء العلاقة'),
    steps([
      ['صرف المستحقات خلال المدة النظامية (المادة 88: أسبوع إذا أنهى صاحب العمل العقد، وأسبوعان إذا كان الإنهاء من العامل)', 'المالية'],
      ['توقيع المخالصة النهائية', 'الموارد البشرية'],
      ['إصدار شهادة الخدمة عند الطلب، مجاناً (المادة 64)', 'الموارد البشرية'],
      ['حفظ نسخ المستندات في ملف الموظف', 'الموارد البشرية'],
    ]),
    para('ملاحظة: الإجراءات والمدد مبنية على نظام العمل والمنصات الحكومية وقت إعداد النموذج، وقد تتغير. تحقق منها في المصادر الرسمية.', { size: 18, color: MUTED, before: 240 }),
  ]);
})();
