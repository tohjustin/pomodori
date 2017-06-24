<template>
  <div class="radialBar" v-bind:style="computedStyle.radialBar">
    <div class="radialBar-progress" v-bind:style="radialBarArc">
      <div class="radialBar-overlay" v-bind:style="computedStyle.overlay">{{ overlayText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'radialBar',
  props: {
    fraction: {
      validator(value) { return !isNaN(value) && (value >= 0 && value <= 1); },
      required: true,
    },
    overlayText: {
      type: String,
      required: true,
    },
    // Validate if string is #XXXXXX format
    strokeColor: {
      validator(value) { return /^#[0-9A-F]{6}$/i.test(value); },
      required: true,
    },
    // Validate if string is #XXXXXX format
    trailColor: {
      validator(value) { return /^#[0-9A-F]{6}$/i.test(value); },
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  computed: {
    // Computes the linear-gradient values to display the corresponding [fraction] prop
    radialBarArc() {
      if (this.fraction > 0.5) {
        // @this.fraction = 1.00, computedAngle = -90deg
        // @this.fraction = 0.75, computedAngle =   0deg
        // @this.fraction = 0.50, computedAngle =  90deg
        const computedAngle = 270 - (this.fraction * 360);
        return {
          'background-image': `linear-gradient(${computedAngle}deg, ${this.strokeColor} 50%, transparent 50%, transparent), linear-gradient(90deg, ${this.strokeColor} 50%, ${this.trailColor} 50%, ${this.trailColor})`,
        };
      }

      // @this.fraction = 0.50, computedAngle =  90deg
      // @this.fraction = 0.25, computedAngle = 180deg
      // @this.fraction = 0.00, computedAngle = 270deg
      const computedAngle = 270 - (this.fraction * 360);
      return {
        'background-image': `linear-gradient(270deg, ${this.trailColor} 50%, transparent 50%, transparent), linear-gradient(${computedAngle}deg, ${this.strokeColor} 50%, ${this.trailColor} 50%, ${this.trailColor})`,
      };
    },
    // Compute CSS to scale the component based on the [size] prop
    computedStyle() {
      const strokeWidth = this.size * 0.08;
      const overlayTextSize = this.size * 0.3;
      const overlaySize = this.size - strokeWidth;
      const overlayMargin = strokeWidth / 2;
      return {
        radialBar: {
          height: `${this.size}px`,
          width: `${this.size}px`,
        },
        overlay: {
          height: `${overlaySize}px`,
          width: `${overlaySize}px`,
          lineHeight: `${overlaySize}px`,
          margin: `${overlayMargin}px`,
          fontSize: `${overlayTextSize}px`,
        },
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons)

// Colors & Sizes
$radialSize: 300px
$textColor: #36474F
$overlayColor: #ffffff

// Computed Values
$strokeWidth: $radialSize * 0.08
$textSize: $radialSize * 0.3

.radialBar-progress
  width: inherit
  height: inherit
  border-radius: 50%

.radialBar-progress .radialBar-overlay
  color: $textColor
  position: absolute
  background-color: $overlayColor
  border-radius: 50%
  text-align: center
</style>
