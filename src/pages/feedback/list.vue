<template>
<div>
      <div class="bread">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
              <el-breadcrumb-item>用户反馈管理</el-breadcrumb-item>
              <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
          </el-breadcrumb>
      </div>

      <div class="content">
            <ul class="search-form clearfix">
                <li class="clearfix">
                <label style="width:140px">反馈类型查询：</label>
                  <div class="input">
                      <el-select style="width:220px" v-model="filters.feedbackType" placeholder="请选择反馈类型" @visible-change="getFeedbackType">
                            <el-option
                                    v-for="item in feedbackTypeList"
                                    :key="item.type"
                                    :label="item.name"
                                    :value="item.type">
                            </el-option>
                        </el-select>
                  </div>
                </li>
                <li class="clearfix">
                  <label style="width:140px">处理状态类型查询：</label>
                  <div class="input">
                      <el-select style="width:220px" v-model="filters.status" placeholder="请选择处理状态类型">
                            <el-option
                                    v-for="item in filterAuditStatusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                  </div>
                </li>
                <li class="clearfix">
                  <label style="width:140px">反馈时间范围查询：</label>
                  <div class="input">
                      <el-date-picker
                                v-model="filters.createTime"
                                type="datetimerange"
                                align="right"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '00:00:00']"
                                @change="getCreateTime"
                                style="float: left;padding: 5px;">
                        </el-date-picker>
                  </div>
                </li>
                <li class="clearfix" style="margin-left: 20px;">
                  <el-button type="primary" v-on:click="handleSearch">查询</el-button>
                </li>
            </ul>
            <div class="table-content">
                <div class="table-title clearfix">
                    <p>反馈列表</p>
                </div>
                <!--列表-->
               <el-table :data="feedbackList" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column type="index" width="60"></el-table-column>
                  <el-table-column prop="status" label="状态" width="110" :formatter="auditStatus" sortable></el-table-column>
                  <el-table-column prop="userId" label="用户" width="170" sortable></el-table-column>
                  <el-table-column prop="feedbackTypeName" label="类型" width="160" sortable></el-table-column>
                  <el-table-column prop="content" label="反馈内容" width="360" sortable></el-table-column>
                  <el-table-column prop="createTime" label="时间" width="190" :formatter="timestampToTime" sortable></el-table-column>
                  <el-table-column label="操作" width="400">
                      <template slot-scope="scope">
                          <el-button size="small" @click="showDetail(scope.$index,scope.row)">详情</el-button>
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

<el-dialog title="反馈详情" :visible.sync ="detailVisible" :close-on-click-modal="false" width="80%">
                <el-form :model="detailForm" label-width="120px"  ref="detailForm">
                    <el-form-item label="用户：" prop="userId" >
                        <el-input v-model="detailForm.userId" auto-complete="off" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content" style="width:70%">
                        <el-input type="textarea" v-model="detailForm.content" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" style="width:70%">
                        <el-carousel :interval="5000" arrow="always">
                            <el-carousel-item v-for="item in imgList" :key="item">
                                <el-row>
                                    <el-col :span="24"><img :src="item" style="width: 100%;height: auto" onclick="jump(this.src)"/></el-col>
                                </el-row>
                            </el-carousel-item>
                        </el-carousel>
                    </el-form-item>
                    <el-form-item label="是否采纳">
                        <el-select v-model="detailForm.status" placeholder="请选择状态">
                            <el-option
                                    v-for="item in statusVO"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="detailVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="updateSubmit">提交</el-button>
                </div>
            </el-dialog>

</div>
</template>
<script>
export default{
  data () {
    return {
      filters: {
        feedbackType: '',
        status: '',
        createTime: ''
      },
      startTime: '',
      endTime: '',
      feedbackList: [],
      filterAuditStatusList: [{
        value: 1,
        label: '待处理'
      }, {
        value: 2,
        label: '采纳'
      }, {
        value: 3,
        label: '不采纳'
      }],
      feedbackTypeList: [],
      detailVisible: false, // detail
      feedbackInfo: [],
      detailForm: {
        id: '',
        userId: '',
        content: '',
        urls: '',
        url: '',
        status: ''

      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      sels: [], // 列表选中列
      imgList: [],
      statusVO: [{
        value: 2,
        label: '采纳'
      }, {
        value: 3,
        label: '不采纳'
      }]
    }
  },
  methods: {
    getCreateTime (date) {
      let _this = this
      if (date.length === 2) {
        _this.startTime = new Date(date[0])
        _this.endTime = new Date(date[1])
      }
    },
    async getFeedbackType () {
      let _that = this
      let param = {}
      param.platformId = 1
      let response = await this.$services.activityApi.getFeedbackTypeList(param)
      if (response.status === 200) {
        _that.feedbackTypeList = response.result.data.typeList
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
    },
    handleSearch () {
      this.search()
    },
    async search () {
      let that = this
      let params = {}
      if (that.filters.feedbackType !== '') {
        params.feedbackType = that.filters.feedbackType
      }
      if (that.filters.status !== '') {
        params.status = that.filters.status
      }
      if (that.filters.createTime !== '') {
        params.startTime = that.startTime
        params.endTime = that.endTime
      }
      let pages = {}
      pages.page = that.page.currentPage
      params.page = pages
      let response = await this.$services.activityApi.getFeedbackList(params)
      if (response.status === 200) {
        let data = response.result.data
        that.feedbackList = data.dataList
        that.page.total = data.count
      }
    },
    selsChange: function (sels) {
      this.sels = sels
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
    auditStatus: function (row, column) {
      if (row.status === 1) {
        return '待处理'
      } else {
        return '已处理'
      }
    },
    showDetail: function (index, row) {
      let _this = this
      _this.imgList = []
      _this.detailVisible = true
      _this.detailForm = Object.assign({}, row)
      if (row.status === 1) {
        _this.detailForm.status = 2
      }
      _this.imgList = row.urls
    },
    updateSubmit () {
      let that = this
      that.$refs.detailForm.validate((valid) => {
        if (valid) {
          let para = Object.assign({}, this.detailForm)
          this.$services.activityApi.updateFeedback(para).then((res) => {
            if (res.status === 200) {
              that.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
              that.detailVisible = false
              that.search()
            } else {
              that.$message({
                showClose: true,
                message: '更新失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    jump (url) {
      window.open(url)
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
    width: 60px;
  }
</style>
