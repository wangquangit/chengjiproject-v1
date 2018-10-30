import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    manuwidth: 6,
    mainwidth: 18,
    jsondata: {},
    menuWidth: 100,
    serverUrl: 'http://192.168.0.231:8888',
    userMenuInfo: [],
    nowButtons: [],
  },
  mutations: {

  },
  actions: {

  }
})
