<template>
  <div class="settings">
    <mu-appbar title="Settings">
      <mu-icon-button slot="left" class="backButton" icon="arrow_back" v-on:click="backToAppView"/>
    </mu-appbar>
    <mu-list>
      <mu-divider/>
      <mu-list-item :describeText="myWorkDuration | toMinutes('Work Duration')">
        <mu-icon slot="left" value="access_alarm"/>
        <mu-slider :step="60" :min="60" :max="3600" v-model="myWorkDuration"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item :describeText="myBreakDuration | toMinutes('Break Duration')">
        <mu-icon slot="left" value="videogame_asset"/>
        <mu-slider :step="60" :min="60" :max="3600" v-model="myBreakDuration"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item title="Play Alarm Melody">
        <mu-switch slot="right" v-model="myAllowMelody"/>
      </mu-list-item>
      <mu-divider/>
      <mu-list-item title="Vibrate on alarm" :describeText="vibrationSupported ? 'Your browser supports vibration' : 'Your browser doesn\'t support vibration'">
        <mu-switch slot="right" v-model="myAllowVibration" :disabled="!vibrationSupported"/>
      </mu-list-item>
      <mu-divider/>
    </mu-list>
  </div>
</template>

<script>
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)

export default {
  name: 'settings',
  props: {
    workDuration: { type: Number, required: true },
    breakDuration: { type: Number, required: true },
    allowMelody: { type: Boolean, required: true },
    allowVibration: { type: Boolean, required: true }
  },
  data () {
    return {
      myWorkDuration: this.workDuration,
      myBreakDuration: this.breakDuration,
      myAllowMelody: this.allowMelody,
      myAllowVibration: this.allowVibration,
      vibrationSupported: false
    }
  },
  methods: {
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
  filters: {
    toMinutes: function (value, text) {
      return `${text} (${value / 60} min)`
    }
  },
  created: function () {
    // Check if browser supports HTML5 Vibration API
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate
    let vibrationSupported = ('vibrate' in navigator && navigator.vibrate !== undefined)

    this.vibrationSupported = vibrationSupported
    this.myAllowVibration = this.myAllowVibration && vibrationSupported
  }
}
</script>

<style lang="less">
@import "./../muse-ui-theme/vars.less";
@import "./../muse-ui-theme/theme-vars.less";
@import "./../muse-ui-theme/theme.less";

// Overwrite Muse-UI's CSS
.mu-appbar {
  padding-left: 16px !important;
  padding-right: 16px !important;
}
.mu-appbar .backButton {
  padding-left: 0px !important;
  padding-right: 0px !important;
  width: auto !important;
}
.mu-appbar-title {
  padding-left: 32px !important;
}
.mu-list {
  padding: 0px !important;
}
.mu-item {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
.mu-slider {
  margin-bottom: 0px !important;
}
</style>
