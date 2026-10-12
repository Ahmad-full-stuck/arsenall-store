/* Service worker: receives Web Push notifications for new orders (manager only). */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: 'طلب جديد', body: event.data ? event.data.text() : '' }
  }
  const payload = data.data || {}
  const orderNumber = payload.orderNumber || ''
  const title = data.title || 'طلب جديد'
  const options = {
    body: data.body || '',
    dir: 'rtl',
    lang: 'ar',
    tag: orderNumber || 'order',
    renotify: true,
    requireInteraction: true,
    icon: 'favicon.svg',
    badge: 'favicon.svg',
    data: { orderNumber, url: payload.url || '' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const info = event.notification.data || {}
  const base = self.registration.scope
  let target = info.url
  if (!target) {
    target = base + '#/admin-console' + (info.orderNumber ? `?order=${encodeURIComponent(info.orderNumber)}` : '')
  }
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.navigate) client.navigate(target)
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
      return undefined
    }),
  )
})
