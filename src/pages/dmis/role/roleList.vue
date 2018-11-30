<template>
    <section>
      <div class="bread">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item >角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <ul class="search-form clearfix">
          <li class="clearfix">
              <label>系统名称</label>
              <div class="input">
                <el-select v-model="queryForm.systemId" @change="handleSysChange"  placeholder="请选择系统">
                      <el-option
                              v-for="item in navList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                      </el-option>
                  </el-select>
              </div>
            </li>
            <li class="clearfix" style="margin-left: 20px;">
              <el-button class="search" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button class="search" size="small" type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
            </li>
        </ul>
        <div class="table-content">
          <el-table :data="tableData" border stripe style="width: 100%">
                <el-table-column
                        prop="id"
                        label="角色Id"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="角色名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="des"
                        label="角色描述"
                        width="180">
                </el-table-column>

                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editClick(scope.row)" type="primary" size="small">编辑</el-button>
                        <el-button @click="auditEditClick(scope.row)" type="primary" size="small">权限编辑</el-button>
                        <el-button @click="deleteClick(scope.row)" type="danger" size="small">删除角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
          <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
            :title="editDialog.title"
            size="small"
            center
            :visible.sync="editDialog.dialogVisible"
            :before-close="handleEditDialogClose">
          <el-form ref="roleInfoForm" :model="roleInfoForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="角色名称">
                <el-input v-model="roleInfoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleInfoForm.des" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button @click="editDialog.dialogVisible = false">关 闭</el-button>
              <el-button type="primary" @click="saveRoleInfo" >保 存</el-button>
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
                  <el-tab-pane label="菜单">
                      <el-tree
                              ref="menuTree"
                              :data="menuData"
                              default-expand-all
                              show-checkbox
                              node-key="id"
                              :default-checked-keys="defaultChecked"
                              :props="defaultProps">
                      </el-tree>
                      <el-button type="primary" size="small" @click="menuSave">保存</el-button>
                  </el-tab-pane>
                  <el-tab-pane label="资源">
                      <el-table
                              :data="resTable"
                              ref="multipleTable"
                              tooltip-effect="dark"
                              style="width: 100%"
                              @select="handleTableSelect"
                              @select-all="handleSelectAll">
                          <el-table-column
                                  type="selection"
                                  width="55">
                          </el-table-column>
                          <el-table-column
                                  prop="name"
                                  label="资源名称"
                                  width="120">
                          </el-table-column>
                          <el-table-column
                                  prop="url"
                                  label="资源url">
                          </el-table-column>
                      </el-table>
                      <div class="page">
                          <el-pagination
                                  @size-change="handlePermSizeChange"
                                  @current-change="handlePermCurrentChange"
                                  :current-page="permPage.currentPage"
                                  :page-sizes="permPage.pageSizes"
                                  :page-size="permPage.pageSize"
                                  layout="total, sizes, prev, pager, next, jumper"
                                  :total="permPage.total">
                          </el-pagination>
                      </div>
                      <el-button type="primary" size="small" @click="resSave" >保存</el-button>
                  </el-tab-pane>
              </el-tabs>
          </div>
      </el-dialog>
    </section>
</template>
<script>
export default {
  data () {
    return {
      queryForm: {
        systemId: ''
      },
      tableData: [],
      navList: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      editDialog: {
        title: '角色编辑',
        dialogVisible: false
      },
      auditDialog: {
        title: '权限编辑',
        dialogVisible: false
      },
      roleInfoForm: {
        operate: 1
      },
      menuData: [],
      defaultChecked: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      resTable: [],
      multipleSelection: [],
      originResIds: [],
      currentResIds: [],
      permPage: {
        currentPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        total: 0
      },
      currentRoleId: '',
      hasLoadedResRoleId: ''
    }
  },
  methods: {
    // 搜索角色列表
    async search () {
      let sysId = this.queryForm.systemId
      let pageNo = this.page.currentPage
      let pageSize = this.page.pageSize
      if (sysId === '') {
        this.$message({
          showClose: true,
          message: '请先选择系统',
          type: 'warning'
        })
        return
      }
      let params = {
        systemId: sysId,
        pageNo: pageNo,
        pageSize: pageSize
      }
      let response = await this.$services.dmis.getSysRoleList(params)
      if (response.status === 200) {
        let data = response.result
        this.tableData = data.roleList
        this.total = data.total
      } else {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
    },
    // 点击添加角色
    addRole () {
      this.editDialog.dialogVisible = true
      // 0 新增
      this.roleInfoForm.operate = 0
    },
    // 切换系统
    handleSysChange (val) {
      this.queryForm.systemId = val
    },
    // 编辑角色
    editClick (row) {
      this.roleInfoForm.name = row.name
      this.roleInfoForm.id = row.id
      this.roleInfoForm.des = row.des
      // 1 表示更新  0 表示新增
      this.roleInfoForm.operate = 1
      this.editDialog.dialogVisible = true
    },
    // 编辑权限
    async auditEditClick (row) {
      let roleId = row.id
      this.currentRoleId = row.id
      this.roleInfoForm.id = roleId
      this.auditDialog.dialogVisible = true
      let systemId = this.queryForm.systemId

      let params = {
        systemId: systemId,
        roleId: roleId
      }
      // 查询选中角色拥有的菜单 getRoleMenuIds
      let resp = await this.$services.dmis.getRoleMenuIds(params)
      if (resp.status === 200) {
        let data = resp.result.data
        if (data != null) {
          this.defaultChecked = data
        }
      } else {
        this.$message({
          showClose: true,
          message: '查询角色菜单失败,稍后再试',
          type: 'error'
        })
        return
      }

      let menuResp = await this.$services.dmis.getSysMenuList({systemId: systemId})
      if (menuResp.status === 200) {
        let data = menuResp.result.data
        this.menuData = data
      } else {
        this.$message({
          showClose: true,
          message: '查询系统菜单失败,稍后再试',
          type: 'error'
        })
        return
      }
      // 查询角色资源
      this.searchPerms()
    },
    // 切换角色列表单页记录数量
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    // 角色列表 切换页码
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    // 角色编辑对话框
    handleEditDialogClose () {
      this.defaultChecked = []
      this.editDialog.dialogVisible = false
    },
    async saveRoleInfo () {
      if (this.roleInfoForm.name === '') {
        this.$message({
          showClose: true,
          message: '角色名称不能为空',
          type: 'warning'
        })
      }
      let param = {}
      param.name = this.roleInfoForm.name
      param.des = this.roleInfoForm.des
      let operate = this.roleInfoForm.operate
      if (operate === 1) {
        param.id = this.roleInfoForm.id
        let resp = await this.$services.dmis.updateRole(param)
        if (resp === 200) {
          this.$message({
            showClose: true,
            message: '更新成功',
            type: 'success'
          })
          this.editDialog.dialogVisible = false
          this.roleInfoForm = {}
          this.search()
        } else {
          this.$message({
            showClose: true,
            message: '更新失败,稍后再试',
            type: 'error'
          })
        }
      } else {
        // 0 新增
        param.systemId = this.queryForm.systemId
        let resp = await this.$services.dmis.addRole(param)
        if (resp.status === 200) {
          let role = resp.result.data
          this.tableData.push(role)
          this.$message({
            showClose: true,
            message: '添加角色成功',
            type: 'success'
          })
          this.editDialog.dialogVisible = false
          this.roleInfoForm = {}
        } else {
          this.$message({
            showClose: true,
            message: '添加角色失败,稍后再试',
            type: 'error'
          })
        }
      }
    },
    async menuSave () {
      let _this = this
      let roleId = this.roleInfoForm.id
      let oldMenuIds = this.defaultChecked
      let currentMenuIds = []
      let checkedNode = this.$refs.menuTree.getCheckedNodes()
      let newAddMenus = []
      let delMenus = []
      if (checkedNode.length > 0) {
        checkedNode.forEach((menu) => {
          currentMenuIds.push(menu.id)
        })
      }
      // 过滤新添加的
      currentMenuIds.forEach((value) => {
        if (!_this.arrayContains(oldMenuIds, value)) {
          newAddMenus.push(value)
        }
      })
      // 过滤取消的
      oldMenuIds.forEach((value) => {
        if (!_this.arrayContains(currentMenuIds, value)) {
          delMenus.push(value)
        }
      })
      if (newAddMenus.length === 0 && delMenus.length === 0) {
        // 啥也不做
        _this.$message({
          showClose: true,
          message: '请至少删除或者添加一个菜单',
          type: 'warning'
        })
      }
      let param = {}
      if (checkedNode.length === 0) {
        // 没有添加任何菜单 取消 展示系统
        param.systemShow = 0
      } else if (oldMenuIds.length === 0 && newAddMenus.length > 0) {
        // 需要添加系统id
        param.systemShow = 1
      } else {
        // 什么也不操作
        param.systemShow = 2
      }
      param.roleId = roleId
      param.newAddMenus = newAddMenus
      param.delMenus = delMenus
      param.systemId = this.queryForm.systemId
      let resp = await this.$services.dmis.saveRoleMenu(param)
      if (resp.status === 200) {
        this.defaultChecked = []
        this.auditDialog.dialogVisible = false
        this.currentRoleId = ''
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: resp.result.message,
          type: 'error'
        })
      }
    },
    arrayContains (array, item) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === item) {
          return true
        }
      }
      return false
    },
    // 保存资源
    async resSave () {
      let _this = this
      let roleId = this.roleInfoForm.id
      let origionResIds = this.originResIds
      let currentRes = this.currentResIds
      let newAddRes = []
      let delRes = []
      // 过滤新添加的
      currentRes.forEach((value) => {
        if (!_this.arrayContains(origionResIds, value)) {
          newAddRes.push(value)
        }
      })
      // 过滤取消的
      origionResIds.forEach((value) => {
        if (!_this.arrayContains(currentRes, value)) {
          delRes.push(value)
        }
      })
      if (delRes.length === 0 && newAddRes.length === 0) {
        // 啥也不做
        _this.$message({
          showClose: true,
          message: '请至少删除或者添加一个资源',
          type: 'warning'
        })
      }
      let param = {}
      param.roleId = roleId
      param.addRoleRes = newAddRes
      param.delRoleRes = delRes
      let resp = await this.$services.dmis.saveRoleRes(param)
      if (resp.status === 200) {
        this.originResIds = []
        this.auditDialog.dialogVisible = false
        this.currentRoleId = ''
        this.hasLoadedResRoleId = ''
        this.currentResIds = []
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: resp.result.message,
          type: 'error'
        })
      }
    },
    handleAuditDialogClose () {
      this.auditDialog.dialogVisible = false
      this.currentRoleId = ''
      this.originResIds = []
      this.currentResIds = []
    },
    handleTabClick (tab) {

    },
    handleSelectAll (selection) {
      let tableIds = []
      let currentIds = []
      let _this = this
      this.resTable.forEach(row => {
        tableIds.push(row.id)
      })
      if (selection.length === 0) {
        // 全部取消选中
        this.currentResIds.forEach(val => {
          if (!_this.arrayContains(tableIds, val)) {
            currentIds.push(val)
          }
        })
        this.currentResIds = currentIds
      } else {
        // 全部选中
        tableIds.forEach(val => {
          if (!_this.arrayContains(this.currentResIds, val)) {
            this.currentResIds.push(val)
          }
        })
      }
    },
    handleTableSelect (selection, row) {
      let checked = false
      selection.forEach((node) => {
        if (node.id === row.id) {
          checked = true
        }
      })

      if (checked) {
        this.currentResIds.push(row.id)
      } else {
        let currentResIds = this.currentResIds
        let newSelection = []
        for (let i = 0; i < currentResIds.length; i++) {
          if (currentResIds[i] !== row.id) {
            newSelection.push(currentResIds[i])
          }
        }
        this.currentResIds = newSelection
      }
    },
    // 删除角色
    deleteClick (row) {
      let _this = this
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$services.dmis.deleteRoleById({roleId: row.id}).then((resp) => {
          if (resp.status === 200) {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
            _this.search()
          } else {
            _this.$message({
              showClose: true,
              message: resp.result.message,
              type: 'error'
            })
          }
        })
      })
    },
    handlePermSizeChange (val) {
      this.permPage.pageSize = val
      this.searchPerms()
    },
    handlePermCurrentChange (val) {
      this.permPage.currentPage = val
      this.searchPerms()
    },
    async searchPerms () {
      // 查询系统的资源
      let _this = this
      let roleId = this.currentRoleId
      if (this.hasLoadedResRoleId !== roleId) {
        this.currentResIds = []
      }
      let systemId = this.queryForm.systemId
      let pageNo = this.permPage.currentPage
      let pageSize = this.permPage.pageSize
      let param = {
        sysId: systemId,
        pageNo: pageNo,
        pageSize: pageSize

      }
      let resp = await this.$services.dmis.getSysResList(param)
      if (resp.status === 200) {
        let data = resp.result.data
        if (data != null) {
          this.resTable = data.resList
          this.permPage.total = data.total
        }
      } else {
        this.$message({
          showClose: true,
          message: resp.result.message,
          type: 'error'
        })
        return
      }

      // 查询选中角色的资源
      if (_this.hasLoadedResRoleId !== roleId) {
        // 未加载角色资源
        let roleIdResp = await this.$services.dmis.getRoleReIds({roleId: roleId})
        if (roleIdResp.status === 200) {
          let data = roleIdResp.result.data
          if (data != null) {
            _this.originResIds = data
            for (let i = 0; i < _this.resTable.length; i++) {
              let row = _this.resTable[i]
              if (_this.arrayContains(data, row.id)) {
                _this.$refs.multipleTable.toggleRowSelection(row, true)
                _this.currentResIds.push(row.id)
              }
            }
            _this.hasLoadedResRoleId = roleId
          }
        }
      } else {
        // 已经加载过角色资源了
        for (let i = 0; i < _this.resTable.length; i++) {
          let row = _this.resTable[i]
          if (_this.arrayContains(_this.currentResIds, row.id)) {
            _this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        }
      }
    }
  },
  mounted () {
    let _this = this
    this.$services.dmis.getAllNavList().then((resp) => {
      if (resp.status === 200) {
        let data = resp.result.data
        _this.navList = data
      } else {
        _this.$message({
          showClose: true,
          message: resp.result.message,
          type: 'error'
        })
      }
    })
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
