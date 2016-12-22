<template>
  <div id="app">
    <radialBar fraction="0.2" overlayText="11:42" strokeColor="#2196F3" trailColor="#ABABAB"></radialBar>
  </div>
</template>

<script>
import radialBar from './components/radialBar'

export default {
  name: 'app',
  components: {
    radialBar
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
