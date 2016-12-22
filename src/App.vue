<template>
  <div id="app">
    <timeRadialBar></timeRadialBar>
  </div>
</template>

<script>
import timeRadialBar from './components/timeRadialBar'

export default {
  name: 'app',
  components: {
    timeRadialBar
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
