<template>
 <section>
<div>
    <!-- 订单详情 -->
    <el-dialog
            :title="orderDetailDialog.title"
            center
            :visible.sync="orderDetailDialog.dialogVisible"
            width="80%"
            :before-close="handleOrderDetailDialogClose">
        <div>
            <el-form ref="orderDetail" :model="orderDetail" label-width="120px">
                 <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">订单信息</span>
                        <el-button style="float: right; padding: 3px 0" type="text">
                            <a :href="orderDetail.protocolUrl" v-if="orderDetail.protocolUrl!=''"
                               target="_blank"
                               class="buttonText" >购车协议</a></el-button>
                    </div>
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
                                应付金额：{{orderDetail.payableAmount}}元
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
                                运费：{{orderDetail.freightAmount}}元
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
                                已支付金额：{{orderDetail.paidAmount}}元
                            </el-col>
                            <el-col :span="8">
                                支付方式：{{orderDetail.paymentMethodId}}
                            </el-col>
                            <el-col :span="8">
                                支付时间：{{orderDetail.payTime}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                订单备注：{{orderDetail.remark}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                 <!--收货人信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">收货人信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                收货人姓名：{{orderDetail.receiverName}}
                            </el-col>

                            <el-col :span="12" v-if="orderDetail.receiverName!=''">
                                所在地区：{{orderDetail.receiverProvinceName}}/{{orderDetail.receiverCityName}}/{{orderDetail.receiverDistrictName}}/{{orderDetail.receiverTownName}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-col :span="10">
                                收货人手机号：{{orderDetail.receiverMobile}}
                        </el-col>
                        <el-row>
                            <el-col :span="12"  v-if="orderDetail.receiverName!=''">
                                详细地址：{{orderDetail.receiverAddress}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!--发票信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">发票信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                发票类型：{{orderDetail.invoiceTypeName}}
                            </el-col>
                            <el-col :span="8" v-if="orderDetail.invoiceType!=1">
                                发票抬头: {{orderDetail.invoiceTitle}}
                            </el-col>
                            <el-col :span="8" v-if="orderDetail.invoiceType!=1&&orderDetail.invoiceTaxid!=''">
                                企业税号: {{orderDetail.invoiceTaxid}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!--商品信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">商品信息</span>
                    </div>
                         <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                         <el-table-column
                            type="index"
                                label="序号"
                            width="50">
                        </el-table-column>
                        <el-table-column
                                prop="productName"
                                label="商品名称">
                        </el-table-column>
                        <el-table-column
                                prop="productSkuNo"
                                label="商品SkuNo">
                        </el-table-column>
                        <el-table-column
                                prop="productPrice"
                                label="商品价格(元)"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="salePrice"
                                label="销售价格(元)"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                label="数量"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                prop="discountTotal"
                                label="折扣金额(元)"
                                width="120">
                        </el-table-column>
                    </el-table>
                </el-card>

                <!--物流信息信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">物流信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                快递方式：{{orderDetail.deliveryTypeName}}
                            </el-col>
                            <el-col :span="8">
                                物流公司：{{orderDetail.expressName}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                快递单号：{{orderDetail.expressNo}}
                            </el-col>
                            <el-col :span="12">
                                发货时间：{{orderDetail.expressTime}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="orderDetailDialog.dialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</div>
 </section>
</template>

<script>
export default {
  data () {
    return {
      orderDetail: {},
      orderDetailDialog: {
        title: '订单详情',
        dialogVisible: false
      },
      tableData: []
    }
  },
  methods: {
    async showOrderDetail (orderId) {
      let _this = this
      let param = {}
      param.orderId = orderId
      let response = await this.$services.order.orderDetail(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.orderDetail = data
        _this.orderDetail.orderId = orderId
        _this.orderDetail.productName = data.itemList[0].productName
        _this.orderDetail.createTime = timestampToTime(data.createTime)
        _this.orderDetail.payTime = timestampToTime(data.payTime)
        _this.orderDetail.payEndTime = timestampToTime(data.payEndTime)
        _this.orderDetail.expressTime = timestampToDate(data.expressTime)
        _this.tableData = data.itemList
        this.orderDetailDialog.dialogVisible = true
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    handleOrderDetailDialogClose () {
      this.orderDetailDialog.dialogVisible = false
      this.orderDetail = {}
    }
  }
}

function timestampToTime (formatDate) {
  if (formatDate === undefined || formatDate === '' || formatDate == null) {
    return ''
  }
  var date = new Date(formatDate) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  var h = date.getHours() > 9 ? date.getHours() + ':' : '0' + date.getHours() + ':'
  var m = date.getMinutes() > 9 ? date.getMinutes() + ':' : '0' + date.getMinutes() + ':'
  var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return Y + M + D + h + m + s
}
function timestampToDate (formatDate) {
  if (formatDate === undefined || formatDate === '' || formatDate == null) {
    return ''
  }
  var date = new Date(formatDate)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  return Y + M + D
}
</script>
<style scoped>
.text {
        font-size: 14px;
    }
.title{
    font-size: 14px;
    font-weight:bold;
}

.item {
    margin-bottom: 18px;
}
.box-card{
    margin-top: 5px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
