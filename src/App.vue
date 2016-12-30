<template>
  <div id="App">
    <div v-show="showSettingsView === false">
      <div class="top">
        <img class="logo" src="/static/logo.png">
        <mu-icon-button v-on:click="switchToSettingsView" icon="settings"/>
      </div>
      <div class="middle">
        <radialBar :fraction="fractionOfTimeLeft" :overlayText="overlayText" :strokeColor="primaryButton.bgColor" trailColor="#ABABAB" :size="radialBarSize"></radialBar>
      </div>
      <div class="bottom">
        <mu-raised-button label="RESET" :color="primaryButton.bgColor" class="resetButton" v-on:click="resetTimer"/>
        <mu-raised-button :label="primaryButton.text" :backgroundColor="primaryButton.bgColor" class="primaryButton" v-on:click="primaryButton.callbackFn" />
      </div>
      <audio class="audio" ref="audio" src="/static/alarm.mp3" preload="auto" type="audio/mpeg"></audio>
    </div>
    <div v-show="showSettingsView === true">
      <settings ref="settings" :workDuration="workDuration" :breakDuration="breakDuration" :allowMelody="allowMelody" :allowVibration="allowVibration" v-on:change="switchToMainView"><settings>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import radialBar from './components/radialBar'
import settings from './components/SettingsView'

import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)

// Helper Object to manage STATE
const STATE = {
  WORK_START: 'WORK_START_STATE',
  WORK: 'WORK_STATE',
  WORK_PAUSED: 'WORK_PAUSED_STATE',
  BREAK_START: 'BREAK_START_STATE',
  BREAK: 'BREAK_STATE',
  BREAK_PAUSE: 'BREAK_PAUSE_STATE',
  GET_MODE: (inputState) => { return (inputState === STATE.WORK_START || inputState === STATE.WORK || inputState === STATE.WORK_PAUSED) ? 'WORK' : 'BREAK' },
  START: (inputState) => { return (STATE.GET_MODE(inputState) === 'WORK') ? STATE.WORK : STATE.BREAK },
  PAUSE: (inputState) => { return (STATE.GET_MODE(inputState) === 'WORK') ? STATE.WORK_PAUSED : STATE.BREAK_PAUSED },
  RESET: (inputState) => { return (STATE.GET_MODE(inputState) === 'WORK') ? STATE.WORK_START : STATE.BREAK_START },
  SWITCH: (inputState) => { return (STATE.GET_MODE(inputState) === 'BREAK') ? STATE.WORK_START : STATE.BREAK_START }
}

export default {
  name: 'App',
  components: {
    radialBar,
    settings
  },
  data () {
    return {
      timeRemaining: 2,
      workDuration: 1500,
      breakDuration: 300,
      state: STATE.WORK_START,
      worker: null,
      allowMelody: false,
      allowVibration: false,
      showSettingsView: false,
      // Data used for responsiveness
      radialBarSize: 300
    }
  },
  computed: {
    overlayText: function () {
      return _.chain(this.timeRemaining / 60).floor().padStart(2, '0') + ':' + _.chain(this.timeRemaining % 60).padStart(2, '0')
    },
    fractionOfTimeLeft: function () {
      if (this.state === STATE.WORK_START || this.state === STATE.WORK || this.state === STATE.WORK_PAUSED) {
        return this.timeRemaining / this.workDuration
      } else {
        return this.timeRemaining / this.breakDuration
      }
    },
    // Computes the data of the primaryButton at any given [state]
    primaryButton: function () {
      switch (this.state) {
        case STATE.WORK_START:
          return { text: 'START WORKING', bgColor: '#2196F3', callbackFn: () => { this.startTimer() } }
        case STATE.WORK:
          return { text: 'STOP WORKING', bgColor: '#2196F3', callbackFn: () => { this.pauseTimer() } }
        case STATE.WORK_PAUSED:
          return { text: 'RESUME WORKING', bgColor: '#2196F3', callbackFn: () => { this.startTimer() } }
        case STATE.BREAK_START:
          return { text: 'START MY BREAK', bgColor: '#7CB342', callbackFn: () => { this.startTimer() } }
        case STATE.BREAK:
          return { text: 'STOP MY BREAK', bgColor: '#7CB342', callbackFn: () => { this.pauseTimer() } }
        case STATE.BREAK_PAUSED:
          return { text: 'RESUME MY BREAK', bgColor: '#7CB342', callbackFn: () => { this.startTimer() } }
        default:
          return { text: 'ERROR', bgColor: '#FFFFFF', callbackFn: () => {} } // Error
      }
    }
  },
  methods: {
    startTimer: function () {
      // Workaround to get browsers to play audio on mobile devices (requires user interaction to download sound file)
      this._preloadAudio()

      this.state = STATE.START(this.state)
      this._stopAlarm()

      if (this.worker === null) {
        this.worker = setInterval(() => {
          this.timeRemaining--
          if (this.timeRemaining <= 0) {
            this.triggerAlarm()
          }
        }, 1000)
      }
    },
    pauseTimer: function () {
      this._clearWorker()
      this.state = STATE.PAUSE(this.state)
    },
    resetTimer: function () {
      this._clearWorker()
      this.state = STATE.RESET(this.state)
      this.timeRemaining = (STATE.GET_MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
      this._stopAlarm()
    },
    triggerAlarm: function () {
      this._clearWorker()
      this.state = STATE.SWITCH(this.state)
      this.timeRemaining = (STATE.GET_MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
      if (this.allowMelody) {
        this._ringAlarm()
      }
    },
    switchToSettingsView: function () {
      this.pauseTimer()
      this.showSettingsView = true
    },
    switchToMainView: function (event) {
      this.workDuration = event.workDuration
      this.breakDuration = event.breakDuration
      this.allowMelody = event.allowMelody
      this.allowVibration = event.allowVibration
      this.resetTimer()
      this.showSettingsView = false
    },
    // [PRIVATE] Removes & clear the setInterval() function used to decrement the time
    _clearWorker: function () {
      clearInterval(this.worker)
      this.worker = null
    },
    // [PRIVATE] helper method to access STATE object
    _getStateHelper: function () {
      return STATE
    },
    // [PRIVATE] Controls the HTML5 Audio element to ring the alarm
    _ringAlarm: function () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    // [PRIVATE] Controls the HTML5 Audio element to stop the alarm (if it's ringing)
    _stopAlarm: function () {
      if (!this.$refs.audio.paused) {
        this.$refs.audio.pause()
      }
    },
    // [PRIVATE] Workaround to get browsers to play audio on mobile devices (requires user interaction to download sound file)
    _preloadAudio () {
      this.$refs.audio.play()
      this.$refs.audio.pause()
    },
    // [PRIVATE] Callback for WINDOW_RESIZE event, resizes the radialBar component for the new viewport dimension
    _handleResize (event) {
      const paddingPercentage = 0.2
      let newRadialBarDivHeight = 75 / 100 * document.documentElement.clientHeight
      let newRadialBarDivWidth = document.documentElement.clientWidth

      this.radialBarSize = _.min([newRadialBarDivHeight, newRadialBarDivWidth]) * (1 - paddingPercentage)
    }
  },
  // Bind event handlers to the `_handleResize` method
  created: function () {
    window.addEventListener('resize', this._handleResize)
    this._handleResize()
  },
  // Remove event handler before the component is destroyed
  beforeDestroy: function () {
    window.removeEventListener('resize', this._handleResize)
  }
}
</script>

<style lang="sass" scoped>
#App
  font-family: 'Roboto', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

.top
  height: 10vh
  padding: 2vh
  display: flex
  justify-content: space-between
  .logo
    width: auto
    height: 24px
    margin: 12px 10px

.middle
  height: 75vh
  display: flex
  justify-content: center
  .radialBar
    align-self: center
    margin: auto

.bottom
  height: 15vh
  display: flex
  justify-content: center
  button
    align-self: center
    margin: 0 5px
    font-weight: 500
  .resetButton
    color: #7cb342
</style>
