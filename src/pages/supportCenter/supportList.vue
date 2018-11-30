<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>帮助管理</el-breadcrumb-item>
                    <el-breadcrumb-item>帮助列表</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                  <label>帮助标题</label>
                  <div class="input">
                      <el-input v-model="filters.contentTitle" placeholder="请输入帮助标题" @keyup.enter.native="handleSearch"></el-input>
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
                        <el-button type="primary" size="small" @click="batchDeleteBook" >批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
           <el-table :data="contents" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="contentTitle" label="帮助标题" sortable></el-table-column>
                <el-table-column prop="status" label="审核状态" width="120" :formatter="formatVerify" sortable></el-table-column>
                <el-table-column prop="createTime" label="发布时间"  width="250" :formatter="timestampToTime" sortable></el-table-column>
                 <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button size="small" @click="top(scope.$index,scope.row)" v-if="scope.row.isTop===0 && scope.row.status===1">置顶</el-button>
                        <el-button size="small" @click="top(scope.$index,scope.row)" v-if="scope.row.isTop===1 && scope.row.status===1">取消置顶</el-button>
                        <el-button size="small" @click="verify(scope.$index,scope.row)" v-if="scope.row.status===0">审核</el-button>
                        <el-button size="small" @click="verify(scope.$index,scope.row)" v-if="scope.row.status===1" >取消审核</el-button>
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)" v-if="scope.row.status===0">编辑</el-button>
                        <el-button type="danger" @click="delContent(scope.$index,scope.row)" size="small" v-if="scope.row.status===0">删除</el-button>
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
                <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="帮助资讯栏目" prop="levelId">
                        <el-select v-model="editForm.levelId" placeholder="请选择资讯栏目" @change="setPar">
                            <el-option
                                    v-for="item in comI"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="栏目标题" prop="partentsId">
                        <el-select v-model="editForm.partentsId" placeholder="请选择栏目">
                            <el-option
                                    v-for="item in coms"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="editForm.contentTitle" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="帮助内容">
                        <script id="editEditor" type="text/plain" style="width:100%;height:100%;" > </script>
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
                    <el-form-item label="资讯栏目">
                        <el-select v-model="addForm.levelId" placeholder="请选择资讯栏目" @change="setPar">
                            <el-option
                        v-for="item in comI"
                            :key="item.id"
                        :label="item.name"
                        :value="item.id">
                            </el-option>
                            </el-select>
                            <el-select v-model="addForm.partentsId" placeholder="请选择栏目">
                            <el-option
                        v-for="item in coms"
                            :key="item.id"
                        :label="item.name"
                        :value="item.id">
                            </el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="标题">
                            <el-input v-model="addForm.contentTitle" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="帮助内容">
                            <script id="editor" type="text/plain" style="width:100%;height:100%;" > </script>
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
        contentTitle: ''
      },
      contents: [],
      comI: [],
      comII: [],
      coms: [],
      fileList: [],
      imageUrl: '',
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
      imgUrl: [],
      sels: [], // 列表选中列

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        levelId: [
          {required: true, message: '一级分类', trigger: 'blur'}
        ],
        partentsId: [
          {required: true, message: '二级分类', trigger: 'blur'}
        ],
        contentTitle: [
          {required: true, message: '帮助标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '帮助内容', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        levelId: '',
        partentsId: '',
        contentTitle: '',
        content: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        levelId: [
          {required: true, message: '一级分类', trigger: 'blur'}
        ],
        partentsId: [
          {required: true, message: '二级分类', trigger: 'blur'}
        ],
        contentTitle: [
          {required: true, message: '帮助标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '帮助内容', trigger: 'blur'}
        ]
      },
      addForm: {
        levelId: '',
        partentsId: '',
        contentTitle: '',
        content: ''
      }
    }
  },
  methods: {
    setPar: function (val) {
      let _this = this
      _this.addForm.partentsId = null
      _this.editForm.partentsId = null
      _this.coms = []
      let pars = _this.comII
      let par = []
      for (var j = 0; j < pars.length; j++) {
        if (val === pars[j].parentId) {
          par.push(pars[j])
        }
      }
      _this.coms = par
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleSuccess (data, file, fileList) {
      var url = data.source
      console.log(fileList)
      console.log(url)
      this.fileList = fileList
      this.form.imgUrl.push(url)
    },
    formatCom: function (row, column) {
      let com = this.comVO
      for (var i = 0; i < com.length; i++) {
        if (row.parentId === com[i].id) {
          return com[i].name
        }
      }
      return '未知'
    },
    formatContentType: function (row, column) {
      return row.contentType === 1 ? '图文' : row.contentType === 2 ? '视频' : '未知'
    },
    formatStatus: function (row, column) {
      return row.isDeleted === 0 ? '删除' : '未删'
    },
    formatVerify: function (row, column) {
      return row.status === 0 ? '待审核' : row.status === 1 ? '已审核' : '未知'
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
      var name = that.filters.contentTitle
      if (name !== '') {
        params.contentTitle = name
      }
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages

      let response = await this.$services.activityApi.getListSupport(params)
      if (response.status === 200) {
        let data = response.result.data
        let total = data.total
        let conList = data.conList
        that.contents = conList
        that.comI = data.comI
        that.comII = data.comII
        that.page.total = total
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 删除
    delContent: function (index, row) {
      let that = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.id

        that.$services.activityApi.deleteSupport(param).then((response) => {
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
      // this.editFormVisible = true;
      // this.editForm = Object.assign({}, row);
      // var newsContent = row.content;
      // setTimeout(editUEContent,100,newsContent);
      var _this = this
      _this.editFormVisible = true
      _this.editForm = Object.assign({}, row)
      var comTemp = _this.comII
      for (var i = 0; i < comTemp.length; i++) {
        if (row.partentsId === comTemp[i].id) {
          _this.coms.push(comTemp[i])
          break
        }
      }
      var newsContent = row.content
      setTimeout(function () { editUEContent() }, 100, newsContent)
    },
    verify: function (index, row) {
      let that = this
      let param = {}
      param.id = row.id
      if (row.status === 0) {
        param.status = 1
      } else {
        param.status = 0
      }
      this.$confirm('确认通过审核吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.veriftySupport(param).then((response) => {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    top: function (index, row) {
      let that = this
      let param = {}
      param.id = row.id
      if (row.isTop === 0) {
        param.isTop = 1
      } else {
        param.isTop = 0
      }
      that.$confirm('确认置顶吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.setTopSupport(param).then((response) => {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    recommend: function (index, row) {
      let that = this
      let param = {}
      param.id = row.id
      if (row.isRecommend === 0) {
        param.isRecommend = 1
      } else {
        param.isRecommend = 0
      }
      this.$confirm('确认推荐吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.recommendSupport(param).then((response) => {
          if (response.status === 200) {
            that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.search()
          }
        })
      }).catch(() => {
      })
    },
    // 编辑
    editSubmit: function () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, this.editForm)
          that.$services.activityApi.updateSupport(para).then((response) => {
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
        levelId: '',
        partentsId: '',
        contentTitle: '',
        content: ''

      }
      if (!this.dialogLoaded) {
        setTimeout(function () { initUE() }, 50)
        this.dialogLoaded = true
      }
    },
    // 新增
    addSubmit: function () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
        //   let fileList = this.fileList
          let form = this.addForm
          let param = {}
          param.levelId = form.levelId
          param.partentsId = form.partentsId
          param.contentTitle = form.contentTitle
          param.content = window.UE.getEditor('editor').getContent()
          that.$services.activityApi.addSupport(param).then((response) => {
            if (response.status === 200) {
              that.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              this.addFormVisible = false
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
        that.$services.activityApi.deleteSupport(param).then((response) => {
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
    },
    timestampToTime: function (row, column) {
      var timestamp = row[column.property]
      if (timestamp === undefined) {
        return ''
      }
      var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() > 9 ? date.getHours() + ':' : '0' + date.getHours() + ':'
      var m = date.getMinutes() > 9 ? date.getMinutes() + ':' : '0' + date.getMinutes() + ':'
      var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return Y + M + D + h + m + s
    }
  },
  mounted () {
    this.handleSearch()
  }
}

// eslint-disable-next-line no-unused-vars
function initUE () {
  window.UE.getEditor('editor')
}

function editUEContent (content) {
  console.log(content)
  let ue = window.UE.getEditor('editEditor')
  ue.ready(function () {
    // 设置编辑器的内容
    ue.setContent(content)
  })
}
</script>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>
<style>
.search-form li label {
    width: 60px;
  }
</style>
