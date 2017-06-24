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
      <mu-list-item title="Push Notifications" :describeText="notificationSettingDescription">
        <mu-switch slot="right" v-model="myAllowNotification" :disabled="disableNotificationSetting"/>
      </mu-list-item>
      <mu-divider/>
    </mu-list>
  </div>
</template>

<script>
import Vue from 'vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

import notifications from '../modules/notifications';

Vue.use(MuseUI);

export default {
  name: 'settings',
  props: {
    workDuration: { type: Number, required: true },
    breakDuration: { type: Number, required: true },
    allowNotification: { type: Boolean, required: true },
  },
  data() {
    return {
      myWorkDuration: this.workDuration,
      myBreakDuration: this.breakDuration,
      myAllowNotification: this.allowNotification,
    };
  },
  computed: {
    disableNotificationSetting() {
      return !notifications.supported() || notifications.isBlocked();
    },
    notificationSettingDescription() {
      if (!notifications.supported()) {
        return 'Your browser does not support notifications';
      } else if (notifications.isBlocked()) {
        return 'Please unblock notifications via your browser settings';
      }

      return (this.myAllowNotification) ?
        'You will be notified when timer reaches zero' :
        'You will NOT be notified when timer reaches zero';
    },
  },
  methods: {
    backToAppView() {
      const settings = {
        workDuration: this.myWorkDuration,
        breakDuration: this.myBreakDuration,
        allowNotification: this.myAllowNotification,
      };
      this.$emit('change', settings);
    },
  },
  filters: {
    toMinutes(value, text) {
      return `${text} (${value / 60} min)`;
    },
  },
};
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
.mu-item-text {
  word-break: normal;
}
.mu-slider {
  margin-bottom: 0px !important;
}
</style>
