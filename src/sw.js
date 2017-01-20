/* eslint-disable no-undef */
const CACHE_NAME = 'pomodori-pwa'

const urlsToCache = [
  '/',
  '/sw.js',
  '/index.html',
  '/manifest.json',
  // '/static/alarm.mp3',
  '/static/logo.png',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v19/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2'
]

// Combine the list of files contained in our "assetJson" & "urlsToCache"
let _generatePrecacheList = (assetJson, urlArray) => {
  return urlArray.concat(Object.keys(assetJson).map(function (val) { return assetJson[val] }))
}

self.addEventListener('install', event => {
  console.log('Installed')

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        fetch('asset-manifest.json')
          .then(response => response.json())
          .then(assets => {
            cache.addAll(_generatePrecacheList(assets, urlsToCache))
          })
          .catch(response => {
            console.log('Fail to fetch asset-manifest.json!')
            console.log(response)
          })
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
      .then(cache => _cacheableRequestFailingToCacheStrategy({ event, cache }))
  )
})

let _cacheableRequestFailingToCacheStrategy = ({ event, cache }) => {
  return fetch(event.request)
    .then(_throwOnError) // do not cache errors
    .then(response => {
      cache.put(event.request, response.clone())
      return response
    })
    .catch(() => cache.match(event.request))
}

// Prevent cache being polluted with failure responses
let _throwOnError = response => {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText)
  }
  return response
}
