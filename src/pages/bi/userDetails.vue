<template>
 <section>
<div>
    <el-form ref="form" :model="form">
      <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input v-model="form.keyword"  clearable  placeholder="请输入获客渠道或手机号"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>注册渠道</label>
          <div class="input">
            <el-checkbox-group  v-model="form.sources"  size="small">
              <el-checkbox-button style="margin-right:0px;width:auto"
                v-for="item in sourceData"
                :label="item.sourceCode"
                :key="item.sourceCode" >{{item.sourceName}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </li>
        <li class="clearfix">
          <label>注册时间</label>
          <div class="input">
            <el-date-picker
                    v-model="form.registerTime"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right">
            </el-date-picker>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 0px;">
         <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">查询</el-button>
         <el-button class="search" type="primary" icon="el-icon-download" @click="download">导出</el-button>
        </li>
        </ul>
         </div>
    </el-form>
    <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%">
        <el-table-column
                type="index"
                label="序号"
                width="80">
        </el-table-column>
        <el-table-column
                prop="nickName"
                label="用户名称">
        </el-table-column>
        <el-table-column
                prop=""
                label="手机号"
                width="180">
            <template slot-scope="scope" v-if="scope.row.mobile != null">
                <el-tooltip content="点击查看完整手机号" placement="bottom"  effect="light">
                    <el-button type="text"  @click="showMobileDialog(scope.row.userId)" >{{scope.row.mobile}}</el-button>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column
                prop="source"
                label="注册渠道"
                width="180">
        </el-table-column>
        <el-table-column
                prop="registerTime"
                label="注册时间"
                width="180"
                :formatter="timestampToTime">
        </el-table-column>
        <el-table-column
                prop="cpsName"
                label="获客渠道">
        </el-table-column>
    </el-table>
    <div class="page">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :page-count="total"
                :total="total">
        </el-pagination>
    </div>
    <!--手机号显示框-->
    <el-dialog
            :title="mobileDialog.title"
            center
            :visible.sync="mobileDialog.dialogVisible"
            width="30%"
            :before-close="handleMobileDialogClose"
            >
        <div>
            <el-form ref="mobileForm" :model="mobileForm" label-width="100px" >
                <el-row>
                    <el-col :span="10" :offset="7">
                      <el-input v-model="mobileForm.mobileNo"  readonly></el-input>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-dialog>
</div>
 </section>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      form: {
        keyword: '',
        sources: []
      },
      sourceData: [{'sourceCode': 'web_pc', 'sourceName': '官网'}, {'sourceCode': 'native_app', 'sourceName': 'APP'},
        {'sourceCode': 'wx_sub', 'sourceName': '公众号'}, {'sourceCode': 'wx_mapp', 'sourceName': '小程序'},
        {'sourceCode': 'web_m', 'sourceName': 'M站'}, {'sourceCode': 'web_pad', 'sourceName': 'D-BOX'}],
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      mobileDialog: {
        title: '用户手机号',
        dialogVisible: false
      },
      mobileForm: {
        mobileNo: ''
      }
    }
  },
  methods: {
    searchByKeyWord () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.search()
    },
    async search () {
      let _this = this
      let param = {}
      let form = this.form
      if (form.keyword !== '' && form.keyword !== undefined) {
        param.selectKey = form.keyword
      }
      if (form.sources !== '' && form.sources !== undefined) {
        param.source = form.sources + ''
      }
      if (form.registerTime !== '' && form.registerTime !== undefined) {
        param.beginRegisterTime = form.registerTime[0]
        param.endRegisterTime = form.registerTime[1]
      }
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize

      let response = await this.$services.bi.getDetailed(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.tableData = data.records
        _this.total = parseInt(data.totalRecord)
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    download () {
      let param = {}
      let form = this.form
      if (form.keyword !== '' && form.keyword !== undefined) {
        param.selectKey = form.keyword
      }
      if (form.sources !== '' && form.sources !== undefined) {
        param.source = form.sources + ''
      }
      if (form.registerTime !== '' && form.registerTime !== undefined) {
        param.beginRegisterTime = form.registerTime[0]
        param.endRegisterTime = form.registerTime[1]
      }
      window.location.href = 'http://dmis-api.xtev.cn/bi/v1/mis/exportDetailed?' + param
    },
    timestampToTime: function (row, column) {
      let formatDate = row[column.property]
      if (formatDate === undefined || formatDate === '') {
        return ''
      }
      var date = new Date(formatDate) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      var h = date.getHours() > 9 ? date.getHours() + ':' : '0' + date.getHours() + ':'
      var m =
        date.getMinutes() > 9
          ? date.getMinutes() + ':'
          : '0' + date.getMinutes() + ':'
      var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return Y + M + D + h + m + s
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    handleMobileDialogClose () {
      this.mobileDialog.dialogVisible = false
      this.mobileForm.mobileNo = ''
    },
    /* eslint-disable */
    async showMobileDialog(userid){
        if(userid === '' || userid === undefined){
            return;
        }
        let _this = this;
        let param ={}
        param.userId = userid
        let response = await this.$services.bi.getUserRealIphone(param)
        if (response.status === 200) {
          _this.mobileDialog.dialogVisible = true
          let data = response.result.data
           _this.mobileForm.mobileNo=data
        } else {
          _this.$message({
            showClose: true,
            message: '暂获取不到手机号,请稍后再试',
            type: 'error'
          })
        }
    }
  },// methods end
  mounted () {
      this.search()
  }
}
</script>
<style scoped>
  .search-form {
    background: #EEF1F6;
    margin-bottom: 30px;
    padding: 20px 0 0 20px;
    border-radius: 3px;
    font-size: 14px;
  }
  .search-form li {
    float: left;
    list-style: none;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .search-form li label {
    float: left;
    line-height: 40px;
    text-align: left;
    width: 80px;
    margin-right: 16px;
  }
  .search-form li .input {
    float: left;
  }
  .search-form li .input .el-input {
    width: 300px;
  }
  .el-dialog--small {
    width: auto;
}
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
