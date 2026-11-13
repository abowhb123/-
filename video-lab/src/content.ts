// ✏️ عدّل النصوص هنا فقط، وبعدها صدّر الفيديو من جديد

// الشعار: حط الملف في public/ واكتب اسمه هنا، مثلاً 'logo.png'
// إذا خليته null يطلع شعار نصي مؤقت
export const LOGO: string | null = 'logos/card-white.png';

// أيقونة بيضاء تدور ببطء في الخلفية (null لإخفائها)
export const WATERMARK: string | null = 'logos/icon-white.png';

export const JOB_AD = {
  headline: ['نبحث', 'عنك'],
  intro: 'انضم إلى فريق الراجحية',
  tag: 'وظيفة شاغرة',
  title: 'منسق مبيعات',
  requirementsTitle: 'المتطلبات',
  requirements: [
    'بكالوريوس إدارة أعمال أو تسويق',
    'خبرة في المبيعات أو خدمة العملاء',
    'إجادة برامج Excel و Office',
    'مهارات تواصل وتنظيم عالية',
  ],
  cta: 'قدّم الآن',
  ctaNote: 'التقديم عبر الرابط',
};

export const WELCOME = {
  greeting: 'أهلاً وسهلاً',
  intro: 'نرحب بزملائنا الجدد',
  // ⚠️ أسماء تجريبية، بدّلها بالأسماء الحقيقية
  employees: [
    { name: 'محمد العتيبي', role: 'محاسب' },
    { name: 'سارة القحطاني', role: 'أخصائية جودة' },
    { name: 'عبدالله الشهري', role: 'مشرف إنتاج' },
    { name: 'نورة الدوسري', role: 'منسقة مشتريات' },
  ],
  closing: 'نتمنى لكم رحلة موفقة معنا',
};
