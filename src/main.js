// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/main.css'
import services from './utils/services'
import App from './App'
import utils from './utils/utils'
import '../static/ueditor/ueditor.config'
import '../static/ueditor/ueditor.all'
import '../static/ueditor/lang/zh-cn/zh-cn'
import '../static/ueditor/ueditor.parse'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.$services = services
Vue.prototype.$utils = utils
/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  data () {
    return {
      bus: new Vue()
    }
  },
  router,
  components: { App },
  template: '<App/>'
})
export default app
