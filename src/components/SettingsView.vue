<template>
  <div class="settings">
    <mu-appbar title="Settings">
      <mu-icon-button slot="left" class="backButton" icon="arrow_back" v-on:click="backToAppView"/>
    </mu-appbar>
    <mu-list>
      <mu-divider/>
      <mu-list-item :describeText="workDurationText">
        <mu-icon slot="left" value="access_alarm"/>
        <mu-slider :step="60" :min="60" :max="3600" :value="workDuration" v-on:change="updateWorkDuration"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item :describeText="breakDurationText">
        <!-- <mu-icon slot="left" value="snooze"/> -->
        <mu-icon slot="left" value="videogame_asset"/>
        <mu-slider :step="60" :min="60" :max="3600" :value="breakDuration" v-on:change="updateBreakDuration"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item title="Play Alarm Melody">
        <mu-switch slot="right" :value="allowMelody" v-on:change="updateAllowMelody"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item title="Vibrate on alarm">
        <mu-switch slot="right" :value="allowVibration" v-on:change="updateAllowVibration"/>
      </mu-list-item>
      <mu-divider/>
    </mu-list>
  </div>
</template>

<script>
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css' // 使用 carbon 主题
Vue.use(MuseUI)

export default {
  name: 'settings',
  props: {
    workDuration: {
      type: Number,
      required: true
    },
    breakDuration: {
      type: Number,
      required: true
    },
    allowMelody: {
      type: Boolean,
      required: true
    },
    allowVibration: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      myWorkDuration: this.workDuration,
      myBreakDuration: this.breakDuration,
      myAllowMelody: this.allowMelody,
      myAllowVibration: this.allowVibration
    }
  },
  methods: {
    updateWorkDuration (event) {
      this.myWorkDuration = event
    },
    updateBreakDuration (event) {
      this.myBreakDuration = event
    },
    updateAllowMelody (event) {
      this.myAllowMelody = event
    },
    updateAllowVibration (event) {
      this.myAllowVibration = event
    },
    backToAppView () {
      let settings = {
        workDuration: this.myWorkDuration,
        breakDuration: this.myBreakDuration,
        allowMelody: this.myAllowMelody,
        allowVibration: this.myAllowVibration
      }
      this.$emit('change', settings)
    }
  },
  computed: {
    workDurationText: function () {
      return `Work Duration (${this.myWorkDuration / 60} min)`
    },
    breakDurationText: function () {
      // let minuteCount = this.breakDuration / 60
      return `Break Duration (${this.myBreakDuration / 60} min)`
    }
  }
}
</script>

<!--  Style cannot be scoped since we're trying to overwrite Muse-UI component's CSS -->
<style lang="sass">
// Overwrite Muse-UI component css
.mu-appbar
  padding-left: 16px !important
  padding-right: 16px !important
.mu-appbar .backButton
  padding-left: 0px !important
  padding-right: 0px !important
  width: auto !important
.mu-appbar-title
  padding-left: 32px !important
.mu-list
  padding: 0px !important
.mu-item
  padding-top: 10px !important
  padding-bottom: 10px !important
.mu-slider
  margin-bottom: 0px !important
</style>
