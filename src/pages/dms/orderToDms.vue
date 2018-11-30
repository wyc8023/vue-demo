<template>
 <section>
<div>
    <el-form ref="form" :model="form">
      <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>订单号</label>
          <div class="input">
            <el-input v-model="form.orderId" placeholder="请输入订单号"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>发送状态</label>
          <div class="input">
            <el-select v-model="form.status" placeholder="请选择发送状态">
                        <el-option
                                v-for="item in statusData"
                                :key="item.statusCode"
                                :label="item.statusName"
                                :value="item.statusCode">
                        </el-option>
                    </el-select>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 20px;">
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
                width="180">
        </el-table-column>
        <el-table-column
                prop="status"
                label="发送状态"  :formatter="formatStatus">
        </el-table-column>
        <el-table-column
                prop="remark"
                label="说明">
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间" :formatter="timestampToTime">
        </el-table-column>
        <el-table-column
                prop="updateBy"
                label="修改人"
                 width="100">
        </el-table-column>
        <el-table-column
                prop="updateTime"
                label="修改时间"
                :formatter="timestampToTime">
        </el-table-column>
        <el-table-column
                label="操作"
                 width="100">
            <template slot-scope="scope" v-if="scope.row.status != null">
                <el-button v-if="scope.row.status=='3'" @click="handleSendOrderToDms(scope.row.orderId)" type="primary" size="small">发送</el-button>
            </template>
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
</div>
 </section>
</template>

<script>
export default {
  data () {
    return {
      form: {
        orderId: '',
        status: ''
      },
      statusData: [{'statusCode': '', 'statusName': '全部'}, {'statusCode': 0, 'statusName': '待发送'}, {'statusCode': 1, 'statusName': '已发送'},
        {'statusCode': 2, 'statusName': '网络或系统异常'}, {'statusCode': 3, 'statusName': '业务异常'}, {'statusCode': 4, 'statusName': '发送取消'}],
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0
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
      if (form.orderId !== '' && form.orderId !== undefined) {
        param.orderId = form.orderId
      }
      if (form.status !== '' && form.status !== undefined) {
        param.status = form.status
      }
      param.pageNo = this.page.currentPage
      param.pageSize = this.page.pageSize

      let response = await this.$services.order.orderDmsList(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.tableData = data.orderDmsList
        _this.total = data.orderDmsCount
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    timestampToTime: function (row, column) {
      let formatDate = row[column.property]
      if (formatDate === undefined || formatDate === '' || formatDate === null) {
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
    formatStatus: function (row, column) {
      for (var i = 0; i < this.statusData.length; i++) {
        if (row.status === this.statusData[i].statusCode) {
          return this.statusData[i].statusName
        }
      }
      return ''
    },
    /* eslint-disable */
    handleSendOrderToDms (orderId) {
      if (orderId === '' || orderId === undefined) {
        return
      }
      this.$confirm('确定要发送吗?', '提示', {type: 'warning'}).then(async () =>{
        let _this = this;
        let param = {}
        param.orderId = orderId
        let response = await this.$services.order.sendOrderToDms(param)
        if (response.status === 200) {
          _this.$message({
              showClose: true,
              message: '发送成功',
              type: 'success'
          })
          _this.search()
        } else if (response.status === 400){
          _this.$message({
              showClose: true,
              message: response.result.message,
              type: 'success'
          })
          _this.search()
        }else {
          _this.$message({
            showClose: true,
            message: '发送失败,请稍后再试',
            type: 'error'
          })
        }
      }) // confirm end
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
    width: 194px;
  }
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
