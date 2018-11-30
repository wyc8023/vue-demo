<template>
<div>
 <el-form :inline="true" :model="filters">
        <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input v-model="filters.orderNo" placeholder="请输入订单号 "  clearable ></el-input>
          </div>
        </li>
          <li class="clearfix">
          <label>状态</label>
          <div class="input">
            <el-select v-model="filters.status" placeholder="请选择状态">
                            <el-option
                                    v-for="item in statusVo"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
          </div>
        </li>
               <li class="clearfix">
           <el-button type="primary" v-on:click="handleSearch" > <i class="el-icon-search"></i>查询</el-button>
        </li>
        </ul>
        </div>
                </el-form>
            <!--列表-->
            <el-table :data="orders" border highlight-current-row @selection-change="selsChange" style="width: 100%"
             v-loading="loading">
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
                <el-table-column fixed prop="orderNo" label="订单号" width="150" ></el-table-column>
                <el-table-column prop="dealerCode" label="经销商代码" width="100" ></el-table-column>
                <el-table-column prop="orderType" label="支付方式" width="130" ></el-table-column>
                <el-table-column prop="orderDate" label="支付日期"  width="165" :formatter="dateFormat" ></el-table-column>
                <el-table-column prop="impAccount" label="汇入方账号"  width="180" ></el-table-column>
                <el-table-column prop="docNum" label="凭证号"  width="110" ></el-table-column>
                <el-table-column prop="useProperty" label="使用用途" width="90"  ></el-table-column>
                <el-table-column prop="createTime" label="创建时间"  width="165" :formatter="dateFormat" ></el-table-column>
                <el-table-column prop="status" label="状态"  width="80" ></el-table-column>
                <el-table-column prop="transactionVoucher" label="交易凭证"  width="120"  >
                <template slot-scope="scope">
               <el-popover
                placement="right"
                title=""
                trigger="click">
                <img :src="scope.row.transactionVoucher" style="width:500px">
                <img slot="reference" :src="scope.row.transactionVoucher" :alt="scope.row.transactionVoucher"  class="table_transaction_voucher">
                    </el-popover>
                <!-- <img  :src="scope.row.transactionVoucher" alt="" style="width: 50px;height: 50px"> -->
                        </template>
                    </el-table-column>
                <el-table-column  label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)" :disabled="scope.row.status !='审核驳回'" >编辑</el-button>
                        <el-button @click="pushOrder(scope.row.orderNo)"  size="small"  :disabled="scope.row.status != '审核驳回'" >审核</el-button>

                       <!--  <el-button type="danger" @click="delUsers(scope.$index,scope.row)" size="small">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :page-sizes="pageSizes"
                    :total="page.total">
              </el-pagination>
            </div>
            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm"  @submit.native.prevent>
                  <el-row>
                    <el-col :span="12" :offset="5">
                    <el-form-item label="凭证号" prop="docNum">
                        <el-input v-model="editForm.docNum" auto-complete="off"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" :offset="5">
                    <el-form-item label="用途" prop="useProperty">
                        <el-select v-model="editForm.useProperty" placeholder="请选择用途" >
                            <el-option
                                    v-for="item in useVo"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                     <el-col :span="12" :offset="5">
                      <el-form-item label="交易凭证" prop="transactionVoucher">
                      <el-upload ref="upload"
                            action="http://dmis-api.xtev.cn/order/v1/mis/upload"
                            list-type="picture"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :auto-upload="false"
                            :limit="1">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                         </el-upload>
                    </el-form-item>
                     </el-col>
                </el-row>
                  <el-row>
                    <el-col :span="12" :offset="9">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                       <el-button type="primary" @click.native="editSubmit">提交</el-button>
                    </el-col>
                </el-row>
                </el-form>
            </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      filters: {
      },
      orders: [],
      picurl: [],

      loading: false,
      statusVo: [
        {
          'id': null,
          'name': '全部'

        }, {
          'id': '2',
          'name': '已发送'

        },
        {
          'id': '4',
          'name': '审核驳回'

        }],
      useVo: [
        {
          'id': '1',
          'name': '购车定金'

        },
        {
          'id': '2',
          'name': '其他'

        }],
      headers: {
        'Content-Type': 'application/json'
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      fileList: [],

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        docNum: [
          {required: true, message: '凭证号', trigger: 'blur'}
        ]
      },

      editForm: {
        orderNo: '',
        dealerCode: '',
        orderDate: '',
        impAccount: '',
        docNum: '',
        useProperty: '',
        transactionVoucher: ''
      }
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {

    },
    handleSuccess (data, file, fileList) {
      var url = data.data
      this.fileList = fileList
      this.picurl.push(url)
    },

    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
    },

    handleSearch () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.search()
    },
    search () {
      let that = this
      that.loading = true
      let params = {}
      var orderNo = that.filters.orderNo
      var status = that.filters.status
      if (orderNo !== '') {
        params.orderNo = orderNo
      }
      if (status != null) {
        params.status = status
      }
      params.page = that.page.currentPage
      params.perpage = that.page.pageSize

      this.$services.order.queryOrderDepositList(params, this.headers).then((resp) => {
        let data = resp.result.data
        if (data == null) {
          that.$message({
            showClose: true,
            message: '没有查询到符合条件的数据',
            type: 'warning'
          })
          that.orders = ''
          that.page.total = 0
        } else {
          that.orders = data.orderList
          that.page.total = data.orderCount
        }
      }).catch(resp => {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
      that.loading = false
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 显示编辑界面
    showEditDialog: function (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },

    getUseKey: function (val) {
      let forVo = this.useVo

      for (var i = 0; i < forVo.length; i++) {
        if (forVo[i].name === val) {
          return forVo[i].id
        }
      }
      return val
    },
    // 编辑
    editSubmit: function () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.editForm.transactionVoucher = this.picurl[0]
          this.editForm.useProperty = this.getUseKey(this.editForm.useProperty)
          let para = Object.assign({}, this.editForm)
          this.$services.order.updateOrderDepositStatus(para, this.headers).then(resp => {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            that.editFormVisible = false
            this.search()
          }).catch(resp => {
            console.log(resp)
            that.$message({
              showClose: true,
              message: '更新失败,稍后再试',
              type: 'error'
            })
          })
        }
      })
    },
    dateFormat: function (row, column) {
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
    // 审核并推送
    pushOrder: function (orderNo) {
      this.$confirm('确定要审核通过并发送吗?', '提示', {type: 'warning'}).then(() => {
        let that = this
        that.loading = true
        this.$services.order.pushOrderDepositToDms({'orderNo': orderNo}).then(resp => {
          that.$message({
            showClose: true,
            message: '审核成功，并已推送',
            type: 'success'
          })
          this.search()
        }).catch(resp => {
          console.log(resp)
          that.$message({
            showClose: true,
            message: '审核失败,稍后再试',
            type: 'error'
          })
        })
        that.loading = false
      })
    }
  },
  components: {

  }
}
</script>

<style scoped>
.table_transaction_voucher{
max-height: 50px;
max-width: 130px
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
    width: 80px;
    margin-right: 16px;
  }
  .search-form li .input {
    float: left;
  }
  .search-form li .input .el-input {
    width: 300px;
  }
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
