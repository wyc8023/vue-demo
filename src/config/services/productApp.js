import host from '../host'
let productApp = {
  host: host.ecommerceApi,
  getSimpleInfo: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/product/getSimpleInfo/bySkuNos/v1'
  }
}
export default productApp
