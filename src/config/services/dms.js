import host from '../host'
let dms = {
  host: host.dmisApi,
  menuInit: {
    method: 'post',
    url: '/dms/v1/mis/queryDealerMisList'
  },
  getDealerDetail: {
    method: 'get',
    url: '/dms/v1/mis/queryDealerMisdetail'
  },
  selectDealerInvitation: {
    method: 'get',
    url: '/dms/v1/mis/selectDealerInvitation'
  },
  addOrUpdateDealerInvitation: {
    method: 'post',
    url: '/dms/v1/mis/addOrUpdateDealerInvitation'
  },
  addDealerMisdetail: {
    method: 'post',
    url: '/dms/v1/mis/addDealerMisdetail'
  },
  editDealerMisdetail: {
    method: 'post',
    url: '/dms/v1/mis/editDealerMisdetail'
  },
  selectAreaByid: {
    method: 'get',
    url: '/dms/v1/mis/selectCityById'
  },
  getCustomerList: {
    method: 'get',
    url: '/dms/v1/mis/getCustomerList'
  },
  getCustomerDeatil: {
    method: 'get',
    url: '/dms/v1/mis/getCustomerDeatil'
  },
  queryMaterialSeriesCode: {
    method: 'get',
    url: '/dms/v1/mis/queryMaterialSeriesCode'
  },
  queryVehicleManagementList: {
    method: 'get',
    url: '/dms/v1/mis/queryVehicleManagementList'
  },
  queryTboxUpdateRecord: {
    method: 'get',
    url: '/dms/v1/mis/queryVehicleManagementList'
  },
  queryVehicleManagementDetail: {
    method: 'get',
    url: '/dms/v1/mis/queryVehicleManagementDetail'
  },
  queryDealerByCity: {
    method: 'post',
    url: '/dms/v1/queryDealerByCity'
  }

}
export default dms
