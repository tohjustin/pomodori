// import Vue from 'vue'
import { mountComponent, destroyVueInstance } from '../utils.js'
import App from 'src/App.vue'
// var chai = require('chai')
// var sinon = require('sinon')

describe('App', () => {
  let vm = null
  let STATE = null
  var mock

  beforeEach(() => {
    vm = mountComponent(App, {})
    STATE = vm._getStateHelper()
    // **NOTE** PhantomJS doesn't support Audio Tags so we have to stub these 2 methods that interacts w/ HTML5 Audio
    sinon.stub(vm, '_ringAlarm')
    sinon.stub(vm, '_stopAlarm')
  })

  afterEach(() => {
    destroyVueInstance(vm)
  })

  describe('Test [STATE] helper object', () => {
    it('method STATE.GET_MODE() should be implemented correctly', () => {
      expect(STATE.GET_MODE(STATE.WORK_START)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.WORK)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.WORK_PAUSED)).to.equal('WORK')
      expect(STATE.GET_MODE(STATE.BREAK_START)).to.equal('BREAK')
      expect(STATE.GET_MODE(STATE.BREAK)).to.equal('BREAK')
      expect(STATE.GET_MODE(STATE.BREAK_PAUSED)).to.equal('BREAK')
    })
    it('method STATE.START() should be implemented correctly', () => {
      expect(STATE.START(STATE.WORK_START)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.WORK)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.WORK_PAUSED)).to.equal(STATE.WORK)
      expect(STATE.START(STATE.BREAK_START)).to.equal(STATE.BREAK)
      expect(STATE.START(STATE.BREAK)).to.equal(STATE.BREAK)
      expect(STATE.START(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK)
    })
    it('method STATE.PAUSE() should be implemented correctly', () => {
      expect(STATE.PAUSE(STATE.WORK_START)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.WORK)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.WORK_PAUSED)).to.equal(STATE.WORK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK_START)).to.equal(STATE.BREAK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK)).to.equal(STATE.BREAK_PAUSED)
      expect(STATE.PAUSE(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK_PAUSED)
    })
    it('method STATE.RESET() should be implemented correctly', () => {
      expect(STATE.RESET(STATE.WORK_START)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.WORK)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.WORK_PAUSED)).to.equal(STATE.WORK_START)
      expect(STATE.RESET(STATE.BREAK_START)).to.equal(STATE.BREAK_START)
      expect(STATE.RESET(STATE.BREAK)).to.equal(STATE.BREAK_START)
      expect(STATE.RESET(STATE.BREAK_PAUSED)).to.equal(STATE.BREAK_START)
    })
    it('method STATE.SWITCH() should be implemented correctly', () => {
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
      vm.timeRemaining = 0
      vm.workDuration = 1000
      vm.breakDuration = 1000
      expect(vm.overlayText).to.equal('00:00')
      vm.timeRemaining = 25
      expect(vm.overlayText).to.equal('00:25')
      vm.timeRemaining = (1 * 60) + 0
      expect(vm.overlayText).to.equal('01:00')
      vm.timeRemaining = (11 * 60) + 6
      expect(vm.overlayText).to.equal('11:06')
    })
    it('[fractionOfTimeLeft] calculates the correct value in "WORK" mode', () => {
      vm.workDuration = 100
      vm.breakDuration = 200
      const statesToTest = [ STATE.WORK_START, STATE.WORK, STATE.WORK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
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
      vm.workDuration = 100
      vm.breakDuration = 200
      const statesToTest = [ STATE.BREAK_START, STATE.BREAK, STATE.BREAK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
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
      let startTimerSpy = sinon.spy(vm, 'startTimer')
      let pauseTimerSpy = sinon.spy(vm, 'pauseTimer')
      expect(startTimerSpy.callCount).to.equal(0)
      expect(pauseTimerSpy.callCount).to.equal(0)

      vm.state = STATE.WORK_START
      expect(vm.primaryButton).to.have.deep.property('text', 'START WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(1)
      expect(pauseTimerSpy.callCount).to.equal(0)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = STATE.WORK
      expect(vm.primaryButton).to.have.deep.property('text', 'STOP WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(0)
      expect(pauseTimerSpy.callCount).to.equal(1)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = STATE.WORK_PAUSED
      expect(vm.primaryButton).to.have.deep.property('text', 'RESUME WORKING')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#2196F3')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(1)
      expect(pauseTimerSpy.callCount).to.equal(0)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = STATE.BREAK_START
      expect(vm.primaryButton).to.have.deep.property('text', 'START MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(1)
      expect(pauseTimerSpy.callCount).to.equal(0)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = STATE.BREAK
      expect(vm.primaryButton).to.have.deep.property('text', 'STOP MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(0)
      expect(pauseTimerSpy.callCount).to.equal(1)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = STATE.BREAK_PAUSED
      expect(vm.primaryButton).to.have.deep.property('text', 'RESUME MY BREAK')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#A5D173')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(1)
      expect(pauseTimerSpy.callCount).to.equal(0)
      startTimerSpy.reset()
      pauseTimerSpy.reset()

      vm.state = ''
      expect(vm.primaryButton).to.have.deep.property('text', 'ERROR')
      expect(vm.primaryButton).to.have.deep.property('bgColor', '#FFFFFF')
      vm.primaryButton.callbackFn()
      expect(startTimerSpy.callCount).to.equal(0)
      expect(pauseTimerSpy.callCount).to.equal(0)
      startTimerSpy.reset()
      pauseTimerSpy.reset()
    })
  })

  describe('Test Component Methods', () => {
    it('[startTimer] decrements [timeRemaining] every second in "WORK" mode', () => {
      const statesToTest = [ STATE.WORK_START, STATE.WORK, STATE.WORK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 20
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(20)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(500)
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(20)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(500)
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(19)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(17)
        expect(vm.worker).not.to.be.null

        CLOCK.restore()
      }
    })
    it('[startTimer] decrements [timeRemaining] every second in "BREAK" mode', () => {
      const statesToTest = [ STATE.BREAK_START, STATE.BREAK, STATE.BREAK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 10
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(10)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(500)
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(10)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(500)
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(9)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(7)
        expect(vm.worker).not.to.be.null

        CLOCK.restore()
      }
    })
    it('[startTimer] switches from "WORK" to "BREAK" mode when [timeRemaining] approaches 0', () => {
      const CLOCK = sinon.useFakeTimers()
      let spy = sinon.spy(vm, 'switchMode')

      // Initialize component properties/variables
      vm.timeRemaining = 1
      vm.workDuration = 20
      vm.breakDuration = 10
      vm.state = STATE.WORK
      vm.worker = null
      expect(vm.state).to.equal(STATE.WORK)
      expect(vm.worker).to.be.null

      // Begin Test
      vm.startTimer()
      expect(spy.callCount).to.equal(0)
      expect(vm.state).to.equal(STATE.WORK)
      expect(vm.timeRemaining).to.equal(1)
      expect(vm.worker).not.to.be.null
      CLOCK.tick(500)
      expect(spy.callCount).to.equal(0)
      expect(vm.state).to.equal(STATE.WORK)
      expect(vm.timeRemaining).to.equal(1)
      expect(vm.worker).not.to.be.null
      CLOCK.tick(500)
      expect(spy.callCount).to.equal(1)
      expect(vm.state).to.equal(STATE.BREAK_START)
      expect(vm.timeRemaining).to.equal(10)
      expect(vm.worker).to.be.null
      CLOCK.tick(2000)
      expect(spy.callCount).to.equal(1)
      expect(vm.state).to.equal(STATE.BREAK_START)
      expect(vm.timeRemaining).to.equal(10)
      expect(vm.worker).to.be.null

      CLOCK.restore()
    })
    it('[startTimer] switches from "BREAK" to "WORK" mode when [timeRemaining] approaches 0', () => {
      const CLOCK = sinon.useFakeTimers()
      let spy = sinon.spy(vm, 'switchMode')

      // Initialize component properties/variables
      vm.timeRemaining = 1
      vm.workDuration = 20
      vm.breakDuration = 10
      vm.state = STATE.BREAK
      vm.worker = null
      expect(vm.state).to.equal(STATE.BREAK)
      expect(vm.worker).to.be.null

      // Begin Test
      vm.startTimer()
      expect(spy.callCount).to.equal(0)
      expect(vm.state).to.equal(STATE.BREAK)
      expect(vm.timeRemaining).to.equal(1)
      expect(vm.worker).not.to.be.null
      CLOCK.tick(500)
      expect(spy.callCount).to.equal(0)
      expect(vm.state).to.equal(STATE.BREAK)
      expect(vm.timeRemaining).to.equal(1)
      expect(vm.worker).not.to.be.null
      CLOCK.tick(500)
      expect(spy.callCount).to.equal(1)
      expect(vm.state).to.equal(STATE.WORK_START)
      expect(vm.timeRemaining).to.equal(20)
      expect(vm.worker).to.be.null
      CLOCK.tick(2000)
      expect(spy.callCount).to.equal(1)
      expect(vm.state).to.equal(STATE.WORK_START)
      expect(vm.timeRemaining).to.equal(20)
      expect(vm.worker).to.be.null

      // Restore Timer
      CLOCK.restore()
    })
    it('[startTimer] stops the alarm', () => {
      // Restore the stubbed function so we can mock it
      vm._ringAlarm.restore()
      vm._stopAlarm.restore()

      // Setup mocks
      mock = sinon.mock(vm)
      var ringAlarmExpectation = mock.expects('_ringAlarm')
      var stopAlarmExpectation = mock.expects('_stopAlarm')
      ringAlarmExpectation.never()
      stopAlarmExpectation.once()

      // Verify it
      vm.startTimer()
      ringAlarmExpectation.verify()
      stopAlarmExpectation.verify()
    })
    it('[pauseTimer] stops decrementing [timeRemaining] every second in "WORK" mode', () => {
      const statesToTest = [ STATE.WORK_START, STATE.WORK, STATE.WORK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 20
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(20)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(18)
        expect(vm.worker).not.to.be.null

        vm.pauseTimer()
        expect(vm.state).to.equal(STATE.WORK_PAUSED)
        expect(vm.timeRemaining).to.equal(18)
        expect(vm.worker).to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.WORK_PAUSED)
        expect(vm.timeRemaining).to.equal(18)
        expect(vm.worker).to.be.null

        CLOCK.restore()
      }
    })
    it('[pauseTimer] stops decrementing [timeRemaining] every second in "BREAK" mode', () => {
      const statesToTest = [ STATE.BREAK_START, STATE.BREAK, STATE.BREAK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 10
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(10)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(3000)
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(7)
        expect(vm.worker).not.to.be.null

        vm.pauseTimer()
        expect(vm.state).to.equal(STATE.BREAK_PAUSED)
        expect(vm.timeRemaining).to.equal(7)
        expect(vm.worker).to.be.null
        CLOCK.tick(3000)
        expect(vm.state).to.equal(STATE.BREAK_PAUSED)
        expect(vm.timeRemaining).to.equal(7)
        expect(vm.worker).to.be.null

        CLOCK.restore()
      }
    })
    it('[resetTimer] resets [timeRemaining] correctly in "WORK" mode', () => {
      const statesToTest = [ STATE.WORK_START, STATE.WORK, STATE.WORK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 15
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(15)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.WORK)
        expect(vm.timeRemaining).to.equal(13)
        expect(vm.worker).not.to.be.null

        vm.resetTimer()
        expect(vm.state).to.equal(STATE.WORK_START)
        expect(vm.timeRemaining).to.equal(20)
        expect(vm.worker).to.be.null
        CLOCK.tick(2000)
        expect(vm.state).to.equal(STATE.WORK_START)
        expect(vm.timeRemaining).to.equal(20)
        expect(vm.worker).to.be.null

        CLOCK.restore()
      }
    })
    it('[resetTimer] resets [timeRemaining] correctly in "BREAK" mode', () => {
      const statesToTest = [ STATE.BREAK_START, STATE.BREAK, STATE.BREAK_PAUSED ]
      for (var i = 0; i < statesToTest.length; i++) {
        const CLOCK = sinon.useFakeTimers()
        // Initialize component properties/variables
        vm.timeRemaining = 5
        vm.workDuration = 20
        vm.breakDuration = 10
        vm.state = statesToTest[i]
        vm.worker = null
        expect(vm.state).to.equal(statesToTest[i])
        expect(vm.worker).to.be.null

        // Begin Test
        vm.startTimer()
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(5)
        expect(vm.worker).not.to.be.null
        CLOCK.tick(3000)
        expect(vm.state).to.equal(STATE.BREAK)
        expect(vm.timeRemaining).to.equal(2)
        expect(vm.worker).not.to.be.null

        vm.resetTimer()
        expect(vm.state).to.equal(STATE.BREAK_START)
        expect(vm.timeRemaining).to.equal(10)
        expect(vm.worker).to.be.null
        CLOCK.tick(3000)
        expect(vm.state).to.equal(STATE.BREAK_START)
        expect(vm.timeRemaining).to.equal(10)
        expect(vm.worker).to.be.null

        CLOCK.restore()
      }
    })
    it('[resetTimer] stops the alarm', () => {
      // Restore the stubbed function so we can mock it
      vm._ringAlarm.restore()
      vm._stopAlarm.restore()

      // Setup mocks
      mock = sinon.mock(vm)
      var ringAlarmExpectation = mock.expects('_ringAlarm')
      var stopAlarmExpectation = mock.expects('_stopAlarm')
      ringAlarmExpectation.never()
      stopAlarmExpectation.once()

      // Verify it
      vm.resetTimer()
      ringAlarmExpectation.verify()
      stopAlarmExpectation.verify()
    })
    it('[switchMode] switches from "WORK" mode correctly', () => {
      const CLOCK = sinon.useFakeTimers()
      // Initialize component properties/variables
      vm.timeRemaining = 2
      vm.workDuration = 20
      vm.breakDuration = 10
      vm.state = STATE.WORK
      vm.worker = null
      expect(vm.state).to.equal(STATE.WORK)
      expect(vm.worker).to.be.null

      // Begin Test
      vm.startTimer()
      expect(vm.state).to.equal(STATE.WORK)
      expect(vm.timeRemaining).to.equal(2)
      expect(vm.worker).not.to.be.null
      vm.switchMode()
      expect(vm.state).to.equal(STATE.BREAK_START)
      expect(vm.timeRemaining).to.equal(10)
      expect(vm.worker).to.be.null

      CLOCK.restore()
    })
    it('[switchMode] switches from "BREAK" mode correctly', () => {
      const CLOCK = sinon.useFakeTimers()
      // Initialize component properties/variables
      vm.timeRemaining = 5
      vm.workDuration = 20
      vm.breakDuration = 10
      vm.state = STATE.BREAK
      vm.worker = null
      expect(vm.state).to.equal(STATE.BREAK)
      expect(vm.worker).to.be.null

      // Begin Test
      vm.startTimer()
      expect(vm.state).to.equal(STATE.BREAK)
      expect(vm.timeRemaining).to.equal(5)
      expect(vm.worker).not.to.be.null
      vm.switchMode()
      expect(vm.state).to.equal(STATE.WORK_START)
      expect(vm.timeRemaining).to.equal(20)
      expect(vm.worker).to.be.null

      CLOCK.restore()
    })
    it('[switchMode] rings the alarm', () => {
      // Restore the stubbed function so we can mock it
      vm._ringAlarm.restore()
      vm._stopAlarm.restore()

      // Setup mocks
      mock = sinon.mock(vm)
      var ringAlarmExpectation = mock.expects('_ringAlarm')
      var stopAlarmExpectation = mock.expects('_stopAlarm')
      ringAlarmExpectation.once()
      stopAlarmExpectation.never()

      // Verify it
      vm.switchMode()
      ringAlarmExpectation.verify()
      stopAlarmExpectation.verify()
    })
  })
})
