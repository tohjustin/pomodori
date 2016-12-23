<template>
  <div id="app">
    <radialBar :fraction="fractionOfTimeLeft" :overlayText="overlayText" :strokeColor="primaryButton.bgColor" trailColor="#ABABAB"></radialBar>
    <button v-on:click="resetTimer">RESET</button>
    <button v-on:click="primaryButton.callbackFn" :style="{ 'background-color' : primaryButton.bgColor }">{{ primaryButton.text }}</button>
  </div>
</template>

<script>
import * as _ from 'lodash'
import radialBar from './components/radialBar'

// Helper Object to manage STATE
const STATE = {
  WORK_START: 0,
  WORK: 1,
  WORK_PAUSED: 2,
  BREAK_START: 3,
  BREAK: 4,
  BREAK_PAUSE: 5,
  MODE: (inputState) => { return (inputState === STATE.WORK_START || inputState === STATE.WORK || inputState === STATE.WORK_PAUSED) ? 'WORK' : 'BREAK' },
  START: (inputState) => { return (STATE.MODE(inputState) === 'WORK') ? STATE.WORK : STATE.BREAK },
  PAUSE: (inputState) => { return (STATE.MODE(inputState) === 'WORK') ? STATE.WORK_PAUSED : STATE.BREAK_PAUSED },
  RESET: (inputState) => { return (STATE.MODE(inputState) === 'WORK') ? STATE.WORK_START : STATE.BREAK_START },
  SWITCH: (inputState) => { return (STATE.MODE(inputState) === 'BREAK') ? STATE.WORK_START : STATE.BREAK_START }
}

export default {
  name: 'app',
  components: {
    radialBar
  },
  data () {
    return {
      timeRemaining: 2,
      workDuration: 300,
      breakDuration: 100,
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
          throw new Error('Unknown State')
      }
    }
  },
  methods: {
    startTimer: function () {
      // Check STATE
      this.state = STATE.START(this.state)

      if (this.worker === null) {
        this.worker = setInterval(() => {
          this.timeRemaining--
          if (this.timeRemaining <= 0) {
            this.clearWorker()
            this.state = STATE.SWITCH(this.state)
            this.timeRemaining = (STATE.MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
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
      this.timeRemaining = (STATE.MODE(this.state) === 'WORK') ? this.workDuration : this.breakDuration
    },
    clearWorker: function () {
      clearInterval(this.worker)
      this.worker = null
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
</style>
