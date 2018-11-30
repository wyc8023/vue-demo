<template>
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
                </el-card>

                <!--客户信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">客户信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="8">
                                客户姓名：{{orderDetail.receiverName}}
                            </el-col>
                            <el-col :span="8">
                                客户手机号: {{orderDetail.receiverMobile}}
                            </el-col>
                            <el-col :span="8">
                                提车城市: {{orderDetail.receiverProvinceName}}/{{orderDetail.receiverCityName}}
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <!--车辆信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">车辆信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                物料号：{{orderDetail.productSkuNo}}
                            </el-col>
                            <el-col :span="8" v-if="orderDetail.stockTypeStr!=''">
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
                </el-card>

                <!--经销商信息-->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">经销商信息</span>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                经销商名称：{{orderDetail.shopName}}
                            </el-col>
                            <el-col :span="8">
                                经销商电话：{{orderDetail.receiverPhone}}
                            </el-col>
                        </el-row>
                    </div>
                    <div  class="text item">
                        <el-row>
                            <el-col :span="10">
                                经销商编码：{{orderDetail.shopId}}
                            </el-col>
                            <el-col :span="12">
                                经销商地址：{{orderDetail.receiverAddress}}
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
</template>

<script>
export default {
  data () {
    return {
      orderDetail: {},
      orderDetailDialog: {
        title: '订单详情',
        dialogVisible: false
      }
    }
  },
  methods: {
    async showOrderDetail (orderId) {
      let _this = this
      this.$services.order.orderDetail({'orderId': orderId, 'type': 'real'}).then((resp) => {
        let data = resp.result.data
        _this.orderDetail = data
        _this.orderDetail.orderId = orderId
        _this.orderDetail.productName = data.itemList[0].productName
        _this.orderDetail.productSkuNo = data.itemList[0].productSkuNo
        _this.orderDetail.createTime = timestampToTime(data.createTime)
        _this.orderDetail.payTime = timestampToTime(data.payTime)
        _this.orderDetail.payEndTime = timestampToTime(data.payEndTime)
        this.orderDetailDialog.dialogVisible = true
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
    handleOrderDetailDialogClose () {
      this.orderDetailDialog.dialogVisible = false
      this.orderDetail = {}
    }
  },
  components: {

  }
}

function timestampToTime (formatDate) {
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
}
</script>

<style>
.button{
    display:block;
    margin:0 auto
    }
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
</style>
