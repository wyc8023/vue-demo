<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
                    <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                  <label style="width:100px">资讯栏目名称</label>
                  <div class="input">
                      <el-input v-model="filters.name" placeholder="资讯栏目"></el-input>
                  </div>
                </li>
                <li class="clearfix" style="margin-left: 20px;">
                  <el-button type="primary" v-on:click="handleSearch">查询</el-button>
                  <el-button type="primary" @click="showAddDialog">新增</el-button>
                </li>
            </ul>
            <div class="table-content">
                <div class="table-title clearfix">
                    <p>列表</p>
                    <div class="add-btn">
                        <el-button type="danger" size="small" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
                <el-table :data="categories" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="name" label="栏目名称" width="150" sortable></el-table-column>
                <el-table-column prop="parentId" label="父栏目" width="150" :formatter="formatCom" sortable></el-table-column>
                <el-table-column prop="isDeleted" label="是否删除" width="120" :formatter="formatStatus" sortable></el-table-column>
                <el-table-column prop="isDisplay" label="是否展示"  width="120" :formatter="formatDis" sortable></el-table-column>
                <el-table-column prop="categoryLevel" label="栏目级别" :formatter="formatLevel" width="110" sortable></el-table-column>
                <el-table-column label="操作" width="150">
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
        </div>

        <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="栏目名称">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目别名">
                        <el-input v-model="editForm.categoryAlias" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="父栏目">
                        <el-select v-model="editForm.parentId" placeholder="请选择父栏目">
                            <el-option
                                    v-for="item in comVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="栏目级别" prop="categoryLevel">
                        <el-select v-model="editForm.categoryLevel" placeholder="请选择状态">
                            <el-option
                                    v-for="item in categoryLevelVO"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="是否删除" prop="isDeleted">
                        <el-select v-model="editForm.isDeleted" placeholder="请选择状态">
                            <el-option
                                    v-for="item in isDeletedVO"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否展示" prop="isDisplay">
                        <el-select v-model="editForm.isDisplay" placeholder="请选择状态">
                            <el-option
                                    v-for="item in isDisplayVO"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

            <!--新增界面-->
            <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="栏目名称" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目别名" prop="categoryAlias">
                        <el-input v-model="addForm.categoryAlias" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目级别" prop="categoryLevel">
                        <el-select v-model="addForm.categoryLevel" placeholder="请选择工作状态" @change="selectParentId">
                            <el-option label="二级栏目" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父栏目" prop="parentId" >
                        <el-select v-model="addForm.parentId" placeholder="请选择父栏目" :disabled="parentid_disabled">
                            <el-option
                                v-for="item in comVO "
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否删除" prop="isDeleted">
                        <el-select v-model="addForm.isDeleted" placeholder="请选择状态">
                            <el-option label="删除" value="0"></el-option>
                            <el-option label="未删" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否展示" prop="isDisplay">
                        <el-select v-model="addForm.isDisplay" placeholder="请选择状态">
                            <el-option label="不展示" value="0"></el-option>
                            <el-option label="展示" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      parentid_disabled: false,
      filters: {
        name: '',
        parentId: ''
      },
      categories: [],
      comVO: [],
      categoryLevelVO: [
        {
          value: 1,
          label: '一级栏目'
        },
        {
          value: 2,
          label: '二级栏目'
        }
      ],
      isDeletedVO: [
        {
          value: 0,
          label: '删除'
        },
        {
          value: 1,
          label: '未删'
        }
      ],
      isDisplayVO: [
        {
          value: 0,
          label: '不展示'
        },
        {
          value: 1,
          label: '展示'
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
          {required: true, message: '栏目名称', trigger: 'blur'}
        ],
        // priority: [
        //     {required: true, message: '栏目顺序', trigger: 'blur'}
        // ],
        categoryLevel: [
          {required: true, message: '栏目级别', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        name: '',
        categoryAlias: '',
        parentId: '',
        isDeleted: '',
        isDisplay: '',
        priority: '',
        categoryLevel: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {required: true, message: '栏目名称', trigger: 'blur'}
        ],
        // priority: [
        //     {required: true, message: '栏目顺序', trigger: 'blur'}
        // ],
        categoryLevel: [
          {required: true, message: '栏目级别', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        categoryAlias: '',
        parentId: '',
        isDeleted: '',
        isDisplay: '',
        priority: '',
        categoryLevel: ''
      }
    }
  },
  methods: {
    formatCom: function (row, column) {
      let com = this.comVO
      for (var i = 0; i < com.length; i++) {
        if (row.parentId === com[i].id) {
          return com[i].name
        }
      }
      return row.name
    },
    formatStatus: function (row, column) {
      return row.isDeleted === 0 ? '删除' : '未删'
    },
    formatDis: function (row, column) {
      return row.isDisplay === 0 ? '不展示' : '展示'
    },
    formatLevel: function (row, column) {
      return row.categoryLevel === 1 ? '一级栏目' : row.categoryLevel === 2 ? '二级栏目' : '未知'
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      console.log(`每页 ${pageSize} 条`)
    },
    handleSearch () {
      this.search()
    },
    async search () {
      let that = this
      let params = {}
      var name = that.filters.name
      if (name !== '') {
        params.name = name
      }
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages
      let response = await this.$services.activityApi.getListCategory(params)
      if (response.status === 200) {
        let data = response.result.data
        let total = data.total
        let comList = data.comList
        that.categories = comList
        that.comVO = data.comVO
        that.page.total = total
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 删除
    delCompany: function (index, row) {
      let that = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.id
        that.$services.activityApi.deleteCategory(param).then((response) => {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    // 显示编辑界面
    showEditDialog: function (index, row) {
      this.editFormVisible = true
      if (row.parentId === 0) {
        row.parentId = row.id
      }
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    editSubmit: function () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let para = Object.assign({}, this.editForm)
          if (para.parentId === para.id) {
            para.parentId = 0
          }
          that.$services.activityApi.updateCategory(para).then((response) => {
            if (response.status === 200) {
              that.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              that.editFormVisible = false
              this.search()
            }
          })
        }
      })
    },
    showAddDialog: function () {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        categoryAlias: '',
        parentId: '',
        isDeleted: '',
        isDisplay: '',
        priority: '',
        categoryLevel: ''
      }
    },
    // 新增
    addSubmit: function () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let form = this.addForm
          let param = {}
          param.name = form.name
          param.categoryAlias = form.categoryAlias
          param.parentId = form.parentId
          param.isDeleted = form.isDeleted
          param.isDisplay = form.isDisplay
          // param.priority = form.priority;
          param.categoryLevel = form.categoryLevel
          that.$services.activityApi.addCategory(param).then((response) => {
            if (response.status === 200) {
              that.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              that.addFormVisible = false
              this.search()
            }
          })
        }
      })
    },
    // 批量删除
    batchDeleteBook: function () {
      let ids = this.sels.map(item => item.id).toString()
      let param = {}
      param.id = ids
      let that = this
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        that.loading = true
        that.$services.activityApi.deleteCateogry(param).then((response) => {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    selectParentId: function () {
      if (this.addForm.categoryLevel === '1') {
        this.parentid_disabled = true
      } else {
        this.parentid_disabled = false
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
