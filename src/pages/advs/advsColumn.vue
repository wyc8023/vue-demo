<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>广告管理</el-breadcrumb-item>
                    <el-breadcrumb-item>广告栏目</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <div class="table-content">
                <div class="table-title clearfix">
                    <el-button type="primary" size="small" @click="showAddDialog" style="float:right;">新增</el-button>
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" :disabled="this.sels.length===0" style="float:right;margin-right:10px;">批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
            <el-table :data="advsColumnList" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="name" label="广告栏目名称"></el-table-column>
                <el-table-column prop="code" label="广告栏目检索条件" sortable></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="danger" @click="delAdvs(scope.$index,scope.row)" size="small">删除</el-button>
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
                <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="广告栏目名称" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目检索条件" prop="code">
                        <el-input v-model="editForm.code" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

        <!--新增界面-->
            <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="广告栏目名称" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目检索条件" prop="code">
                        <el-input v-model="addForm.code" auto-complete="off"></el-input>
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
      filters: {
      },
      advsColumnList: [],
      fileList: [],
      advsColumn: [],
      pers: [],
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
      advsColumnChange: false,
      sels: [], // 列表选中列

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        name: [
          {required: true, message: '广告名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '栏目检索条件', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        name: '',
        code: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {required: true, message: '广告名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '栏目检索条件', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        code: ''
      }
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleSuccess (data, file, fileList) {
    //   var url = data.source
      this.fileList = fileList
      // this.addForm.img1.push(url);
    },
    async changSysSelect (val) {
      let _this = this
      _this.$refs.tree.data = []
      let response = await this.$services.dmis.getPermmissionTree(val)
      if (response.status === 200) {
        _this.$refs.tree.data = response.result.data.data
      }
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      console.log(currentPage)
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
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages
      params.type = 0
      let response = await this.$services.activityApi.getAdvColumnsList(params)
      if (response.status === 200) {
        let data = response.result.data
        let total = data.total
        let advsColumnList = data.advsColumnList
        that.advsColumnList = advsColumnList
        that.page.total = total
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 删除
    async delAdvs (index, row) {
      let that = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.id
        that.$services.activityApi.deleteAdvs(param).then((response) => {
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
      let _this = this
      _this.editFormVisible = true
      _this.editForm = Object.assign({}, row)
    },
    // 编辑
    editSubmit: function () {
      let that = this
      that.$refs.editForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, that.editForm)
          that.$services.activityApi.updateAdvs(para).then((response) => {
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
        code: ''
      }
    },
    // 新增
    addSubmit: function () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          var param = {}
          let form = this.addForm
          param.name = form.name
          param.type = 0
          param.code = form.code
          that.$services.activityApi.addAdvs(param).then((response) => {
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
      param.ids = ids
      let that = this
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        that.$services.activityApi.delete1Advs(param).then((response) => {
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
