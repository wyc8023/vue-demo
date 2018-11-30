<template>
 <section>
<div>
    <el-form ref="form" :model="form">
    <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
        <label>订单号</label>
        <div class="input">
            <el-input v-model="form.orderId" clearable placeholder="请输入订单号"></el-input>
        </div>
        </li>
        <li class="clearfix">
        <label>订单状态</label>
        <div class="input">
           <el-select v-model="form.orderStatus"   @visible-change="orderStatusVisibleChange">
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
        <label>订单来源</label>
        <div class="input">
           <el-select v-model="form.orderSource"  @visible-change="orderSourceVisibleChange">
                <el-option
                        v-for="item in orderSourceList"
                        :key="item.sourceId"
                        :label="item.sourceName"
                        :value="item.sourceId">
                </el-option>
            </el-select>
        </div>
        </li>
        <li class="clearfix">
        <label>销售平台</label>
        <div class="input">
           <el-select v-model="form.platformId"  @visible-change="platformIdVisibleChange">
                <el-option
                        v-for="item in platformIdList"
                        :key="item.platformId"
                        :label="item.platformName"
                        :value="item.platformId">
                </el-option>
            </el-select>
        </div>
        </li>
        <li class="clearfix" style="margin-left: 0px;">
         <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">查询</el-button>
        </li>
        </ul>
        </div>
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
                label="收货人"
                width="100">
        </el-table-column>
        <el-table-column
                prop="orderAmount"
                label="订单金额(元)"
                width="110">
        </el-table-column>

        <el-table-column
                prop="orderStatus"
                label="订单状态"
                width="90">
        </el-table-column>

        <el-table-column
                prop="orderSource"
                label="订单来源"
                width="100">
        </el-table-column>

        <el-table-column
                prop="orderType"
                label="订单类型"
                 width="120">
        </el-table-column>
        <el-table-column
                prop="payEndTime"
                label="支付截止时间"
                :formatter="timestampToTime">
        </el-table-column>
        <el-table-column
                prop="payTime"
                label="支付时间"
                :formatter="timestampToTime">
        </el-table-column>
        <el-table-column
                label="操作"
                 width="100">
            <template slot-scope="scope">
                <el-button v-if="scope.row.orderTypeId!='2'" @click="detailAllClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button v-if="scope.row.orderTypeId=='2'" @click="detailClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button v-if="scope.row.orderStatusId=='101'" @click="handleDeliverDialogClick(scope.row)" type="text" size="small">发货</el-button>
                <el-button v-if="scope.row.orderStatusId=='65'&&scope.row.orderTypeId!='2'" @click="handleAuditDialogClick(scope.row)" type="text" size="small">审核</el-button>
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
                        <el-radio v-model="auditForm.isApprove" label="1">通过</el-radio>
                        <el-radio v-model="auditForm.isApprove" label="0">不通过</el-radio>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" :offset="1">
                        <el-form-item label="备注">
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
    <!-- 填写物流详情 -->
    <el-dialog
            :title="deliverDialog.title"
            center
            :visible.sync="deliverDialog.dialogVisible"
            width="45%"
            :before-close="handleDeliverDialogClose">
        <div>
            <el-form ref="deliverForm" :model="deliverForm" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="14" :offset="4">
                        <el-form-item label="物流公司" prop="expressCode">
                            <el-select v-model="deliverForm.expressCode" @change="deliverCompanyChange" class="input-class">
                                <el-option
                                        v-for="item in deliverCompany"
                                        :key="item.expressCode"
                                        :label="item.expressName"
                                        :value="item.expressCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14" :offset="4">
                        <el-form-item label="快递单号" prop="expressNo">
                            <el-input v-model="deliverForm.expressNo" clearable placeholder="请输入快递单号" class="input-class"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14" :offset="4">
                        <el-form-item label="发货时间" prop="expressDate">
                             <el-date-picker class="input-class"
                                v-model="deliverForm.expressDate"
                                type="date"
                                placeholder="选择日期"
                                 format="yyyy-MM-dd"
                                 value-format="yyyy-MM-dd HH:mm:ss">
                              </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleDeliverDialogClose">取 消</el-button>
            <el-button type="primary" @click="handleDeliverDialogSbumit">提 交</el-button>
        </span>
    </el-dialog>
    <!-- 订单详情 -->
    <order-detail-all ref="orderDetailAll"></order-detail-all>
    <order-detail ref="orderDetail"></order-detail>
  </div>
 </section>
</template>

<script>
export default {
  data () {
    return {
      form: {
        orderId: '',
        orderStatus: '',
        orderType: '',
        orderSource: '',
        receiverMobile: '',
        platformId: ''
      },
      auditForm: {
        isApprove: '1'
      },
      deliverForm: {
        orderId: '',
        expressCode: '',
        expressName: '',
        expressNo: '',
        expressDate: ''
      },
      rules: {
        expressCode: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        expressNo: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ],
        expressDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      deliverCompany: [{'expressCode': 'EMS', 'expressName': 'EMS'}, {'expressCode': 'STO', 'expressName': '申通物流'},
        {'expressCode': 'YTO', 'expressName': '圆通速递'}, {'expressCode': 'ZTO', 'expressName': '中通速递'},
        {'expressCode': 'ZJS', 'expressName': '宅急送'}, {'expressCode': 'YUNDA', 'expressName': '韵达快运'},
        {'expressCode': 'TTKDEX', 'expressName': '天天快递'}, {'expressCode': 'HTKY', 'expressName': '汇通快运'},
        {'expressCode': 'SF', 'expressName': '顺丰速运'}, {'expressCode': 'DBL', 'expressName': '德邦物流'}],
      tableData: [],
      orderStatusList: [],
      orderTypeList: [],
      orderSourceList: [],
      platformIdList: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      auditDialog: {
        title: '订单审核',
        dialogVisible: false
      },
      deliverDialog: {
        title: '填写快递信息',
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
  components: {
    'order-detail-all': require('./orderDetailAll.vue').default,
    'order-detail': require('./orderDetail.vue').default
  },
  methods: {
    searchByKeyWord () {
      if (this.form.orderId === '' && this.form.orderStatus === '' && this.form.orderType === '' &&
          this.form.orderSource === '' && this.form.platformId === '') {
        this.$message({
          showClose: true,
          message: '请输入查询条件'
        })
        return
      }
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.search()
    },
    async search () {
      let _this = this
      let param = {}
      let form = this.form
      if (form.orderId !== '') {
        param.orderId = form.orderId
      }
      if (form.orderStatus !== '' && form.orderStatus !== undefined) {
        param.orderStatus = form.orderStatus + ''
      }
      if (typeof (form.orderType) === 'number') {
        param.orderType = form.orderType
      }

      if (typeof (form.orderSource) === 'number') {
        param.orderSource = form.orderSource
      }
      if (form.platformId !== '') {
        param.platformId = form.platformId
      }
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize

      let response = await this.$services.order.orderList(param)
      if (response.status === 200) {
        let data = response.result.data
        if (data == null) {
          _this.tableData = []
          _this.total = 0
        } else {
          _this.tableData = data.orderList
          _this.total = data.orderCount
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
      this.$refs.orderDetail.showOrderDetail(row.orderId)
    },
    detailAllClick (row) {
      this.$refs.orderDetailAll.showOrderDetail(row.orderId)
    },
    timestampToTime: function (row, column) {
      let formatDate = row[column.property]
      if (formatDate === undefined || formatDate === '' || formatDate == null) {
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
    handleAuditDialogClick (row) {
      // 审核点击
      this.auditForm.orderId = row.orderId
      this.auditDialog.dialogVisible = true
    },
    handleAuditDialogClose () {
      this.auditDialog.dialogVisible = false
      this.auditForm.orderId = ''
    },
    async handleAuditDialogSbumit () {
      let _this = this
      let param = {}
      param.orderId = this.auditForm.orderId
      param.isApprove = this.auditForm.isApprove
      param.reason = this.auditForm.reason
      let response = await this.$services.order.auditOrder(param)
      if (response.status === 200) {
        _this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
        _this.search()
        _this.auditForm = {
          isApprove: '1'
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
        let response = await this.$services.order.orderStatus(param)
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
    async  orderSourceVisibleChange () {
      if (!this.selectionStatus.orderStatusLoaded) {
        let _this = this
        let param = {}
        let response = await this.$services.order.orderSource(param)
        if (response.status === 200) {
          let data = response.result.data
          data.unshift({'sourceId': '', 'sourceName': '请选择'})
          _this.orderSourceList = data
          _this.selectionStatus.orderStatusLoaded = true
        }
      }
    },
    async  platformIdVisibleChange () {
      if (!this.selectionStatus.platformIdLoaded) {
        let _this = this
        let param = {}
        let response = await this.$services.order.orderPlatform(param)
        if (response.status === 200) {
          let data = response.result.data
          data.unshift({'platformId': '', 'platformName': '请选择'})
          _this.platformIdList = data
          _this.selectionStatus.platformIdLoaded = true
        }
      }
    },
    handleDeliverDialogClose () {
      this.deliverForm.orderId = ''
      this.$refs['deliverForm'].resetFields()
      this.deliverDialog.dialogVisible = false
    },
    handleDeliverDialogClick (row) {
      // 点击填写物流
      this.deliverForm.orderId = row.orderId
      this.deliverDialog.dialogVisible = true
    },
    async handleDeliverDialogSbumit () {
      let _this = this
      let param = {}
      let form = this.deliverForm
      this.$refs['deliverForm'].validate(async (valid) => {
        if (valid) {
          param.orderId = form.orderId
          param.expressCode = form.expressCode
          param.expressName = form.expressName
          param.expressNo = form.expressNo
          param.expressDate = form.expressDate
          let response = await this.$services.order.orderDeliver(param)
          if (response.status === 200) {
            _this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            })
            _this.search()
            this.handleDeliverDialogClose()
          } else {
            _this.$message({
              showClose: true,
              message: '提交失败,稍后再试',
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    },
    deliverCompanyChange (val) {
      let companyList = this.deliverCompany
      for (var i = 0; i < companyList.length; i++) {
        if (companyList[i].expressCode === val) {
          this.deliverForm.expressCode = companyList[i].expressCode
          this.deliverForm.expressName = companyList[i].expressName
          break
        }
      }
    }
  },
  mounted () {
    // this.search()
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
    width: 217px;
  }
  .input-class{
    width:230px
  }
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
