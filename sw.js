/**
 * Service Worker - 清理版（一次性）
 * 部署后用户访问一次，旧缓存就被彻底清掉，然后 SW 自卸载。
 */

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      for (const name of names) {
        await caches.delete(name)
      }
      const clients = await self.clients.matchAll({ includeUncontrolled: true })
      for (const client of clients) {
        client.postMessage({ type: 'SW_CLEANUP_DONE' })
      }
      await self.registration.unregister()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
