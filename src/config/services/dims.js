import host from '../host'
let dmis = {
  host: host.dmis,
  menuInit: {
    method: 'get',
    url: '/menu/init'
  },
  getMenuByParentId: {
    method: 'get',
    url: '/menu/getUserMenusBySysId'
  },
  login: {
    method: 'get',
    url: '/userLogin/login'
  },
  logout: {
    method: 'post',
    url: '/user/logout'
  },
  getUserList: {
    method: 'post',
    url: '/user/getList'
  },
  deleteUser: {
    method: 'post',
    url: '/user/delete'
  },
  updateUser: {
    method: 'post',
    url: '/user/update'
  },
  updateUserRole: {
    method: 'post',
    url: '/user/userRoleUpdate'
  },
  updateUserCompany: {
    method: 'post',
    url: '/user/userComUpdate'
  },
  addUser: {
    method: 'post',
    url: '/user/add'
  },
  changeUserPwd: {
    method: 'post',
    url: '/user/changePwd'
  },
  getUserInfo: {
    method: 'get',
    url: '/user/getUserInfo'
  },
  // 角色相关接口
  getSysRoleList: {
    method: 'get',
    url: '/role/getSysRoleList'
  },
  getRoleMenuIds: {
    method: 'get',
    url: '/menu/getRoleMenuIds'
  },
  getSysMenuList: {
    method: 'get',
    url: '/menu/getSysMenuList'
  },
  updateRole: {
    method: 'post',
    url: '/role/update'
  },
  addRole: {
    method: 'post',
    url: '/role/addRole'
  },
  saveRoleMenu: {
    method: 'post',
    url: '/menu/saveRoleMenu/v1'
  },
  saveRoleRes: {
    method: 'post',
    url: '/rolePermission/saveRoleRes/v1'
  },
  deleteRoleById: {
    method: 'get',
    url: '/role/delete/v1'
  },
  getSysResList: {
    method: 'get',
    url: '/permission/getSysRes'
  },
  getRoleReIds: {
    method: 'get',
    url: '/permission/getRoleReIds'
  },
  getAllNavList: {
    method: 'get',
    url: '/nav/getAllNavList/v1'
  },
  getPermmissionTree: {
    method: 'get',
    url: '/permission/query/tree/v1/{val}'
  },
  getPermissionList: {
    method: 'post',
    url: '/permission/getList'
  },
  deletePermission: {
    method: 'post',
    url: '/permission/delete'
  },
  updatePermission: {
    method: 'post',
    url: '/permission/update'
  },
  addPermission: {
    method: 'post',
    url: '/permission/add'
  },
  // 公司相关接口
  getCompanyList: {
    method: 'post',
    url: '/company/getList'
  },
  deleteCompany: {
    method: 'post',
    url: '/company/delete'
  },
  updateCompany: {
    method: 'post',
    url: '/company/update'
  },
  addCompany: {
    method: 'post',
    url: '/company/add'
  },
  // 部门相关接口
  getDepTree: {
    method: 'get',
    url: '/dep/query/tree/v1/{nodeId}'
  },
  getDepList: {
    method: 'post',
    url: '/dep/getList'
  },
  deleteDep: {
    method: 'post',
    url: '/dep/delete'
  },
  updateDep: {
    method: 'post',
    url: '/dep/update'
  },
  addDep: {
    method: 'post',
    url: '/dep/add'
  }
}
export default dmis
