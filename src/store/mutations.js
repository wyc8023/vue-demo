import { GETUSERINFO } from './mutation-types'

export default {
  [GETUSERINFO] (state, { misSid, isLogin }) {
    state.misSid = misSid
    state.isLogin = isLogin
  }
}
