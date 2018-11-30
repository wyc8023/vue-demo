<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>员工管理</el-breadcrumb-item>
                    <el-breadcrumb-item>员工列表</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                  <label>员工姓名：</label>
                  <div class="input">
                      <el-input v-model="filters.staffName" placeholder="员工名" @keyup.enter.native="handleSearch"></el-input>
                  </div>
                </li>
                <li class="clearfix">
                <label>公司名称</label>
                  <div class="input">
                      <el-select style="width:220px" v-model="filters.companyId" placeholder="请选择公司名称" @change="setDep">
                          <el-option
                                  v-for="item in comVO"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                          </el-option>
                      </el-select>
                  </div>
                </li>
                <li class="clearfix">
                  <label>部门名称</label>
                  <div class="input">
                      <el-select  v-model="filters.depId" placeholder="请选择部门名称">
                              <el-option
                                      v-for="item in depCom"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                              </el-option>
                      </el-select>
                  </div>
                </li>
                <li class="clearfix" style="margin-left: 20px;">
                  <el-button type="primary" v-on:click="handleSearch">查询</el-button>
                  <el-button type="primary" @click="showAddDialog">新增</el-button>
                </li>
            </ul>
            <div class="table-content">
                <div class="table-title clearfix">
                    <p>用户列表</p>
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" >批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
                <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="staffName" label="员工姓名" width="120" sortable></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="150" sortable></el-table-column>
                    <el-table-column prop="address" label="地址" sortable></el-table-column>
                    <el-table-column label="操作" width="450">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="primary" @click="showRoleDialog(scope.$index,scope.row)" size="small">分配角色</el-button>
                                <el-button type="primary" @click="showComDialog(scope.$index,scope.row)" size="small">分配公司部门</el-button>
                                <el-button type="primary" @click="showEditDialog(scope.$index,scope.row)" size="small">编辑</el-button>
                                <el-button type="danger" @click="delUsers(scope.$index,scope.row)" size="small">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="page">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :page-count="page.total"
                        :total="page.total"
                        style="float:right;">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm"  @submit.native.prevent>
                <el-form-item label="员工姓名" prop="staffName">
                    <el-input v-model="editForm.staffName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="editForm.nickName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" @submit.native.prevent>
                <el-form-item label="员工姓名" prop="staffName">
                    <el-input v-model="addForm.staffName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="addForm.nickName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog
                :title="auditDialog.title"
                center
                :visible.sync="auditDialog.dialogVisible"
                width="90%"
                :before-close="handleAuditDialogClose">
            <div>
                <el-tabs type="border-card" @tab-click="handleTabClick" >
                    <el-tab-pane label="角色管理">
                        <table id="table">
                            <thead>
                                <tr>
                                    <th>编号</th>
                                    <th>所属系统</th>
                                    <th>已分配的角色</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(role,index) in userRole" :key="index">
                                    <td>{{index+1}}</td>
                                    <td>{{role.systemName}}</td>
                                    <td>{{role.name}}</td>
                                    <td><button @click="removeRole(index)">移除</button></td>
                                </tr>
                                <tr></tr>
                                <tr></tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <el-select v-model="auditDialog.sysName" placeholder="请选择系统" @change="setSelectRole">
                                            <el-option
                                                    v-for="item in sysName"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </td>
                                    <td>
                                        <el-select v-model="auditDialog.roleName" placeholder="请选择角色">
                                            <el-option
                                                    v-for="item in sysRole"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </td>
                                    <td><button @click="insertRole">添加</button></td>
                                </tr>
                            </tbody>
                        </table>
                            <el-button type="primary" size="small" @click.native="viewRoleSubmit" :loading="addLoading">保存</el-button>
                            <el-button type="primary" size="small" @click.native="auditDialog.dialogVisible = false">取消</el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>

        <el-dialog
                :title="comDialog.title"
                center
                :visible.sync="comDialog.dialogVisible"
                width="90%"
                :before-close="handleAuditDialogClose">
            <div>
                <el-tabs type="border-card" @tab-click="handleTabClick" >
                    <el-tab-pane label="公司部门管理">
                        <table id="comTable">
                            <thead>
                            <tr>
                                <th>编号</th>
                                <th>公司名称</th>
                                <th>部门名称</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(userComDep,index) in comDep" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{userComDep.companyName}}</td>
                                <td>{{userComDep.name}}</td>
                                <td><button @click="removeComDep(index)">移除</button></td>
                            </tr>
                            <tr></tr>
                            <tr></tr>
                            <tr>
                                <td></td>
                                <td>
                                    <el-select v-model="comDialog.comName" placeholder="请选择公司" @change="setDep">
                                        <el-option
                                                v-for="item in comVO"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td>
                                    <el-select v-model="comDialog.depName" placeholder="请选择部门">
                                        <el-option
                                                v-for="item in depCom"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td><button @click="insertComDep">添加</button></td>
                            </tr>
                            </tbody>
                        </table>
                        <el-button type="primary" size="small" @click.native="viewComSubmit" :loading="addLoading">保存</el-button>
                        <el-button type="primary" size="small" @click.native="comDialog.dialogVisible = false">取消</el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      filters: {
        staffName: '',
        companyId: '',
        depId: ''
      },
      users: [],
      lazy: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      comVO: [],
      depVO: [],
      depCom: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      loading: false,
      sels: [], // 列表选中列

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        staffName: [
          {required: true, message: '员工姓名', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '请输入公司名称', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        staffName: '',
        nickName: '',
        email: '',
        mobile: '',
        address: '',
        companyId: '',
        password: '',
        depId: '',
        roleId: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        staffName: [
          {required: true, message: '员工姓名', trigger: 'blur'}
        ],
        // password: [
        //     {required: true, message: '员工密码', trigger: 'blur'}
        // ],
        email: [
          {required: true, message: '邮箱', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '公司名称', trigger: 'blur'}
        ]
      },
      addForm: {
        staffName: '',
        nickName: '',
        email: '',
        mobile: '',
        address: '',
        companyId: '',
        password: '',
        depId: '',
        roleId: ''
      },
      // 显示角色
      roleVO: [],
      userRole: [],
      sysRole: [],
      sysName: [],
      role: {},
      userId: '',
      auditDialog: {
        title: '查看角色',
        dialogVisible: false,
        sysName: '',
        roleName: ''
      },
      // 显示公司部门
      userComDep: {},
      comDep: [],
      comDialog: {
        title: '查看公司部门',
        dialogVisible: false,
        comName: '',
        depName: ''
      }
    }
  },
  methods: {
    setDep: function (val) {
      this.value = '0'
      this.depCom = []
      let dep = this.depVO
      let deps = []
      for (var j = 0; j < dep.length; j++) {
        if (val === dep[j].companyId) {
          deps.push(dep[j])
        }
      }
      this.depCom = deps
      this.filters.depId = null
    },
    formatDep: function (row, column) {
      let dep = this.depVO
      if (row.depId.length !== 0 && dep.length !== 0) {
        var deps = ''
        for (var j = 0; j < dep.length; j++) {
          for (var i = 0; i < row.depId.length; i++) {
            if (row.depId[i] === dep[j].id) {
              deps += dep[j].name + ','
            }
          }
        }
        var length = deps.length - 1
        return deps.substr(0, length)
      }
      return '未知'
    },
    formatCom: function (row, column) {
      let com = this.comVO
      if (row.companyId.length !== 0 && com.length !== 0) {
        var coms = ''
        for (var i = 0; i < com.length; i++) {
          for (var j = 0; j < row.companyId.length; j++) {
            if (row.companyId[j] === com[i].id) {
              coms += com[i].name + ','
            }
          }
        }
        return coms.substr(0, coms.length - 1)
      }
      return '未知'
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      console.log(`每页 ${pageSize} 条`)
    },
    formatStatus: function (row, column) {
      return row.status === 1 ? '在职' : row.status === 0 ? '离职' : '未知'
    },
    handleSearch () {
      this.search()
    },
    async search () {
      let that = this
      let params = {}
      var name = that.filters.staffName
      var depName = that.filters.depId
      var comName = that.filters.companyId
      if (name !== '') {
        params.staffName = name
      }
      if (depName !== '') {
        params.depId = depName
      }
      if (comName !== '') {
        params.companyId = comName
      }
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages
      let response = await this.$services.dmis.getUserList(params)
      if (response.status === 200) {
        let data = response.result.data
        let total = data.total
        let userList = data.userList
        this.users = userList
        this.comVO = data.comVO
        this.depVO = data.depVO
        this.roleVO = data.roleVO
        this.sysName = data.sysName
        this.page.total = total
      }
    },
    selsChange (sels) {
      this.sels = sels
    },
    // 删除
    delUsers (index, row) {
      let _this = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.email = row.email
        _this.$services.dmis.deleteUser(param).then((response) => {
          if (response.status === 200) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.search()
          }
        })
      })
    },

    // 显示编辑界面
    showEditDialog (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit () {
      let _this = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let editform = _this.editForm
          let param = {
            id: editform.id,
            staffName: editform.staffName,
            nickName: editform.nickName,
            mobile: editform.mobile,
            address: editform.address,
            email: editform.email
          }
          console.log(param)
          _this.$services.dmis.updateUser(param).then((res) => {
            if (res.status === 200) {
              _this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              _this.editFormVisible = false
              _this.search()
            } else {
              _this.$message({
                showClose: true,
                message: '更新失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    showAddDialog () {
      this.addFormVisible = true
      this.addForm = {
        password: '',
        staffName: '',
        nickName: '',
        email: '',
        mobile: '',
        address: '',
        companyId: '',
        depId: '',
        roleId: ''
      }
    },
    // 新增
    addSubmit () {
      let _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          _this.loading = true
          let param = {}
          let form = _this.addForm
          param.staffName = form.staffName
          param.nickName = form.nickName
          param.email = form.email
          param.mobile = form.mobile
          param.address = form.address
          _this.$services.dmis.addUser(param).then((response) => {
            if (response.status === 200) {
              _this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              _this.addFormVisible = false
              _this.search()
            } else {
              _this.$message({
                showClose: true,
                message: response.data.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 批量删除
    batchDeleteBook () {
      if (this.sels.length === 0) {
        this.$message({
          showClose: true,
          message: '请先选中至少一条记录',
          type: 'error'
        })
        return
      }
      let ids = this.sels.map(item => item.email).toString()
      let _this = this
      let param = {}
      param.email = ids
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        _this.$services.dmis.deleteUser(param).then((resp) => {
          if (resp.status === 200) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.search()
          } else {
            _this.$message({
              showClose: true,
              message: '删除失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    // 编辑角色
    handleAuditDialogClose () {
      this.auditDialog.dialogVisible = false
      this.comDialog.dialogVisible = false
    },
    handleTabClick (tab) {

    },
    insertRole () {
      let tableRole = this.roleVO
      let tableSys = this.sysName
      let insertRoId = this.auditDialog.roleName
      let insertSysId = this.auditDialog.sysName
      let sysName = ''
      var isInsert = true
      if (tableRole.length !== 0 && insertRoId !== null && insertSysId !== null) {
        for (var j = 0; j < tableSys.length; j++) {
          if (insertSysId === tableSys[j].id) {
            sysName = tableSys[j].name
            break
          }
        }
        for (var i = 0; i < tableRole.length; i++) {
          if (insertRoId === tableRole[i].id) {
            var insetRole = tableRole[i]
            for (var k = 0; k < this.userRole.length; k++) {
              if (insetRole.id === this.userRole[k].id && insertSysId === this.userRole[k].systemId) {
                isInsert = false
                break
              }
            }
            if (isInsert) {
              insetRole.systemId = insertSysId
              insetRole.systemName = sysName
              this.userRole.push(insetRole)
            } else {
              this.$message({
                message: '已存在,请插入其他系统角色',
                type: 'warning'
              })
            }
            break
          }
        }
      }
    },
    // 显示查看分配公司部门界面
    removeComDep (index) {
      this.comDep.splice(index, 1)
    },
    showComDialog (index, row) {
      this.comDep = []
      this.comDialog.dialogVisible = true
      this.userId = row.id

      let dep = this.depVO
      if (dep.length !== 0 && row.depId.length !== 0) {
        this.userComDep = dep[0]
        for (var j = 0; j < dep.length; j++) {
          for (var i = 0; i < row.depId.length; i++) {
            if (row.depId[i] === dep[j].id) {
              this.comDep.push(dep[j])
            }
          }
        }
      }
    },
    insertComDep () {
      var tableDep = this.depVO
      var tableCom = this.comVO
      var insertDepId = this.comDialog.depName
      var insertComId = this.comDialog.comName
      var comName = ''
      var isInsert = true
      if (tableDep.length !== 0 && insertDepId !== null && insertComId !== null) {
        for (var j = 0; j < tableCom.length; j++) {
          if (insertComId === tableCom[j].id) {
            comName = tableCom[j].name
            break
          }
        }
        for (var i = 0; i < tableDep.length; i++) {
          if (insertDepId === tableDep[i].id) {
            var insetDep = tableDep[i]
            for (var k = 0; k < this.comDep.length; k++) {
              if (insetDep.id === this.comDep[k].id && insertComId === this.comDep[k].companyId) {
                isInsert = false
                break
              }
            }
            if (isInsert) {
              insetDep.companyId = insertComId
              insetDep.comName = comName
              this.comDep.push(insetDep)
            } else {
              this.$message({
                message: '已存在,请插入其他公司部门',
                type: 'warning'
              })
            }
            break
          }
        }
      }
    },
    async viewComSubmit () {
      var param = {}
      param.userId = this.userId
      param.comDep = this.comDep
      let response = await this.$services.dmis.updateUserCompany(param)
      if (response.status === 200) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.comDialog.dialogVisible = false
        this.userId = []
        this.search()
      } else {
        this.userId = ''
        this.$message({
          showClose: true,
          message: '保存失败,稍后再试',
          type: 'error'
        })
      }
    },
    removeRole (index) {
      this.userRole.splice(index, 1)
    },
    setSelectRole (val) {
      let role = this.roleVO
      let roles = []
      for (var j = 0; j < role.length; j++) {
        if (val === role[j].systemId) {
          roles.push(role[j])
        }
      }
      this.sysRole = roles
    },
    showRoleDialog (index, row) {
      this.userRole = []
      this.auditDialog.dialogVisible = true
      this.userId = row.id
      let role = this.roleVO
      if (role.length !== 0 && row.roleId.length !== 0) {
        this.role = role[0]
        for (var j = 0; j < role.length; j++) {
          for (var i = 0; i < row.roleId.length; i++) {
            if (row.roleId[i] === role[j].id) {
              this.userRole.push(role[j])
            }
          }
        }
      }
    },
    async viewRoleSubmit () {
      let param = {}
      param.userId = this.userId
      param.role = this.userRole
      let response = await this.$services.dmis.updateUserRole(param)
      if (response.status === 200) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.auditDialog.dialogVisible = false
        this.userId = []
        this.search()
      } else {
        this.userId = []
        this.$message({
          showClose: true,
          message: '保存失败,稍后再试',
          type: 'error'
        })
      }
    }
  },
  mounted () {
    this.handleSearch()
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
<style>
.search-form li label {
    width: 75px;
  }
</style>
