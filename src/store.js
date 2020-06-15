import Vue from 'vue';

export const store = Vue.observable({
  counter: 0
});
export const mutations = {
  setCounter(counter) {
    store.counter = counter;
  },
  resetCounter() {
    store.counter = 0;
  }
};
