<template>
    <div>
        <div class="bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>广告管理</el-breadcrumb-item>
                    <el-breadcrumb-item>广告列表</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                <label>广告栏目</label>
                  <div class="input">
                      <el-select style="width:220px" v-model="filters.id" placeholder="请选择广告栏目" @visible-change="handleAdvsColumnChange" @keyup.enter.native="handleSearch">
                            <el-option
                                    v-for="item in advsColumn"
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
                    <p>列表</p>
                    <div class="add-btn">
                        <el-button type="primary" size="small" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
                    </div>
                </div>
                <!--列表-->
                <el-table :data="advsList" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="parentName" label="广告栏目" width="150" sortable></el-table-column>
                <el-table-column prop="name" label="广告名称"></el-table-column>
                <el-table-column prop="startAt" label="生效时间" width="180" :formatter="timestampToTime" sortable></el-table-column>
                <el-table-column prop="endAt" label="失效时间" width="180" :formatter="timestampToTime" sortable></el-table-column>
                <el-table-column prop="sorts" label="排序号" width="120" sortable></el-table-column>
                <el-table-column prop="mediaType" label="广告内容类型" width="150"></el-table-column>
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
                    <el-form-item label="广告栏目" prop="parentId">
                        <el-select style="width:220px" v-model="editForm.parentId" placeholder="请选择广告栏目" @visible-change="handleAdvsColumnChange">
                            <el-option
                                    v-for="item in advsColumn"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告名称" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="广告url" prop="url">
                        <el-upload ref="upload"
                                   action="https://ecommerce-api.sitechdev.com/news/upload"
                                   list-type="picture"
                                   :on-remove="handleRemove"
                                   :on-success="handleSuccess"
                                   :file-list="fileList"
                                   :auto-upload="false"
                                   :on-preview="handlePreview">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <img v-bind:src="editForm.url" style="width: 100%;height: auto"/>
                    </el-form-item>
                    <el-form-item label="广告内容类型">
                        <el-select style="width:220px" v-model="editForm.mediaType" placeholder="请选择内容类型">
                            <el-option
                                    v-for="item in advsContentType"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子分类类型">
                        <div slot="tip">没有子分类请选择默认</div>
                        <el-select style="width:220px" v-model="editForm.subType" placeholder="请选择内容类型">
                            <el-option
                                    v-for="item in advsSubType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跳转地址">
                        <el-input v-model="editForm.jumpLink" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sorts">
                        <el-input v-model="editForm.sorts" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="des">
                        <el-input type="textarea" v-model="editForm.des" :rows="8"></el-input>
                    </el-form-item>
                    <el-form-item label="生效时间范围：" prop="time">
                        <el-date-picker
                                v-model="editForm.time"
                                type="datetimerange"
                                align="right"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '00:00:00']"
                                @change="getEditCreateTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="绑定skuId号：" prop="mediaType">
                        <el-input v-model="editForm.skuNos" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

            <!--新增界面-->
            <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="140px" :rules="adbsAddFormRules" ref="addForm"  @submit.native.prevent>
                    <el-form-item label="广告栏目">
                        <el-select style="width:220px" v-model="addForm.parentId" placeholder="请选择广告栏目" @visible-change="handleAdvsColumnChange">
                            <el-option
                                    v-for="item in advsColumn"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告名称">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="广告url">
                        <el-upload ref="upload"
                                   action="https://ecommerce-api.sitechdev.com/news/upload"
                                   list-type="picture"
                                   :on-remove="handleRemove"
                                   :on-success="handleSuccess"
                                   :file-list="fileList"
                                   :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <img v-bind:src="addForm.url" style="width: 100%;height: auto"/>
                    </el-form-item>
                    <el-form-item label="广告内容类型">
                        <el-select style="width:220px" v-model="addForm.mediaType" placeholder="请选择内容类型">
                            <el-option
                                    v-for="item in advsContentType"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子分类类型">
                        <div slot="tip">没有子分类请选择默认</div>
                        <el-select style="width:220px" v-model="addForm.subType" placeholder="请选择内容类型">
                            <el-option
                                    v-for="item in advsSubType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跳转地址">
                        <el-input v-model="addForm.jumpLink" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="addForm.sorts" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="addForm.des" :rows="8"></el-input>
                    </el-form-item>
                    <el-form-item label="生效时间范围">
                        <el-date-picker
                                v-model="addForm.time"
                                type="datetimerange"
                                align="right"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '00:00:00']"
                                @change="getCreateTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="绑定skuId号" prop="mediaType">
                        <el-input v-model="addForm.skuNos" auto-complete="off"></el-input>
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
      advsSubType: [{
        id: 0,
        name: '默认'
      }, {
        id: 1,
        name: '最新'
      }, {
        id: 2,
        name: '最热'
      }],
      advsContentType: [{
        name: 'image'
      }, {
        name: 'veido'
      }, {
        name: '小程序'
      }],
      addTree: false,
      filters: {
        name: '',
        id: ''
      },
      advsList: [],
      fileList: [],
      advsColumn: [],

      pers: [],

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
      advsColumnChange: false,
      sels: [], // 列表选中列

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        name: [
          {required: true, message: '广告名称', trigger: 'blur'}
        ]
      },
      editForm: {
        id: 0,
        name: '',
        url: '',
        sorts: '',
        parentId: '',
        mediaType: '',
        des: '',
        startAt: '',
        endAt: '',
        time: '',
        skuNos: '',
        subType: '',
        jumpLink: ''
      },

      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      adbsAddFormRules: {
        name: [
          {required: true, message: '广告名称', trigger: 'blur'}
        ]
      },
      addForm: {
        name: '',
        url: '',
        sorts: '',
        parentId: '',
        mediaType: '',
        des: '',
        startAt: '',
        endAt: '',
        time: '',
        skuNos: '',
        subType: '',
        jumpLink: ''
      }
    }
  },
  methods: {
    handlePreview (file) {
      alert(file)
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
    getCreateTime (date) {
      let _this = this.addForm
      if (date.length === 2) {
        var start = new Date(date[0])
        var destStart = new Date(start.getTime() + 8 * 3600 * 1000)
        _this.startAt = destStart
        var end = new Date(date[1])
        var destEnd = new Date(end.getTime() + 8 * 3600 * 1000)
        _this.endAt = destEnd
      }
    },
    getEditCreateTime (date) {
      let _this = this.editForm
      if (date.length === 2) {
        var start = new Date(date[0])
        var destStart = new Date(start.getTime() + 8 * 3600 * 1000)
        _this.startAt = destStart
        var end = new Date(date[1])
        var destEnd = new Date(end.getTime() + 8 * 3600 * 1000)
        _this.endAt = destEnd
      }
    },
    async handleAdvsColumnChange () {
      if (!this.advsColumnChange) {
        let _this = this
        let response = await _this.$services.activityApi.getAdvColumnsList()
        if (response.status === 200) {
          let data = response.result.data
          _this.advsColumn = data.advsColumnList
          _this.advsColumnChange = true
        }
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
      var parentId = that.filters.id
      if (parentId !== '') {
        params.parentId = parentId
      }
      let pages = {}
      pages.currentPage = that.page.currentPage
      pages.pageSize = that.page.pageSize
      params.page = pages
      params.type = 1
      let response = await this.$services.activityApi.getAdvsList(params)
      if (response.status === 200) {
        let data = response.result.data
        let total = data.total
        let advsList = data.advsList
        that.advsList = advsList
        that.page.total = total
      }
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 删除
    delAdvs: function (index, row) {
      let that = this
      this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
        let param = {}
        param.id = row.id
        that.$services.activityApi.deleteAdvs(param).then((response) => {
          that.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          that.search()
        })
      })
    },
    // 显示编辑界面
    showEditDialog: function (index, row) {
      let _this = this
      _this.editFormVisible = true
      _this.editForm = Object.assign({}, row)
      var start = _this.editForm.startAt
      var end = _this.editForm.endAt
      if (start != null && end != null) {
        _this.editForm.time = [start, end]
      }
      _this.handleAdvsColumnChange()
    },
    // 编辑
    editSubmit () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, this.editForm)
          let fileList = this.fileList
          if (fileList != null) {
            let imgArray = []
            for (let i = 0; i < fileList.length; i++) {
              imgArray.push(fileList[i].response.source)
            }
            if (imgArray.length >= 1) {
              para.url = imgArray[0]
            }
          }
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
        url: '',
        sorts: '',
        parentId: '',
        mediaType: 'image',
        des: '',
        startAt: '',
        endAt: '',
        time: '',
        skuNos: '',
        subType: 0,
        jumpLink: ''
      }
    },
    // 新增
    addSubmit: function () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          var param = {}
          let fileList = this.fileList
          let form = this.addForm
          param.subType = form.subType
          param.name = form.name
          param.jumpLink = form.jumpLink
          param.type = 1
          if (fileList != null) {
            let imgArray = []
            for (let i = 0; i < fileList.length; i++) {
              imgArray.push(fileList[i].response.source)
            }
            if (imgArray.length >= 1) {
              param.url = imgArray[0]
            }
          }
          param.sorts = form.sorts
          param.mediaType = form.mediaType
          param.des = form.des
          param.startAt = form.startAt
          param.endAt = form.endAt
          param.parentId = form.parentId
          param.skuNo = form.skuNos
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
    // 批量删除
    batchDeleteBook: function () {
      let ids = this.sels.map(item => item.id).toString()
      let param = {}
      param.ids = ids
      let that = this
      that.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
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
