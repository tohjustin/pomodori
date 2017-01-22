
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import notificationHelper from './js/notificationHelper'
import serviceWorkerHelper from './js/serviceWorkerHelper'

serviceWorkerHelper.register() // Register Service Worker
notificationHelper.requestPermission() // Request for permission to send local notifications

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
