import type { Category, Product, ProductFaq, SiteRoute } from '@/types'
import rawCategories from '../../../../data/categories.json'
import rawProducts from '../../../../data/products.json'
import { sanitizeCategories, sanitizeProducts } from '@/lib/sanitize'

const isHidden = (value: unknown): boolean =>
  Boolean(value) && typeof value === 'object' && (value as { hidden?: unknown }).hidden === true

export const fallbackCategories: Category[] = sanitizeCategories(rawCategories)

export const fallbackProducts: Product[] = sanitizeProducts((rawProducts as unknown[]).filter((item) => !isHidden(item)))

export const fallbackRoutes: SiteRoute[] = [
  { id: 'home', label: 'الرئيسية', path: '/', header: true },
  { id: 'catalog', label: 'المنتجات', path: '/catalog', header: true },
  { id: 'new', label: 'وصل حديثاً', path: '/catalog', header: true },
  { id: 'favorites', label: 'المفضلة', path: '/favorites', header: false },
  { id: 'about', label: 'من نحن', path: '/about', header: true },
  { id: 'guide', label: 'دليل المقاسات', path: '/size-guide', header: true },
  { id: 'contact', label: 'تواصل معنا', path: '/contact', header: false },
  { id: 'tracking', label: 'تتبع الطلب', path: '/order-tracking', header: false },
  { id: 'policies', label: 'السياسات', path: '/policies', header: false },
]

export const governorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'الأنبار', 'ديالى',
  'كركوك', 'صلاح الدين', 'واسط', 'بابل', 'ذي قار', 'ميسان', 'المثنى', 'القادسية', 'دهوك', 'السليمانية',
]

export const guideQuestions: ProductFaq[] = [
  { question: 'كيف أختار المقاس المناسب؟', answer: 'راجع جدول المقاسات في دليل المقاسات. إذا كنت بين مقاسين، اختر الأكبر لمزيد من الراحة. تواصل معنا إذا كنت غير متأكد.' },
  { question: 'هل المنتجات أصلية؟', answer: 'نعم، جميع منتجاتنا أصلية 100% من البراندات المعتمدة. نضمن لك الجودة والأصالة.' },
  { question: 'كم تستغرق مدة التوصيل؟', answer: 'التوصيل داخل بغداد خلال 24-48 ساعة، وباقي المحافظات 2-5 أيام عمل.' },
  { question: 'هل يمكنني الإرجاع؟', answer: 'نعم، يمكنك الإرجاع خلال 7 أيام من الاستلام إذا كان المنتج بحالته الأصلية مع الفاتورة.' },
  { question: 'كيف أعرف مقاس الحذاء؟', answer: 'راجع جدول المقاسات في دليل المقاسات. قِس طول قدمك بالسنتيمتر وقارنه مع الجدول.' },
]

export const trustItems = [
  { title: 'توصيل لكل العراق', description: 'جميع المحافظات', icon: 'truck' },
  { title: 'منتجات أصلية', description: 'جودة مضمونة 100%', icon: 'check' },
  { title: 'دفع عند الاستلام', description: 'لا تحتاج بطاقة ائتمان', icon: 'wallet' },
  { title: 'دعم سريع', description: 'قبل وبعد الطلب', icon: 'message' },
] as const

export const homeStory = {
  title: 'شغف كرة القدم في كل قطعة',
  text: 'متجر Arsenall: ملابس كرة القدم الأصلية — أزياء، تيشيرتات، وشورتات من أشهر الأندية.',
}

export interface QuickGuideAnswer {
  question: string
  answers: string[]
}

export const quickGuideAnswers: QuickGuideAnswer[] = [
  {
    question: 'كيف أختار مقاس الملابس؟',
    answers: [
      'راجع جدول المقاسات في دليل المقاسات.',
      'إذا كنت بين مقاسين، اختر الأكبر.',
      'تواصل معنا للمساعدة في الاختيار.',
    ],
  },
  {
    question: 'ما الفرق بين أحذية الجري والتدريب؟',
    answers: [
      'أحذية الجري توفر تبطيناً إضافاً للركبة.',
      'أحذية التدريب أكثر مرونة وثباتاً.',
      'اختر حسب نشاطك الرياضي المفضل.',
    ],
  },
  {
    question: 'هل يمكنني الإرجاع؟',
    answers: [
      'نعم، خلال 7 أيام من الاستلام.',
      'يجب أن يكون المنتج بحالته الأصلية.',
      'احتفظ بالفاتورة مع المنتج.',
    ],
  },
  {
    question: 'كيف أعرف أن المنتج أصلي؟',
    answers: [
      'جميع منتجاتنا أصلية من البراندات المعتمدة.',
      'تحصل على فاتورة مع كل طلب.',
      'يمكنك التحقق من المنتج لدى الوكيل المعتمد.',
    ],
  },
  {
    question: 'كم تستغرق مدة التوصيل؟',
    answers: [
      'بغداد: 24-48 ساعة.',
      'باقي المحافظات: 2-5 أيام عمل.',
      'التوصيل مجاني للطلبات فوق 50,000 دينار.',
    ],
  },
  {
    question: 'كيف أختار الحقيبة الرياضية المناسبة؟',
    answers: [
      'للجري: حقيبة صغيرة بحزام صدر.',
      'للحقيبة الرياضية: اختر حسب حجم عدتك.',
      'راجع الأبعاد في دليل المقاسات.',
    ],
  },
]
