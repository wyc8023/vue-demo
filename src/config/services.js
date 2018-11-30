import host from './host'
import dmis from './services/dims'
import dms from './services/dms'
import order from './services/order'
import promise from './services/promise'
import productApp from './services/productApp'
import bi from './services/bi'
import ota from './services/ota'
import activityApi from './services/activityApi'
import area from './services/area'

let product = {
  host: host.product,
  getProductList: {
    method: 'post',
    url: '/sku/query/list/v1'
  }
}
export default {
  dmis,
  product,
  dms,
  order,
  promise,
  productApp,
  bi,
  ota,
  activityApi,
  area
}
