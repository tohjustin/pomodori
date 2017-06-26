import Vue from 'vue';

/**
 * Destroys the input vue instance
 * @param  {Object} vm
 */
export function destroyVueInstance(vm) {
  vm.$destroy();
}

/**
 * Helper function that mounts and returns the vue instance for testing
 * @link https://vuejs.org/v2/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Component      - component under testing
 * @param  {Object}  propsData      - props data
 */
export function mountComponent(Component, propsData) {
  const Ctor = Vue.extend(Component);
  const vm = new Ctor({
    propsData,
  }).$mount();

  return vm;
}
