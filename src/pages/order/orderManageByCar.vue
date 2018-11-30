<template>
<div>
  <el-form ref="form" :model="form" label-width="80px">
     <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
             <el-input v-model="form.searchKey" clearable placeholder="请输入订单号、客户姓名、手机号"></el-input>
          </div>
        </li>
             <li class="clearfix">
          <label>订单状态</label>
          <div class="input" >
            <el-select style="width:217px" v-model="form.orderStatus" multiple  @visible-change="orderStatusVisibleChange" >
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
      <li class="clearfix" style="margin-left: 10px;">
        <div>
          <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">搜索</el-button>
          <!-- <el-button class="search" type="primary"  @click="AllSearch" icon="el-icon-search">全部显示</el-button> -->
          <el-button class="search" type="primary" icon="el-icon-download" @click="orderExport">导出</el-button>
        </div>
        </li>
        </ul>
         </div>
         <el-row>
          <div class="statistics_div">
            <div>共计订单:{{total}}条&nbsp;&nbsp;&nbsp;&nbsp; 已支付订单:{{payNum}}条&nbsp;&nbsp;&nbsp; 已收款：{{payMoney}}元</div>
            </div>
        </el-row>
    </el-form>

    <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="拼命加载中"
            border
            style="width: 100%">
            <el-table-column
               type="index"
                label="序号"
               width="50">
        </el-table-column>
        <el-table-column
                prop="orderId"
                label="订单号"
                width="160">
        </el-table-column>
        <el-table-column
                prop="orderAmount"
                label="订单金额(元)" width="110">
        </el-table-column>

          <el-table-column
                prop="receiverName"
                label="客户姓名" width="100">
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
                prop="orderStatus"
                label="订单状态" width="90" >
        </el-table-column>
         <el-table-column
                prop="createTime"
                label="下单时间" :formatter="dateFormat" width="170">
        </el-table-column>
        <el-table-column
                prop="payTime"
                label="支付时间" :formatter="dateFormat" width="170">
        </el-table-column>

        <el-table-column
                label="操作">
            <template slot-scope="scope">
                <el-button @click="detailClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button v-if="scope.row.orderStatusId=='65'" @click="handleAuditDialogClick(scope.row)" type="text" size="small">审核</el-button>
                <el-button v-if="scope.row.orderStatusId=='65'" @click="editOrderClick(scope.row)" type="text" size="small">修改</el-button>
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
                            <el-input v-model="auditForm.reason" ref="auditReason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template>
            <el-table :data="auditRecord" highlight-current-row @selection-change="selsChange" style="width: 90%;margin-left:30px;" v-if="auditRecord!=''">
                  <!--v-loading="loading" element-loading-text="拼命加载中""-->
                  <el-table-column type="index" width="40"></el-table-column>
                  <el-table-column prop="operator" label="审核人"  width="110" ></el-table-column>
                  <el-table-column prop="createTime" label="审核时间"   :formatter="dateFormat" width="180" ></el-table-column>
                  <el-table-column prop="logContent" label="备注"  ></el-table-column>
                </el-table>
                </template>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleAuditDialogClose">取 消</el-button>
            <el-button type="primary" @click="handleAuditDialogSbumit">提 交</el-button>
        </span>
    </el-dialog>
     <!-- 订单详情 -->
    <order-detail ref="myOrderDetail"></order-detail>
     <!-- 订单编辑 -->
    <el-dialog
            :title="editOrderDetailDialog.title"
            center
            :visible.sync="editOrderDetailDialog.dialogVisible"
            width="80%"
            :before-close="handleEditOrderDetailDialogClose">
        <div>
            <el-form ref="orderDetail" :model="orderDetail" label-width="120px">

              <el-collapse v-model="activeNames" >
                <el-collapse-item  name="orderInfo">
                  <template slot="title">
                   <span class="title">订单信息</span>
                        <el-button style="float: right; padding: 3px 0" type="text">
                            <a :href="orderDetail.protocolUrl"  v-if="orderDetail.protocolUrl!=''"
                               target="_blank"
                               class="buttonText" >&nbsp;&nbsp;|&nbsp;&nbsp;购车协议</a></el-button>
                  </template>
                 <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                订单号：{{orderDetail.orderId}}
                            </el-col>
                            <el-col :span="8">
                                订单金额：{{orderDetail.orderAmount}}元
                            </el-col>
                            <el-col :span="8">
                                订单状态：{{orderDetail.orderStatusName}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                订单来源：{{orderDetail.orderSourceName}}
                            </el-col>
                            <el-col :span="8">
                                订单类型：{{orderDetail.orderTypeName}}
                            </el-col>
                            <el-col :span="8">
                                预付定金金额：{{orderDetail.prepaidAmount}}元
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                优惠券抵扣金额：{{orderDetail.couponAmount}}元
                            </el-col>
                            <el-col :span="8">
                                折扣金额：{{orderDetail.discountAmount}}元
                            </el-col>
                            <el-col :span="8">
                                积分抵扣金额：{{orderDetail.pointsAmount}}元
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                折后金额：{{orderDetail.payableAmount}}元
                            </el-col>
                            <el-col :span="8">
                                下单时间：{{orderDetail.createTime}}
                            </el-col>
                            <el-col :span="8">
                                支付截止时间：{{orderDetail.payEndTime}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                支付方式：{{orderDetail.paymentMethodId}}
                            </el-col>
                            <el-col :span="8">
                                支付时间：{{orderDetail.payTime}}
                            </el-col>
                            <el-col :span="8">
                                订单备注：{{orderDetail.remark}}
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!--客户信息-->
                <el-collapse-item  name="userInfo">
                  <template slot="title">
                    <span class="title">客户信息</span>
                  </template>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                客户姓名：{{orderDetail.receiverName}}
                            </el-col>
                            <el-col :span="8">
                                客户手机号: {{orderDetail.receiverMobile}}
                            </el-col>
                            <el-col :span="8">
                                提车城市:  {{orderDetail.receiverProvinceName}}/{{orderDetail.receiverCityName}}
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!--车辆信息-->
                <el-collapse-item name="carInfo">
                  <template slot="title">
                    <span class="title">车辆信息</span>
                  </template>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                物料号：{{orderDetail.productSkuNo}}
                            </el-col>
                            <el-col :span="8">
                                购车订单类型：{{orderDetail.stockTypeStr}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                车型配置：{{orderDetail.productName}}
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!--经销商信息-->
                <el-collapse-item  name="shopInfo">
                   <template slot="title">
                     <span class="title">经销商信息</span>
                  </template>

                    <div  class="text item">
                       <el-row>
                              <el-col :span="24">
                                <el-form-item label="经销商">
                                    <el-select v-model="orderDetail.provinceId"  @change="provinceChange('1')" class="input-width">
                                        <el-option
                                                v-for="item in provinceList"
                                                :key="item.areaId"
                                                :label="item.areaName"
                                                :value="item.areaId">
                                        </el-option>
                                    </el-select>
                                     <el-select v-model="orderDetail.cityId"  @change="cityChange('1')" class="input-width">
                                        <el-option
                                                v-for="item in cityList"
                                                :key="item.areaId"
                                                :label="item.areaName"
                                                :value="item.areaId">
                                        </el-option>
                                    </el-select>
                                     <el-select v-model="orderDetail.dealerId"  @change="dealerChange" style="width:320px;">
                                        <el-option
                                                v-for="item in dealerList"
                                                :key="item.dealerCode"
                                                :label="item.dealerName"
                                                :value="item.dealerCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row>
                          <el-col :span="8">
                                <el-form-item label="经销商电话">
                                    <el-input v-model="orderDetail.receiverPhone" readonly></el-input>
                                </el-form-item>
                            </el-col>
                              <el-col :span="8">
                                <el-form-item label="经销商编码">
                                    <el-input v-model="orderDetail.shopId" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="经销商地址">
                                    <el-input v-model="orderDetail.receiverAddress" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
              </el-collapse>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
             <el-button @click="handleEditOrderDetailDialogClose">取 消</el-button>
             <el-button type="primary" @click="editOrderDetailSbumit">保存</el-button>
        </span>
    </el-dialog>

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
</template>

<script>
export default {
  components: {
    'order-detail': require('./orderDetail.vue').default
  },
  data () {
    return {
      formHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
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
      loading: false,
      form: {
        searchKey: '',
        orderStatus: '',
        orderType: '2',
        orderSource: '',
        receiverMobile: '',
        platformId: '103001',
        createTime: ''
      },
      auditForm: {
        isApprove: '1',
        reason: ''
      },
      deliverForm: {
        orderId: '',
        expressCode: '',
        expressName: '',
        expressNo: ''
      },
      orderDetail: {},
      stockTypeList: [{'id': 1, 'name': '现货'}, {'id': 2, 'name': '预售'}],
      tableData: [],
      orderStatusList: [],
      orderTypeList: [],
      orderSourceList: [],
      platformIdList: [],
      payNum: 0,
      payMoney: 0,
      auditRecord: [],
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
      orderDetailDialog: {
        title: '订单详情',
        dialogVisible: false
      },
      editOrderDetailDialog: {
        title: '订单修改',
        dialogVisible: false
      },
      realMobileDialog: {
        title: '客户手机号',
        dialogVisible: false
      },
      realMobile: {},
      selectionStatus: {
        orderStatusLoaded: false,
        orderTypeLoaded: false,
        orderSourceLoaded: false,
        platformIdLoaded: false
      },
      activeNames: ['carInfo', 'shopInfo'],
      provinceList: [],
      cityList: [],
      dealerList: []
    }
  },
  methods: {
    searchByKeyWord () {
      let _this = this
      this.page.currentPage = 1
      this.page.pageSize = 10
      let form = this.form
      if (form.searchKey === '' && form.orderStatus.length === 0 && form.createTime === '') {
        _this.$message({
          showClose: true,
          message: '请输入订单号/客户姓名/手机号/订单状态/创建时间',
          type: 'warning'
        })
        return
      }
      this.search()
    },
    selsChange: function (sels) {
      this.sels = sels
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
      _this.loading = true
      let param = {}
      param.platformId = this.form.platformId
      param.orderType = this.form.orderType
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize
      this.$services.order.orderList(param, this.formHeaders).then((resp) => {
        let data = resp.result.data
        if (data == null) {
          _this.total = 0
          _this.payNum = 0
          _this.payMoney = 0
          _this.$message({
            showClose: true,
            message: '没有查询到你所需要的数据！',
            type: 'warning'
          })
        } else {
          _this.tableData = data.orderList
          _this.total = data.orderCount
          _this.payNum = data.payNum
          _this.payMoney = data.payMoney
        }
      }).catch(error => {
        console.log(error.response.data)
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
      _this.loading = false
    },
    search () {
      let _this = this
      let param = {}
      let form = this.form
      _this.loading = true
      if (form.searchKey !== '') {
        param.searchKey = form.searchKey
      }
      if (form.orderStatus !== '') {
        param.paramOrderStatus = form.orderStatus.join(',')
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
      if (form.createTime !== '' && form.createTime != null) {
        param.createTimeBegin = form.createTime[0]
        param.createTimeEnd = form.createTime[1]
      }
      this.$services.order.orderList(param).then((resp) => {
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
          _this.tableData = data.orderList
          _this.total = data.orderCount
          _this.payNum = data.payNum
          _this.payMoney = data.payMoney
        }
      }).catch(error => {
        console.log(error.response.data)
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
      _this.loading = false
    },
    detailClick (row) {
      this.$refs.myOrderDetail.showOrderDetail(row.orderId)
    },

    editOrderClick (row) {
      let _this = this
      this.$services.order.orderDetail({'orderId': row.orderId, 'type': 'real'}).then((resp) => {
        let data = resp.result.data
        _this.orderDetail = data
        _this.orderDetail.orderId = row.orderId
        _this.orderDetail.productName = data.itemList[0].productName
        _this.orderDetail.productSkuNo = data.itemList[0].productSkuNo
        _this.orderDetail.createTime = this.$utils.timestampToTime(data.createTime)
        _this.orderDetail.payTime = this.$utils.timestampToTime(data.payTime)
        _this.orderDetail.payEndTime = this.$utils.timestampToTime(data.payEndTime)
        this.editOrderDetailDialog.dialogVisible = true
        _this.getProviceList()
        _this.orderDetail.provinceId = data.receiverProvince
        _this.provinceChange('0')
        _this.orderDetail.cityId = data.receiverCity
        _this.cityChange('0')
        _this.orderDetail.dealerId = data.shopId
      }).catch(error => {
        if (error.response.data) {
          _this.$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
        } else {
          _this.$message({
            showClose: true,
            message: '查询失败,稍后再试',
            type: 'error'
          })
        }
      })
    },
    selectRealMobileClick (row) {
      let _this = this
      this.$services.order.addSelectTelLog({'orderId': row.orderId}).then((resp) => {
        let data = resp.result.data
        _this.realMobile.receiverMobile = data
        this.realMobileDialog.dialogVisible = true
      }).catch(error => {
        if (error.response.data) {
          _this.$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
        } else {
          _this.$message({
            showClose: true,
            message: '查询失败,稍后再试',
            type: 'error'
          })
        }
      })
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
    handleAuditDialogRecord () {
      let _this = this
      this.$services.order.orderAuditLog({'orderId': this.auditForm.orderId}).then((resp) => {
        _this.auditRecord = resp.result.data
      }).catch(error => {
        if (error.response.data) {
          _this.$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
        } else {
          _this.$message({
            showClose: true,
            message: '查询失败,稍后再试',
            type: 'error'
          })
        }
      })
    },

    handleAuditDialogClick (row) {
      // 审核点击
      this.auditForm.orderId = row.orderId
      this.handleAuditDialogRecord()
      this.auditDialog.dialogVisible = true
    },
    handleAuditDialogClose () {
      this.auditDialog.dialogVisible = false
      this.auditForm.reason = ''
      this.auditForm.isApprove = '1'
    },

    handleAuditDialogSbumit () {
      let _this = this
      if (this.auditForm.isApprove === 0 && (this.auditForm.reason == null || this.auditForm.reason === '')) {
        _this.$message({
          showClose: true,
          message: '请填写审核不通过原因',
          type: 'warm'
        })
        return
      }
      var param = {}
      param.orderId = this.auditForm.orderId
      param.isApprove = this.auditForm.isApprove
      param.reason = this.auditForm.reason
      this.$services.order.auditOrder(param).then((resp) => {
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
      }).catch(error => {
        if (error.response.data) {
          _this.$message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
        } else {
          _this.$message({
            showClose: true,
            message: '查询失败,稍后再试',
            type: 'error'
          })
        }
      })
    },
    orderStatusVisibleChange () {
      if (!this.selectionStatus.orderSourceLoaded) {
        let _this = this
        this.$services.order.orderStatus().then((resp) => {
          let data = resp.result.data
          data.unshift({'statusId': '', 'statusName': '请选择'})
          _this.orderStatusList = data
          _this.selectionStatus.orderSourceLoaded = true
        }).catch(error => {
          if (error.response.data) {
            _this.$message({
              showClose: true,
              message: error.response.data.message,
              type: 'error'
            })
          } else {
            _this.$message({
              showClose: true,
              message: '查询失败,稍后再试',
              type: 'error'
            })
          }
        })
      }
    },
    orderTypeVisibleChange () {
      if (!this.selectionStatus.orderTypeLoaded) {
        let _this = this
        this.$services.order.orderType().then((resp) => {
          let data = resp.result.data
          data.unshift({'typeId': '', 'typeName': '请选择'})
          _this.orderTypeList = data
          _this.selectionStatus.orderTypeLoaded = true
        }).catch(error => {
          if (error.response.data) {
            _this.$message({
              showClose: true,
              message: error.response.data.message,
              type: 'error'
            })
          } else {
            _this.$message({
              showClose: true,
              message: '查询失败,稍后再试',
              type: 'error'
            })
          }
        })
      }
    },
    async getProviceList () {
      let _this = this
      let param = {}
      param.pid = '0'
      let response = await this.$services.area.getAreaInfo(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.provinceList = data
      }
    },
    async provinceChange (val) {
      let _this = this
      let param = {}
      param.pid = this.orderDetail.provinceId
      let response = await this.$services.area.getAreaInfo(param)
      if (response.status === 200) {
        let data = response.result.data
        if (val === '1') {
          _this.orderDetail.cityId = ''
          _this.orderDetail.dealerId = ''
        }
        _this.cityList = data
      }
    },
    async cityChange (val) {
      let _this = this
      let param = {}
      param.provinceId = this.orderDetail.provinceId
      param.cityId = this.orderDetail.cityId
      param.type = 1
      param.skuNo = this.orderDetail.productSkuNo
      let response = await this.$services.dms.queryDealerByCity(param)
      if (response.status === 200) {
        let data = response.result.data
        if (val === '1') {
          _this.orderDetail.dealerId = ''
        }
        _this.dealerList = data
      }
    },
    dealerChange () {
      let shopId = this.orderDetail.dealerId
      for (let dealer of this.dealerList) {
        if (shopId === dealer.dealerCode) {
          this.orderDetail.receiverPhone = dealer.linkPhone
          this.orderDetail.receiverAddress = dealer.linkAddr
          this.orderDetail.shopId = dealer.dealerCode
          this.orderDetail.stockType = dealer.stockType
          this.orderDetail.stockTypeStr = dealer.stockType === '1' ? '现货' : '预售'
        }
      }
    },
    editOrderDetailSbumit () {
      let _this = this
      if (_this.orderDetail.shopId === '' || _this.orderDetail.dealerId === '') {
        _this.$message({
          showClose: true,
          message: '请选择经销商'
        })
        return
      }
      var param = {}
      param.shopId = _this.orderDetail.shopId
      param.orderId = _this.orderDetail.orderId
      param.stockType = _this.orderDetail.stockType
      this.$services.order.modifyOrderShopId(param, this.formHeaders).then((resp) => {
        _this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        _this.editOrderDetailDialog.dialogVisible = false
      }).catch(resp => {
        _this.$message({
          showClose: true,
          message: '修改失败,稍后再试',
          type: 'error'
        })
      })
    },
    orderExport () {
      let _this = this
      let param = new URLSearchParams()
      let form = this.form
      if (form.searchKey === '' && form.orderStatus.length === 0 && form.createTime === '') {
        _this.$message({
          showClose: true,
          message: '请输入订单号/客户姓名/手机号/订单状态/创建时间',
          type: 'warning'
        })
        return
      }
      if (form.searchKey !== '') {
        param.append('searchKey', form.searchKey)
      }
      if (form.orderStatus !== '') {
        param.append('paramOrderStatus', form.orderStatus.join(','))
      }
      if (typeof (form.orderType) === 'number') {
        param.append('orderType', form.orderType)
      }
      if (typeof (form.orderSource) === 'number') {
        param.append('orderSource', form.orderSource)
      }
      if (form.platformId !== '') {
        param.append('platformId', form.platformId)
      }
      if (form.createTime !== '' && form.createTime != null) {
        param.append('createTimeBegin', form.createTime[0])
        param.append('createTimeEnd', form.createTime[1])
      }
      window.location.href = 'http://dmis-api.xtev.cn/order/v1/mis/orderExport?' + param
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
    },
    handleOrderDetailDialogClose () {
    },
    handleEditOrderDetailDialogClose () {
      this.editOrderDetailDialog.dialogVisible = false
      this.orderDetail = {}
    }
  },
  mounted () {
    this.AllSearch()
  }
}
</script>

<style scoped>
  .statistics_div {
  float:right
  }
  .form_item_style{
  margin-left: -90px
  }
  .select_muli_hidden{
    overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  }
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
    width: 318px;
  }
  .input-width{
    width: 140px;
  }
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
