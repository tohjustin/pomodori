<template>
  <div class="timeRadialBar">
    <div class="progress-radial" v-bind:style="radialBarStyle">
      <div class="overlay">{{ overlayText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'time-radial-bar',
  props: {
    fraction: {
      validator: function (value) { return !isNaN(value) && (value >= 0 && value <= 1) },
      required: true
    },
    overlayText: {
      type: String,
      required: true
    },
    strokeColor: {
      validator: function (value) { return /^#[0-9A-F]{6}$/i.test(value) }, // Validate if string is #XXXXXX format
      required: true
    },
    trailColor: {
      validator: function (value) { return /^#[0-9A-F]{6}$/i.test(value) }, // Validate if string is #XXXXXX format
      required: true
    }
  },
  computed: {
    // Computes the linear-gradient values for the to display the corresponding fraction of time left
    radialBarStyle: function () {
      if (this.fraction > 0.5) {
        // @this.fraction = 1.00, computedAngle = -90deg
        // @this.fraction = 0.75, computedAngle =   0deg
        // @this.fraction = 0.50, computedAngle =  90deg
        let computedAngle = 270 - (this.fraction) * 360
        return { 'background-image': 'linear-gradient(' + computedAngle + 'deg, ' + this.strokeColor + ' 50%, transparent 50%, transparent), linear-gradient(90deg, ' + this.strokeColor + ' 50%, ' + this.trailColor + ' 50%, ' + this.trailColor + ')' }
      } else {
        // @this.fraction = 0.50, computedAngle =  90deg
        // @this.fraction = 0.25, computedAngle = 180deg
        // @this.fraction = 0.00, computedAngle = 270deg
        let computedAngle = 270 - (this.fraction) * 360
        return { 'background-image': 'linear-gradient(270deg, ' + this.trailColor + ' 50%, transparent 50%, transparent), linear-gradient(' + computedAngle + 'deg, ' + this.strokeColor + ' 50%, ' + this.trailColor + ' 50%, ' + this.trailColor + ')' }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons)

// Colors & Sizes
$radialSize: 300px
$textColor: #36474F
$overlayColor: #ffffff

// Computed Values
$radialWidth: $radialSize * 0.08
$textSize: $radialSize * 0.3

.progress-radial
  width: $radialSize
  height: $radialSize
  border-radius: 50%

.progress-radial .overlay
  font-family: 'Roboto', sans-serif
  color: $textColor
  position: absolute
  width: $radialSize - $radialWidth
  height: $radialSize - $radialWidth
  background-color: $overlayColor
  border-radius: 50%
  margin: $radialWidth / 2
  text-align: center
  line-height: $radialSize - $radialWidth
  font-weight: medium
  font-size: $textSize
</style>
