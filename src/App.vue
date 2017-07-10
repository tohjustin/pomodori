<template>
  <div id="app">
    <div class="MainView">
      <div class="top">
        <img class="logo" src="/static/img/logo.png" alt="Pomodori Logo">
        <mu-icon-button v-on:click="switchToSettingsView" icon="settings"/>
      </div>
      <div class="middle">
        <radialBar
          :fraction="fractionOfTimeLeft"
          :overlayText="overlayText"
          :size="radialBarSize"
          :strokeColor="primaryButton.bgColor"
          trailColor="#ABABAB"
        />
      </div>
      <div class="bottom">
        <mu-raised-button
          v-on:click="resetTimer"
          label="RESET"
          :color="primaryButton.bgColor"
          class="resetButton"
        />
        <mu-raised-button
          v-on:click="primaryButton.callbackFn"
          :label="primaryButton.text"
          :backgroundColor="primaryButton.bgColor"
          class="primaryButton"
        />
      </div>
    </div>
    <transition name="slide">
      <div class="SettingsView" v-show="showSettingsView">
        <settings
          ref="settings"
          v-on:change="switchToMainView"
          :allowNotification="allowNotification"
          :breakDuration="breakDuration"
          :workDuration="workDuration"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

import radialBar from './components/radialBar';
import settings from './components/SettingsView';

import notifications from './modules/notifications';
import STATE from './modules/stateMachine';
import storage from './modules/storage';

Vue.use(MuseUI);

export default {
  name: 'app',
  components: {
    radialBar,
    settings,
  },
  data() {
    return {
      // app State
      timeRemaining: 1500,
      state: STATE.WORK_START,
      showSettingsView: false,
      // app Settings
      workDuration: 1500,
      breakDuration: 300,
      // allowNotification: true && !notifications.isBlocked(),
      allowNotification: true,
      // worker objects for our timer
      timerWorker: null,
      alarmWorker: null,
      // data used for responsiveness
      radialBarSize: 300,
      // variable to control timer speed
      clockDelay: 1000,
    };
  },
  computed: {
    overlayText() {
      return `${_.chain(this.timeRemaining / 60).floor().padStart(2, '0')}:${_.chain(this.timeRemaining % 60).padStart(2, '0')}`;
    },
    fractionOfTimeLeft() {
      return (this.state.mode === 'work') ? (this.timeRemaining / this.workDuration) : (this.timeRemaining / this.breakDuration);
    },
    // computes the data of the primaryButton at any given [state]
    primaryButton() {
      const primaryBtn = {};
      switch (this.state.status) {
        case 'init': primaryBtn.text = 'START'; break;
        case 'active': primaryBtn.text = 'STOP'; break;
        case 'inactive': primaryBtn.text = 'RESUME'; break;
        default:
      }
      primaryBtn.text += (this.state.mode === 'work') ? ' WORKING' : ' MY BREAK';
      primaryBtn.bgColor = (this.state.mode === 'work') ? '#2196F3' : '#7CB342';
      primaryBtn.callbackFn = (this.state.status === 'active') ?
        () => { this.pauseTimer(); } :
        () => { this.startTimer(); };
      return primaryBtn;
    },
  },
  methods: {
    startTimer() {
      this.state = STATE.START(this.state);

      if (this.timerWorker === null) {
        this.timerWorker = setInterval(() => {
          this.timeRemaining -= 1;
          if (this.timeRemaining <= 0) {
            this.triggerAlarm();
          }
        }, this.clockDelay);
      }
    },
    pauseTimer() {
      this.clearTimeWorker();
      this.state = STATE.PAUSE(this.state);
    },
    resetTimer() {
      this.clearTimeWorker();
      this.state = STATE.RESET(this.state);
      this.timeRemaining = (this.state.mode === 'work') ? this.workDuration : this.breakDuration;
    },
    triggerAlarm() {
      this.clearTimeWorker();
      this.state = STATE.SWITCH(this.state);
      this.timeRemaining = (this.state.mode === 'work') ? this.workDuration : this.breakDuration;
      const startBreakMessage = { title: 'Stop working already!', body: 'Time to start your break...' };
      const backToWorkMessage = { title: 'Your break is over!', body: 'Time to get back to work...' };

      if (this.allowNotification === true) {
        notifications.requestPermission();
        notifications.sendNotification(
          (this.state.mode === 'work') ? backToWorkMessage.title : startBreakMessage.title,
          (this.state.mode === 'work') ? backToWorkMessage.body : startBreakMessage.body,
        );
      }
    },
    switchToSettingsView() {
      this.pauseTimer();
      this.showSettingsView = true;
    },
    switchToMainView(event) {
      this.workDuration = event.workDuration;
      this.breakDuration = event.breakDuration;
      this.allowNotification = event.allowNotification;
      this.resetTimer();
      this.showSettingsView = false;
    },
    // [PRIVATE] terminates the timerWorker
    clearTimeWorker() {
      clearInterval(this.timerWorker);
      this.timerWorker = null;
    },
    // [PRIVATE] helper method to access STATE object
    getStateHelper() {
      return STATE;
    },
    // [PRIVATE] callback for WINDOW_RESIZE event,
    //           resizes the radialBar component for the new viewport dimension
    handleResize() {
      const paddingPercentage = 0.2;
      const newRadialBarDivHeight = 0.75 * document.documentElement.clientHeight;
      const newRadialBarDivWidth = document.documentElement.clientWidth;

      this.radialBarSize =
        _.min([newRadialBarDivHeight, newRadialBarDivWidth])
        * (1 - paddingPercentage);
    },
  },
  mounted() {
    // Listener to resize our radialBar when user changes the browser window size
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    // Configure storage settings (required by localforage)
    storage.configStorage();

    // Load user settings from storage module
    storage.loadSettings()
      .then((userSettings) => {
        if (!_.isNull(userSettings)) {
          const { workDuration, breakDuration, allowNotification } = userSettings;
          this.workDuration = workDuration;
          this.breakDuration = breakDuration;
          this.allowNotification = allowNotification;

          // Update `timeRemaining` to newly loaded `workDuration`
          this.timeRemaining = workDuration;
        }
      })
      .catch(() => {});

    // Request for permission to send local notifications
    notifications.requestPermission();
  },
  // remove event handler before the component is destroyed
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
};
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
