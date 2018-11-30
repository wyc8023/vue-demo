<template>
    <section>
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                <el-breadcrumb-item >部门管理</el-breadcrumb-item>
                <el-breadcrumb-item >部门列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                    <label>部门名称</label>
                    <div class="input">
                        <el-input v-model="filters.name" placeholder="公司名称" ></el-input>
                    </div>
                </li>
                <li class="clearfix">
                    <label>公司名称</label>
                    <div class="input">
                        <el-select v-model="filters.companyId" placeholder="请选择公司" @change="setDep">
                            <el-option
                                    v-for="item in comVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
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
                <el-table :data="deps" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                    <!--v-loading="loading" element-loading-text="拼命加载中""-->
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="name" label="部门名称" ></el-table-column>
                    <el-table-column prop="companyId" label="公司名称" :formatter="formatCom" ></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                            <el-button type="danger" @click="delDep(scope.$index,scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
                    <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="editForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称" prop="companyId">
                            <el-select v-model="editForm.companyId" placeholder="请选择公司名称" @change="setDep">
                                <el-option
                                        v-for="item in comVO"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门目录" prop="partentsId">
                            <el-tree ref="tree" default-expand-all="" :data="menuData" node-key="id" :props="defaultProps" :lazy="lazy"
                                    accordion  highlight-current :load="loadEditNode">
                            </el-tree>
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
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="addForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称" prop="companyId">
                            <el-select v-model="addForm.companyId" placeholder="请选择公司名称" @change="setDep">
                                <el-option
                                        v-for="item in comVO"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门目录" prop="partentsId">
                            <el-tree ref="tree" :data="menuData" node-key="id" :props="defaultProps" :lazy="lazy"
                                    accordion  highlight-current :load="loadNode">
                            </el-tree>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </div>
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
      filters: {
        staffName: '',
        companyId: ''
      },
      deps: [],
      menuData: [],
      depVO: [],
      comVO: [],
      depCom: [],
      lazy: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      value: '全部',
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
          {required: true, message: '部门名称', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '公司名称', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        name: '',
        companyId: '',
        partentsId: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {required: true, message: '部门名称', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '公司名称', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        companyId: '',
        partentsId: ''
      }
    }
  },
  methods: {
    async loadNode (node, resolve) { // 初始化加载树
      if (node.level === 0) {
        return resolve([])
      }
      let resp = await this.$services.dmis.getDepTree({nodeId: node.data.id})
      if (resp.status === 200) {
        let menuData = resp.result.data.data
        resolve(menuData)
      } else {
        this.$message({
          showClose: true,
          message: '查询公司树异常,稍后再试',
          type: 'error'
        })
      }
    },
    async loadEditNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      }
      let resp = await this.$services.dmis.getDepTree({nodeId: node.data.id})
      if (resp.status === 200) {
        let menuData = resp.result.data.data
        resolve(menuData)
      } else {
        this.$message({
          showClose: true,
          message: '查询公司树异常,稍后再试',
          type: 'error'
        })
      }
    },
    setEditDep (val) {
      this.value = '0'
      let dep = this.depVO
      let deps = []
      for (var j = 0; j < dep.length; j++) {
        if (val === dep[j].companyId) {
          deps.push(dep[j])
        }
      }
      this.depCom = deps
      this.editForm.partentsId = null
    },
    async setDep (val) {
      this.$refs.tree.data = []
      let resp = await this.$services.dmis.getDepTree({nodeId: val})
      if (resp.status === 200) {
        this.$refs.tree.data = resp.result.data.data
      } else {
        this.$message({
          showClose: true,
          message: '查询公司树异常,稍后再试',
          type: 'error'
        })
      }
    },
    formatCom (row) {
      let com = this.comVO
      for (var i = 0; i < com.length; i++) {
        if (row.companyId === com[i].id) {
          return com[i].name
        }
      }
      return '未知'
    },
    formatDep (row) {
      let dep = this.depVO
      for (var j = 0; j < dep.length; j++) {
        if (row.partentsId === dep[j].id) {
          return dep[j].name
        }
      }
      return ''
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
      var com = this.filters.companyId
      if (name !== '') {
        params.name = name
      }
      if (com !== '') {
        params.companyId = com
      }
      let pages = {}
      pages.currentPage = this.page.currentPage
      pages.pageSize = this.page.pageSize
      params.page = pages
      let resp = await this.$services.dmis.getDepList(params)
      if (resp.status === 200) {
        let data = resp.result.data
        let total = data.total
        let depList = data.depList
        this.deps = depList
        this.depVO = data.depVO
        this.comVO = data.comVO
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
    delDep (index, row) {
      let _this = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {
          id: row.id
        }
        _this.$services.dmis.deleteDep(param).then((resp) => {
          if (resp.status === 200) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.search()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    async showEditDialog (index, row) {
      let _this = this
      _this.editFormVisible = true
      _this.editForm = Object.assign({}, row)
      this.$refs.tree.data = []
      let resp = await this.$services.dmis.getDepTree({nodeId: row.id})
      if (resp.status === 200) {
        this.$refs.tree.data = resp.result.data.data
      } else {
        this.$message({
          showClose: true,
          message: '查询公司树异常,稍后再试',
          type: 'error'
        })
      }
    },
    editSubmit () {
      let _this = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.editForm)
          _this.$services.dmis.updateDep(param).then((resp) => {
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
        companyId: '',
        partentsId: ''
      }
    },
    addSubmit () {
      let _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let form = this.addForm
          let param = {}
          param.name = form.name
          param.companyId = form.companyId
          _this.$services.dmis.addDep(param).then((resp) => {
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
        _this.$services.dmis.deleteDep(param).then((resp) => {
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
