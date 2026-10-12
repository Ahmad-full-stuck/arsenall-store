import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, BellRing, LogOut, Package, RefreshCw, Send, ShieldCheck, X } from 'lucide-react'
import {
  ORDERS_CLOUD,
  cloudEnabled,
  cloudLogin,
  cloudSession,
  fetchCloudOrderDetail,
  fetchCloudOrders,
  getAdminToken,
  savePushSubscription,
  sendTestPush,
  setAdminToken,
  urlBase64ToUint8Array,
  type CloudOrder,
  type CloudOrderSummary,
} from '@/lib/orders-cloud'

const STORES: { id: string; name: string }[] = [
  { id: 'ah-lb03', name: 'AH LB03' },
  { id: 'roxsport', name: 'ROX Sport' },
  { id: 'arsenall', name: 'Arsenal L' },
  { id: 'almarefaco', name: 'المعرفة' },
]

const storeName = (id: string): string => STORES.find((s) => s.id === id)?.name || id

const styles = `
.ac-wrap { padding: 34px 0 64px; }
.ac-card { background: var(--glass-bg-strong, rgba(255,255,255,.8)); border: 1px solid var(--glass-border, rgba(255,255,255,.6)); border-radius: 22px; box-shadow: var(--glass-shadow, 0 18px 40px rgba(24,16,32,.12)); padding: 22px; backdrop-filter: blur(18px); }
.ac-login { max-width: 430px; margin: 6vh auto 0; display: flex; flex-direction: column; gap: 14px; }
.ac-input { width: 100%; min-height: 48px; border-radius: 14px; border: 1px solid var(--glass-border, rgba(180,120,120,.3)); background: rgba(255,255,255,.85); padding: 12px 16px; font-size: 15px; }
.ac-toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.ac-filters { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-chip { border: 1px solid var(--glass-border, rgba(180,120,120,.3)); background: rgba(255,255,255,.7); border-radius: 999px; padding: 7px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.ac-chip.is-active { background: var(--eva-rose); color: #fff; border-color: var(--eva-rose); }
.ac-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-btn { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; border: 1px solid var(--glass-border, rgba(180,120,120,.3)); background: rgba(255,255,255,.8); padding: 9px 15px; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--eva-ink, #341b28); }
.ac-btn:hover { color: var(--eva-rose); border-color: rgba(194,24,91,.5); }
.ac-btn-primary { background: var(--eva-rose); color: #fff; border-color: var(--eva-rose); }
.ac-btn-primary:hover { color: #fff; background: var(--eva-rose-dark, #880e4f); }
.ac-list { display: flex; flex-direction: column; gap: 10px; }
.ac-row { display: grid; grid-template-columns: 1.4fr 1fr .8fr .7fr; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 16px; border: 1px solid var(--glass-border, rgba(180,120,120,.22)); background: rgba(255,255,255,.72); cursor: pointer; text-align: start; }
.ac-row:hover { border-color: rgba(194,24,91,.45); box-shadow: 0 10px 22px rgba(194,24,91,.1); }
.ac-row.is-new { border-color: var(--eva-rose); box-shadow: 0 0 0 2px rgba(194,24,91,.18); }
.ac-num { font-weight: 700; font-size: 13.5px; }
.ac-muted { color: #7b6a74; font-size: 12px; }
.ac-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 999px; background: rgba(194,24,91,.12); color: var(--eva-rose); font-size: 11px; font-weight: 700; }
.ac-total { font-weight: 700; }
.ac-empty { text-align: center; padding: 40px 10px; color: #7b6a74; }
.ac-msg { font-size: 12.5px; color: var(--eva-rose); }
.ac-modal { position: fixed; inset: 0; z-index: 200; display: flex; align-items: stretch; justify-content: flex-end; background: rgba(30,10,20,.35); }
.ac-drawer { width: min(560px, 100%); background: #fff; overflow-y: auto; padding: 22px; box-shadow: -20px 0 60px rgba(0,0,0,.25); }
.ac-drawer-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.ac-kv { display: grid; grid-template-columns: 120px 1fr; gap: 8px 14px; font-size: 13.5px; margin: 14px 0; }
.ac-kv dt { color: #7b6a74; }
.ac-item { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px dashed rgba(180,120,120,.25); font-size: 13.5px; }
.ac-close { background: transparent; border: none; cursor: pointer; color: #7b6a74; }
@media (max-width: 640px) {
  .ac-row { grid-template-columns: 1fr 1fr; }
  .ac-kv { grid-template-columns: 90px 1fr; }
}
`

type Status = 'checking' | 'need-login' | 'ready' | 'disabled'

export function AdminConsolePage() {
  const [status, setStatus] = useState<Status>(cloudEnabled() ? 'checking' : 'disabled')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState<CloudOrderSummary[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<CloudOrder | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notifState, setNotifState] = useState<'unknown' | 'granted' | 'denied' | 'unsupported'>('unknown')
  const [subscribed, setSubscribed] = useState(false)
  const [message, setMessage] = useState('')
  const knownRef = useRef<Set<string> | null>(null)
  const openRef = useRef<string | null>(null)

  const showOrderNotification = useCallback(async (summary: CloudOrderSummary): Promise<void> => {
    const title = `طلب جديد • ${storeName(summary.store)}`
    const body = `#${summary.orderNumber}\n${summary.customerName} — ${summary.governorate}\nالإجمالي: ${summary.total}`
    const data = { orderNumber: summary.orderNumber, store: summary.store }
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg) {
        await reg.showNotification(title, { body, dir: 'rtl', lang: 'ar', tag: summary.orderNumber, data, icon: 'favicon.svg', badge: 'favicon.svg', requireInteraction: true })
        return
      }
    } catch {
      /* fall through */
    }
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification(title, { body })
    } catch {
      /* ignore */
    }
  }, [])

  const loadOrders = useCallback(
    async (notify: boolean): Promise<void> => {
      const list = await fetchCloudOrders(filter === 'all' ? undefined : filter)
      if (notify && knownRef.current) {
        for (const o of list) {
          if (!knownRef.current.has(o.orderNumber)) void showOrderNotification(o)
        }
      }
      knownRef.current = new Set(list.map((o) => o.orderNumber))
      setOrders(list)
    },
    [filter, showOrderNotification],
  )

  useEffect(() => {
    if (status !== 'ready') return
    void loadOrders(false)
    const timer = window.setInterval(() => void loadOrders(true), 6000)
    return () => window.clearInterval(timer)
  }, [status, loadOrders])

  useEffect(() => {
    if (status !== 'ready') return
    const orderParam = new URLSearchParams(window.location.search).get('order')
    if (orderParam) openRef.current = orderParam
    if (openRef.current) {
      const num = openRef.current
      openRef.current = null
      const match = orders.find((o) => o.orderNumber === num)
      if (match) void openDetail(match)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orders])

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setNotifState('unsupported')
      return
    }
    const p = Notification.permission
    setNotifState(p === 'granted' ? 'granted' : p === 'denied' ? 'denied' : 'unknown')
  }, [])

  useEffect(() => {
    if (!cloudEnabled()) return
    void (async () => {
      if (!getAdminToken()) {
        setStatus('need-login')
        return
      }
      const ok = await cloudSession()
      setStatus(ok ? 'ready' : 'need-login')
    })()
  }, [])

  const doLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoginError('')
    const token = await cloudLogin(password)
    if (!token) {
      setLoginError('كلمة المرور غير صحيحة')
      return
    }
    setAdminToken(token)
    setPassword('')
    setStatus('ready')
  }

  const logout = (): void => {
    setAdminToken('')
    setOrders([])
    setStatus('need-login')
  }

  const openDetail = async (summary: CloudOrderSummary): Promise<void> => {
    setDetailLoading(true)
    setSelected({ ...(summary as unknown as CloudOrder), items: [] })
    const full = await fetchCloudOrderDetail(summary.store, summary.orderNumber)
    setSelected(full || null)
    setDetailLoading(false)
  }

  const enableNotifications = async (): Promise<void> => {
    setMessage('')
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setNotifState('unsupported')
      setMessage('المتصفح لا يدعم إشعارات الويب')
      return
    }
    const perm = await Notification.requestPermission()
    setNotifState(perm as 'granted' | 'denied')
    if (perm !== 'granted') {
      setMessage('تم رفض إذن الإشعارات من المتصفح')
      return
    }
    try {
      const base = import.meta.env.BASE_URL || '/'
      const reg = await navigator.serviceWorker.register(`${base}sw.js`, { scope: base })
      await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const sub =
        existing ||
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(ORDERS_CLOUD.vapidPublicKey) as BufferSource }))
      const ok = await savePushSubscription(sub)
      setSubscribed(ok)
      setMessage(ok ? 'تم تفعيل الإشعارات على هذا الجهاز ✓' : 'تعذّر حفظ الاشتراك في الخادم')
    } catch {
      setMessage('تعذّر تفعيل الإشعارات على هذا الجهاز')
    }
  }

  const runTestPush = async (): Promise<void> => {
    setMessage('')
    const result = await sendTestPush()
    if (!result) {
      setMessage('تعذّر إرسال الإشعار التجريبي (تحقق من الدخول)')
      return
    }
    setMessage(result.total === 0 ? 'لا توجد أجهزة مشتركة بعد — فعّل الإشعارات أولاً' : `أُرسل الاختبار إلى ${result.sent}/${result.total} جهاز`)
  }

  return (
    <main className="container-eva ac-wrap glass-scope">
      <style>{styles}</style>

      {status === 'disabled' && (
        <div className="ac-card ac-login">
          <span className="eyebrow"><ShieldCheck size={15} />لوحة المدير</span>
          <h1 style={{ fontSize: 20, margin: 0 }}>الخدمة السحابية غير مُفعّلة بعد</h1>
          <p className="ac-muted">
            انشر خادم Cloudflare (مجلد cloudflare-orders) وضع رابطه في الإعداد، وستعمل هذه اللوحة تلقائياً مع الإشعارات.
          </p>
        </div>
      )}

      {status === 'checking' && <div className="ac-card ac-login"><p className="ac-muted">جارٍ التحقق…</p></div>}

      {status === 'need-login' && (
        <form className="ac-card ac-login" onSubmit={doLogin}>
          <span className="eyebrow"><ShieldCheck size={15} />لوحة المدير</span>
          <h1 style={{ fontSize: 20, margin: 0 }}>تسجيل دخول المدير</h1>
          <p className="ac-muted">أدخل كلمة مرور المدير لعرض الطلبات واستقبال الإشعارات. لا يظهر هذا العنوان للعملاء.</p>
          <input className="ac-input" type="password" dir="ltr" placeholder="كلمة مرور المدير" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          {loginError && <span className="ac-msg">{loginError}</span>}
          <button type="submit" className="ac-btn ac-btn-primary" style={{ justifyContent: 'center' }}>دخول</button>
        </form>
      )}

      {status === 'ready' && (
        <>
          <div className="ac-toolbar">
            <div className="ac-filters">
              <button type="button" className={`ac-chip${filter === 'all' ? ' is-active' : ''}`} onClick={() => setFilter('all')}>الكل</button>
              {STORES.map((s) => (
                <button key={s.id} type="button" className={`ac-chip${filter === s.id ? ' is-active' : ''}`} onClick={() => setFilter(s.id)}>{s.name}</button>
              ))}
            </div>
            <div className="ac-actions">
              <button type="button" className="ac-btn" onClick={() => void loadOrders(false)}><RefreshCw size={14} />تحديث</button>
              <button type="button" className="ac-btn" onClick={() => void enableNotifications()}>{subscribed ? <BellRing size={14} /> : <Bell size={14} />}{subscribed ? 'الإشعارات مُفعّلة' : 'تفعيل الإشعارات'}</button>
              <button type="button" className="ac-btn" onClick={() => void runTestPush()}><Send size={14} />إشعار تجريبي</button>
              <button type="button" className="ac-btn" onClick={logout}><LogOut size={14} />خروج</button>
            </div>
          </div>

          {notifState === 'denied' && <p className="ac-msg">إذن الإشعارات مرفوض — اسمح به من إعدادات المتصفح لهذا الموقع.</p>}
          {message && <p className="ac-msg">{message}</p>}

          <div className="ac-card">
            {orders.length === 0 ? (
              <div className="ac-empty"><Package size={30} /><p>لا توجد طلبات بعد</p></div>
            ) : (
              <div className="ac-list">
                {orders.map((o) => (
                  <button key={`${o.store}:${o.orderNumber}`} type="button" className="ac-row" onClick={() => void openDetail(o)}>
                    <span>
                      <span className="ac-num" dir="ltr">{o.orderNumber}</span>
                      <br />
                      <span className="ac-muted">{storeName(o.store)}</span>
                    </span>
                    <span className="ac-muted">{o.customerName}<br />{o.governorate}</span>
                    <span className="ac-total" dir="ltr">{o.total}</span>
                    <span className="ac-muted" dir="ltr">{new Date(o.receivedAt || o.createdAt).toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selected && (
        <div className="ac-modal" onClick={() => setSelected(null)}>
          <div className="ac-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ac-drawer-head">
              <div>
                <span className="ac-badge">{storeName(selected.store || '')}</span>
                <h2 style={{ fontSize: 18, margin: '8px 0 0' }} dir="ltr">{selected.orderNumber}</h2>
              </div>
              <button type="button" className="ac-close" onClick={() => setSelected(null)} aria-label="إغلاق"><X size={20} /></button>
            </div>

            {detailLoading ? (
              <p className="ac-muted">جارٍ تحميل التفاصيل…</p>
            ) : (
              <>
                <dl className="ac-kv">
                  <dt>العميل</dt><dd>{selected.customerName}</dd>
                  <dt>الهاتف</dt><dd dir="ltr">{selected.phone}</dd>
                  <dt>البريد</dt><dd dir="ltr">{selected.email || '—'}</dd>
                  <dt>العنوان</dt><dd>{[selected.governorate, selected.district, selected.address, selected.landmark].filter(Boolean).join(' - ')}</dd>
                  <dt>ملاحظات</dt><dd>{selected.notes || '—'}</dd>
                  <dt>التاريخ</dt><dd>{new Date(selected.receivedAt || selected.createdAt).toLocaleString('ar-IQ')}</dd>
                </dl>

                <h3 style={{ fontSize: 14, margin: '10px 0' }}>المنتجات</h3>
                {(selected.items || []).map((it, i) => (
                  <div className="ac-item" key={i}>
                    <span>{it.productName}<br /><span className="ac-muted">{it.colorName}{it.size ? ` · ${it.size}` : ''} · ×${it.quantity}</span></span>
                    <span dir="ltr">{it.totalPrice}</span>
                  </div>
                ))}

                <dl className="ac-kv" style={{ marginTop: 16 }}>
                  <dt>المجموع الفرعي</dt><dd dir="ltr">{selected.subtotal}</dd>
                  <dt>التوصيل</dt><dd dir="ltr">{selected.deliveryFee}</dd>
                  <dt><strong>الإجمالي</strong></dt><dd dir="ltr"><strong>{selected.total}</strong></dd>
                </dl>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
