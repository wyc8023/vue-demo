/**
 * @file Axios的Vue插件（添加全局请求/响应拦截器）
 */

import axios from 'axios'
import app from '../main'

axios.defaults.withCredentials = true
// 拦截request,设置全局请求为ajax请求
axios.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((res) => {
  if (res && res.data && (!res.data.status || res.data.status >= 600 || res.data.status < 200)) {
    res.data = {
      status: res.status,
      result: res.data
    }
  }
  if (res.status < 300) {
    return res
  } else {
    return Promise.reject(res)
  }
}, (error) => {
  if (error.response) {
    if (error.response.data) {
      if (error.response.status === 404 || error.response.status > 500) {
        error.response.data = {
          code: -1,
          message: '系统异常~'
        }
      }
      if (error.response.data.code && error.response.data.code === '600000017') {
        let fullPath = app.$router.currentRoute.fullPath
        let query = {}
        if (!fullPath.indexOf('login')) {
          query = {redirect: fullPath}
        }
        app.$router.replace({
          path: '/login',
          query: query
        })
      }
      error.response.data = {
        status: error.response.status,
        result: error.response.data
      }
    }
  }
  return error.response
})
export default axios
