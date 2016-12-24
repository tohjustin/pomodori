// import Vue from 'vue'
import { mountComponent, destroyVueInstance } from '../utils.js'
import App from 'src/App.vue'
// var chai = require('chai')

describe('App', () => {
  let vm = null

  afterEach(() => {
    destroyVueInstance(vm)
  })

  describe('Test [STATE] helper object', () => {
    it('method STATE.GET_MODE() should be implemented correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      expect(STATE.GET_MODE(STATE.WORK_START)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.WORK)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.WORK_PAUSED)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.BREAK_START)).to.equal('BREAK')
      expect(STATE.GET_MODE(STATE.BREAK)).to.equal('BREAK')
      expect(STATE.GET_MODE(STATE.BREAK_PAUSED)).to.equal('BREAK')
    })
    it('method STATE.START() should be implemented correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      expect(STATE.START(STATE.WORK_START)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.WORK)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.WORK_PAUSED)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.BREAK_START)).to.equal(STATE.BREAK)
      expect(STATE.START(STATE.BREAK)).to.equal(STATE.BREAK)
      expect(STATE.START(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK)
    })
    it('method STATE.PAUSE() should be implemented correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      expect(STATE.PAUSE(STATE.WORK_START)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.WORK)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.WORK_PAUSED)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK_START)).to.equal(STATE.BREAK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK)).to.equal(STATE.BREAK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK_PAUSED)
    })
    it('method STATE.RESET() should be implemented correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      expect(STATE.RESET(STATE.WORK_START)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.WORK)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.WORK_PAUSED)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.BREAK_START)).to.equal(STATE.BREAK_START)
      expect(STATE.RESET(STATE.BREAK)).to.equal(STATE.BREAK_START)
      expect(STATE.RESET(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK_START)
    })
    it('method STATE.SWITCH() should be implemented correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      expect(STATE.SWITCH(STATE.WORK_START)).to.equal(STATE.BREAK_START)
      expect(STATE.SWITCH(STATE.WORK)).to.equal(STATE.BREAK_START)
      expect(STATE.SWITCH(STATE.WORK_PAUSED)).to.equal(STATE.BREAK_START)
      expect(STATE.SWITCH(STATE.BREAK_START)).to.equal(STATE.WORK_START)
      expect(STATE.SWITCH(STATE.BREAK)).to.equal(STATE.WORK_START)
      expect(STATE.SWITCH(STATE.BREAK_PAUSED)).to.equal(STATE.WORK_START)
    })
  })

  describe('Test Computed Properties', () => {
    it('[overlayText] converts [timeRemaining] into a correct format', () => {
      vm = mountComponent(App, {})
      vm.timeRemaining = 0
      expect(vm.overlayText).to.equal('00:00')
      vm.timeRemaining = 25
      expect(vm.overlayText).to.equal('00:25')
      vm.timeRemaining = (1 * 60) + 0
      expect(vm.overlayText).to.equal('01:00')
      vm.timeRemaining = (11 * 60) + 6
      expect(vm.overlayText).to.equal('11:06')
    })
    it('[fractionOfTimeLeft] calculates the correct value in "WORK" mode', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      vm.workDuration = 100
      vm.breakDuration = 200
      const statesToTest = [ STATE.WORK_START, STATE.WORK, STATE.WORK_PAUSED ]
      for (var i = 0; i < 3; i++) {
        vm.state = statesToTest[i]
        vm.timeRemaining = 0
        expect(vm.fractionOfTimeLeft).to.equal(0)
        vm.timeRemaining = 55
        expect(vm.fractionOfTimeLeft).to.equal(0.55)
        vm.timeRemaining = 100
        expect(vm.fractionOfTimeLeft).to.equal(1)
      }
    })
    it('[fractionOfTimeLeft] calculates the correct value in "BREAK" mode', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      vm.workDuration = 100
      vm.breakDuration = 200
      const statesToTest = [ STATE.BREAK_START, STATE.BREAK, STATE.BREAK_PAUSED ]
      for (var i = 0; i < 3; i++) {
        vm.state = statesToTest[i]
        vm.timeRemaining = 0
        expect(vm.fractionOfTimeLeft).to.equal(0)
        vm.timeRemaining = 55
        expect(vm.fractionOfTimeLeft).to.equal(0.275)
        vm.timeRemaining = 110
        expect(vm.fractionOfTimeLeft).to.equal(0.55)
        vm.timeRemaining = 200
        expect(vm.fractionOfTimeLeft).to.equal(1)
      }
    })
    it('[primaryButton] is computed correctly', () => {
      vm = mountComponent(App, {})
      const STATE = vm._getStateHelper()
      vm.state = STATE.WORK_START
      expect(vm.primaryButton).to.have.deep.property('text', 'START WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.state = STATE.WORK
      expect(vm.primaryButton).to.have.deep.property('text', 'STOP WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.state = STATE.WORK_PAUSED
      expect(vm.primaryButton).to.have.deep.property('text', 'RESUME WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.state = STATE.BREAK_START
      expect(vm.primaryButton).to.have.deep.property('text', 'START MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.state = STATE.BREAK
      expect(vm.primaryButton).to.have.deep.property('text', 'STOP MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.state = STATE.BREAK_PAUSED
      expect(vm.primaryButton).to.have.deep.property('text', 'RESUME MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.state = ''
      expect(vm.primaryButton).to.have.deep.property('text', 'ERROR')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#FFFFFF')
    })
  })

  describe('Test Component Methods', () => {
    it('[overlayText] converts [timeRemaining] into a correct format', () => {
    })
  })
})
