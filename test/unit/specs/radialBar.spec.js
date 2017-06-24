import Vue from 'vue';
import { mountComponent, destroyVueInstance } from '../utils';
import radialBar from '../../../src/components/radialBar';

describe('radialBar', () => {
  let vm = null;

  beforeEach(() => {
    vm = mountComponent(radialBar, {
      fraction: '0',
      overlayText: '00:00',
      strokeColor: '#2196F3', // rgb(33, 150, 243)
      trailColor: '#ABABAB', // rgb(171, 171, 171)
      size: 100,
    });
  });

  afterEach(() => {
    destroyVueInstance(vm);
  });

  describe('Test Component Props', () => {
    it('should render correct contents', () => {
      expect(vm.$el.querySelector('.radialBar-overlay').textContent)
        .to.equal('00:00');
      expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
        .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
    });

    it('should re-render component correctly after changing [overlayText] props', (done) => {
      // Set overlayText to "23:59"
      vm.overlayText = '23:59';
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.radialBar-overlay').textContent)
          .to.equal('23:59');
        done();
      });
    });

    it('should re-render component correctly after changing [strokeColor] props', (done) => {
      vm.strokeColor = '#A5D173';
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(165, 209, 115) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });
  });

  describe('Test Computed Properties', () => {
    it('[radialBarArc] computes correctly after changing [fraction] props -> 0%', (done) => {
      // Set radial-bar to 0% or 0.00
      vm.fraction = '0.0';
      Vue.nextTick(() => {
        expect(vm.radialBarArc['background-image'])
          .to.equal('linear-gradient(270deg, #ABABAB 50%, transparent 50%, transparent), linear-gradient(270deg, #2196F3 50%, #ABABAB 50%, #ABABAB)');
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(270deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });

    it('[radialBarArc] computes & re-renders component correctly after changing [fraction] props -> 25%', (done) => {
      // Set radial-bar to 25% or 0.25
      vm.fraction = '0.25';
      Vue.nextTick(() => {
        expect(vm.radialBarArc['background-image'])
          .to.equal('linear-gradient(270deg, #ABABAB 50%, transparent 50%, transparent), linear-gradient(180deg, #2196F3 50%, #ABABAB 50%, #ABABAB)');
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });

    it('[radialBarArc] computes & re-renders component correctly after changing [fraction] props -> 50%', (done) => {
      // Set radial-bar to 50% or 0.50
      vm.fraction = '0.50';
      Vue.nextTick(() => {
        expect(vm.radialBarArc['background-image'])
          .to.equal('linear-gradient(270deg, #ABABAB 50%, transparent 50%, transparent), linear-gradient(90deg, #2196F3 50%, #ABABAB 50%, #ABABAB)');
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(270deg, rgb(171, 171, 171) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });

    it('[radialBarArc] computes & re-renders component correctly after changing [fraction] props -> 75%', (done) => {
      // Set radial-bar to 75% or 0.75
      vm.fraction = '0.75';
      Vue.nextTick(() => {
        expect(vm.radialBarArc['background-image'])
          .to.equal('linear-gradient(0deg, #2196F3 50%, transparent 50%, transparent), linear-gradient(90deg, #2196F3 50%, #ABABAB 50%, #ABABAB)');
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(0deg, rgb(33, 150, 243) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });

    it('[radialBarArc] computes & re-renders component correctly after changing [fraction] props -> 100%', (done) => {
      // Set radial-bar to 100% or 1.00
      vm.fraction = '1.00';
      Vue.nextTick(() => {
        expect(vm.radialBarArc['background-image'])
          .to.equal('linear-gradient(-90deg, #2196F3 50%, transparent 50%, transparent), linear-gradient(90deg, #2196F3 50%, #ABABAB 50%, #ABABAB)');
        expect(vm.$el.querySelector('.radialBar-progress').style.backgroundImage)
          .to.equal('linear-gradient(-90deg, rgb(33, 150, 243) 50%, transparent 50%, transparent), linear-gradient(90deg, rgb(33, 150, 243) 50%, rgb(171, 171, 171) 50%, rgb(171, 171, 171))');
        done();
      });
    });

    it('[computedStyle] computes & re-renders component correctly after changing [size] props -> 1000', (done) => {
      const size = 1000;
      const overlayTextSize = 300;
      const overlaySize = 920;
      const overlayMargin = 40;
      const expectedResult = {
        radialBar: { height: `${size}px`, width: `${size}px` },
        overlay: { height: `${overlaySize}px`, width: `${overlaySize}px`, 'line-height': `${overlaySize}px`, margin: `${overlayMargin}px`, 'font-size': `${overlayTextSize}px` },
      };

      // Set [size] prop to 1000
      vm.size = '1000';
      Vue.nextTick(() => {
        expect(vm.computedStyle).to.deep.equal(expectedResult);
        expect(vm.$el.style.height).to.equal(`${size}px`);
        expect(vm.$el.style.width).to.equal(`${size}px`);
        expect(vm.$el.querySelector('.radialBar-overlay').style.height).to.equal(`${overlaySize}px`);
        expect(vm.$el.querySelector('.radialBar-overlay').style.width).to.equal(`${overlaySize}px`);
        expect(vm.$el.querySelector('.radialBar-overlay').style.lineHeight).to.equal(`${overlaySize}px`);
        expect(vm.$el.querySelector('.radialBar-overlay').style.margin).to.equal(`${overlayMargin}px`);
        expect(vm.$el.querySelector('.radialBar-overlay').style.fontSize).to.equal(`${overlayTextSize}px`);
        done();
      });
    });
  });
});
