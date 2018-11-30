import host from '../host'
let promise = {
  host: host.dmisApi,
  getStockList: {
    method: 'get',
    url: '/promise/v1/mis/getStockList'
  },
  addStock: {
    method: 'get',
    url: '/promise/v1/mis/addStock'
  }
}
export default promise
