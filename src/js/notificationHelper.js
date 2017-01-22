// Configuration Data
var vibratePattern = [100, 50, 100, 50, 100]
var notificationTag = 'pomodori-notification'
var notificationIcon = '/static/icons/icon-192x192.png'
var renotifyOption = 'true'

var _supported = function () { return ('Notification' in window && window.Notification !== undefined) }
var _isBlocked = function () { return ('Notification' in window && window.Notification.permission === 'denied') }
var _isEnabled = function () { return ('Notification' in window && window.Notification.permission === 'granted') }

exports.supported = function () { return _supported() }
exports.isBlocked = function () { return _isBlocked() }
exports.isEnabled = function () { return _isEnabled() }

exports.requestPermission = function () {
  if (_supported() && window.Notification.permission === 'default') {
    window.Notification.requestPermission()
  }
}

exports.sendNotification = function (msgTitle, msgBody) {
  if (_supported() && window.Notification.permission === 'granted') {
    // send notification via service workers (for browsers w/ service worker installed)
    if (navigator.serviceWorker.controller !== null) {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(msgTitle, {
          body: msgBody,
          icon: notificationIcon,
          vibrate: vibratePattern,
          tag: notificationTag,
          renotify: renotifyOption
        })
      })
    } else {
      new window.Notification(msgTitle, { // eslint-disable-line no-new
        'body': msgBody,
        'icon': notificationIcon,
        'vibrate': vibratePattern,
        'tag': notificationTag,
        'renotify': renotifyOption
      })
    }
    return true
  }
  return false
}
