"""
منتج سنعها 2: كشف الرواتب الشهري (مع التأمينات الاجتماعية والإضافي والغياب)
التشغيل: python3 hr-store/build/payroll.py
الناتج: hr-store/products/كشف-الرواتب.xlsx
"""
import datetime as dt
import os

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Protection, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = os.path.join(os.path.dirname(__file__), '..', 'products', 'كشف-الرواتب.xlsx')

TEAL, SAND, CREAM, INK = '0F5E63', 'E9A35B', 'F7F3EC', '0B2E30'
INPUT, OK = 'FFF4CC', 'E3F4E8'
FONT = 'Alexandria'
thin = Side(style='thin', color='D0D5DD')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
R = Alignment(horizontal='right', vertical='center', wrap_text=True, readingOrder=2)
C = Alignment(horizontal='center', vertical='center', wrap_text=True, readingOrder=2)
MONEY = '#,##0.00;-#,##0.00;"-"'
PCT = '0.00%'


def f(size=11, bold=False, color='1D2939'):
    return Font(name=FONT, size=size, bold=bold, color=color)


def fill(c):
    return PatternFill('solid', start_color=c, end_color=c)


def title(ws, ref, text, cols, size=16):
    ws.merge_cells(f'{ref}:{cols}')
    c = ws[ref]
    c.value, c.font, c.fill, c.alignment = text, f(size, True, 'FFFFFF'), fill(TEAL), C
    ws.row_dimensions[c.row].height = 38


def setup(ws):
    ws.sheet_view.rightToLeft = True
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = 'landscape'
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth, ws.page_setup.fitToHeight = 1, 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True


wb = Workbook()

# ═════════════ الإعدادات ═════════════
st = wb.active
st.title = 'الإعدادات'
setup(st)
st.column_dimensions['A'].width = 3
st.column_dimensions['B'].width = 34
st.column_dimensions['C'].width = 18
st.column_dimensions['D'].width = 18
st.column_dimensions['E'].width = 50
title(st, 'B2', 'الإعدادات', 'E2')

rows = [
    (4, 'اسم المنشأة', 'منشأة المثال', None),
    (5, 'شهر الكشف', dt.date(2026, 11, 1), 'yyyy/mm'),
    (6, 'أيام الشهر المعتمدة للحساب', 30, '0'),
    (7, 'ساعات العمل اليومية', 8, '0'),
    (8, 'تاريخ بدء نظام التأمينات الجديد', dt.date(2024, 7, 3), 'yyyy/mm/dd'),
    (9, 'الحد الأعلى للأجر الخاضع للتأمينات', 45000, MONEY),
    (10, 'نسبة إضافية الساعة الإضافية (من الأساسي)', 0.5, '0%'),
]
for r, label, val, fmt in rows:
    a = st.cell(r, 2, label)
    a.font, a.alignment, a.border = f(11), R, BOX
    b = st.cell(r, 3, val)
    b.font, b.alignment, b.border, b.fill = f(11, False, '0000FF'), C, BOX, fill(INPUT)
    b.protection = Protection(locked=False)
    if fmt:
        b.number_format = fmt
notes = {
    6: 'المعتاد: الأجر الشهري ÷ 30 لحساب أجر اليوم',
    8: 'من باشر من هذا التاريخ أو بعده يخضع للنظام الجديد',
    9: 'الأساسي + السكن، بحد أعلى. تحقق من القيمة الحالية في موقع التأمينات',
    10: 'المادة 107: أجر الساعة + 50% من أجر الساعة الأساسي',
}
for r, t in notes.items():
    c = st.cell(r, 5, t)
    c.font, c.alignment = f(10, color='667085'), R

# جدول نسب التأمينات
st.merge_cells('B12:E12')
st['B12'] = 'نسب الاشتراك في التأمينات الاجتماعية (عدّلها إذا تغيّرت)'
st['B12'].font, st['B12'].fill, st['B12'].alignment = f(12, True, TEAL), fill(CREAM), R
for i, h in enumerate(['الفئة', 'حصة الموظف', 'حصة صاحب العمل', 'التفصيل'], 2):
    c = st.cell(13, i, h)
    c.font, c.fill, c.alignment, c.border = f(11, True, 'FFFFFF'), fill(TEAL), C, BOX
rates = [
    ('سعودي - قديم', 0.0975, 0.1175, 'معاشات 9% + ساند 0.75% لكل طرف، وأخطار مهنية 2% على صاحب العمل'),
    ('سعودي - جديد', 0.1075, 0.1275, 'معاشات 10% (تزيد 0.5% كل يوليو حتى 11%) + ساند 0.75%، وأخطار 2% على صاحب العمل'),
    ('غير سعودي', 0, 0.02, 'أخطار مهنية 2% على صاحب العمل فقط'),
]
for i, (k, e, er, d) in enumerate(rates, 14):
    for j, v in enumerate([k, e, er, d], 2):
        c = st.cell(i, j, v)
        c.font, c.border = f(11), BOX
        c.alignment = R if j in (2, 5) else C
        if j in (3, 4):
            c.number_format = PCT
            c.fill, c.font = fill(INPUT), f(11, False, '0000FF')
            c.protection = Protection(locked=False)
st['B18'] = '⚠️ النسب من مصادر متعددة وقد تتغير. تحقق منها في موقع المؤسسة العامة للتأمينات الاجتماعية (gosi.gov.sa) قبل الاعتماد.'
st['B18'].font, st['B18'].alignment = f(10, True, 'B42318'), R
st.merge_cells('B18:E18')
st.row_dimensions[18].height = 34
RATE_KEYS = "'الإعدادات'!$B$14:$B$16"
RATE_EMP = "'الإعدادات'!$C$14:$C$16"
RATE_ER = "'الإعدادات'!$D$14:$D$16"
DAYS, HOURS, NEWDATE, CAP, OTP = ("'الإعدادات'!$C$6", "'الإعدادات'!$C$7", "'الإعدادات'!$C$8", "'الإعدادات'!$C$9", "'الإعدادات'!$C$10")
st.protection.sheet = True

# ═════════════ بيانات الموظفين (ثابتة) ═════════════
es = wb.create_sheet('الموظفين', 0)
setup(es)
es.freeze_panes = 'A4'
eh = [('الرقم الوظيفي', 13), ('اسم الموظف', 24), ('الجنسية', 13), ('تاريخ المباشرة', 15), ('نظام التأمينات', 15),
      ('الراتب الأساسي', 14), ('بدل السكن', 13), ('بدل النقل', 13), ('بدلات أخرى', 13), ('إجمالي الراتب', 15)]
title(es, 'A1', 'بيانات الموظفين · تُعبّأ مرة وحدة وتتحدث عند التغيير', 'J1', 14)
for i, (h, w) in enumerate(eh, 1):
    c = es.cell(3, i, h)
    is_in = i not in (5, 10)
    c.font = f(11, True, INK if is_in else 'FFFFFF')
    c.fill = fill(INPUT if is_in else SAND)
    c.alignment, c.border = C, BOX
    es.column_dimensions[c.column_letter].width = w
es.row_dimensions[3].height = 34
EMP_ROWS = 100
E1, E2 = 4, 4 + EMP_ROWS - 1
samples = [
    (1001, 'مثال: أحمد العتيبي', 'سعودي', dt.date(2019, 4, 1), 8000, 2000, 800, 0),
    (1002, 'مثال: سارة القحطاني', 'سعودي', dt.date(2025, 2, 15), 7000, 1750, 700, 300),
    (1003, 'مثال: راجيش كومار', 'غير سعودي', dt.date(2022, 9, 10), 4500, 1125, 450, 0),
]
for r in range(E1, E2 + 1):
    if r - E1 < len(samples):
        s = samples[r - E1]
        for col, v in zip((1, 2, 3, 4, 6, 7, 8, 9), s):
            es.cell(r, col, v)
    es.cell(r, 5, f'=IF(C{r}="","",IF(C{r}="غير سعودي","—",IF(D{r}>={NEWDATE},"جديد","قديم")))')
    es.cell(r, 10, f'=IF(A{r}="","",SUM(F{r}:I{r}))')
    for col in range(1, 11):
        c = es.cell(r, col)
        c.border, c.alignment = BOX, C
        c.font = f(10, col == 10, '0000FF' if col not in (5, 10) else '1D2939')
        if col not in (5, 10):
            c.protection = Protection(locked=False)
        if r % 2 == 0:
            c.fill = fill('FAFBFC')
    es.cell(r, 4).number_format = 'yyyy/mm/dd'
    for col in (6, 7, 8, 9, 10):
        es.cell(r, col).number_format = MONEY
dvn = DataValidation(type='list', formula1='"سعودي,غير سعودي"', allow_blank=True)
es.add_data_validation(dvn)
dvn.add(f'C{E1}:C{E2}')
es['E3'].comment = Comment('يتحدد تلقائياً من تاريخ المباشرة وتاريخ النظام الجديد في الإعدادات', 'سنعها')
es.protection.sheet = True

EMP_ID = f"'الموظفين'!$A${E1}:$A${E2}"


# "اسم المنشأة · نوفمبر 2026" بأسماء الشهور العربية (TEXT يطلعها إنجليزي حسب لغة الجهاز)
AR_MONTHS = ','.join(f'"{m}"' for m in ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'])
PERIOD = f"='الإعدادات'!C4&\"  ·  \"&CHOOSE(MONTH('الإعدادات'!C5),{AR_MONTHS})&\" \"&YEAR('الإعدادات'!C5)"


def emp(col_letter, key):
    return f"INDEX('الموظفين'!${col_letter}${E1}:${col_letter}${E2},MATCH({key},{EMP_ID},0))"


# ═════════════ كشف الشهر ═════════════
ms = wb.create_sheet('كشف الشهر', 1)
setup(ms)
ms.freeze_panes = 'C5'
title(ms, 'A1', 'كشف الرواتب', 'S1', 16)
ms.merge_cells('A2:S2')
ms['A2'] = PERIOD
ms['A2'].font, ms['A2'].alignment = f(12, True, TEAL), C
mh = [
    ('الرقم الوظيفي', 12, 'in'), ('اسم الموظف', 22, 'calc'), ('الجنسية / النظام', 14, 'calc'), ('إجمالي الراتب', 14, 'calc'),
    ('أيام الغياب', 10, 'in'), ('خصم الغياب', 13, 'calc'), ('ساعات إضافي', 10, 'in'), ('قيمة الإضافي', 13, 'calc'),
    ('مكافآت', 12, 'in'), ('سلف وخصومات', 12, 'in'), ('الأجر الخاضع للتأمينات', 15, 'calc'), ('نسبة الموظف', 10, 'calc'),
    ('خصم التأمينات', 13, 'calc'), ('صافي الراتب', 15, 'net'), ('نسبة صاحب العمل', 11, 'calc'), ('تأمينات صاحب العمل', 14, 'calc'),
    ('تكلفة الموظف الكلية', 15, 'calc'), ('ملاحظات', 18, 'in'), ('الحالة', 10, 'calc'),
]
for i, (h, w, kind) in enumerate(mh, 1):
    c = ms.cell(4, i, h)
    c.font = f(10, True, INK if kind == 'in' else 'FFFFFF')
    c.fill = fill(INPUT if kind == 'in' else (TEAL if kind == 'net' else SAND))
    c.alignment, c.border = C, BOX
    ms.column_dimensions[c.column_letter].width = w
ms.row_dimensions[4].height = 44
M1, M2 = 5, 5 + EMP_ROWS - 1
ex_inputs = {M1: (1001, 0, 6, 500, 0), M1 + 1: (1002, 2, 0, 0, 1000), M1 + 2: (1003, 0, 10, 0, 0)}
for r in range(M1, M2 + 1):
    if r in ex_inputs:
        a, ab, ot, bo, ded = ex_inputs[r]
        ms.cell(r, 1, a); ms.cell(r, 5, ab); ms.cell(r, 7, ot); ms.cell(r, 9, bo); ms.cell(r, 10, ded)
    k = f'A{r}'
    ok = f'AND({k}<>"",ISNUMBER(MATCH({k},{EMP_ID},0)))'
    ms.cell(r, 2, f'=IF({k}="","",IFERROR({emp("B", k)},"⚠️ رقم غير موجود"))')
    ms.cell(r, 3, f'=IF({ok},{emp("C", k)}&IF({emp("C", k)}="سعودي"," - "&{emp("E", k)},""),"")')
    ms.cell(r, 4, f'=IF({ok},{emp("J", k)},"")')
    ms.cell(r, 6, f'=IF(D{r}="","",ROUND(N(E{r})*D{r}/{DAYS},2))')
    ms.cell(r, 8, f'=IF(D{r}="","",ROUND(N(G{r})*(D{r}/{DAYS}/{HOURS}+{OTP}*{emp("F", k)}/{DAYS}/{HOURS}),2))')
    ms.cell(r, 11, f'=IF({ok},MIN({emp("F", k)}+{emp("G", k)},{CAP}),"")')
    key = f'IF({emp("C", k)}="غير سعودي","غير سعودي","سعودي - "&{emp("E", k)})'
    ms.cell(r, 12, f'=IF({ok},INDEX({RATE_EMP},MATCH({key},{RATE_KEYS},0)),"")')
    ms.cell(r, 13, f'=IF(K{r}="","",ROUND(K{r}*L{r},2))')
    ms.cell(r, 14, f'=IF(D{r}="","",D{r}-F{r}+H{r}+N(I{r})-M{r}-N(J{r}))')
    ms.cell(r, 15, f'=IF({ok},INDEX({RATE_ER},MATCH({key},{RATE_KEYS},0)),"")')
    ms.cell(r, 16, f'=IF(K{r}="","",ROUND(K{r}*O{r},2))')
    ms.cell(r, 17, f'=IF(D{r}="","",D{r}-F{r}+H{r}+N(I{r})+P{r})')
    ms.cell(r, 19, f'=IF({k}="","",IF(NOT({ok}),"تحقق",IF(N{r}<0,"سالب!","✓")))')
    for col in range(1, 20):
        c = ms.cell(r, col)
        kind = mh[col - 1][2]
        c.border, c.alignment = BOX, C
        c.font = f(10, kind == 'net', '0000FF' if kind == 'in' else (TEAL if kind == 'net' else '1D2939'))
        if kind == 'in':
            c.protection = Protection(locked=False)
        if kind == 'net':
            c.fill = fill(OK)
        elif r % 2 == 0:
            c.fill = fill('FAFBFC')
    for col in (4, 6, 8, 9, 10, 11, 13, 14, 16, 17):
        ms.cell(r, col).number_format = MONEY
    for col in (12, 15):
        ms.cell(r, col).number_format = PCT
    ms.cell(r, 18).alignment = R
tot = M2 + 1
ms.cell(tot, 1, 'الإجمالي')
for col in range(1, 20):
    c = ms.cell(tot, col)
    c.fill, c.font, c.alignment, c.border = fill(TEAL), f(11, True, 'FFFFFF'), C, BOX
for col in (4, 6, 8, 9, 10, 13, 14, 16, 17):
    L = ms.cell(tot, col).column_letter
    ms.cell(tot, col, f'=SUM({L}{M1}:{L}{M2})').number_format = MONEY
ms.row_dimensions[tot].height = 30
ms.conditional_formatting.add(f'S{M1}:S{M2}', FormulaRule(formula=[f'S{M1}<>"✓"'], font=Font(name=FONT, color='B42318', bold=True)))
ms['G4'].comment = Comment('قيمة الساعة = (الإجمالي ÷ أيام الشهر ÷ ساعات اليوم) + 50% من أجر الساعة الأساسي (المادة 107)', 'سنعها')
ms['F4'].comment = Comment('خصم اليوم = إجمالي الراتب ÷ أيام الشهر المعتمدة', 'سنعها')
ms['K4'].comment = Comment('الأساسي + السكن، بحد أعلى من الإعدادات', 'سنعها')
ms.protection.sheet = True
ms.protection.formatColumns = False

# ═════════════ الملخص ═════════════
ss = wb.create_sheet('الملخص', 2)
setup(ss)
ss.column_dimensions['A'].width = 3
ss.column_dimensions['B'].width = 50
ss.column_dimensions['C'].width = 22
title(ss, 'B2', 'ملخص الرواتب', 'C2')
ss.merge_cells('B3:C3')
ss['B3'] = PERIOD
ss['B3'].font, ss['B3'].alignment = f(11, True, TEAL), C
M = f"'كشف الشهر'!"
summary = [
    ('عدد الموظفين في الكشف', f'=COUNTIF({M}$S${M1}:$S${M2},"✓")', '0'),
    ('منهم سعوديون', f'=COUNTIF({M}$C${M1}:$C${M2},"سعودي*")', '0'),
    ('منهم غير سعوديين', f'=COUNTIF({M}$C${M1}:$C${M2},"غير سعودي")', '0'),
    ('نسبة السعودة (تقريبية)', '=IFERROR(C6/C5,0)', '0%'),
    ('إجمالي الرواتب', f'={M}D{tot}', MONEY),
    ('خصومات الغياب', f'={M}F{tot}', MONEY),
    ('الإضافي', f'={M}H{tot}', MONEY),
    ('المكافآت', f'={M}I{tot}', MONEY),
    ('السلف والخصومات', f'={M}J{tot}', MONEY),
    ('تأمينات (حصة الموظفين)', f'={M}M{tot}', MONEY),
    ('صافي الرواتب المحوّلة', f'={M}N{tot}', MONEY),
    ('تأمينات (حصة المنشأة)', f'={M}P{tot}', MONEY),
    ('إجمالي التأمينات المستحقة للتأمينات الاجتماعية', '=C14+C16', MONEY),
    ('التكلفة الكلية على المنشأة', f'={M}Q{tot}', MONEY),
]
for i, (label, formula, fmt) in enumerate(summary, 5):
    a = ss.cell(i, 2, label)
    b = ss.cell(i, 3, formula)
    big = label in ('صافي الرواتب المحوّلة', 'التكلفة الكلية على المنشأة', 'إجمالي التأمينات المستحقة للتأمينات الاجتماعية')
    a.font, a.alignment, a.border = f(11, big), R, BOX
    b.font, b.alignment, b.border, b.number_format = f(12 if big else 11, big, TEAL if big else '1D2939'), C, BOX, fmt
    if big:
        a.fill = b.fill = fill(OK)
    ss.row_dimensions[i].height = 26
ss.protection.sheet = True

# ═════════════ طريقة الاستخدام ═════════════
hs = wb.create_sheet('طريقة الاستخدام')
setup(hs)
hs.column_dimensions['B'].width = 105
guide = [
    ('طريقة الاستخدام', 18, True),
    ('', 11, False),
    ('1) ورقة "الإعدادات": اكتب اسم المنشأة وشهر الكشف، وراجع نسب التأمينات (مرة وحدة).', 11, False),
    ('2) ورقة "الموظفين": أدخل بيانات كل موظف مرة وحدة (حتى 100 موظف). نظام التأمينات يتحدد تلقائياً من تاريخ المباشرة.', 11, False),
    ('3) ورقة "كشف الشهر": اكتب الرقم الوظيفي، والاسم والراتب ينسحبون تلقائياً. ثم أدخل الغياب والإضافي والمكافآت والسلف.', 11, False),
    ('4) ورقة "الملخص": صافي الرواتب، وحصص التأمينات، والتكلفة الكلية على المنشأة.', 11, False),
    ('5) لكل شهر جديد: انسخ الملف واحفظه باسم الشهر، وغيّر شهر الكشف، وامسح خانات الغياب والإضافي.', 11, False),
    ('', 11, False),
    ('الألوان', 13, True),
    ('أصفر = خانات تعبّئها أنت · الأزرق = بيانات مُدخلة · الأخضر = صافي الراتب · الباقي معادلات.', 11, False),
    ('عمود "الحالة": ✓ يعني السطر سليم، و"تحقق" يعني الرقم الوظيفي غير موجود، و"سالب!" يعني الخصومات أكبر من الراتب.', 11, False),
    ('', 11, False),
    ('طريقة الحساب', 13, True),
    ('• خصم الغياب = أيام الغياب × (إجمالي الراتب ÷ 30).', 11, False),
    ('• الإضافي (المادة 107) = الساعات × (أجر الساعة الفعلي + 50% من أجر الساعة الأساسي)، والساعة = الأجر ÷ 30 ÷ 8.', 11, False),
    ('• الأجر الخاضع للتأمينات = الأساسي + السكن، بحد أعلى 45,000 ريال (قابل للتعديل).', 11, False),
    ('• صافي الراتب = الإجمالي − الغياب + الإضافي + المكافآت − التأمينات − السلف.', 11, False),
    ('', 11, False),
    ('إخلاء مسؤولية', 13, True),
    ('هذا الكشف أداة تنظيمية مساعدة. نسب التأمينات قابلة للتغيير، فتحقق منها في موقع المؤسسة العامة للتأمينات الاجتماعية،', 11, False),
    ('وراجع الحالات الخاصة (الإجازات المرضية، والبدلات المتغيرة، والعقود الخاصة) مع مختص قبل اعتماد الصرف.', 11, False),
]
for i, (t, sz, b) in enumerate(guide, 2):
    c = hs.cell(i, 2, t)
    c.font, c.alignment = f(sz, b, TEAL if b else '344054'), R
    hs.row_dimensions[i].height = 24

for ws in wb.worksheets:
    ws.sheet_properties.tabColor = TEAL if ws.title == 'كشف الشهر' else SAND

os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)
print('saved', OUT)
