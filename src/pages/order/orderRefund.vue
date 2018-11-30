<template>
 <section>
<div>
     <el-form ref="form" :model="form" label-width="80px">
<div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input v-model="form.searchKey" placeholder="请输入订单号、客户姓名"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>退款状态</label>
          <div class="input">
            <el-select   v-model="form.orderStatus"  @visible-change="orderStatusVisibleChange"  placeholder="请选择退款状态">
                        <el-option
                                v-for="item in orderStatusList"
                                :key="item.statusId"
                                :label="item.statusName"
                                :value="item.statusId">
                        </el-option>
                    </el-select>
          </div>
        </li>
        <li class="clearfix">
        <label>订单类型</label>
        <div class="input">
           <el-select v-model="form.orderType"  @visible-change="orderTypeVisibleChange">
                <el-option
                        v-for="item in orderTypeList"
                        :key="item.typeId"
                        :label="item.typeName"
                        :value="item.typeId">
                </el-option>
            </el-select>
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
        <li class="clearfix" style="margin-left: 20px;">
         <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">搜索</el-button>
         <!-- <el-button class="search" type="primary" icon="el-icon-search" @click="AllSearch">全部显示</el-button> -->
         <el-button class="search" type="primary" icon="el-icon-download" @click="refundExport">导出</el-button>
        </li>
        </ul>
         </div>
          <el-row>
          <div class="statistics_div">
            <div>共计订单:{{total}}条&nbsp;&nbsp;&nbsp;&nbsp; 已退款:{{payNum}}条&nbsp;&nbsp;&nbsp; 已退款：{{payMoney}}元</div>
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
                width="160">
        </el-table-column>
          <el-table-column
                prop="receiverName"
                label="客户姓名"
                width="100">
        </el-table-column>
          <el-table-column
                prop="receiverMobile"
                label="手机号" width="120">
                <template slot-scope="scope" v-if="scope.row.receiverMobile != null">
                   <el-tooltip content="点击查看完整手机号" placement="bottom"  effect="light">
                       <el-button type="text"  @click="selectRealMobileClick(scope.row)" >{{scope.row.receiverMobile}}</el-button>
                   </el-tooltip>
               </template>
        </el-table-column>
          <el-table-column
                prop="requestAmount"
                label="申请退款(元)">
        </el-table-column>
        <el-table-column
                prop="statusStr"
                label="退款状态">
        </el-table-column>
        <el-table-column
                prop="refundId"
                label="退款单号">
        </el-table-column>
        <el-table-column
                prop="refundAmount"
                label="实际退款(元)">
        </el-table-column>

        <el-table-column
                prop="refundTime"
                label="退款时间" >
        </el-table-column>
        <!-- <el-table-column
                prop="payTime"
                label="支付时间"  :formatter="dateFormat">
        </el-table-column> -->

        <el-table-column
                label="操作">
            <template slot-scope="scope">
                <el-button @click="detailClick(scope.row)" type="text" size="small">查看详情</el-button>
                <!-- <el-button  @click="selectRealMobileClick(scope.row)" type="text" size="small">查看手机号</el-button> -->
                <el-button v-if="scope.row.status==120" @click="handleAuditDialogClick(scope.row)" type="text" size="small">审核</el-button>
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
    <!-- 审核 -->
    <el-dialog
            :title="auditDialog.title"
            center
            :visible.sync="auditDialog.dialogVisible"
            width="50%"
            :before-close="handleAuditDialogClose">
        <div>
            <el-form ref="auditForm" :model="auditForm" label-width="80px">
                <el-row>
                    <el-col :span="12" :offset="1" center>
                       <el-form-item label="意见">
                        <el-radio v-model="auditForm.isApprove" label="200">通过</el-radio>
                        <el-radio v-model="auditForm.isApprove" label="300">不通过</el-radio>
                         </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" :offset="1">
                        <el-form-item label="原因">
                            <el-input v-model="auditForm.reason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="auditDialog.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAuditDialogSbumit">提 交</el-button>
        </span>
    </el-dialog>
         <!-- 订单详情 -->
      <order-detail ref="myOrderDetail"></order-detail>

        <!-- 订单详情all -->
      <order-detail-all ref="myOrderDetailAll"></order-detail-all>

      <!-- 真实手机 -->
    <el-dialog
            :title="realMobileDialog.title"
            center
            :visible.sync="realMobileDialog.dialogVisible"
            width="30%"
            :before-close="handleRealMobileDialogClose">
        <div>
            <el-form ref="realMobile" :model="realMobile" label-width="180px">
                <el-row>
                     <el-col :span="12" :offset="6">
                            <el-input v-model="realMobile.receiverMobile" readonly></el-input>
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
  components: {
    'order-detail': require('./orderDetail.vue').default,
    'order-detail-all': require('./orderDetailAll.vue').default

  },
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
      auditDialog: {
        title: '退款审核',
        dialogVisible: false
      },
      orderDetailDialog: {
        title: '订单详情',
        dialogVisible: false
      },
      selectionStatus: {
        orderStatusLoaded: false,
        orderTypeLoaded: false,
        orderSourceLoaded: false,
        platformIdLoaded: false
      },
      realMobileDialog: {
        title: '客户手机号',
        dialogVisible: false
      },
      realMobile: {}
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
    async AllSearch () {
      let _this = this
      let param = {}
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize

      let response = await this.$services.order.orderRefund(param)
      if (response.status === 200) {
        let data = response.result.data
        if (data == null) {
          _this.total = 0
          _this.payNum = 0
          _this.payMoney = 0
          _this.tableData = ''
          _this.$message({
            showClose: true,
            message: '没有查询到你所需要的数据！'
          })
        } else {
          _this.tableData = data.refundList
          _this.total = data.refundCount
          _this.payNum = data.refundOrderNum
          _this.payMoney = data.refundSum
        }
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    async search () {
      let _this = this
      let param = {}
      let form = this.form
      if (form.searchKey !== '') {
        param.searchKey = form.searchKey
      }
      if (typeof (form.orderStatus) === 'number') {
        param.status = form.orderStatus
      }
      if (typeof (form.orderType) === 'number') {
        param.orderType = form.orderType
      }

      if (typeof (form.orderSource) === 'number') {
        param.orderSource = form.orderSource
      }
      if (form.createTime !== '' && form.createTime !== null) {
        param.createTimeBegin = form.createTime[0]
        param.createTimeEnd = form.createTime[1]
      }
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize

      let response = await this.$services.order.orderRefund(param)
      if (response.status === 200) {
        let data = response.result.data
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
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    detailClick (row) {
      if (row.orderType === 2) {
        this.$refs.myOrderDetail.showOrderDetail(row.orderId)
      } else {
        this.$refs.myOrderDetailAll.showOrderDetail(row.orderId)
      }
    },
    async selectRealMobileClick (row) {
      let _this = this
      let param = {}
      param.orderId = row.orderId
      let response = await this.$services.order.addSelectTelLog(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.realMobile.receiverMobile = data
        _this.realMobileDialog.dialogVisible = true
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    handleRealMobileDialogClose () {
      this.realMobileDialog.dialogVisible = false
      this.realMobileDialog.receiverMobile = ''
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    handleAuditDialogClick (row) {
      // 审核点击
      this.auditForm.orderRefundId = row.orderRefundId
      this.auditDialog.dialogVisible = true
    },
    handleAuditDialogClose () {
      this.auditDialog.dialogVisible = false
      this.auditForm.orderRefundId = ''
    },
    async handleAuditDialogSbumit () {
      let _this = this
      let param = {}
      param.orderRefundId = this.auditForm.orderRefundId
      param.status = this.auditForm.isApprove
      param.reason = this.auditForm.reason
      if (this.auditForm.isApprove === 300 && (this.auditForm.reason === null || this.auditForm.reason === '')) {
        _this.$message({
          showClose: true,
          message: '请填写审核不通过原因',
          type: 'warm'
        })
        return
      }
      let response = await this.$services.order.refundCheckStatus(param)
      if (response.status === 200) {
        _this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
        _this.search()
        _this.auditForm = {
          isApprove: '200'
        }
        _this.auditDialog.dialogVisible = false
      } else {
        _this.$message({
          showClose: true,
          message: '审核失败,请稍后再试',
          type: 'error'
        })
      }
    },
    async  orderStatusVisibleChange () {
      if (!this.selectionStatus.orderSourceLoaded) {
        let _this = this
        let param = {}
        let response = await this.$services.order.getRefundStatus(param)
        if (response.status === 200) {
          let data = response.result.data
          data.unshift({'statusId': '', 'statusName': '请选择'})
          _this.orderStatusList = data
          _this.selectionStatus.orderSourceLoaded = true
        }
      }
    },
    async  orderTypeVisibleChange () {
      if (!this.selectionStatus.orderTypeLoaded) {
        let _this = this
        let param = {}
        let response = await this.$services.order.orderType(param)
        if (response.status === 200) {
          let data = response.result.data
          data.unshift({'typeId': '', 'typeName': '请选择'})
          _this.orderTypeList = data
          _this.selectionStatus.orderTypeLoaded = true
        }
      }
    },
    refundExport () {
      let param = new URLSearchParams()
      let form = this.form
      if (form.searchKey !== '') {
        param.append('searchKey', form.searchKey)
      }
      if (form.orderStatus !== '') {
        param.append('status', form.orderStatus)
      }
      if (typeof (form.orderType) === 'number') {
        param.append('orderType', form.orderType)
      }
      if (typeof (form.orderSource) === 'number') {
        param.append('orderSource', form.orderSource)
      }
      if (form.createTime !== '' && form.createTime !== null) {
        param.append('createTimeBegin', form.createTime[0])
        param.append('createTimeEnd', form.createTime[1])
      }
      window.location.href = 'http://dmis-api.xtev.cn/order/v1/mis/refundExport?' + param
    },
    handleOrderDetailDialogClose () {
      this.orderDetailDialog.dialogVisible = false
      this.orderDetail = {}
    }
  },
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
    width: 75px;
    margin-right: 16px;
  }
  .search-form li .input {
    float: left;
  }
  .search-form li .input .el-input {
    width: 204px;
  }
  .statistics_div {
  float:right
  }
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
