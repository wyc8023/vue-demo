
import services from '../config/services'
import cookie from '../utils/cookie'
export default {
  async getUserInfo ({ state, commit }, payload) {
    let res = services.dmis.login(payload)
    if (res.result.code === 200) { // 登录成功dispatch
      let misSid = cookie.get('mis_sid')
      commit('GETUSERINFO', { misSid: misSid, isLogin: true })
    } else {
      cookie.clear('mis_sid')
      commit('GETUSERINFO', { misSid: '', isLogin: false })
    }
  }
}
