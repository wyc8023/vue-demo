import host from '../host'
let area = {
  host: host.ecommerceApi,
  getAreaInfo: {
    method: 'get',
    url: '/user/v1/app/getAreaInfo'
  }
}
export default area
