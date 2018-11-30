import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
Vue.use(Router)
let routers = [
  {
    path: '/',
    redirect: '/home'
  }
]
for (let i in globalRouters) {
  let router = globalRouters[i]
  let pathString = router.componentPath.indexOf('/') === 0 ? router.componentPath.replace('/', '') : router.componentPath
  router.component = require(`../pages/${pathString}`).default
  routers.push(router)
}

const router = new Router({
  mode: 'history',
  routes: routers
})

router.beforeEach((to, from, next) => { // 全局钩子函数
  to.matched.some((route) => {
    if (route.meta.need2Login) { // 通过此操作可以判断哪些页面需要登录
      if (store.state.isLogin || sessionStorage.getItem('isLogin')) {
        next()
      } else {
        next({ name: 'login', params: { path: route.path } })
      }
    } else {
      next()
    }
  })
})

export default router
