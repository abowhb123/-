"""
يبني منتج: حاسبة مكافأة نهاية الخدمة (نظام العمل السعودي)
التشغيل: python3 hr-store/build/eos_calculator.py
الناتج: hr-store/products/حاسبة-نهاية-الخدمة.xlsx
"""
import datetime as dt
import os

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = os.path.join(os.path.dirname(__file__), '..', 'products', 'حاسبة-نهاية-الخدمة.xlsx')

# ألوان هوية سنعها
DARK = '0F5E63'  # تركوازي سنعها
ACCENT = 'E9A35B'  # رملي
LIGHT = 'F7F3EC'  # كريمي
INPUT = 'FFF4CC'
FONT = 'Alexandria'

thin = Side(style='thin', color='D0D5DD')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
RIGHT = Alignment(horizontal='right', vertical='center', wrap_text=True, readingOrder=2)
CENTER = Alignment(horizontal='center', vertical='center', wrap_text=True, readingOrder=2)


def f(size=11, bold=False, color='1D2939'):
    return Font(name=FONT, size=size, bold=bold, color=color)


def fill(c):
    return PatternFill('solid', start_color=c, end_color=c)


wb = Workbook()

# ═════════════ الإعدادات (أسباب انتهاء العلاقة) ═════════════
st = wb.active
st.title = 'الإعدادات'
reasons = [
    ('انتهاء مدة العقد', 'كامل', 'المادة 84'),
    ('إنهاء العقد من صاحب العمل', 'كامل', 'المادة 84'),
    ('استقالة العامل', 'استقالة', 'المادة 85'),
    ('ترك العامل العمل لإخلال صاحب العمل (المادة 81)', 'كامل', 'المادة 81'),
    ('قوة قاهرة خارجة عن إرادة العامل', 'كامل', 'المادة 87'),
    ('العاملة خلال 6 أشهر من الزواج أو 3 أشهر من الوضع', 'كامل', 'المادة 87'),
    ('الفصل وفق المادة 80', 'لا شيء', 'المادة 80'),
]
st.sheet_view.rightToLeft = True
st.append(['سبب انتهاء العلاقة', 'نوع الاستحقاق', 'المرجع'])
for r in reasons:
    st.append(list(r))
for c in st[1]:
    c.font, c.fill, c.alignment = f(11, True, 'FFFFFF'), fill(DARK), CENTER
for row in st.iter_rows(min_row=2, max_row=len(reasons) + 1):
    for c in row:
        c.font, c.alignment, c.border = f(), RIGHT, BOX
st.column_dimensions['A'].width = 52
st.column_dimensions['B'].width = 18
st.column_dimensions['C'].width = 14
note_row = len(reasons) + 3
st.cell(note_row, 1, 'أنواع الاستحقاق:').font = f(11, True)
st.cell(note_row + 1, 1, 'كامل = المكافأة كاملة · استقالة = حسب مدة الخدمة (المادة 85) · لا شيء = لا يستحق').font = f(10)
REASONS_RANGE = f"'الإعدادات'!$A$2:$A${len(reasons) + 1}"
TYPES_RANGE = f"'الإعدادات'!$B$2:$B${len(reasons) + 1}"


def type_of(cell):
    return f'INDEX({TYPES_RANGE},MATCH({cell},{REASONS_RANGE},0))'


def factor(type_expr, years):
    return (
        f'IF({type_expr}="كامل",1,IF({type_expr}="لا شيء",0,'
        f'IF({years}<2,0,IF({years}<5,1/3,IF({years}<10,2/3,1)))))'
    )


def full_award(years, wage):
    # نصف شهر عن كل سنة من أول 5 سنوات، وشهر كامل عن كل سنة بعدها (المادة 84)
    return f'IF({years}<=5,{years}*{wage}/2,5*{wage}/2+({years}-5)*{wage})'


# ═════════════ الحاسبة (موظف واحد) ═════════════
ws = wb.create_sheet('الحاسبة', 0)
ws.sheet_view.rightToLeft = True
ws.sheet_view.showGridLines = False
ws.column_dimensions['A'].width = 3
ws.column_dimensions['B'].width = 38
ws.column_dimensions['C'].width = 30
ws.column_dimensions['D'].width = 3
ws.column_dimensions['E'].width = 46

ws.merge_cells('B2:E2')
ws['B2'] = 'حاسبة مكافأة نهاية الخدمة'
ws['B2'].font, ws['B2'].fill, ws['B2'].alignment = f(20, True, 'FFFFFF'), fill(DARK), CENTER
ws.row_dimensions[2].height = 44
ws.merge_cells('B3:E3')
ws['B3'] = 'سنعها · وفق نظام العمل السعودي (المواد 84 و85 و87) · عبّئ الخانات الصفراء فقط'
ws['B3'].font, ws['B3'].alignment = f(10, color='667085'), CENTER


def section(row, title):
    ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=3)
    c = ws.cell(row, 2, title)
    c.font, c.fill, c.alignment = f(12, True, DARK), fill(LIGHT), RIGHT
    ws.cell(row, 3).fill = fill(LIGHT)
    ws.row_dimensions[row].height = 26


def line(row, label, value=None, fmt=None, is_input=False, bold=False):
    a = ws.cell(row, 2, label)
    a.font, a.alignment, a.border = f(11, bold), RIGHT, BOX
    b = ws.cell(row, 3, value)
    b.font = f(12 if bold else 11, bold, DARK if bold else '1D2939')
    b.alignment, b.border = CENTER, BOX
    if is_input:
        b.fill = fill(INPUT)
        b.font = f(11, False, '0000FF')
    if fmt:
        b.number_format = fmt
    ws.row_dimensions[row].height = 24
    return b


MONEY = '#,##0.00 "ر.س";-#,##0.00 "ر.س";"-"'
DATE = 'yyyy/mm/dd'

section(5, 'بيانات الموظف')
line(6, 'اسم الموظف', 'أحمد محمد', is_input=True)
line(7, 'تاريخ المباشرة', dt.date(2018, 1, 1), DATE, True)
line(8, 'تاريخ انتهاء العلاقة التعاقدية', dt.date(2025, 12, 31), DATE, True)
line(9, 'سبب انتهاء العلاقة', 'استقالة العامل', is_input=True)

section(11, 'الأجر الشهري (الأجر الفعلي)')
line(12, 'الراتب الأساسي', 7000, MONEY, True)
line(13, 'بدل السكن', 1750, MONEY, True)
line(14, 'بدل النقل', 700, MONEY, True)
line(15, 'بدلات ثابتة أخرى', 0, MONEY, True)
line(16, 'الأجر المعتمد للحساب', '=SUM(C12:C15)', MONEY, bold=True)

section(18, 'رصيد الإجازات (اختياري)')
line(19, 'أيام الإجازة المستحقة غير المستخدمة', 0, '0', True)

section(21, 'النتيجة')
line(22, 'مدة الخدمة', '=IF(OR(C7="",C8=""),"",DATEDIF(C7,C8,"y")&" سنة و "&DATEDIF(C7,C8,"ym")&" شهر و "&DATEDIF(C7,C8,"md")&" يوم")')
line(23, 'مدة الخدمة بالسنوات', '=IF(OR(C7="",C8=""),0,MAX(0,(C8-C7)/365))', '0.00 "سنة"')
line(24, 'نوع الاستحقاق', f'=IFERROR({type_of("C9")},"اختر السبب")')
line(25, 'المكافأة الكاملة (قبل النسبة)', '=' + full_award('C23', 'C16'), MONEY)
line(26, 'نسبة الاستحقاق', '=IFERROR(' + factor('C24', 'C23') + ',0)', '0%')
line(27, 'مكافأة نهاية الخدمة المستحقة', '=ROUND(C25*C26,2)', MONEY, bold=True)
line(28, 'تعويض رصيد الإجازات', '=ROUND(C19*C16/30,2)', MONEY)
line(29, 'إجمالي المستحق', '=C27+C28', MONEY, bold=True)
for r in (27, 29):
    ws.cell(r, 3).fill = fill('E7F0E9')
ws.row_dimensions[29].height = 32
ws['C29'].font = f(14, True, DARK)

# شرح جانبي
notes = [
    ('طريقة الحساب', True),
    ('• نصف أجر شهر عن كل سنة من أول 5 سنوات.', False),
    ('• أجر شهر كامل عن كل سنة بعد الخمس.', False),
    ('• أجزاء السنة تُحسب بنسبتها (أيام ÷ 365).', False),
    ('', False),
    ('عند الاستقالة (المادة 85)', True),
    ('• أقل من سنتين: لا يستحق.', False),
    ('• من 2 إلى أقل من 5 سنوات: ثلث المكافأة.', False),
    ('• من 5 إلى أقل من 10 سنوات: ثلثا المكافأة.', False),
    ('• 10 سنوات فأكثر: المكافأة كاملة.', False),
    ('', False),
    ('تنبيه', True),
    ('النتيجة تقديرية للاسترشاد. للحالات الخاصة راجع', False),
    ('نظام العمل أو حاسبة وزارة الموارد البشرية.', False),
]
for i, (t, b) in enumerate(notes):
    c = ws.cell(5 + i, 5, t)
    c.font = f(11 if b else 10, b, DARK if b else '475467')
    c.alignment = RIGHT
    if b:
        c.fill = fill(LIGHT)

ws['C9'].comment = Comment('اختر من القائمة. الأسباب ومراجعها النظامية في ورقة "الإعدادات".', 'الحاسبة')
ws['C16'].comment = Comment('الأجر الفعلي = الأساسي + البدلات الثابتة التي تُصرف شهرياً (المادة 2 من نظام العمل).', 'الحاسبة')
ws['C23'].comment = Comment('افتراض: السنة = 365 يوماً.', 'الحاسبة')

dv = DataValidation(type='list', formula1=REASONS_RANGE, allow_blank=False)
dv.error, dv.errorTitle = 'اختر سبباً من القائمة', 'قيمة غير صحيحة'
ws.add_data_validation(dv)
dv.add('C9')
dv_date = DataValidation(type='date', operator='greaterThan', formula1='DATE(1950,1,1)')
dv_date.error = 'أدخل تاريخاً صحيحاً'
ws.add_data_validation(dv_date)
dv_date.add('C7:C8')
dv_num = DataValidation(type='decimal', operator='greaterThanOrEqual', formula1='0')
dv_num.error = 'أدخل رقماً موجباً'
ws.add_data_validation(dv_num)
dv_num.add('C12:C15')
dv_num.add('C19')

# حماية الخلايا: نفتح الخانات الصفراء فقط
from openpyxl.styles import Protection  # noqa: E402

for row in ws.iter_rows():
    for c in row:
        c.protection = Protection(locked=True)
for ref in ['C6', 'C7', 'C8', 'C9', 'C12', 'C13', 'C14', 'C15', 'C19']:
    ws[ref].protection = Protection(locked=False)
ws.protection.sheet = True
ws.protection.formatColumns = False

# ═════════════ كشف الموظفين ═════════════
ls = wb.create_sheet('كشف الموظفين', 1)
ls.sheet_view.rightToLeft = True
ls.freeze_panes = 'A4'
headers = [
    ('اسم الموظف', 22, True), ('تاريخ المباشرة', 15, True), ('تاريخ الانتهاء', 15, True),
    ('سبب الانتهاء', 34, True), ('الأجر الفعلي', 15, True), ('أيام الإجازة', 11, True),
    ('مدة الخدمة (سنة)', 14, False), ('نسبة الاستحقاق', 13, False), ('مكافأة نهاية الخدمة', 18, False),
    ('تعويض الإجازات', 16, False), ('الإجمالي', 18, False),
]
ls.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))
ls['A1'] = 'كشف مكافآت نهاية الخدمة · الأعمدة الصفراء للإدخال والباقي يُحسب تلقائياً'
ls['A1'].font, ls['A1'].fill, ls['A1'].alignment = f(14, True, 'FFFFFF'), fill(DARK), CENTER
ls.row_dimensions[1].height = 34
for i, (h, w, is_in) in enumerate(headers, 1):
    c = ls.cell(3, i, h)
    c.font = f(11, True, DARK if is_in else 'FFFFFF')
    c.fill = fill(INPUT if is_in else ACCENT)
    c.alignment, c.border = CENTER, BOX
    ls.column_dimensions[c.column_letter].width = w
ls.row_dimensions[3].height = 36

ROWS = 50
first, last = 4, 4 + ROWS - 1
example = ['مثال: سارة علي', dt.date(2015, 3, 15), dt.date(2025, 6, 30), 'انتهاء مدة العقد', 9500, 12]
for r in range(first, last + 1):
    if r == first:
        for i, v in enumerate(example, 1):
            ls.cell(r, i, v)
    ls.cell(r, 7, f'=IF(OR(B{r}="",C{r}=""),"",MAX(0,(C{r}-B{r})/365))')
    ls.cell(r, 8, f'=IF(OR(G{r}="",D{r}=""),"",IFERROR({factor(type_of(f"D{r}"), f"G{r}")},""))')
    ls.cell(r, 9, f'=IF(H{r}="","",ROUND(({full_award(f"G{r}", f"E{r}")})*H{r},2))')
    ls.cell(r, 10, f'=IF(E{r}="","",ROUND(N(F{r})*E{r}/30,2))')
    ls.cell(r, 11, f'=IF(I{r}="","",I{r}+N(J{r}))')
    for col in range(1, 12):
        c = ls.cell(r, col)
        c.font = f(10, col == 11, '0000FF' if col <= 6 else '1D2939')
        c.alignment, c.border = CENTER, BOX
        if r % 2 == 0:
            c.fill = fill('FAFBFC')
    ls.cell(r, 2).number_format = ls.cell(r, 3).number_format = DATE
    ls.cell(r, 7).number_format = '0.00'
    ls.cell(r, 8).number_format = '0%'
    for col in (5, 9, 10, 11):
        ls.cell(r, col).number_format = '#,##0.00;-#,##0.00;"-"'
tot = last + 1
ls.cell(tot, 1, 'الإجمالي').font = f(11, True, 'FFFFFF')
for col in range(1, 12):
    ls.cell(tot, col).fill = fill(DARK)
    ls.cell(tot, col).alignment, ls.cell(tot, col).border = CENTER, BOX
for col, letter in ((9, 'I'), (10, 'J'), (11, 'K')):
    c = ls.cell(tot, col, f'=SUM({letter}{first}:{letter}{last})')
    c.font, c.number_format = f(11, True, 'FFFFFF'), '#,##0.00 "ر.س"'
ls.row_dimensions[tot].height = 30

dv2 = DataValidation(type='list', formula1=REASONS_RANGE, allow_blank=True)
ls.add_data_validation(dv2)
dv2.add(f'D{first}:D{last}')

# ═════════════ طريقة الاستخدام ═════════════
hs = wb.create_sheet('طريقة الاستخدام')
hs.sheet_view.rightToLeft = True
hs.sheet_view.showGridLines = False
hs.column_dimensions['B'].width = 95
guide = [
    ('طريقة الاستخدام', 18, True),
    ('', 11, False),
    ('1) ورقة "الحاسبة": لموظف واحد. عبّئ الخانات الصفراء وتظهر النتيجة مباشرة.', 11, False),
    ('2) ورقة "كشف الموظفين": لعدة موظفين (حتى 50). أول صف مثال، امسحه واكتب بياناتك.', 11, False),
    ('3) سبب الانتهاء يُختار من قائمة، والأسباب ومراجعها في ورقة "الإعدادات".', 11, False),
    ('4) الأجر الفعلي = الراتب الأساسي + البدلات الثابتة الشهرية (سكن، نقل، ...).', 11, False),
    ('', 11, False),
    ('الألوان', 13, True),
    ('أصفر = خانات تعبّئها أنت · النص الأزرق = بيانات مُدخلة · الباقي معادلات لا تحتاج تعديل.', 11, False),
    ('', 11, False),
    ('افتراضات الحساب', 13, True),
    ('• السنة = 365 يوماً، وأجزاء السنة تُحسب بنسبتها.', 11, False),
    ('• تعويض الإجازة = عدد الأيام × (الأجر الفعلي ÷ 30).', 11, False),
    ('• ورقة "الحاسبة" محمية من التعديل غير المقصود (بدون كلمة مرور): مراجعة ← إلغاء حماية الورقة.', 11, False),
    ('', 11, False),
    ('إخلاء مسؤولية', 13, True),
    ('هذه الحاسبة أداة تقديرية للاسترشاد مبنية على نظام العمل السعودي، ولا تُعد استشارة قانونية.', 11, False),
    ('للحالات الخاصة أو النزاعات، راجع نظام العمل وحاسبة وزارة الموارد البشرية والتنمية الاجتماعية.', 11, False),
]
for i, (t, s, b) in enumerate(guide, 2):
    c = hs.cell(i, 2, t)
    c.font, c.alignment = f(s, b, DARK if b else '344054'), RIGHT
    hs.row_dimensions[i].height = 24

for sheet in wb.worksheets:
    # طباعة: عرض صفحة واحدة
    sheet.page_setup.orientation = 'landscape'
    sheet.page_setup.paperSize = sheet.PAPERSIZE_A4
    sheet.page_setup.fitToWidth = 1
    sheet.page_setup.fitToHeight = 0
    sheet.sheet_properties.pageSetUpPr.fitToPage = True
    sheet.print_options.horizontalCentered = True
    sheet.sheet_properties.tabColor = DARK if sheet.title == 'الحاسبة' else ACCENT

# الحاسبة: صفحة واحدة بالطول
ws.page_setup.orientation = 'portrait'
ws.page_setup.fitToHeight = 1

os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)
print('saved', OUT)
