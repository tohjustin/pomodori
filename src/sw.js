/* eslint-disable no-undef */
const CACHE_NAME = 'pomodori-pwa'

const urlsToCache = [
  '/',
  '/sw.js',
  '/index.html',
  '/manifest.json',
  '/static/alarm.mp3',
  '/static/logo.png',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v19/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2'
]

let generatePrecacheList = (assetJson, urlArray) => {
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
            cache.addAll(generatePrecacheList(assets, urlsToCache))
            // let listOfItemsToCache = _.chain(assets).values().join(urlsToCache).uniq()
            // cache.addAll(listOfItemsToCache)
            // cache.addAll([
            //   '/',
            //   '/sw.js',
            //   '/index.html',
            //   '/manifest.json',
            //   '/static/alarm.mp3',
            //   '/static/logo.png',
            //   'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
            // ])
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
  // Don't intercept requests to google analytics
  if (event.request.url.startsWith('https://www.google-analytics.com/')) {
    return fetch(event.request)
  } else {
    // Return cached content if there's a cache hit
    event.respondWith(
      caches.open(CACHE_NAME)
        .then(cache => cacheableRequestFailingToCacheStrategy({ event, cache }))
    )
  }
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
