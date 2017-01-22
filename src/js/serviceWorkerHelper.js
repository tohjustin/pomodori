// Configuration Data
var swDir = './sw.js'

exports.register = function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(swDir)
        .then(function (registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope) // Registration was successful
        })
        .catch(function (err) {
          console.log('ServiceWorker registration failed: ', err) // registration failed :(
        })
    })
  } else {
    console.log('Service worker not supported')
  }
}
