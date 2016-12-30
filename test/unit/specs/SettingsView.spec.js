import Vue from 'vue'
import { mountComponent, destroyVueInstance } from '../utils.js'
import SettingsView from 'src/components/SettingsView.vue'

describe('SettingsView', () => {
  let vm = null

  beforeEach(() => {
    vm = mountComponent(SettingsView, {
      workDuration: 1,
      breakDuration: 1,
      allowMelody: false,
      allowVibration: false
    })
  })

  afterEach(() => {
    destroyVueInstance(vm)
  })

  describe('Test Component Methods', () => {
    it('[updateWorkDuration] updates [myWorkDuration] correctly', () => {
      vm.updateWorkDuration(1000)
      expect(vm.myWorkDuration).to.equal(1000)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
      vm.updateWorkDuration(3600)
      expect(vm.myWorkDuration).to.equal(3600)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
    })
    it('[updateBreakDuration] updates [myBreakDuration] correctly', () => {
      vm.updateBreakDuration(1000)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(1000)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
      vm.updateBreakDuration(3600)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(3600)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
    })
    it('[updateAllowMelody] updates [myAllowMelody] correctly', () => {
      vm.updateAllowMelody(true)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowMelody).to.equal(true)
      expect(vm.myAllowVibration).to.equal(false)
      vm.updateAllowMelody(false)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
    })
    it('[updateAllowVibration] updates [myAllowVibration] correctly', () => {
      vm.updateAllowVibration(true)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowMelody).to.equal(false)
      expect(vm.myAllowVibration).to.equal(true)
      vm.updateAllowVibration(false)
      expect(vm.myWorkDuration).to.equal(1)
      expect(vm.myBreakDuration).to.equal(1)
      expect(vm.myAllowVibration).to.equal(false)
      expect(vm.myAllowVibration).to.equal(false)
    })
    it('[backToAppView] emits [change] event with correct values', () => {
      let spy = sinon.spy()
      vm = new Vue({
        template: '<div><SettingsView :workDuration="1" :breakDuration="1" :allowMelody="false" :allowVibration="false" v-on:change="callbackFn"></SettingsView></div>',
        components: { SettingsView },
        methods: {
          callbackFn: spy
        }
      }).$mount()
      vm.$children[0].backToAppView()
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith({ workDuration: 1, breakDuration: 1, allowMelody: false, allowVibration: false })
    })
  })
})
