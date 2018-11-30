import host from '../host'

let ota = {
  host: host.cloudApi,
  getAdminToken: {
    method: 'get',
    url: '/sitechid/admin/v2/security/admin-token-build/{platformId}'
  },
  getRpmList: {
    method: 'get',
    url: '/vehicle/admin/v2/ota/publish/query'
  },
  updateRpm: {
    method: 'put',
    url: '/vehicle/admin/v2/ota/publish/{publishId}'
  },
  addRpm: {
    method: 'post',
    url: '/vehicle/admin/v2/ota/publish'
  },
  auditRpm: {
    method: 'put',
    url: '/vehicle/admin/v2/ota/publish/{publishId}/confirm'
  },
  finishRpm: {
    method: 'put',
    url: '/vehicle/admin/v2/ota/publish/{publishId}/finish'
  }
}
export default ota
