// Configuration Data
const vibratePattern = [100, 50, 100, 50, 100];
const notificationTag = 'pomodori-notification';
const notificationIcon = '/static/icons/icon-192x192.png';
const renotifyOption = 'true';

const supported = () => ('Notification' in window && window.Notification !== undefined);
const isBlocked = () => ('Notification' in window && window.Notification.permission === 'denied');
const isEnabled = () => ('Notification' in window && window.Notification.permission === 'granted');

const requestPermission = () => {
  if (supported() && window.Notification.permission === 'default') {
    window.Notification.requestPermission();
  }
};

const sendNotification = (msgTitle, msgBody) => {
  if (supported() && window.Notification.permission === 'granted') {
    // send notification via service workers (for browsers w/ service worker installed)
    if (navigator.serviceWorker.controller !== null) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(msgTitle, {
          body: msgBody,
          icon: notificationIcon,
          vibrate: vibratePattern,
          tag: notificationTag,
          renotify: renotifyOption,
        });
      });
    } else {
      new window.Notification(msgTitle, { // eslint-disable-line no-new
        body: msgBody,
        icon: notificationIcon,
        vibrate: vibratePattern,
        tag: notificationTag,
        renotify: renotifyOption,
      });
    }

    return true;
  }
  return false;
};

export default {
  supported,
  isBlocked,
  isEnabled,
  requestPermission,
  sendNotification,
};
