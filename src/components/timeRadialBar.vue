<template>
    <div class="timeRadialBar">
      <div class="progress-radial" v-bind:class="percentageClass">
        <div class="overlay">{{ timeString }}</div>
      </div>
    </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'time-radial-bar',
  data () {
    return {
      timeLeft: 21,
      timeTotal: 100
    }
  },
  computed: {
    timeString: function () {
      return _.chain(this.timeLeft / 60).floor().padStart(2, '0') + ':' + _.chain(this.timeLeft % 60).padStart(2, '0')
    },
    percentageClass: function () {
      return 'progress-' + _.chain((this.timeLeft / this.timeTotal) * 100).round()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons)

  // Colors
  $barColor: #2196F3
  $overlayColor: white
  $backColor: #ABABAB
  $textColor: #36474F

  // Size
  $radialSize: 150px
  $radialWidth: $radialSize * 0.08
  $textSize: $radialSize * 0.3

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

  $step: 1 // step of % for created classes

  $loops: round(100 / $step)
  $increment: 360 / $loops
  $half: round($loops / 2)
  @for $i from 0 through $loops
    .progress-#{$i*$step}
      @if $i < $half
        $nextdeg: 90deg + ( $increment * $i )
        background-image: linear-gradient(90deg, $backColor 50%, transparent 50%, transparent), linear-gradient($nextdeg, $barColor 50%, $backColor 50%, $backColor)
      @else
        $nextdeg: -90deg + ( $increment * ( $i - $half ) )
        background-image: linear-gradient($nextdeg, $barColor 50%, transparent 50%, transparent), linear-gradient(270deg, $barColor 50%, $backColor 50%, $backColor)

</style>
