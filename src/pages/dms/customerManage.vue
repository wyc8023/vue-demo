<template>
 <section>
  <div>
 <el-form ref="form" :model="form" >
     <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input  v-model="form.selectKey"  clearable  placeholder="请输入客户姓名、手机号"></el-input>
          </div>
        </li>
        <li class="clearfix">
           <el-button class="search" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </li>
        </ul>
     </div>
    </el-form>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column
                prop="customerName"
                label="客户名称"
                width="180">
        </el-table-column>
        <el-table-column
                prop="sex"
                label="性别">
        </el-table-column>

        <!-- //   <el-table-column
        //         prop="receiverName"
        //         label="省份">
        // </el-table-column> -->

           <el-table-column
                prop="customerTel"
                label="联系电话">
        </el-table-column>

        <el-table-column
                prop="customerAddress"
                label="联系地址">
        </el-table-column>

        <el-table-column
                label="操作">
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

     <!-- 用户详情 -->
    <el-dialog
            :title="customerDetailDialog.title"
            :visible.sync="customerDetailDialog.dialogVisible"
            width="80%"
            :before-close="handleCustomerDetailDialogClose">
        <div>
            <el-form ref="customerDetail" :model="customerDetail" label-width="120px">
               <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">客户信息</span>
                    </div>
                    <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      客户名称:{{customerDetail.customerName}}
                    </el-col>
                   <el-col :span="8">
                     客户等级:{{customerDetail.customerLevel}}
                    </el-col>
                  <el-col :span="8">
                     车辆vin:{{customerDetail.vin}}
                    </el-col>
                    </el-row>
                    </div>
                    <div  class="text item">
                <el-row>
                 <el-col :span="8">
                       网络订单编号:{{customerDetail.preOrderNo}}
                    </el-col>
                    <el-col :span="8">
                      客户手机:{{customerDetail.customerPhone}}
                    </el-col>
                    <el-col :span="8">
                      所属行业:{{customerDetail.tradeType}}
                    </el-col>
                </el-row>
                    </div>
              <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      客户性别:{{customerDetail.sex}}
                    </el-col>
                    <el-col :span="8">
                      兴趣爱好:{{customerDetail.hobbyId}}
                    </el-col>
                    <el-col :span="8">
                      联系地址:{{customerDetail.customerAddress}}
                    </el-col>
                </el-row>
              </div>
              <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      薪资水平:{{customerDetail.incomeId}}
                    </el-col>
                    <el-col :span="8">
                      客户电话:{{customerDetail.customerTel}}
                    </el-col>
                    <el-col :span="8">
                      文化水平:{{customerDetail.educDegree}}
                    </el-col>
                </el-row>
              </div>
              <div  class="text item">
                <el-row>
                   <el-col :span="8">
                     证件类型:{{customerDetail.customerDocumenttype}}
                    </el-col>
                    <el-col :span="8" >
                      出生日期:{{customerDetail.birth}}
                    </el-col>
                     <el-col :span="8">
                       证件号码:{{customerDetail.documentNum}}
                    </el-col>
                </el-row>
              </div>
              <div  class="text item">
                      <el-row aria-rowspan="3">
                 备注:{{customerDetail.remark}}
                      </el-row>
                     </div>
               </el-card>
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
      form: {
        selectKey: ''
      },
      customerDetail: {},
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      customerDetailDialog: {
        title: '客户详情',
        dialogVisible: false
      }
    }
  },
  methods: {
    selsChange: function (sels) {
      this.sels = sels
    },
    dateFormat: function (row, column) {
      var timestamp = row[column.property]
      if (timestamp === undefined) {
        return ''
      }
      return this.$utils.timestampToTime(timestamp)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    AllSearch () {
      let _this = this
      let param = {}
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize
      this.$services.dms.getCustomerList(param).then((resp) => {
        let data = resp.result.data
        if (data == null || data === '') {
          _this.$message({
            showClose: true,
            message: '没有查询到你所需要的数据！',
            type: 'warning'
          })
          _this.tableData = ''
          _this.total = 0
        } else {
          _this.tableData = data.carOwnerList
          _this.total = data.carOwnerCount
        }
      }).catch(error => {
        console.log(error.response.result)
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
      if (form.selectKey !== '') {
        param.selectKey = form.selectKey
      }
      param.page = this.page.currentPage
      param.perpage = this.page.pageSize
      this.$services.dms.getCustomerList(param).then((resp) => {
        let data = resp.result.data
        if (data == null || data === '') {
          _this.$message({
            showClose: true,
            message: '没有查询到你所需要的数据！',
            type: 'warning'
          })
          _this.tableData = ''
          _this.total = 0
        } else {
          _this.tableData = data.carOwnerList
          _this.total = data.carOwnerCount
        }
      }).catch(error => {
        console.log(error.result)
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
    },
    detailClick (row) {
      let _this = this
      this.$services.dms.getCustomerDeatil({'customerId': row.carownerId}).then((resp) => {
        let data = resp.result.data
        _this.customerDetail = data
        if (_this.customerDetail.birth != null && this.customerDetail.birth !== '') {
          _this.customerDetail.birth = this.$utils.timestampToTime(data.birth)
        }
      }).catch(error => {
        if (error.result) {
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
      this.customerDetailDialog.dialogVisible = true
    },
    handleCustomerDetailDialogClose () {
      this.customerDetailDialog.dialogVisible = false
      this.customerDetail = {}
    }
  },
  components: {
  },
  mounted () {
    this.search()
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
