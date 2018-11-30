<template>
 <section>
<div>
    <el-form ref="form" :model="form">
         <div class="content">
        <ul class="search-form clearfix">
        <li class="clearfix">
          <label>商品skuNo</label>
          <div class="input">
            <el-input v-model="form.skuNo" placeholder="请输入商品skuNo"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>商品名称</label>
          <div class="input">
            <el-input v-model="form.skuName" placeholder="请输入商品名称"></el-input>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 20px;">
          <el-button class="search" type="primary" icon="el-icon-search" @click="searchByKeyWord">查询</el-button>
          <el-button class="" type="primary" icon="el-icon-edit-outline" @click="initStock">维护</el-button>
        </li>
        </ul>
         </div>
    </el-form>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column
                prop="productId"
                label="商品skuNo"
                width="120">
        </el-table-column>
        <el-table-column
                prop="productName"
                label="商品名称">
        </el-table-column>
        <el-table-column
                prop="categorynameone"
                label="一级分类"
                width="95">
        </el-table-column>

        <el-table-column
                prop="categorynametwo"
                label="二级分类"
                width="95">
        </el-table-column>

        <el-table-column
                prop="categorynamethree"
                label="三级分类">
        </el-table-column>
        <el-table-column
                prop="totalNum"
                label="销售总量"
                width="95">
            <template slot-scope="scope" >
                {{scope.row.totalNum == null?"0":scope.row.totalNum}}
            </template>
        </el-table-column>
        <el-table-column
                prop="costNum"
                label="占用量"
                width="80">
            <template slot-scope="scope" >
                {{scope.row.costNum == null?"0":scope.row.costNum}}
            </template>
        </el-table-column>
        <el-table-column
                prop="cancelNum"
                label="取消量"
                width="80">
            <template slot-scope="scope" >
                {{scope.row.cancelNum == null?"0":scope.row.cancelNum}}
            </template>
        </el-table-column>
        <el-table-column
                prop="deliverNum"
                label="发货量"
                width="80">
            <template slot-scope="scope" >
                {{scope.row.deliverNum == null?"0":scope.row.deliverNum}}
            </template>
        </el-table-column>
        <el-table-column
                prop="ableNum"
                label="可占用量"
                width="95">
            <template slot-scope="scope" >
                {{scope.row.totalNum -(scope.row.costNum-scope.row.cancelNum-scope.row.deliverNum )}}
            </template>
        </el-table-column>
        <!--
        <el-table-column
                prop="createdBy"
                label="创建人">
        </el-table-column>
        -->
        <el-table-column
                prop="createDate"
                label="创建时间"  :formatter="timestampToTime">
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
    <!-- 库存维护 -->
    <el-dialog
            :title="stockDialog.title"
            center
            :visible.sync="stockDialog.dialogVisible"
            width="60%"
            :before-close="handleStockDialogClose">
        <div>
            <el-form ref="stockForm" :model="stockForm" label-width="100px" labelPosition='left'>
                <el-row>
                    <el-col :span="12" :offset="5">
                        <el-form-item label="商品skuNo">
                            <el-input v-model="stockForm.skuNo" @input="changeValue" placeholder="请输入商品skuNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="5">
                        <el-form-item label="商品名称">
                            <el-input v-model="stockForm.skuName" readonly="true" placeholder="商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--
                <el-row>
                    <el-col :span="12" :offset="5">
                        <el-form-item label="仓库ID">
                            <el-input v-model="stockForm.warehouseId" placeholder="请输入仓库ID,默认仓库1001">1001</el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                -->
                <el-row>
                    <el-col :span="12" :offset="5">
                        <el-form-item label="商品库存总量">
                            <el-input v-model="stockForm.stockNum" placeholder="请输入商品库存总量"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="9">
                        <el-button type="primary" @click="handleStockDialogSbumit">提 交</el-button>
                        <el-button @click="handleStockDialogClose">取 消</el-button>
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
      form: {
        skuNo: '',
        skuName: ''
      },
      stockForm: {
        skuNo: '',
        skuName: '',
        warehouseId: '1001',
        stockNum: ''
      },
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      total: 0,
      stockDialog: {
        title: '商品库存维护',
        dialogVisible: false
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
      if (form.skuNo !== '' && form.skuNo !== undefined) {
        param.skuNo = form.skuNo
      }
      if (form.skuName !== '' && form.skuName !== undefined) {
        param.skuName = form.skuName
      }
      param.pageNo = this.page.currentPage
      param.pageSize = this.page.pageSize

      let response = await this.$services.promise.getStockList(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.tableData = data.stockList
        _this.total = data.stockCount
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
    },
    /* eslint-disable */
    async changeValue () {
        let _this = this
        let param = {}
        let form = _this.stockForm
        if (form.skuNo === '' || form.skuNo === undefined) {
            return
        }
        let skuNos = []
        skuNos.push(form.skuNo)
        param.skuNos = skuNos

        let response = await this.$services.productApp.getSimpleInfo(param)
        if (response.status === 200) {
            let data = response.result.data
            form.skuName = data[0].name
        }
    },
    timestampToTime: function(row, column) {
      if (row.createDate === undefined || row.createDate === '') {
          return ''
        }
        var date = new Date(row.createDate) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        var h =
          date.getHours() > 9 ? date.getHours() + ':' : '0' + date.getHours() + ':'
        var m =
          date.getMinutes() > 9
            ? date.getMinutes() + ':'
            : '0' + date.getMinutes() + ':'
        var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
        return Y + M + D
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.search()
    },
    initStock () {
      this.stockDialog.dialogVisible = true
    },
    handleStockDialogClose () {
      this.stockDialog.dialogVisible = false
      this.stockForm.skuNo = ''
      this.stockForm.skuName = ''
      this.stockForm.warehouseId = '1001'
      this.stockForm.stockNum = ''
    },
    async handleStockDialogSbumit () {
      if (this.stockForm.skuNo === '' || this.stockForm.stockNum === '') {
        return
      }
      let _this = this
      let param = {}
      param.skuNo = this.stockForm.skuNo
      param.warehouseId = this.stockForm.warehouseId
      param.stockNum = this.stockForm.stockNum
      let response = await this.$services.promise.addStock(param)
      if (response.status === 200) {
        _this.$message({
          showClose: true,
          message: '提交成功',
          type: 'success'
        })
        _this.search()
        _this.handleStockDialogClose()
      } else {
        _this.$message({
          showClose: true,
          message: '提交失败,请稍后再试',
          type: 'error'
        })
      }
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
