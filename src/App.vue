<template>
  <div id="app">
    <div class="top">
      <img class="logo" src="/static/logo.png">
    </div>
    <div class="middle">
      <radialBar :fraction="fractionOfTimeLeft" :overlayText="overlayText" :strokeColor="primaryButton.bgColor" trailColor="#ABABAB" :size="radialBarSize"></radialBar>
    </div>
    <div class="bottom">
      <mu-raised-button label="RESET" class="resetButton" v-on:click="resetTimer"/>
      <mu-raised-button :label="primaryButton.text" class="primaryButton" v-on:click="primaryButton.callbackFn" :backgroundColor="primaryButton.bgColor"/>
    </div>
    <audio class="audio" ref="audio" src="/static/alarm.mp3" preload="auto" type="audio/mpeg"></audio>
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
      worker: null,
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
    },
    // whenever the document is resized, re-set the 'fullHeight' variable
    handleResize (event) {
      // console.log('h: ' + this.fullHeight + ', w: ' + this.fullWidth)
      // console.log('n_h: ' + document.documentElement.clientHeight + ', n_w: ' + document.documentElement.clientWidth)
      let newRadialBarDivHeight = 77.5 / 100 * document.documentElement.clientWidth
      let newRadialBarDivWidth = document.documentElement.clientWidth

      this.radialBarSize = _.min([newRadialBarDivHeight, newRadialBarDivWidth])
    }
  },
  // bind event handlers to the `_handleResize` method (defined below)
  created: function () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="sass">
#app
  font-family: 'Roboto', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

.top
  height: 10vh
  padding: 3.5vh
  .logo
    width: auto
    height: 100%
    min-height: 24px

.middle
  height: 77.5vh
  display: flex
  justify-content: center
  .radialBar
    align-self: center
    margin: auto

.bottom
  height: 12.5vh
  display: flex
  justify-content: center
  button
    align-self: center
    margin: 0 5px
    font-weight: 500
  .primaryButton
    width: 155px
</style>
