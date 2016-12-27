<template>
  <div id="app">
    <div class="top">
      <img class="logo" src="/static/logo.png">
    </div>
    <div class="middle">
      <radialBar :fraction="fractionOfTimeLeft" :overlayText="overlayText" :strokeColor="primaryButton.bgColor" trailColor="#ABABAB" :size="300"></radialBar>
    </div>
    <div class="bottom">
      <mu-raised-button label="RESET" class="resetButton" v-on:click="resetTimer"/>
      <mu-raised-button :label="primaryButton.text" class="primaryButton" v-on:click="primaryButton.callbackFn" :backgroundColor="primaryButton.bgColor"/>
    </div>
    <audio class="audio" ref="audio" src="/static/Alarm.mp3" preload="auto" type="audio/mpeg"></audio>
  </div>
</template>

<script>
import * as _ from 'lodash'
import radialBar from './components/radialBar'
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
  name: 'app',
  components: {
    radialBar
  },
  data () {
    return {
      timeRemaining: 2,
      workDuration: 1500,
      breakDuration: 300,
      state: STATE.WORK_START,
      worker: null
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
    primaryButton: function () {
      switch (this.state) {
        case STATE.WORK_START:
          return { text: 'START WORKING', bgColor: '#2196F3', callbackFn: () => { this.startTimer() } }
        case STATE.WORK:
          return { text: 'STOP WORKING', bgColor: '#2196F3', callbackFn: () => { this.pauseTimer() } }
        case STATE.WORK_PAUSED:
          return { text: 'RESUME WORKING', bgColor: '#2196F3', callbackFn: () => { this.startTimer() } }
        case STATE.BREAK_START:
          return { text: 'START MY BREAK', bgColor: '#A5D173', callbackFn: () => { this.startTimer() } }
        case STATE.BREAK:
          return { text: 'STOP MY BREAK', bgColor: '#A5D173', callbackFn: () => { this.pauseTimer() } }
        case STATE.BREAK_PAUSED:
          return { text: 'RESUME MY BREAK', bgColor: '#A5D173', callbackFn: () => { this.startTimer() } }
        default:
          return { text: 'ERROR', bgColor: '#FFFFFF', callbackFn: () => {} } // Error
      }
    }
  },
  methods: {
    clearWorker: function () {
      clearInterval(this.worker)
      this.worker = null
    },
    startTimer: function () {
      // Check STATE
      this.state = STATE.START(this.state)
      this._stopAlarm()

      if (this.worker === null) {
        this.worker = setInterval(() => {
          this.timeRemaining--
          if (this.timeRemaining <= 0) {
            this.switchMode()
          }
        }, 1000)
      }
    },
    pauseTimer: function () {
      this.clearWorker()
      this.state = STATE.PAUSE(this.state)
    },
    resetTimer: function () {
      this.clearWorker()
      this.state = STATE.RESET(this.state)
      this.timeRemaining = (STATE.GET_MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
      this._stopAlarm()
    },
    switchMode: function () {
      this.clearWorker()
      this.state = STATE.SWITCH(this.state)
      this.timeRemaining = (STATE.GET_MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
      this._ringAlarm()
    },
    // Private helper method to access STATE object
    _getStateHelper: function () {
      return STATE
    },
    _ringAlarm: function () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    _stopAlarm: function () {
      this.$refs.audio.pause()
    }
  }
}
</script>

<style lang="sass">
#app
  font-family: 'Roboto', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: left

.top
  height: 10vh
  padding: 3vh
  .logo
    max-width: 100%
    max-height: 100%

.middle
  height: 80vh
  .radialBar
      height: 300px
      width: 300px
      margin: auto

.bottom
  height: 10vh
  padding: 10px 0px
  text-align: center
  button
    margin: 0 5px
    font-weight: 500
</style>
