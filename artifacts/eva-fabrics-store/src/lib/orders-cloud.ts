// Cloud order backend (Cloudflare Worker) + Web Push configuration.
// After deploying the worker, set `apiUrl` to its URL (see DEPLOY.md) — until
// then everything here stays inert and the store keeps working as before.

export const ORDERS_CLOUD = {
  apiUrl: (import.meta.env.VITE_ORDERS_API as string | undefined) || '',
  storeId: 'arsenall',
  token: '__STORE_TOKEN__',
  vapidPublicKey: 'BJssVonGGp_qBtx4gEGxPm30sjQFlJOEMkI5MYY8DTl8GW9eCAWwwhxe1iieyqKo_fcxklaw3VL6XDyZ5fkX5TU',
}

const tokenKey = `${ORDERS_CLOUD.storeId}-orders-token`

export const cloudEnabled = (): boolean => Boolean(ORDERS_CLOUD.apiUrl && ORDERS_CLOUD.token)

export interface CloudOrderItem {
  productName: string
  colorName: string
  size?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface CloudOrder {
  orderNumber: string
  store?: string
  createdAt: string
  receivedAt?: string
  customerName: string
  phone: string
  email?: string
  governorate: string
  district?: string
  address?: string
  landmark?: string
  notes?: string
  items: CloudOrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

export interface CloudOrderSummary {
  orderNumber: string
  store: string
  createdAt: string
  receivedAt: string
  customerName: string
  governorate: string
  total: number
  itemCount: number
}

export function getAdminToken(): string {
  try {
    return window.localStorage.getItem(tokenKey) || ''
  } catch {
    return ''
  }
}

export function setAdminToken(token: string): void {
  try {
    if (token) window.localStorage.setItem(tokenKey, token)
    else window.localStorage.removeItem(tokenKey)
  } catch {
    /* ignore */
  }
}

function api(path: string): string {
  return `${ORDERS_CLOUD.apiUrl.replace(/\/+$/, '')}${path}`
}

export async function sendOrderToCloud(order: CloudOrder): Promise<boolean> {
  if (!cloudEnabled()) return false
  try {
    const res = await fetch(api('/api/order'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store: ORDERS_CLOUD.storeId, token: ORDERS_CLOUD.token, order }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function cloudLogin(password: string): Promise<string | null> {
  try {
    const res = await fetch(api('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { token?: string }
    return data.token || null
  } catch {
    return null
  }
}

export async function cloudSession(): Promise<boolean> {
  const token = getAdminToken()
  if (!token) return false
  try {
    const res = await fetch(api('/api/session'), { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return false
    const data = (await res.json()) as { authed?: boolean }
    return data.authed === true
  } catch {
    return false
  }
}

async function authed(path: string, init: RequestInit = {}): Promise<Response | null> {
  const token = getAdminToken()
  if (!token) return null
  try {
    return await fetch(api(path), {
      ...init,
      headers: { ...(init.headers || {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
  } catch {
    return null
  }
}

export async function fetchCloudOrders(store?: string): Promise<CloudOrderSummary[]> {
  const res = await authed(`/api/orders${store ? `?store=${encodeURIComponent(store)}` : ''}`)
  if (!res || !res.ok) return []
  const data = (await res.json()) as { orders?: CloudOrderSummary[] }
  return data.orders || []
}

export async function fetchCloudOrderDetail(store: string, orderNumber: string): Promise<CloudOrder | null> {
  const res = await authed(`/api/order/${encodeURIComponent(store)}/${encodeURIComponent(orderNumber)}`)
  if (!res || !res.ok) return null
  const data = (await res.json()) as { order?: CloudOrder }
  return data.order || null
}

export async function savePushSubscription(subscription: PushSubscription): Promise<boolean> {
  const json = subscription.toJSON()
  const res = await authed('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      store: 'all',
      label: navigator.userAgent.slice(0, 80),
      subscription: { endpoint: json.endpoint, keys: json.keys },
    }),
  })
  return Boolean(res && res.ok)
}

export async function sendTestPush(): Promise<{ sent: number; total: number } | null> {
  const res = await authed('/api/test-push', { method: 'POST', body: '{}' })
  if (!res || !res.ok) return null
  return (await res.json()) as { sent: number; total: number }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}
