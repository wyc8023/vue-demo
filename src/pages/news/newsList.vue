<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
                    <el-breadcrumb-item>内容管理</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                  <label>资讯标题</label>
                  <div class="input">
                      <el-input v-model="filters.contentTitle" placeholder="资讯标题" @keyup.enter.native="handleSearch"></el-input>
                  </div>
                </li>
                <li class="clearfix" style="margin-left: 20px;">
                  <el-button type="primary" v-on:click="handleSearch">查询</el-button>
                  <el-button type="primary" @click="showAddDialog">新增</el-button>
                </li>
            </ul>
            <div class="table-content">
                <div class="table-title clearfix">
                    <p>反馈列表</p>
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
           <el-table :data="contents" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="contentTitle" label="资讯标题" sortable></el-table-column>
                <el-table-column prop="contentStatus" label="审核状态" width="120" :formatter="formatVerify" sortable></el-table-column>
                <el-table-column prop="publishTime" label="发布时间"  width="250" :formatter="timestampToTime" sortable></el-table-column>
                <el-table-column prop="isTop" label="是否置顶"  width="250" :formatter="formatIsTop" sortable></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="top(scope.$index,scope.row)" v-if="scope.row.isTop===0 && scope.row.contentStatus===1">置顶</el-button>
                        <el-button size="small" @click="cancleTop(scope.$index,scope.row)" v-if="scope.row.isTop===1 && scope.row.contentStatus===1">取消置顶</el-button>
                        <el-button size="small" @click="verify(scope.$index,scope.row)" v-if="scope.row.contentStatus===0">审核</el-button>
                        <el-button size="small" @click="cancleVerify(scope.$index,scope.row)" v-if="scope.row.contentStatus===1" >取消审核</el-button>
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)" v-if="scope.row.contentStatus===0">编辑</el-button>
                        <el-button type="danger" @click="delContent(scope.$index,scope.row)" size="small" v-if="scope.row.contentStatus===0">删除</el-button>
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

        <el-dialog title="编辑" :visible.sync ="editFormVisible" @close='closeEditDialog'>
                <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm" >
                    <el-form-item label="资讯栏目" prop="categoryId">
                        <el-select v-model="editForm.categoryId" placeholder="请选择资讯栏目" @change="setPar">
                            <el-option
                                    v-for="item in comI"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="editForm.categoryId2" placeholder="请选择二级栏目">
                            <el-option
                                    v-for="item in coms"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资讯类型" prop="contentType">
                        <el-select v-model="editForm.contentType" placeholder="请选择类型">
                            <el-option
                                    v-for="item in contentTypeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布日期">
                        <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.publishTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="editForm.contentTitle" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="introduction">
                        <el-input type="textarea" v-model="editForm.introduction" :rows="8"></el-input>
                    </el-form-item>
                    <el-form-item label="资讯内容">
                        <div>
                            <script id="editEditor" type="text/plain" style="width:100%;height:100%;"></script>
                        </div>
                    </el-form-item>
                    <el-form-item label="视频编号">
                            <el-input v-model="editForm.videoId" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="pc端列表图">
                        <el-input v-model="editForm.img1" auto-complete="off"></el-input>
                        <el-input v-model="editForm.img2" auto-complete="off"></el-input>
                        <el-input v-model="editForm.img3" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="列表图">
                        <el-upload ref="upload"
                            action="https://ecommerce-api.sitechdev.com/news/upload"
                            list-type="picture"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :file-list="fileList"
                            :auto-upload="false"
                            :multiple="true">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="closeEditDialog">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit">提交</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="新增" :visible.sync ="addFormVisible" @close='closeAddDialog'>
                        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="资讯栏目">
                        <el-select v-model="addForm.categoryId" placeholder="请选择资讯栏目" @change="setPar">
                            <el-option
                                v-for="item in comI"
                                    :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                            </el-select>
                            <el-select v-model="addForm.categoryId2" placeholder="请选择栏目">
                            <el-option
                                v-for="item in coms"
                                    :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="资讯类型">
                            <el-select v-model="addForm.contentType" placeholder="请选择类型">
                                <el-option
                                    v-for="item in contentTypeList"
                                        :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发布日期">
                            <el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.publishTime"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="标题">
                                <el-input v-model="addForm.contentTitle" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="introduction">
                            <el-input type="textarea" v-model="addForm.introduction" :rows="8"></el-input>
                        </el-form-item>
                        <el-form-item label="资讯内容">
                            <div style="width:100%;">
                                <script id="editor" type="text/plain" style="width:100%;height:100%;"></script>
                            </div>
                    </el-form-item>
                    <el-form-item label="视频编号">
                        <el-input v-model="addForm.videoId" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="列表图">
                        <el-upload ref="upload"
                                   class="addFormEditor"
                                   action="https://ecommerce-api.sitechdev.com/news/upload"
                                   list-type="picture"
                                   :on-remove="handleRemove"
                                   :on-success="handleSuccess"
                                   :file-list="fileList"
                                   :auto-upload="false"
                                   :multiple="true">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且图片总大小不超过5000kb,一次上传图片不能超过10张,图片大小建议长*宽(470*256)</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="closeAddDialog">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>

            </el-dialog>

    </div>
</template>
<script>
var editorVisible = false
var editEditorVisible = false
// eslint-disable-next-line no-unused-vars
var urls = ''
export default {
  data () {
    return {
      parentid_disabled: false,
      filters: {
        contentTitle: ''
      },
      contents: [],
      coms: [],
      comI: [],
      comII: [],
      fileList: [],
      imageUrl: '',
      contentTypeList: [
        {
          value: 1,
          name: '图文'
        },
        {
          value: 2,
          name: '视频'
        },
        {
          value: 3,
          name: '相册'
        }
      ],
      categoryLevelVO: [
        {
          value: 1,
          label: '一级栏目'
        },
        {
          value: 2,
          label: '二级栏目'
        },
        {
          value: 3,
          label: '三级栏目'
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
        categoryId: [
          {required: true, message: '一级分类', trigger: 'blur'}
        ],
        categoryId2: [
          {required: true, message: '二级分类', trigger: 'blur'}
        ],
        categoryId3: [
          {required: true, message: '三级分类', trigger: 'blur'}
        ],
        contentTitle: [
          {required: true, message: '资讯标题', trigger: 'blur'}
        ],
        introduction: [
          {required: true, message: '资讯简介', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '资讯内容', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        contentId: 0,
        categoryId: '',
        categoryId2: '',
        categoryId3: '',
        contentTitle: '',
        introduction: '',
        url: '',
        contentSource: '',
        contentType: '',
        videoId: '',
        img1: '',
        img2: '',
        img3: '',
        publishTime: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        categoryId: [
          {required: true, message: '一级分类', trigger: 'blur'}
        ],
        categoryId2: [
          {required: true, message: '二级分类', trigger: 'blur'}
        ],
        categoryId3: [
          {required: true, message: '三级分类', trigger: 'blur'}
        ],
        contentTitle: [
          {required: true, message: '资讯标题', trigger: 'blur'}
        ],
        introduction: [
          {required: true, message: '资讯简介', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '资讯内容', trigger: 'blur'}
        ]
      },
      addForm: {
        categoryId: '',
        categoryId2: '',
        categoryId3: '',
        contentTitle: '',
        introduction: '',
        url: '',
        contentSource: '',
        contentType: '',
        videoId: '',
        img1: '',
        img2: '',
        img3: '',
        publishTime: ''
      }
    }
  },
  // components: {
  //   child
  // },
  methods: {
    setPar: function (val) {
      let _this = this
      _this.addForm.categoryId2 = null
      _this.editForm.categoryId2 = null
      _this.editForm.categoryId3 = null
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
    //   var url = data.source
      this.fileList = fileList
      // this.addForm.img1.push(url);
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
      return row.contentType === 1 ? '图文' : row.contentType === 2 ? '视频' : row.contentType === 3 ? '相册' : '未知'
    },
    formatStatus: function (row, column) {
      return row.isDeleted === 0 ? '删除' : '未删'
    },
    formatVerify: function (row, column) {
      return row.contentStatus === 0 ? '待审核' : row.contentStatus === 1 ? '已审核' : row.contentStatus === 1 ? '取消审核' : '未知'
    },
    formatIsTop: function (row, column) {
      return row.isTop === 0 ? '不置顶' : row.isTop === 1 ? '已置顶' : '未知'
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
      let response = await this.$services.activityApi.getNewsList(params)
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
    delContent (index, row) {
      let that = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.contentId
        this.$services.activityApi.deleteNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    // 显示编辑界面
    showEditDialog: function (index, row) {
      var _this = this
      _this.editFormVisible = true
      _this.fileList = []
      editEditorVisible = true
      urls = ''
      _this.editForm = Object.assign({}, row)
      _this.editForm.categoryId = row.categoryId
      var comTemp = _this.comII
      for (var i = 0; i < comTemp.length; i++) {
        if (row.categoryId2 === comTemp[i].id) {
          _this.coms.push(comTemp[i])
          break
        }
      }
      var newsContent = row.content
      setTimeout(function () { editUEContent(newsContent) }, 100)
    },
    cancleVerify: function (index, row) {
      let that = this
      let param = {}
      param.contentId = row.contentId
      param.contentStatus = 0
      this.$confirm('确认取消审核吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.verifyNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    verify: function (index, row) {
      let that = this
      let param = {}
      param.contentId = row.contentId
      param.contentStatus = 1
      this.$confirm('确认通过审核吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.verifyNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    cancleTop: function (index, row) {
      let that = this
      let param = {}
      param.contentId = row.contentId
      param.isTop = 0
      this.$confirm('确认取消置顶吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.setTopNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    top: function (index, row) {
      let that = this
      let param = {}
      param.contentId = row.contentId
      param.isTop = 1
      this.$confirm('确认置顶吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.setTopNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    recommend: function (index, row) {
      let that = this
      let param = {}
      param.contentId = row.contentId
      if (row.isRecommend === 0) {
        param.isRecommend = 1
      } else {
        param.isRecommend = 0
      }
      this.$confirm('确认推荐吗?', '提示', {type: 'warning'}).then(() => {
        that.$services.activityApi.recommendNews(param).then((res) => {
          if (res.status === 200) {
            that.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.search()
          } else {
            that.$message({
              showClose: true,
              message: '保存失败,稍后再试',
              type: 'error'
            })
          }
        })
      })
    },
    // 编辑
    closeEditDialog: function () {
      this.editFormVisible = false
      editEditorVisible = false
      console.log(editEditorVisible)
    },
    editSubmit: function () {
      let that = this
      that.$refs.editForm.validate((valid) => {
        if (valid) {
          let fileList = that.fileList
          let param = Object.assign({}, that.editForm)
          if (fileList !== null) {
            let imgArray = []
            for (let i = 0; i < fileList.length; i++) {
              imgArray.push(fileList[i].response.source)
            }
            if (param.contentType !== 3 && imgArray.length === 1) {
              param.img1 = imgArray[0]
            } else if (param.contentType === 1 && imgArray.length === 3) {
              param.img1 = imgArray[0]
              param.img2 = imgArray[1]
              param.img3 = imgArray[2]
            }
            if (param.contentType === 3) {
              param.img = imgArray
            }
          }
          param.content = window.UE.getEditor('editEditor').getContent()
          that.$services.activityApi.updateNews(param).then((response) => {
            if (response.status === 200) {
              that.editFormVisible = false
              editEditorVisible = false
              this.search()
            }
          })
        }
      })
    },
    showAddDialog: function () {
      this.addFormVisible = true
      this.fileList = []
      editorVisible = true
      urls = ''
      this.addForm = {
        contentId: '',
        categoryId: '',
        categoryId2: '',
        categoryId3: '',
        contentTitle: '',
        introduction: '',
        url: '',
        contentSource: '',
        contentType: '',
        videoId: '',
        img1: '',
        img2: '',
        img3: '',
        publishTime: ''
      }
      if (!this.dialogLoaded) {
        setTimeout(function () { initUE() }, 100)
        this.dialogLoaded = true
      }
    },
    closeAddDialog: function () {
      this.addFormVisible = false
      editorVisible = false
      console.log(editorVisible)
    },
    // 新增
    addSubmit: function () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let fileList = this.fileList
          let form = this.addForm
          let param = {}
          if (fileList != null) {
            let imgArray = []
            for (let i = 0; i < fileList.length; i++) {
              imgArray.push(fileList[i].response.source)
            }
            if (form.contentType !== 3 && imgArray.length === 1) {
              param.img1 = imgArray[0]
            } else if (form.contentType === 1 && imgArray.length === 3) {
              param.img1 = imgArray[0]
              param.img2 = imgArray[1]
              param.img3 = imgArray[2]
            }
            if (form.contentType === 3) {
              param.img = imgArray
            }
          }
          if (form.videoId !== null) {
            param.videoId = form.videoId
          }
          param.categoryId = form.categoryId
          param.categoryId2 = form.categoryId2
          param.contentTitle = form.contentTitle
          param.introduction = form.introduction
          param.publishTime = form.publishTime
          param.contentType = form.contentType
          if (form.contentType === 2) {
            var str = '<p><video class="edui-faked-video video-js" poster="" controls="" preload="none" src="" data-setup="{}" width="420" height="280"> <source src="" type="video/mp4"/></video></p>'
            param.content = str
            param.videoUrl = urls
          } else {
            param.content = window.UE.getEditor('editor').getContent()
          }
          that.$services.activityApi.addNews(param).then((response) => {
            if (response.status === 200) {
              that.addFormVisible = false
              editorVisible = false
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
      }).then(that.$services.activityApi.deleteNews(param).then((res) => {
        if (res.status === 200) {
          that.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.search()
        } else {
          that.$message({
            showClose: true,
            message: '保存失败,稍后再试',
            type: 'error'
          })
        }
      }))
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
// eslint-disable-next-line no-unused-vars
function initUE () {
  window.UE.getEditor('editor', {
    toolbars: [['source', 'fullscreen', 'undo', 'redo', 'link', 'unlink', 'print', 'preview', 'insertimage', 'insertvideo', 'emotion', 'date', 'time', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'forecolor', 'backcolor', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'indent', 'removeformat', 'paragraph', 'rowspacingbottom', 'rowspacingtop', 'lineheight', 'fontfamily', 'fontsize', 'imagenone', 'imageleft', 'imageright', 'imagecenter', 'inserttable', 'deletetable']]
  })
  window.UE.getEditor('editor').addListener('afterUpVideo', function (t, arg) {
    urls = arg[0].url
  })
  window.UE.Editor.prototype.getActionUrl = function (action) {
    if (action === 'uploadimage') {
      this.$refs.upload.submit()
    }
  }
}

function editUEContent (content) {
  let ue = window.UE.getEditor('editEditor', {
    toolbars: [['source', 'fullscreen', 'undo', 'redo', 'link', 'unlink', 'print', 'preview', 'insertimage', 'insertvideo', 'emotion', 'date', 'time', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'forecolor', 'backcolor', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'indent', 'removeformat', 'paragraph', 'rowspacingbottom', 'rowspacingtop', 'lineheight', 'fontfamily', 'fontsize', 'imagenone', 'imageleft', 'imageright', 'imagecenter', 'inserttable', 'deletetable']]
  })
  ue.ready(function () {
    // 设置编辑器的内容
    ue.setContent(content)
  })
  window.UE.getEditor('editEditor').addListener('afterUpVideo', function (t, arg) {
    urls = arg[0].url
  })
}

window.uploadIImage = function (fileList) {
  var imgObj = {}
  imgObj.title = ''
  imgObj.floatStyle = ''
  var imageUrl = fileList[0].response.source
  imgObj._src = imgObj.src = imageUrl + ((imageUrl.indexOf('?') > -1) ? '&' : '?') + 'x-oss-process=image/resize,m_lfit,w_960'
  if (editorVisible) {
    window.UE.getEditor('editor').fireEvent('beforeInsertImage', imgObj)
    window.UE.getEditor('editor').execCommand('insertImage', imgObj)
  } else if (editEditorVisible) {
    window.UE.getEditor('editEditor').fireEvent('beforeInsertImage', imgObj)
    window.UE.getEditor('editEditor').execCommand('insertImage', imgObj)
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
    width: 90px;
  }
</style>
