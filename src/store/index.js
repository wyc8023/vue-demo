import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

const state = {
  misSid: '', // 登录信息cookie
  isLogin: '' // 是否已登录
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
