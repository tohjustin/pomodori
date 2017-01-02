/* eslint-disable no-undef */
var CACHE_NAME = 'pomodori-pwa'
// var urlsToCache = [
//   '/',
//   '/index.html'
// ]
self.addEventListener('install', event => {
  console.log('Installed')

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        // fetch('static/webpack-assets.json')
          // .then(response => response.json())
          // .then(assets =>
            cache.addAll([
              '/',
              '/index.html',
              '/app.js',
              '/static/Alarm.mp3'
              // assets.manifest.js,
              // assets.app.js,
              // assets.app.css,
              // assets.vendor.js,
              // assets.app.css
            ])
          // )
          // .catch(response => {
          //   console.log(`Fail to fetch webpack-assets.json ${response}`)
          // })
      ).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  // Return cached content if there's a cache hit
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cacheableRequestFailingToCacheStrategy({ event, cache }))
  )
})

let cacheableRequestFailingToCacheStrategy = ({ event, cache }) => {
  return fetch(event.request)
    .then(throwOnError) // do not cache errors
    .then(response => {
      cache.put(event.request, response.clone())
      return response
    })
    .catch(() => cache.match(event.request))
}

// Prevent cache being polluted with failure responses
let throwOnError = response => {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText)
  }
  return response
}
