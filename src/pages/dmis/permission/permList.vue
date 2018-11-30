<template>
    <section>
        <div class="bread">
          <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
                <el-breadcrumb-item>资源列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
              <ul class="search-form clearfix">
                  <li class="clearfix">
                    <label>系统名称</label>
                    <div class="input">
                      <el-select v-model="filters.id" placeholder="请选择系统名称">
                            <el-option
                                    v-for="item in sysData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                  </li>
                  <li class="clearfix">
                    <label>资源名称</label>
                    <div class="input">
                      <el-input v-model="filters.name" placeholder="请输入资源名称"></el-input>
                    </div>
                  </li>
                  <li class="clearfix" style="margin-left: 20px;">
                    <el-button class="search" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    <el-button class="search" size="small" type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                  </li>
              </ul>
              <div class="table-content">
                <div class="table-title clearfix">
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" >批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
                <el-table :data="permissions" border stripe  highlight-current-row  @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="name" label="资源名称"  sortable></el-table-column>
                    <el-table-column prop="systemId" label="系统名称"  :formatter="formatPer" sortable></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                            <el-button type="danger" @click="delCompany(scope.$index,scope.row)" size="small">删除</el-button>
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
                        :total="page.total">
                </el-pagination>
              </div>
              <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                  <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                      <el-form-item label="资源名称" prop="name">
                          <el-input v-model="editForm.name" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="菜单所属系统" prop="systemId">
                          <el-select v-model="editForm.systemId" placeholder="请选择" >
                              <el-option
                                      v-for="item in sysData"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="资源url" prop="url">
                          <el-input v-model="editForm.url" auto-complete="off"></el-input>
                      </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                      <el-button @click.native="editFormVisible = false">取消</el-button>
                      <el-button type="primary" @click.native="editSubmit">提交</el-button>
                  </div>
              </el-dialog>
              <!--新增界面-->
              <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
                  <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                      <el-form-item label="资源名称" prop="name">
                          <el-input v-model="addForm.name" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="菜单所属系统" prop="systemId">
                          <el-select v-model="addForm.systemId" placeholder="请选择系统">
                              <el-option
                                      v-for="item in sysData"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="资源url" prop="url">
                          <el-input v-model="addForm.url" auto-complete="off"></el-input>
                      </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                      <el-button @click.native="addFormVisible = false">取消</el-button>
                      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                  </div>
              </el-dialog>
          </div>
    </section>
</template>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
<script>
export default {
  data () {
    return {
      addTree: false,
      filters: {
        name: ''
      },
      permissions: [],
      menuData: [],
      sysData: [],
      defaultMenu: [],
      defaultKeys: [],
      node: [],
      lazy: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      typeVO: [
        {
          value: 0,
          label: '系统导航菜单'
        },
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '资源'
        }
      ],
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
        name: [
          {required: true, message: '权限名称', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        name: '',
        type: '',
        url: '',
        systemId: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {required: true, message: '权限名称', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        type: '',
        url: '',
        systemId: ''
      }
    }
  },
  methods: {
    formatPer (row) {
      let menu = this.pers
      for (var j = 0; j < menu.length; j++) {
        if (row.systemId === menu[j].id) {
          return menu[j].name
        }
      }
      return '未知'
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    async search () {
      let params = {}
      var name = this.filters.name
      if (name !== '') {
        params.name = name
      }
      let pages = {}
      pages.currentPage = this.page.currentPage
      pages.pageSize = this.page.pageSize
      params.page = pages
      params.type = 2
      params.systemId = this.filters.id
      let resp = await this.$services.dmis.getPermissionList(params)
      if (resp.status === 200) {
        let data = resp.result.data
        let total = data.total
        let permissionList = data.PermissionList
        this.permissions = permissionList
        this.pers = data.pers
        this.sysData = data.sysData
        this.page.total = total
      } else {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    delCompany (index, row) {
      let _this = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {
          id: row.id
        }
        _this.$services.dmis.deletePermission(param).then((resp) => {
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
    // 显示编辑界面
    showEditDialog (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit () {
      let _this = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.editForm)
          _this.$services.dmis.updatePermission(param).then((resp) => {
            if (resp.status === 200) {
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
        name: '',
        type: '',
        url: ''
      }
    },
    addSubmit () {
      let _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let form = _this.addForm
          let param = {
            name: form.name,
            type: 2,
            url: form.url,
            systemId: form.systemId
          }
          _this.$services.dmis.addPermission(param).then((resp) => {
            if (resp.status === 200) {
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
                message: '保存失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    batchDeleteBook () {
      if (this.sels.length === 0) {
        this.$message({
          showClose: true,
          message: '请至少选中一条记录！',
          type: 'warning'
        })
        return
      }
      let ids = this.sels.map(item => item.id).toString()
      let param = {
        id: ids
      }
      let _this = this
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        _this.$services.dmis.deletePermission(param).then((resp) => {
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
    }
  },
  mounted () {
    this.search()
  }
}
</script>
