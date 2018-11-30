<template>
    <section>
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                    <li class="clearfix">
                        <label>系统名称</label>
                        <div class="input">
                            <el-select v-model="filters.id" placeholder="请选择系统">
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
                        <label>菜单名称</label>
                        <div class="input">
                            <el-input  v-model="filters.name" placeholder="菜单名称" @keyup.enter.native="handleSearch"></el-input>
                        </div>
                    </li>
                    <li class="clearfix" style="margin-left: 20px;">
                        <el-button class="search" size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                        <el-button class="search" size="small" type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                    </li>
            </ul>
        </div>
        <div class="table-content">
            <div class="table-title clearfix">
                <div class="add-btn">
                    <el-button type="primary" size="small" @click="batchDeleteBook" >批量删除</el-button>
                </div>
            </div>
            <!--列表-->
            <el-table :data="permissions"  border stripe  highlight-current-row  @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="name" label="菜单名称"  sortable></el-table-column>
                <el-table-column prop="menuLevel" label="菜单级别"  sortable></el-table-column>
                <el-table-column prop="systemId" label="父菜单名称"  :formatter="formatPer" sortable></el-table-column>
                <el-table-column label="操作">
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
                    <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="editForm.name" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单url" prop="url">
                        <el-input v-model="editForm.url" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="iconUrl">
                        <el-input v-model="editForm.iconUrl" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单所属系统" prop="systemId">
                        <el-select v-model="editForm.systemId" placeholder="请选择系统名称" @change="changSysSelect">
                            <el-option
                                    v-for="item in sysData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源在菜单栏级别">
                        <h3 style=""></h3>
                        <p><font size="2" face="arial" color="red">如果添加为一级菜单不需要点击下面内容</font></p>
                        <el-tree ref="tree" default-expand-all="" :data="menuData" node-key="id" :props="defaultProps" :lazy="lazy"
                                 accordion  highlight-current :load="loadNode"
                        >
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align: center;">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="addForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="菜单url" prop="url">
                    <el-input v-model="addForm.url" ></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="iconUrl">
                        <el-input v-model="editForm.iconUrl" ></el-input>
                    </el-form-item>
                <el-form-item label="菜单所属系统" prop="systemId">
                    <el-select v-model="addForm.sysId" placeholder="请选择系统" @change="changSysSelect">
                        <el-option
                                v-for="item in sysData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源在菜单栏级别">
                    <el-tree ref="tree" :data="menuData" node-key="id" :props="defaultProps" :lazy="lazy"
                                accordion  highlight-current :load="loadNode"
                    >
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
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
        name: '',
        id: ''
      },
      permissions: [],
      pers: [],
      sysData: [],
      sysRadio: [],
      menuData: [],
      editMenuData: [],
      defaultMenu: [],
      defaultKeys: [],
      node: [],
      lazy: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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
        menuLevel: '',
        parentId: '',
        requestType: '',
        sysId: ''
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
        menuLevel: '',
        parentId: '',
        requestType: '',
        sysId: ''
      }
    }
  },
  methods: {
    async changSysSelect (val) {
      if (typeof (val) === 'undefined' || val === '') {
        return
      }
      this.$refs.tree.data = []
      let resp = await this.$services.dmis.getPermmissionTree({val: val})
      console.log(resp)
      if (resp.status === 200) {
        this.$refs.tree.data = resp.result.data.data
      } else {
        this.$message({
          showClose: true,
          message: '查询系统列表失败,稍后再试',
          type: 'error'
        })
      }
    },
    disAddMenu () {
      var div = document.getElementById('addTree')
      if (this.addForm.type === 1) {
        div.style.display = 'block'
      } else {
        div.style.display = 'visible'
      }
    },
    setCurrentKey: function (key) {
      this.$refs.tree.setCurrentKey(key)
    },
    async loadNode (node, resolve) { // 初始化加载树
      if (node.level === 0) {
        return resolve([])
      }
      let form = this.addForm
      form.parentId = node.data.id
      form.menuLevel = node.level
      let resp = await this.$services.dmis.getPermmissionTree({val: node.data.id})
      if (resp.status === 200) {
        var menuData = resp.result.data.data
        resolve(menuData)
      } else {
        this.$message({
          showClose: true,
          message: '查询系统列表失败,稍后再试',
          type: 'error'
        })
        resolve([])
      }
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    formatPer: function (row, column) {
      let menu = this.pers
      for (var j = 0; j < menu.length; j++) {
        if (row.systemId === menu[j].id) {
          return menu[j].name
        }
      }
      return '未知'
    },
    handleSearch () {
      this.search()
    },
    async search () {
      let params = {}
      var name = this.filters.name
      var id = this.filters.id
      if (name !== '') {
        params.name = name
      }
      if (id !== '') {
        params.systemId = id
      }
      let pages = {}
      pages.currentPage = this.page.currentPage
      pages.pageSize = this.page.pageSize
      params.page = pages
      params.type = 1
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
          message: '查询权限列表失败,稍后再试',
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
        let param = {}
        param.id = row.id
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
    async showEditDialog (index, row) {
      this.editFormVisible = true
      let _this = this
      this.editForm = Object.assign({}, row)
      let resp = await this.$services.dmis.getPermmissionTree({val: row.systemId})
      if (resp.status === 200) {
        this.$refs.tree.data = resp.result.data.data
        setTimeout(function () {
          console.log(_this)
          _this.$refs.tree.setCurrentKey(row.id)
        }, 500)
      } else {
        this.$message({
          showClose: true,
          message: '加载菜单失败,稍后再试',
          type: 'error'
        })
      }
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
        url: '',
        menuLevel: '',
        parentId: '',
        sysId: ''
      }
    },
    addSubmit () {
      let _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let param = {}
          let form = _this.addForm
          param.name = form.name
          param.type = 1
          param.url = form.url
          if (form.parentId === '') {
            param.parentId = form.sysId
          } else {
            param.parentId = form.parentId
          }
          if (form.menuLevel === '') {
            param.menuLevel = 1
          } else {
            param.menuLevel = form.menuLevel + 1
          }
          param.systemId = form.sysId

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
          message: '请至少选择一条记录',
          type: 'warning'
        })
        return
      }
      let ids = this.sels.map(item => item.id).toString()
      let param = {}
      param.id = ids
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
    this.handleSearch()
  }
}
</script>
