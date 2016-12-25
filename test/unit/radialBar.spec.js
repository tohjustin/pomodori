var Vue = require('vue')
var { mountComponent, destroyVueInstance } = require('../utils.js')
var radialBar = require('../../src/components/radialBar.vue')
var chai = require('chai')
var expect = chai.expect

describe('radialBar', () => {
  let vm = null

  afterEach(() => {
    destroyVueInstance(vm)
  })

  it('should render correct contents', () => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })
    expect(vm.$el.querySelector('.radialBar-overlay').textContent)
      .to.equal('00:00')
    expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
      .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
  })

  it('should update contents correctly after changing [overlayText] props', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })

    // Set overlayText to "23:59"
    vm.overlayText = '23:59'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-overlay').textContent)
        .to.equal('23:59')
      done()
    })
  })

  it('should update contents correctly after changing [fraction] props -> 0%', done => {
    vm = mountComponent(radialBar, {
      fraction: '1',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })

    // Set radial-bar to 0% or 0.00
    vm.fraction = '0.0'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })

  it('should update contents correctly after changing [fraction] props -> 25%', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })

    // Set radial-bar to 25% or 0.25
    vm.fraction = '0.25'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })

  it('should update contents correctly after changing [fraction] props -> 50%', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })
    // Set radial-bar to 50% or 0.50
    vm.fraction = '0.50'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })

  it('should update contents correctly after changing [fraction] props -> 75%', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })
    // Set radial-bar to 75% or 0.75
    vm.fraction = '0.75'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(0deg, rgb(33, 150, 243) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })

  it('should update contents correctly after changing [fraction] props -> 100%', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })
    // Set radial-bar to 100% or 1.00
    vm.fraction = '1.00'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(-90deg, rgb(33, 150, 243) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })

  it('should update contents correctly after changing [strokeColor] props', done => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#A5D173', // rgb(165, 209, 115)
      trailColor: '#ABABAB' // rgb(171, 171, 171)
    })

    vm.strokeColor = '#A5D173'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(165, 209, 115) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))')
      done()
    })
  })
})
