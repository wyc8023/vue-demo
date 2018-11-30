<template>
  <div>
                <el-form :inline="true" :model="filters">
                  <div class="content">
        <ul class="search-form1 clearfix">
        <li class="clearfix">
          <label>关键字</label>
          <div class="input">
            <el-input  v-model="filters.queryName"  clearable  placeholder="请输入vin、车牌号、客户姓名"></el-input>
          </div>
        </li>
            <li class="clearfix">
          <label>客户性质</label>
          <div class="input">
             <el-radio-group v-model="filters.useProperty">
                                <el-radio-button  label='' >全部</el-radio-button >
                                <el-radio-button  label="1">企业</el-radio-button >
                                <el-radio-button  label="0">个人</el-radio-button >
                            </el-radio-group>
          </div>
        </li>
                <li class="clearfix">
          <label>车型</label>
          <div class="input">
             <el-select v-model="filters.modelCode" placeholder="请选择车型"  @visible-change="queryMaterialSeries">
                            <el-option
                                    v-for="item in queryModelCodeVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
          </div>
        </li>
      <li class="clearfix">
   <el-button type="primary" v-on:click="handleSearch" icon="el-icon-search">查询</el-button>
        </li>
        </ul>
                  </div>
                </el-form>
            <el-table
            :data="vehicleManagement"
            border
            style="width: 100%">
                <el-table-column type="index" width="60" label="序号"></el-table-column>
                <el-table-column prop="vin" label="车辆vin" width="180"  ></el-table-column>
                <el-table-column prop="licenseNo" label="车牌号"  width="120" ></el-table-column>
                <el-table-column prop="dealerName" label="经销商"    ></el-table-column>
                <el-table-column prop="customerName" label="客户姓名"  width="120" ></el-table-column>
                <el-table-column prop="generateTime" label="出厂日期"   :formatter="dateFormat" width="190" ></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                       <!--  <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button> -->
                       <!--  <el-button type="danger" @click="delCompany(scope.$index,scope.row)" size="small">删除</el-button> -->
                        <el-button size="small" type="text" @click="showDetailDialog(scope.row)">详情</el-button>
                  <!--   <el-button size="small" @click="queryUpdateTboxList(scope.row.vin)" size="small">tobx变更记录</el-button> -->
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
                :total="page.total">
        </el-pagination>
    </div>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                     <p>车辆vin:{{editForm.vin}}  </p>

                    <el-form-item label="外观颜色" prop="companyId">
                        <el-select v-model="editForm.bodyColorCode" placeholder="请选择车辆颜色">
                            <el-option
                                    v-for="item in bodyColorCodeVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车型" prop="modelCode">
                        <el-select v-model="editForm.modelCode" placeholder="请选择车型">
                             <el-option
                                    v-for="item in modelCodeVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                      <el-form-item label="内饰颜色" prop="interiorColorCode">
                        <el-select v-model="editForm.interiorColorCode" placeholder="请选择内饰颜色">
                            <el-option
                                    v-for="item in interiorColorCodeVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                 <el-form-item label="车辆状态" prop="materialStatus">
                        <el-select v-model="editForm.materialStatus" placeholder="请选择车辆状态">
                             <el-option
                                    v-for="item in useVO"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
               <el-form-item label="销售日期" prop="saleDate">
                  <el-date-picker
                            v-model="editForm.salesDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions1">
                            </el-date-picker>

                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>

             <el-dialog title="车辆详情" :visible.sync ="detailtFormVisible" :close-on-click-modal="false" width="90%">
          <el-form ref="detailForm" :model="detailForm" label-width="120px">
               <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">车辆信息</span>
                    </div>
                    <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      车辆vin:{{detailForm.vin}}
                    </el-col>
                   <el-col :span="8">
                     款式:{{detailForm.seriesName}}
                    </el-col>
                  <el-col :span="8">
                     内饰颜色:{{detailForm.interiorColorName}}
                    </el-col>
                    </el-row>
                    </div>
                    <div  class="text item">
                <el-row>
                 <el-col :span="8">
                       生产日期:{{detailForm.generateTime}}
                    </el-col>
                    <el-col :span="8">
                      车牌号:{{detailForm.licenseNo}}
                    </el-col>
                    <el-col :span="8">
                      tboxsn:{{detailForm.tboxSn}}
                    </el-col>
                </el-row>
                    </div>
              <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      ICCID:{{detailForm.iccid}}
                    </el-col>
                    <el-col :span="8">
                      电机号:{{detailForm.drivemotorCode}}
                    </el-col>
                    <el-col :span="8">
                      电池编码:{{detailForm.batteryCode}}
                    </el-col>
                </el-row>
              </div>
               </el-card>
              </el-form>
          <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">销售信息</span>
                    </div>
                    <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      客户姓名:{{detailForm.customerName}}
                    </el-col>
                   <el-col :span="8">
                    发票号:{{detailForm.invoiceNo}}
                    </el-col>
                  <el-col :span="8">
                     行驶证号:{{detailForm.drivingLicense}}
                    </el-col>
                    </el-row>
                    </div>
                    <div  class="text item">
                <el-row>
                 <el-col :span="8">
                       销售领域:{{detailForm.vehUser}}
                    </el-col>
                    <el-col :span="8">
                      车辆用途:{{detailForm.vehicleUser}}
                    </el-col>
                    <el-col :span="8">
                      存放地点:{{detailForm.addr}}
                    </el-col>
                </el-row>
                    </div>
              <div  class="text item">
                <el-row>
                    <el-col :span="8">
                     销售地区:{{detailForm.groundProvinceId}}
                    </el-col>
                    <el-col :span="8">
                      运行单位名称:{{detailForm.motonCompany}}
                    </el-col>
                    <el-col :span="8">
                      运营单位地址:{{detailForm.operatUnitAddress}}
                    </el-col>
                </el-row>
              </div>
              <div  class="text item">
                <el-row>
                    <el-col :span="8">
                     运营地址:{{detailForm.operatAddress}}
                    </el-col>
                       <el-col :span="8">
                     充电桩地址:{{detailForm.vehChargeAddress}}
                    </el-col>
                     <el-col :span="8">
                     销售时间:{{detailForm.salesDate}}
                    </el-col>
                </el-row>
              </div>
               </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">经销商信息</span>
                    </div>
                    <div  class="text item">
                <el-row>
                    <el-col :span="8">
                      经销商名称:{{detailForm.dealerName}}
                    </el-col>
                   <el-col :span="8">
                    经销商入库日期:{{detailForm.underlineTime}}
                    </el-col>

                    </el-row>
                    </div>
               </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="title">备注</span>
                    </div>
                    <div  class="text item">
                <el-row>
                   <el-col aria-rowspan="3">
                    {{detailForm.remark}}
                    </el-col>
                    </el-row>
                    </div>
               </el-card>
            </el-dialog>

           <el-dialog title="tbox变更记录" :visible.sync ="tboxUpdateVisible" :close-on-click-modal="false" >
               <el-table :data="tboxupdateList" highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <!--v-loading="loading" element-loading-text="拼命加载中""-->
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="oldTBoxId" label="原tboxid"   width="180"  sortable></el-table-column>
                <el-table-column prop="newTBoxId" label="新tboxid"  width="180" sortable></el-table-column>
                <el-table-column prop="replacementTime" label="变更时间"   :formatter="dateFormat" width="180" sortable></el-table-column>
                 <el-table-column prop="servingstationCode" label="变更地点"  width="180" sortable></el-table-column>
            </el-table>
            </el-dialog>
    <!--</el-form>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      filters: {
        useProperty: ''
      },
      bodyColorCodeVO: [{
        'id': '123',
        'name': '蓝色'
      },
      {
        'id': '12',
        'name': '红色'
      }],
      interiorColorCodeVO: [{
        'id': '123',
        'name': '蓝色'
      },
      {
        'id': '12',
        'name': '红色'
      }],
      queryModelCodeVO: [],
      modelCodeVO: [{
        'id': '123',
        'name': 'dev'
      },
      {
        'id': '12',
        'name': 'dev1'
      }],
      useVO: [{
        'id': 1,
        'name': '有效'
      },
      {
        'id': 0,
        'name': '无效'
      }],
      usePropertyVo: [
        {
          'id': '',
          'name': '全部'
        },
        {
          'id': '1',
          'name': '企业'
        },
        {
          'id': '0',
          'name': '个人'
        }],

      selectionStatus: {
        materialSeriesLoaded: false
      },
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: '',
      value2: '',
      value3: '',
      vehicleManagement: [],
      tboxupdateList: [],
      node: [],
      lazy: true,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      loading: false,
      sels: [], // 列表选中列

      // 详情相关数据
      detailtFormVisible: false,
      detailForm: {
      },

      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示

      editFormRules: {
        /*   name: [
                        {required: true, message: '权限名称', trigger: 'blur'}
                    ] */
      },
      editForm: {
      },
      tboxUpdateVisible: false
    }
  },
  methods: {
    dateFormat: function (row, column) {
      var timestamp = row[column.property]
      if (timestamp === undefined) {
        return ''
      }

      return this.$utils.timestampToTime(timestamp)
    },
    codeFormat: function (colorCode, codeList) {
      for (var i = 0; i < codeList.length; i++) {
        if (codeList[i].id === colorCode) {
          return codeList[i].name
        }
      }
    },
    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      console.log(currentPage)
      this.search()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      console.log(`每页 ${pageSize} 条`)
    },

    handleSearch () {
      this.search()
    },
    queryMaterialSeries () {
      let _this = this
      if (!this.selectionStatus.materialSeriesLoaded) {
        this.$services.dms.queryMaterialSeriesCode().then((resp) => {
          let data = resp.result.data
          if (data != null && data !== '') {
            data.unshift({'id': '', 'name': '请选择'})
            _this.queryModelCodeVO = data
            _this.selectionStatus.materialSeriesLoaded = true
          }
        }).catch(resp => {
          _this.$message({
            showClose: true,
            message: '查询失败,稍后再试',
            type: 'error'
          })
        })
      }
    },
    search () {
      let that = this
      let params = {}
      var queryName = that.filters.queryName
      if (queryName !== '') {
        params.queryName = queryName
      }

      var modelCode = that.filters.modelCode
      if (modelCode !== '') {
        params.modelCode = modelCode
      }
      var useProperty = that.filters.useProperty
      if (useProperty !== '') {
        params.useProperty = useProperty
      }
      params.page = that.page.currentPage
      params.perpage = that.page.pageSize
      this.$services.dms.queryVehicleManagementList(params).then((resp) => {
        let data = resp.result.data
        that.vehicleManagement = ''
        that.page.total = 0
        if (data === '') {
          that.$message({
            showClose: true,
            message: '很抱歉，没有查询到您需要的数据',
            type: 'warning'
          })
        } else {
          that.vehicleManagement = data.resList
          that.page.total = data.resCount
        }
      }).catch(resp => {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 查询tbox记录
    queryUpdateTboxList: function (vin) {
      this.tboxUpdateVisible = true
      let that = this
      this.$services.dms.queryVehicleManagementList({'vin': vin}).then((resp) => {
        let record = resp.result.data
        that.tboxupdateList = record
      }).catch(resp => {
        console.log(resp)
        that.$message({
          showClose: true,
          message: '查询tbox变更记录失败,稍后再试',
          type: 'error'
        })
      })
    },

    // 显示编辑界面
    showEditDialog: function (index, row) {
      this.editFormVisible = true
      var _this = this
      this.$services.dms.queryVehicleManagementDetail({'vin': row.vin}).then((resp) => {
        _this.editForm = resp.result.data
      }).catch(resp => {
        console.log('请求失败：' + resp.response.status + ',' + resp.response.statusText)
      })
    },

    showDetailDialog: function (row) {
      this.detailtFormVisible = true
      var _this = this
      this.$services.dms.queryVehicleManagementDetail({'vin': row.vin}).then((resp) => {
        _this.detailForm = resp.result.data
        _this.detailForm.generateTime = this.$utils.timestampToTime(_this.detailForm.generateTime)
        _this.detailForm.underlineTime = this.$utils.timestampToTime(_this.detailForm.underlineTime)
        _this.detailForm.salesDate = this.$utils.timestampToTime(_this.detailForm.salesDate)
      }).catch(resp => {
        console.log('请求失败：' + resp.response.status + ',' + resp.response.statusText)
      })
    },

    // 编辑
    editSubmit: function () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let para = Object.assign({}, this.editForm)
          para.modelName = that.codeFormat(para.modelCode, that.modelCodeVO)
          para.bodyColorName = that.codeFormat(para.bodyColorCode, that.bodyColorCodeVO)
          para.interiorColorName = that.codeFormat(para.interiorColorCode, that.interiorColorCodeVO)
          this.$services.dms.updateVehicleManagement(para).then((resp) => {
            that.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            that.editFormVisible = false
            window.location.reload()
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
.search-form1 {
    background: #EEF1F6;
    margin-bottom: 30px;
    padding: 20px 0 0 20px;
    border-radius: 3px;
    font-size: 14px;
  }
  .search-form1 li {
    float: left;
    list-style: none;
    margin-bottom: 20px;
    margin-right: 20px;
  }
 .search-form1 li label {
    float: left;
    line-height: 40px;
    text-align: left
  }
  .search-form1 li .input {
    float: left;
    margin-left: 28px
  }
  .search-form1 li .input .el-input {
    width: 240px;
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
