import host from '../host'
let order = {
  host: host.dmisApi,
  queryOrderDepositList: {
    method: 'post',
    url: '/order/v1/mis/queryOrderDepositList'
  },
  updateOrderDepositStatus: {
    method: 'post',
    url: '/order/v1/mis/updateOrderDepositStatus'
  },
  pushOrderDepositToDms: {
    method: 'get',
    url: '/order/v1/mis/pushOrderDepositToDms'
  },
  orderList: {
    method: 'get',
    url: '/order/v1/mis/orderList'
  },
  orderDetail: {
    method: 'get',
    url: '/order/v1/mis/orderDetail'
  },
  addSelectTelLog: {
    method: 'get',
    url: '/order/v1/mis/addSelectTelLog'
  },
  orderAuditLog: {
    method: 'get',
    url: '/order/v1/mis/orderAuditLog'
  },
  auditOrder: {
    method: 'get',
    url: '/order/v1/mis/auditOrder'
  },
  orderStatus: {
    method: 'get',
    url: '/order/v1/mis/orderStatus'
  },
  orderType: {
    method: 'get',
    url: '/order/v1/mis/orderType'
  },
  orderSource: {
    method: 'get',
    url: '/order/v1/mis/orderSource'
  },
  orderPlatform: {
    method: 'get',
    url: '/order/v1/mis/orderPlatform'
  },
  modifyOrderShopId: {
    method: 'get',
    url: '/order/v1/mis/modifyOrderShopId'
  },
  orderDeliver: {
    method: 'get',
    url: '/order/v1/mis/orderDeliver'
  },
  orderRefund: {
    method: 'get',
    url: '/order/v1/mis/orderRefund'
  },
  getRefundStatus: {
    method: 'get',
    url: '/order/v1/mis/getRefundStatus'
  },
  refundCheckStatus: {
    method: 'get',
    url: '/order/v1/mis/refundCheckStatus'
  },
  orderIncomeList: {
    method: 'get',
    url: '/order/v1/mis/orderIncomeList'
  },
  orderRefundList: {
    method: 'get',
    url: '/order/v1/mis/orderRefundList'
  },
  orderDmsList: {
    method: 'get',
    url: '/order/v1/mis/orderDmsList'
  },
  sendOrderToDms: {
    method: 'get',
    url: '/order/v1/mis/sendOrderToDms'
  }
}

export default order
