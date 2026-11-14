"""
منتج سنعها 3: متابعة الإقامات والوثائق مع التنبيه قبل الانتهاء
التشغيل: python3 hr-store/build/iqama_tracker.py
الناتج: hr-store/products/متابعة-الإقامات-والوثائق.xlsx
"""
import datetime as dt
import os

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Protection, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = os.path.join(os.path.dirname(__file__), '..', 'products', 'متابعة-الإقامات-والوثائق.xlsx')

TEAL, SAND, CREAM, INK = '0F5E63', 'E9A35B', 'F7F3EC', '0B2E30'
INPUT = 'FFF4CC'
RED_BG, RED_FG = 'FDE2E1', 'B42318'
ORANGE_BG, ORANGE_FG = 'FDE9D2', 'B54708'
YELLOW_BG, YELLOW_FG = 'FEF7C3', '854A0E'
GREEN_BG, GREEN_FG = 'E3F4E8', '067647'
FONT = 'Alexandria'
thin = Side(style='thin', color='D0D5DD')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
R = Alignment(horizontal='right', vertical='center', wrap_text=True, readingOrder=2)
C = Alignment(horizontal='center', vertical='center', wrap_text=True, readingOrder=2)
DATE = 'yyyy/mm/dd'


def f(size=11, bold=False, color='1D2939'):
    return Font(name=FONT, size=size, bold=bold, color=color)


def fill(c):
    return PatternFill('solid', start_color=c, end_color=c)


def setup(ws, landscape=True):
    ws.sheet_view.rightToLeft = True
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = 'landscape' if landscape else 'portrait'
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth, ws.page_setup.fitToHeight = 1, 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True


def title(ws, ref, end, text, size=16):
    ws.merge_cells(f'{ref}:{end}')
    c = ws[ref]
    c.value, c.font, c.fill, c.alignment = text, f(size, True, 'FFFFFF'), fill(TEAL), C
    ws.row_dimensions[c.row].height = 38


wb = Workbook()

# ═════════════ الإعدادات ═════════════
st = wb.active
st.title = 'الإعدادات'
setup(st, False)
for col, w in zip('ABCD', (3, 36, 18, 50)):
    st.column_dimensions[col].width = w
title(st, 'B2', 'D2', 'الإعدادات')
settings = [
    (4, 'اسم المنشأة', 'منشأة المثال', None, ''),
    (5, 'تاريخ اليوم', '=TODAY()', DATE, 'يتحدث تلقائياً كل يوم. تقدر تكتب تاريخ ثاني للتجربة'),
    (6, 'تنبيه عاجل (أيام أو أقل)', 30, '0', 'برتقالي: لازم تبدأ التجديد الحين'),
    (7, 'تنبيه قريب (أيام أو أقل)', 60, '0', 'أصفر: جهّز الإجراءات'),
    (8, 'تنبيه مبكر (أيام أو أقل)', 90, '0', 'يظهر في لوحة التنبيهات فقط'),
]
for r, label, val, fmt, note in settings:
    a = st.cell(r, 2, label)
    a.font, a.alignment, a.border = f(11), R, BOX
    b = st.cell(r, 3, val)
    b.font, b.alignment, b.border, b.fill = f(11, False, '0000FF'), C, BOX, fill(INPUT)
    b.protection = Protection(locked=False)
    if fmt:
        b.number_format = fmt
    n = st.cell(r, 4, note)
    n.font, n.alignment = f(10, color='667085'), R
st['B10'] = 'ألوان الحالات'
st['B10'].font = f(12, True, TEAL)
legend = [('منتهية', RED_BG, RED_FG), ('عاجل', ORANGE_BG, ORANGE_FG), ('قريب', YELLOW_BG, YELLOW_FG), ('سليمة', GREEN_BG, GREEN_FG)]
for i, (t, bg, fg) in enumerate(legend, 11):
    c = st.cell(i, 2, t)
    c.font, c.fill, c.alignment, c.border = f(11, True, fg), fill(bg), C, BOX
st.protection.sheet = True
TODAY, URG, NEAR, EARLY = "'الإعدادات'!$C$5", "'الإعدادات'!$C$6", "'الإعدادات'!$C$7", "'الإعدادات'!$C$8"

# ═════════════ سجل الوثائق ═════════════
ws = wb.create_sheet('سجل الوثائق', 0)
setup(ws)
ws.freeze_panes = 'D4'
DOCS = ['الإقامة / الهوية', 'جواز السفر', 'التأمين الطبي', 'عقد العمل', 'تأشيرة خروج وعودة']
heads = [('الرقم الوظيفي', 11, 'in'), ('اسم الموظف', 22, 'in'), ('الجنسية', 12, 'in'), ('المهنة', 15, 'in'), ('رقم الإقامة / الهوية', 15, 'in')]
heads += [(f'انتهاء {d}', 14, 'date') for d in DOCS]
heads += [('أقرب وثيقة تنتهي', 18, 'calc'), ('تاريخها', 13, 'calc'), ('الأيام المتبقية', 11, 'calc'), ('الحالة', 11, 'calc'), ('ملاحظات', 20, 'in')]
title(ws, 'A1', f'{chr(64 + len(heads))}1', 'سجل الإقامات والوثائق · التواريخ بالميلادي')
for i, (h, w, k) in enumerate(heads, 1):
    c = ws.cell(3, i, h)
    c.font = f(10, True, INK if k in ('in', 'date') else 'FFFFFF')
    c.fill = fill(INPUT if k in ('in', 'date') else (TEAL if h == 'الحالة' else SAND))
    c.alignment, c.border = C, BOX
    ws.column_dimensions[c.column_letter].width = w
ws.row_dimensions[3].height = 40
ws['F3'].comment = Comment('أدخل التاريخ بالميلادي. لتحويل الهجري: انسخ التاريخ الميلادي من أبشر أو مقيم أو قوى', 'سنعها')
ws['J3'].comment = Comment('آخر موعد لرجوع الموظف من الإجازة. اتركها فاضية إذا ما عنده تأشيرة', 'سنعها')

ROWS = 200
R1, R2 = 4, 4 + ROWS - 1
D1, D2 = 'F', 'J'  # أعمدة التواريخ
today = dt.date(2026, 11, 14)
d = lambda n: today + dt.timedelta(days=n)
samples = [
    (101, 'مثال: محمد إقبال', 'باكستاني', 'فني صيانة', '2XXXXXXXXX', d(18), d(400), d(75), d(200), None),
    (102, 'مثال: خالد السبيعي', 'سعودي', 'محاسب', '1XXXXXXXXX', d(900), d(1200), d(150), d(-5), None),
    (103, 'مثال: جون ريز', 'فلبيني', 'ممرض', '2XXXXXXXXX', d(250), d(45), d(320), d(330), d(12)),
    (104, 'مثال: أحمد عبدالله', 'مصري', 'مندوب مبيعات', '2XXXXXXXXX', d(-3), d(600), d(-3), d(500), None),
]
for r in range(R1, R2 + 1):
    if r - R1 < len(samples):
        for col, v in enumerate(samples[r - R1], 1):
            ws.cell(r, col, v)
    rng = f'{D1}{r}:{D2}{r}'
    # K أقرب وثيقة · L تاريخها · M الأيام المتبقية · N الحالة · O ملاحظات · R مفتاح ترتيب (مخفي)
    ws.cell(r, 12, f'=IF(COUNT({rng})=0,"",MIN({rng}))')
    ws.cell(r, 11, f'=IF(L{r}="","",SUBSTITUTE(INDEX($F$3:$J$3,MATCH(L{r},{rng},0)),"انتهاء ",""))')
    ws.cell(r, 13, f'=IF(L{r}="","",L{r}-{TODAY})')
    ws.cell(r, 14, f'=IF(M{r}="","",IF(M{r}<0,"منتهية",IF(M{r}<={URG},"عاجل",IF(M{r}<={NEAR},"قريب","سليمة"))))')
    ws.cell(r, 18, f'=IF(M{r}="","",M{r}+ROW()/100000)')
    for col in range(1, 16):
        c = ws.cell(r, col)
        k = heads[col - 1][2]
        c.border = BOX
        c.alignment = R if col in (2, 15) else C
        c.font = f(10, col in (13, 14), '0000FF' if k in ('in', 'date') else '1D2939')
        if k in ('in', 'date'):
            c.protection = Protection(locked=False)
        if k == 'date':
            c.number_format = DATE
    ws.cell(r, 12).number_format = DATE
    ws.cell(r, 13).number_format = '0;-0;0'
ws.column_dimensions['R'].hidden = True
ws.cell(3, 18, 'مفتاح الترتيب')

# تلوين التواريخ والحالة
def cf(rng, formula, bg, fg):
    ws.conditional_formatting.add(rng, FormulaRule(formula=[formula], fill=fill(bg), font=Font(name=FONT, color=fg, bold=True), stopIfTrue=True))


dates = f'{D1}{R1}:{D2}{R2}'
cf(dates, f'AND(ISNUMBER({D1}{R1}),{D1}{R1}<{TODAY})', RED_BG, RED_FG)
cf(dates, f'AND(ISNUMBER({D1}{R1}),{D1}{R1}-{TODAY}<={URG})', ORANGE_BG, ORANGE_FG)
cf(dates, f'AND(ISNUMBER({D1}{R1}),{D1}{R1}-{TODAY}<={NEAR})', YELLOW_BG, YELLOW_FG)
status = f'N{R1}:N{R2}'
for t, bg, fg in legend:
    cf(status, f'N{R1}="{t}"', bg, fg)
cf(f'M{R1}:M{R2}', f'AND(ISNUMBER(M{R1}),M{R1}<0)', RED_BG, RED_FG)

dvn = DataValidation(type='date', operator='greaterThan', formula1='DATE(2000,1,1)', allow_blank=True)
dvn.error = 'أدخل تاريخاً ميلادياً صحيحاً'
ws.add_data_validation(dvn)
dvn.add(dates)
ws.protection.sheet = True
ws.protection.formatColumns = False
ws.protection.autoFilter = False
ws.auto_filter.ref = f'A3:O{R2}'

# ═════════════ لوحة التنبيهات ═════════════
ds = wb.create_sheet('لوحة التنبيهات', 0)
setup(ds, False)
ds.page_setup.fitToHeight = 1
for col, w in zip('ABCDEFGH', (3, 6, 24, 20, 14, 12, 12, 3)):
    ds.column_dimensions[col].width = w
title(ds, 'B2', 'G2', 'لوحة التنبيهات')
ds.merge_cells('B3:G3')
ds['B3'] = f"='الإعدادات'!C4&\"  ·  اليوم: \"&TEXT({TODAY},\"yyyy/mm/dd\")"
ds['B3'].font, ds['B3'].alignment = f(11, True, TEAL), C

# جدول العدّادات لكل وثيقة
ds['B5'] = 'ملخص حسب نوع الوثيقة'
ds['B5'].font = f(12, True, TEAL)
for i, h in enumerate(['', 'الوثيقة', 'منتهية', 'عاجل', 'قريب', 'تنبيه مبكر'], 2):
    c = ds.cell(6, i, h)
    c.font, c.fill, c.alignment, c.border = f(10, True, 'FFFFFF'), fill(TEAL), C, BOX
SW = "'سجل الوثائق'!"
for j, doc in enumerate(DOCS):
    r = 7 + j
    col = chr(ord(D1) + j)
    rng = f'{SW}${col}${R1}:${col}${R2}'
    vals = [
        doc,
        f'=COUNTIFS({rng},"<"&{TODAY})',
        f'=COUNTIFS({rng},">="&{TODAY},{rng},"<="&({TODAY}+{URG}))',
        f'=COUNTIFS({rng},">"&({TODAY}+{URG}),{rng},"<="&({TODAY}+{NEAR}))',
        f'=COUNTIFS({rng},">"&({TODAY}+{NEAR}),{rng},"<="&({TODAY}+{EARLY}))',
    ]
    ds.cell(r, 2, j + 1)
    for k, v in enumerate(vals, 3):
        c = ds.cell(r, k, v)
        c.border, c.alignment, c.font = BOX, (R if k == 3 else C), f(11, k > 3)
    ds.cell(r, 2).border, ds.cell(r, 2).alignment, ds.cell(r, 2).font = BOX, C, f(10, color='98A2B3')
for k, (bg, fg) in zip((4, 5, 6), ((RED_BG, RED_FG), (ORANGE_BG, ORANGE_FG), (YELLOW_BG, YELLOW_FG))):
    L = chr(64 + k)
    ds.conditional_formatting.add(f'{L}7:{L}11', FormulaRule(formula=[f'{L}7>0'], fill=fill(bg), font=Font(name=FONT, color=fg, bold=True)))
tr = 12
ds.cell(tr, 3, 'المجموع')
for k in range(2, 8):
    c = ds.cell(tr, k)
    c.fill, c.font, c.alignment, c.border = fill(TEAL), f(11, True, 'FFFFFF'), C, BOX
for k in (4, 5, 6, 7):
    L = chr(64 + k)
    ds.cell(tr, k, f'=SUM({L}7:{L}11)')

# أقرب الوثائق انتهاءً
ds['B14'] = 'أقرب 15 وثيقة تنتهي (لكل موظف أقرب وثيقة)'
ds['B14'].font = f(12, True, TEAL)
for i, h in enumerate(['#', 'اسم الموظف', 'الوثيقة', 'التاريخ', 'الأيام', 'الحالة'], 2):
    c = ds.cell(15, i, h)
    c.font, c.fill, c.alignment, c.border = f(10, True, 'FFFFFF'), fill(TEAL), C, BOX
KEY = f'{SW}$R${R1}:$R${R2}'
for n in range(1, 16):
    r = 15 + n
    pos = f'MATCH(SMALL({KEY},{n}),{KEY},0)'
    pick = lambda col: f'=IFERROR(INDEX({SW}${col}${R1}:${col}${R2},{pos}),"")'
    ds.cell(r, 2, n)
    ds.cell(r, 3, pick('B'))
    ds.cell(r, 4, pick('K'))
    ds.cell(r, 5, pick('L')).number_format = DATE
    ds.cell(r, 6, pick('M')).number_format = '0;-0;0'
    ds.cell(r, 7, pick('N'))
    for k in range(2, 8):
        c = ds.cell(r, k)
        c.border, c.alignment = BOX, (R if k == 3 else C)
        c.font = f(10, k in (6, 7), '98A2B3' if k == 2 else '1D2939')
for t, bg, fg in legend[:3]:
    ds.conditional_formatting.add('G16:G30', FormulaRule(formula=[f'G16="{t}"'], fill=fill(bg), font=Font(name=FONT, color=fg, bold=True)))
ds.protection.sheet = True

# ═════════════ طريقة الاستخدام ═════════════
hs = wb.create_sheet('طريقة الاستخدام')
setup(hs, False)
hs.column_dimensions['B'].width = 100
guide = [
    ('طريقة الاستخدام', 18, True),
    ('', 11, False),
    ('1) ورقة "الإعدادات": اكتب اسم المنشأة، وعدّل مدد التنبيه إذا تبي (الافتراضي 30 و60 و90 يوم).', 11, False),
    ('2) ورقة "سجل الوثائق": موظف في كل سطر (حتى 200)، وتواريخ انتهاء وثائقه بالميلادي. أول 4 أسطر أمثلة، امسحها.', 11, False),
    ('3) التواريخ تتلوّن تلقائياً، وأعمدة "أقرب وثيقة تنتهي" توريك وش أقرب شي لازم تجدده لكل موظف.', 11, False),
    ('4) ورقة "لوحة التنبيهات": افتحها كل أسبوع. فيها عدد الوثائق المنتهية والقريبة، وأقرب 15 وثيقة مرتبة.', 11, False),
    ('', 11, False),
    ('الألوان', 13, True),
    ('أحمر = منتهية · برتقالي = عاجل (30 يوم أو أقل) · أصفر = قريب (60 يوم أو أقل) · أخضر = سليمة.', 11, False),
    ('', 11, False),
    ('نصائح', 13, True),
    ('• التواريخ الهجرية: خذ التاريخ الميلادي المقابل من أبشر أعمال أو مقيم أو قوى، وأدخله هنا.', 11, False),
    ('• تأشيرة الخروج والعودة: اكتب آخر موعد للرجوع، عشان يجيك تنبيه قبل ما يتأخر الموظف.', 11, False),
    ('• تقدر تفرز وتفلتر السجل من أسهم العناوين (مثلاً تعرض الموظفين اللي حالتهم "عاجل" بس).', 11, False),
    ('• الملف ما يرسل تنبيهات لجوالك: افتح لوحة التنبيهات بشكل دوري، ويفضّل كل يوم أحد.', 11, False),
    ('', 11, False),
    ('إخلاء مسؤولية', 13, True),
    ('هذا الملف أداة تنظيمية مساعدة، والمرجع النهائي لتواريخ الوثائق هو الأنظمة الرسمية (أبشر، مقيم، قوى، مجلس الضمان الصحي).', 11, False),
]
for i, (t, sz, b) in enumerate(guide, 2):
    c = hs.cell(i, 2, t)
    c.font, c.alignment = f(sz, b, TEAL if b else '344054'), R
    hs.row_dimensions[i].height = 24

for s in wb.worksheets:
    s.sheet_properties.tabColor = TEAL if s.title == 'لوحة التنبيهات' else SAND
wb.active = 0
os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)
print('saved', OUT)
