<template>
    <div class="timeRadialBar">
      <!-- <div class="progress-radial" v-bind:class="percentageClass"> -->
      <div class="progress-radial" v-bind:style="radialBarStyle">
        <div class="overlay">{{ timeString }}</div>
      </div>
    </div>
</template>

<script>
import * as _ from 'lodash'

const radialBarPriColor = '#2196F3'
const radialBarSecColor = '#A5D173'
const radialBarBgColor = '#ABABAB'

export default {
  name: 'time-radial-bar',
  data () {
    return {
      timeLeft: 21,
      timeTotal: 100,
      workingMode: false
    }
  },
  computed: {
    timeString: function () {
      return _.chain(this.timeLeft / 60).floor().padStart(2, '0') + ':' + _.chain(this.timeLeft % 60).padStart(2, '0')
    },
    // Computes the linear-gradient values for the to display the corresponding fraction of time left
    radialBarStyle: function () {
      let fractionLeft = this.timeLeft / this.timeTotal
      let radialBarColor = (this.workingMode) ? radialBarPriColor : radialBarSecColor

      if (fractionLeft > 0.5) {
        // @fractionLeft = 1.00, computedAngle = -90deg
        // @fractionLeft = 0.75, computedAngle =   0deg
        // @fractionLeft = 0.50, computedAngle =  90deg
        let computedAngle = 270 - (fractionLeft) * 360
        return { 'background-image': 'linear-gradient(' + computedAngle + 'deg, ' + radialBarColor + ' 50%, transparent 50%, transparent), linear-gradient(90deg, ' + radialBarColor + ' 50%, ' + radialBarBgColor + ' 50%, ' + radialBarBgColor + ')' }
      } else {
        // @fractionLeft = 0.50, computedAngle =  90deg
        // @fractionLeft = 0.25, computedAngle = 180deg
        // @fractionLeft = 0.00, computedAngle = 270deg
        let computedAngle = 270 - (fractionLeft) * 360
        return { 'background-image': 'linear-gradient(270deg, ' + radialBarBgColor + ' 50%, transparent 50%, transparent), linear-gradient(' + computedAngle + 'deg, ' + radialBarColor + ' 50%, ' + radialBarBgColor + ' 50%, ' + radialBarBgColor + ')' }
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
$radialWidth: $radialSize * 0.08
$textSize: $radialSize * 0.3
$textColor: #36474F
$overlayColor: #ffffff

.timeRadialBar

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
