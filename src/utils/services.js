/**
 * 构造接口请求方法
 * @author hxr
 */
import config from '@/config/services'
import utils from './utils'
import axios from './axios'
import https from 'https'
let services = {}
const Agent = new https.Agent({
  rejectUnauthorized: false
})
for (let i in config) {
  let hostApiPath = config[i]
  let apiHost = hostApiPath['host']
  services[i] = {}
  for (let ind in hostApiPath) {
    if (ind === 'host') {
      continue
    }
    let api = hostApiPath[ind]
    services[i][ind] = async function (params, headers = {}) {
      headers['Cache-Control'] = 'no-cache'
      let apiUrl = api.url
      let newParams = {}
      if (params) {
        utils.each(params, function (ind, param) {
          if (apiUrl.indexOf('{' + ind + '}') > -1) {
            apiUrl = apiUrl.replace('{' + ind + '}', param)
          } else {
            newParams[ind] = param
          }
        })
      }
      let data = newParams
      let config = {
        headers: headers,
        httpsAgent: Agent
      }
      let response = {
        data: {}
      }
      if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
        response = await axios[api.method](apiHost + apiUrl, data, config)
      } else {
        newParams._t = new Date().getTime()
        config.params = newParams
        response = await axios[api.method](apiHost + apiUrl, config)
      }
      return response.data
    }
  }
}

export default services
