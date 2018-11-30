<template>
  <div>
 <el-form ref="form" :model="form" >
       <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input v-model="form.searchKey"  clearable  placeholder="请输入订单号、客户姓名"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>创建时间</label>
          <div class="input">
            <el-date-picker
      v-model="form.createTime"
      type="datetimerange"
      :picker-options="pickerOptions2"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd HH-mm-ss"
      align="right">
    </el-date-picker>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 0px;">
         <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">搜索</el-button>
         <!-- <el-button class="search" type="primary" icon="el-icon-search" @click="AllSearch">显示全部</el-button> -->
        </li>
        </ul>
         </div>
         <el-row>
          <div class="statistics_div">
            <div>共计订单:{{total}}条&nbsp;&nbsp;&nbsp;&nbsp;  已退款：{{payMoney}}元</div>
            </div>
        </el-row>
    </el-form>

    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column
                prop="orderId"
                label="订单号"
                width="160"
                 >
        </el-table-column>
        <el-table-column
                prop="refundId"
                label="退款单号"
                  >
        </el-table-column>
          <el-table-column
                prop="receiverName"
                label="客户姓名"
                 width="90">
        </el-table-column>

           <el-table-column
                prop="statusStr"
                label="退款状态" width="90">
        </el-table-column>

          <el-table-column
                prop="requestAmount"
                label="申请退款(元)" width="105">
        </el-table-column>

           <el-table-column
                prop="refundAmount"
                label="实际退款(元)" width="105">
        </el-table-column>

        <el-table-column
                prop="createTime"
                label="发起退款时间" :formatter="dateFormat"  width="160">
        </el-table-column>
        <el-table-column
                prop="payTime"
                label="支付时间"  :formatter="dateFormat"  width="160">
        </el-table-column>

        <el-table-column
                label="操作"  width="70">
            <template slot-scope="scope">
                <el-button @click="detailClick(scope.row)" type="text" size="small">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="page">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
       <!-- 订单详情 -->
      <order-detail ref="myOrderDetail"></order-detail>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions2: {
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
        searchKey: '',
        orderStatus: '',
        orderType: '',
        orderSource: '',
        receiverMobile: '',
        platformId: '',
        createTime: ''
      },
      auditForm: {
        isApprove: '200'
      },
      orderDetail: {},
      tableData: [],
      orderStatusList: [],
      orderTypeList: [],
      orderSourceList: [],
      platformIdList: [],
      payNum: 0,
      payMoney: 0,
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      orderDetailDialog: {
        title: '订单详情',
        dialogVisible: false
      },
      selectionStatus: {
        orderStatusLoaded: false,
        orderTypeLoaded: false,
        orderSourceLoaded: false,
        platformIdLoaded: false
      }
    }
  },
  methods: {
    searchByKeyWord () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.search()
    },
    dateFormat: function (row, column) {
      var timestamp = row[column.property]
      if (timestamp === undefined || timestamp === '' || timestamp === null) {
        return ''
      }
      return this.$utils.timestampToTime(timestamp)
    },
    AllSearch () {
      let _this = this
      let param = {}
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize
      this.$services.order.orderRefundList(param).then((resp) => {
        let data = resp.result.data
        if (data == null) {
          _this.total = 0
          _this.payNum = 0
          _this.payMoney = 0
          _this.tableData = ''
          _this.$message({
            showClose: true,
            message: '没有查询到你所需要的数据！',
            type: 'warning'
          })
        } else {
          _this.tableData = data.refundList
          _this.total = data.refundCount
          _this.payNum = data.refundOrderNum
          _this.payMoney = data.refundSum
        }
      }).catch(error => {
        console.log(error.response.data)
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
    },
    search () {
      let _this = this
      let param = {}
      let form = this.form
      if (form.searchKey !== '') {
        param.searchKey = form.searchKey
      }
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize
      if (form.createTime !== '' && form.createTime != null) {
        param.createTimeBegin = form.createTime[0]
        param.createTimeEnd = form.createTime[1]
      }
      this.$services.order.orderRefundList(param).then((resp) => {
        let data = resp.result.data
        if (data == null) {
          _this.total = 0
          _this.payNum = 0
          _this.payMoney = 0
          _this.tableData = ''
          _this.$message({
            showClose: true,
            message: '没有查询到您所需要的数据！',
            type: 'warning'
          })
        } else {
          _this.tableData = data.refundList
          _this.total = data.refundCount
          _this.payNum = data.refundOrderNum
          _this.payMoney = data.refundSum
        }
      }).catch(error => {
        console.log(error.response.data)
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
    },
    detailClick (row) {
      this.$refs.myOrderDetail.showOrderDetail(row.orderId)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    handleOrderDetailDialogClose () {
      this.orderDetailDialog.dialogVisible = false
      this.orderDetail = {}
    }
  },
  components: {
    'order-detail': require('./orderDetail.vue').default
  }
}
</script>

<style>
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
  .statistics_div {
 float:right
}
</style>
