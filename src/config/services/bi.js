import host from '../host'
let bi = {
  host: host.dmisApi,
  getDetailed: {
    method: 'get',
    url: '/bi/v1/mis/getDetailed'
  },
  exportDetailed: {
    method: 'get',
    url: '/bi/v1/mis/exportDetailed'
  },
  getUserRealIphone: {
    method: 'get',
    url: '/bi/v1/mis/getUserRealIphone'
  },
  getHeadAnalysis: {
    method: 'get',
    url: '/bi/v1/mis/getHeadAnalysis'
  },
  getGraphicalAnalysis: {
    method: 'get',
    url: '/bi/v1/mis/getGraphicalAnalysis'
  },
  getTopAnalysis: {
    method: 'get',
    url: '/bi/v1/mis/getTopAnalysis'
  }
}
export default bi
