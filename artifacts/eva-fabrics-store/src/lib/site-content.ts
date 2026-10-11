import { useEffect, useState } from 'react'
import { readServerContent, readServerSettings } from '@/lib/api'

export const CONTENT_KEY = 'arsenall-admin-content'

export interface SiteContent {
  shopName: string
  phone: string
  whatsapp: string
  instagram: string
  announcementRight: string
  announcementLeft: string
  aboutTitle: string
  aboutText: string
  contactTitle: string
  contactText: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  heroNote: string
  heroNoteAlt: string
  statsTitle: string
  heroSlideMs: string
  categoriesEyebrow: string
  categoriesTitle: string
  newEyebrow: string
  newTitle: string
  newDesc: string
  guideEyebrow: string
  guideTitle: string
  guideText: string
  guideCta: string
  newsletterEyebrow: string
  newsletterTitle: string
  newsletterText: string
  promoPill: string
  promoLead: string
  promoText: string
  emailOrdersTo: string
  emailFromName: string
  emailFrom: string
  emailSubjectOrder: string
  emailTemplateOrder: string
  emailProvider: 'mailto' | 'formsubmit'
  emailFormSubmitAction: string
}

export const defaultSiteContent: SiteContent = {
  shopName: 'Arsenall',
  phone: '07727282001',
  whatsapp: '9647727282001',
  instagram: 'https://www.instagram.com/a.arsenall/',
  announcementRight: 'شحن إلى جميع محافظات العراق',
  announcementLeft: 'ملابس كرة القدم أصلية 100%',
  aboutTitle: 'Arsenall — شغف كرة القدم في كل قطعة',
  aboutText: 'Arsenall متجر متخصص في ملابس كرة القدم — أزياء رسمية للأندية، تيشيرتات، وشورتات بجودة أصلية وتصميمات رسمية.',
  contactTitle: 'سؤال عن منتج أو طلب؟',
  contactText: 'تواصل معنا لأي استفسار عن منتجات Arsenall أو الطلبات. سنرد عليك في أقرب وقت ممكن.',
  heroEyebrow: 'ملابس كرة القدم الأصلية',
  heroTitle: 'Arsenall|شغفك يبدأ من هنا',
  heroText: 'أزياء رسمية للأندية، تيشيرتات، وشورتات — شغف كرة القدم يظهر في كل قطعة.',
  heroNote: 'توصيل إلى جميع محافظات العراق',
  heroNoteAlt: 'دفع عند استلام الطلب',
  statsTitle: 'أرقامنا الآن',
  heroSlideMs: '2600',
  categoriesEyebrow: 'تصفح المجموعة',
  categoriesTitle: 'أزياء، تيشيرتات، شورتات',
  newEyebrow: 'وصل حديثاً',
  newTitle: 'أحدث المنتجات',
  newDesc: 'آخر ما أضفناه من منتجات رياضية',
  guideEyebrow: 'قبل الشراء',
  guideTitle: 'اختر المقاس|المناسب لفريقك',
  guideText: 'راجع جدول المقاسات في صفحة المنتج. إذا كنت بين مقاسين، اختر الأكبر لمزيد من الراحة.',
  guideCta: 'تصفح المنتجات',
  newsletterEyebrow: 'ابقَ على تواصل',
  newsletterTitle: 'اشتراك بالبريد',
  newsletterText: 'كن أول من يعرف عن الأزياء الجديدة والعروض الخاصة.',
  promoPill: 'توصيل لكل العراق',
  promoLead: 'توصيل مجاني',
  promoText: 'للطلبات فوق {price}',
  emailOrdersTo: 'gdumingm@gmail.com',
  emailFromName: 'Arsenall',
  emailFrom: '',
  emailSubjectOrder: 'طلب جديد من Arsenall #{orderNumber}',
  emailTemplateOrder: '',
  emailProvider: 'formsubmit',
  emailFormSubmitAction: 'https://formsubmit.co/gdumingm@gmail.com',
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export const readSiteContent = (): SiteContent => ({
  ...defaultSiteContent,
  ...(readServerContent<Partial<SiteContent>>() || {}),
  ...readJson<Partial<SiteContent>>(CONTENT_KEY, {}),
})

export interface StoreSettings {
  colorsEnabled: boolean
  freeDeliveryFrom: number
  deliveryFee: number
  [key: string]: unknown
}

export const defaultStoreSettings: StoreSettings = {
  colorsEnabled: true,
  freeDeliveryFrom: 50000,
  deliveryFee: 5000,
}

export const readStoreSettings = (): StoreSettings => ({
  ...defaultStoreSettings,
  ...(readServerSettings() as Partial<StoreSettings>),
})

export const useStoreSettings = (): StoreSettings => {
  const [settings, setSettings] = useState<StoreSettings>(() => readStoreSettings())
  useEffect(() => {
    const sync = () => setSettings(readStoreSettings())
    window.addEventListener('eva-admin-changed', sync)
    return () => window.removeEventListener('eva-admin-changed', sync)
  }, [])
  return settings
}

const listeners = new Set<() => void>()

export const useSiteContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(() => readSiteContent())
  useEffect(() => {
    const sync = () => setContent(readSiteContent())
    listeners.add(sync)
    window.addEventListener('eva-admin-changed', sync)
    return () => {
      listeners.delete(sync)
      window.removeEventListener('eva-admin-changed', sync)
    }
  }, [])
  return content
}

export const contentLines = (value: string): string[] =>
  value.split('|').map((line) => line.trim()).filter(Boolean)

export const contentParts = (value: string): string[] => value.split('*')
