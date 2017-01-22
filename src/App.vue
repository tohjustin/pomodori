<template>
  <div id="app">
    <div class="MainView">
      <div class="top">
        <img class="logo" src="/static/logo.png" alt="Pomodori Logo">
        <mu-icon-button v-on:click="switchToSettingsView" icon="settings"/>
      </div>
      <div class="middle">
        <radialBar :fraction="fractionOfTimeLeft" :overlayText="overlayText" :strokeColor="primaryButton.bgColor" trailColor="#ABABAB" :size="radialBarSize"/>
      </div>
      <div class="bottom">
        <mu-raised-button label="RESET" :color="primaryButton.bgColor" class="resetButton" v-on:click="resetTimer"/>
        <mu-raised-button :label="primaryButton.text" :backgroundColor="primaryButton.bgColor" class="primaryButton" v-on:click="primaryButton.callbackFn"/>
      </div>
    </div>
    <transition name="slide">
      <div class="SettingsView" v-show="showSettingsView">
        <settings ref="settings" :workDuration="workDuration" :breakDuration="breakDuration" :allowNotification="allowNotification" v-on:change="switchToMainView"/>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)

import * as _ from 'lodash'
import radialBar from './components/radialBar'
import settings from './components/SettingsView'
import notificationHelper from './js/notificationHelper'

// helper object to manage our app's state
const STATE = {
  WORK_START: { mode: 'work', status: 'init' },
  WORK: { mode: 'work', status: 'active' },
  WORK_PAUSED: { mode: 'work', status: 'inactive' },
  BREAK_START: { mode: 'break', status: 'init' },
  BREAK: { mode: 'break', status: 'active' },
  BREAK_PAUSED: { mode: 'break', status: 'inactive' },
  GET_MODE: (inputState) => { return inputState.mode },
  GET_STATUS: (inputState) => { return inputState.status },
  START: (inputState) => {
    let temp = _.clone(inputState)
    temp.status = 'active'
    return temp
  },
  PAUSE: (inputState) => {
    let temp = _.clone(inputState)
    temp.status = 'inactive'
    return temp
  },
  RESET: (inputState) => {
    let temp = _.clone(inputState)
    temp.status = 'init'
    return temp
  },
  SWITCH: (inputState) => {
    let temp = _.clone(inputState)
    temp.mode = (temp.mode === 'break') ? 'work' : 'break'
    temp.status = 'init'
    return temp
  }
}

export default {
  name: 'app',
  components: {
    radialBar,
    settings
  },
  data () {
    return {
      // app State
      timeRemaining: 10,
      state: STATE.WORK_START,
      showSettingsView: false,
      // app Settings
      workDuration: 1500,
      breakDuration: 300,
      allowNotification: true && !notificationHelper.isBlocked(),
      // worker objects for our timer
      timerWorker: null,
      alarmWorker: null,
      // data used for responsiveness
      radialBarSize: 300,
      // variable to control timer speed
      clockDelay: 1000
    }
  },
  computed: {
    overlayText: function () {
      return _.chain(this.timeRemaining / 60).floor().padStart(2, '0') + ':' + _.chain(this.timeRemaining % 60).padStart(2, '0')
    },
    fractionOfTimeLeft: function () {
      return (this.state.mode === 'work') ? (this.timeRemaining / this.workDuration) : (this.timeRemaining / this.breakDuration)
    },
    // computes the data of the primaryButton at any given [state]
    primaryButton: function () {
      let primaryBtn = {}
      switch (this.state.status) {
        case 'init': primaryBtn.text = 'START'; break
        case 'active': primaryBtn.text = 'STOP'; break
        case 'inactive': primaryBtn.text = 'RESUME'; break
      }
      primaryBtn.text += (this.state.mode === 'work') ? ' WORKING' : ' MY BREAK'
      primaryBtn.bgColor = (this.state.mode === 'work') ? '#2196F3' : '#7CB342'
      primaryBtn.callbackFn = (this.state.status === 'active') ? () => { this.pauseTimer() } : () => { this.startTimer() }
      return primaryBtn
    }
  },
  methods: {
    startTimer: function () {
      this.state = STATE.START(this.state)

      if (this.timerWorker === null) {
        this.timerWorker = setInterval(() => {
          this.timeRemaining--
          if (this.timeRemaining <= 0) {
            this.triggerAlarm()
          }
        }, this.clockDelay)
      }
    },
    pauseTimer: function () {
      this._clearTimeWorker()
      this.state = STATE.PAUSE(this.state)
    },
    resetTimer: function () {
      this._clearTimeWorker()
      this.state = STATE.RESET(this.state)
      this.timeRemaining = (this.state.mode === 'work') ? this.workDuration : this.breakDuration
    },
    triggerAlarm: function () {
      this._clearTimeWorker()
      this.state = STATE.SWITCH(this.state)
      this.timeRemaining = (this.state.mode === 'work') ? this.workDuration : this.breakDuration

      var startBreakMessage = { title: 'Stop working already!', body: 'Time to start your break...' }
      var backToWorkMessage = { title: 'Your break is over!', body: 'Time to get back to work...' }
      if (this.allowNotification === true) {
        notificationHelper.requestPermission()
        notificationHelper.sendNotification(
          (this.state.mode === 'work') ? backToWorkMessage.title : startBreakMessage.title,
          (this.state.mode === 'work') ? backToWorkMessage.body : startBreakMessage.body
        )
      }
    },
    switchToSettingsView: function () {
      this.pauseTimer()
      this.showSettingsView = true
    },
    switchToMainView: function (event) {
      this.workDuration = event.workDuration
      this.breakDuration = event.breakDuration
      this.allowNotification = event.allowNotification
      this.resetTimer()
      this.showSettingsView = false
    },
    // [PRIVATE] terminates the timerWorker
    _clearTimeWorker: function () {
      clearInterval(this.timerWorker)
      this.timerWorker = null
    },
    // [PRIVATE] helper method to access STATE object
    _getStateHelper: function () {
      return STATE
    },
    // [PRIVATE] sends browser notification
    _sendNotification: function (msg) {
    },
    // [PRIVATE] callback for WINDOW_RESIZE event, resizes the radialBar component for the new viewport dimension
    _handleResize (event) {
      const paddingPercentage = 0.2
      let newRadialBarDivHeight = 75 / 100 * document.documentElement.clientHeight
      let newRadialBarDivWidth = document.documentElement.clientWidth

      this.radialBarSize = _.min([newRadialBarDivHeight, newRadialBarDivWidth]) * (1 - paddingPercentage)
    }
  },
  created: function () {
    // bind event handlers to the `_handleResize` method
    window.addEventListener('resize', this._handleResize)
    this._handleResize()
  },
  // remove event handler before the component is destroyed
  beforeDestroy: function () {
    window.removeEventListener('resize', this._handleResize)
  }
}
</script>

<style lang="sass">
#app
  font-family: 'Roboto', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

.MainView .top
  height: 10vh
  padding: 2vh
  display: flex
  justify-content: space-between
  .logo
    width: auto
    height: 24px
    margin: 12px 10px

.MainView .middle
  height: 75vh
  display: flex
  justify-content: center
  .radialBar
    align-self: center
    margin: auto

.MainView .bottom
  height: 15vh
  display: flex
  justify-content: center
  button
    align-self: center
    margin: 0 5px
    font-weight: 500
  .resetButton
    color: #7cb342

.SettingsView
  height: 100vh
  width: 100vw
  position: absolute
  top: 0px
  left: 0px
  z-index: 100
  background-color: white

// SettingsView Transition Styling
.slide-enter-active, .slide-leave-active
  transition: all 0.25s ease
.slide-enter, .slide-leave-active
  transform: translateX(100vw)
</style>
