<template>
 <section>
    <div>
       <div class="div-table"><!--表格部分-->
        <div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="time"
                        label="时间"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="web_pc"
                        label="官网">
                </el-table-column>
                <el-table-column
                        prop="native_app"
                        label="APP">
                </el-table-column>
                <el-table-column
                        prop="wx_mapp"
                        label="小程序">
                </el-table-column>
                <el-table-column
                        prop="wx_sub"
                        label="公众号">
                </el-table-column>
                <el-table-column
                        prop="web_pad"
                        label="D-BOX">
                </el-table-column>
                <el-table-column
                        prop="web_m"
                        label="M站">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="注册总数">
                </el-table-column>
            </el-table>
        </div>
    </div><!--end表格部分-->

<!--图表部分-->
  <div class="div-left">
       <div id ="userChart" style="width: 600px;height:40px;margin-top: 12px">
            <el-form ref="form" :model="form" label-width="100px" style="height:40px">
                <el-row  >
                    <el-col :span="5" :offset="0">
                        <el-select v-model="form.type"  placeholder="显示设置" @change="onSelectedChart()">
                            <el-option
                                    v-for="item in typeData"
                                    :key="item.typeCode"
                                    :label="item.typeName"
                                    :value="item.typeCode">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4"  :offset="1">
                        <el-select v-model="form.chart" placeholder="图表" @change="onSelectedChart()">
                            <el-option
                                    v-for="item in chartData"
                                    :key="item.chartCode"
                                    :label="item.chartName"
                                    :value="item.chartCode">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5"  :offset="1">
                        <el-select v-model="form.time"  placeholder="时间" @change="onSelectedChart()">
                            <el-option
                                    v-for="item in timeData"
                                    :key="item.timeCode"
                                    :label="item.timeName"
                                    :value="item.timeCode">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="div-relative">
            <div id="lineChart" class="div-line" isShow="false" ></div>
            <div id="barChart" class="div-bar"></div>
            <div id="pieChart" class="div-pie"></div>
        </div>
    </div><!--end图表部分-->

    <div class="div-right"><!--排名部分-->
        <div id ="userSort" style="width: 100%;margin-top: 12px;">
                <div class="div-sort-left">注册量排名TOP10</div>
                <div class="div-sort-right">
                    <el-form ref="form" :model="sortForm">
                    <el-row>
                        <el-col :span="19">
                            <el-input v-model="sortForm.sellerName" placeholder="请输入获客渠道"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button icon="el-icon-search"   @click="search"></el-button>
                        </el-col>
                    </el-row>
                    </el-form>
                </div>
            <el-table
                    :data="sortTableData"
                    stripe
                    style="width: 100%;margin-top:15px;">
                <el-table-column
                        prop="name"
                        label="获客渠道"
                        width="280"
                        >
                </el-table-column>
                <el-table-column
                        prop="registerCount"
                        label="注册量" >
                </el-table-column>
                <el-table-column
                        prop="registerCountPercentage"
                        label="百分比">
                </el-table-column>
            </el-table>

        </div>
      </div><!--end排名部分-->
    </div>
 </section>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  data () {
    return {
      tableData: [],
      form: {},
      typeData: [{'typeCode': 'dealer', 'typeName': '获客渠道'}, {'typeCode': 'source', 'typeName': '注册来源'}],
      chartData: [{'chartCode': '0', 'chartName': '折线图'}, {'chartCode': '1', 'chartName': '柱状图'}, {'chartCode': '2', 'chartName': '饼状图'}],
      timeData: [{'timeCode': '1', 'timeName': '今天'}, {'timeCode': '2', 'timeName': '昨天'}, {'timeCode': '3', 'timeName': '近一周'}, {'timeCode': '4', 'timeName': '近一个月'}],
      sortForm: {
        sellerName: ''
      },
      sortTableData: []
    }
  },
  methods: {
    async getUserStatistics () {
      let _this = this
      let param = {}
      let response = await this.$services.bi.getHeadAnalysis(param)
      if (response.status === 200) {
        let data = response.result.data
        var today = data.today
        today.time = '今天'
        var yesterday = data.yesterday
        yesterday.time = '昨天'
        var history = data.history
        history.time = '历史累积'
        var list = []
        list.push(today)
        list.push(yesterday)
        list.push(history)
        _this.tableData = list
      } else {
        _this.$message({
          showClose: true,
          message: '查询失败,请稍后再试',
          type: 'error'
        })
      }
    },
    async onSelectedChart () {
      let _this = this
      let param = {}
      let form = this.form
      if (form.type !== '' && form.type !== undefined) {
        param.rankType = form.type
      } else {
        param.rankType = 'dealer'
      }

      if (form.time !== '' && form.time !== undefined) {
        param.timeSlot = form.time
      } else {
        param.timeSlot = '1'
      }
      var chartType = (form.chart !== '' && form.chart !== undefined) ? form.chart : '0'
      let response = await this.$services.bi.getGraphicalAnalysis(param)
      if (response.status === 200) {
        let data = response.result.data
        var xData = []
        var seriesData = []
        var pieSeriesData = []
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            xData.push(data[i].shortname)
            seriesData.push(data[i].registerCount)
            var serData = {}
            serData.name = data[i].shortname
            serData.value = data[i].registerCount
            pieSeriesData.push(serData)
          }
        }

        if (chartType === '0') { // 折线
          document.getElementById('lineChart').style.visibility = 'visible'
          document.getElementById('barChart').style.visibility = 'hidden'
          document.getElementById('pieChart').style.visibility = 'hidden'
          lineChart(xData, seriesData)
        }
        if (chartType === '1') { // 柱状图
          document.getElementById('lineChart').style.visibility = 'hidden'
          document.getElementById('barChart').style.visibility = 'visible'
          document.getElementById('pieChart').style.visibility = 'hidden'
          barChart(xData, seriesData)
        }

        if (chartType === '2') { // 饼图
          document.getElementById('lineChart').style.visibility = 'hidden'
          document.getElementById('barChart').style.visibility = 'hidden'
          document.getElementById('pieChart').style.visibility = 'visible'
          pieChart(xData, pieSeriesData)
        }
      } else {
        _this.$message({
          showClose: true,
          message: '数据加载异常,请稍后再试',
          type: 'error'
        })
      }
    },
    async  search () {
      let _this = this
      let param = {}
      let form = this.sortForm
      if (form.sellerName !== '' && form.sellerName !== undefined) {
        param.cpsName = form.sellerName
      }
      let response = await this.$services.bi.getTopAnalysis(param)
      if (response.status === 200) {
        let data = response.result.data
        _this.sortTableData = data
      } else {
        _this.$message({
          showClose: true,
          message: '数据加载异常,请稍后再试',
          type: 'error'
        })
      }
    }
  }, // methods end
  mounted () {
    this.getUserStatistics()
    document.getElementById('lineChart').style.visibility = 'visible'
    document.getElementById('barChart').style.visibility = 'hidden'
    document.getElementById('pieChart').style.visibility = 'hidden'
    this.onSelectedChart()
    this.search()
  }
}

// 折线图
function lineChart (xData, seriesData) {
  var lineChart = echarts.init(document.getElementById('lineChart'), 'macarons')
  var option = {
    legend: {
      data: ['数量'],
      selectedMode: false
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '数量',
      data: seriesData,
      type: 'line',
      symbolSize: 5,
      smooth: false,
      itemStyle: {normal: {label: {show: true}}}
    }]
  }
  lineChart.setOption(option)
}

// 柱图
function barChart (xData, seriesData) {
  var barChart = echarts.init(document.getElementById('barChart'), 'macarons')
  var option = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: ['数量'],
      selectedMode: false
    },
    xAxis: {
      data: xData,
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    },
    yAxis: {},
    series: [{
      name: '数量',
      type: 'bar',
      data: seriesData
    }]
  }
  barChart.setOption(option)
}

// 饼图
function pieChart (legendData, seriesData) {
  var pieChart = echarts.init(document.getElementById('pieChart'), 'macarons')
  var option = {
    title: {
      text: '用户数量统计',
      subtext: '',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: legendData,
      selectedMode: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: seriesData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  pieChart.setOption(option)
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
    width: 80px;
    margin-right: 16px;
  }
  .search-form li .input {
    float: left;
  }
  .search-form li .input .el-input {
    width: 300px;
  }
  .el-dialog--small {
    width: auto;
}
.div-table{width:100%;border:0px solid #F00}
.div-left{ float:left;width:53%;border:0px solid #F00;margin-top: 5px;}
.div-right{ float:right;width:45%;border:1px solid #ebeef5;margin-top: 20px;}
.div-relative{position:relative;}
.div-line{ position:absolute;left:0px;top:0px;z-index:100;width: 100%;height:400px;margin-top: 12px}
.div-bar{ position:absolute;left:0px;top:0px;z-index:80;width: 100%;height:400px;margin-top: 12px}
.div-pie{ position:absolute;left:0px;top:0px;z-index:70;width: 100%;height:400px;margin-top: 12px}
.div-sort-left{float:left;width:160px;height:35px;margin-left: 10px;border:1px solid #ebeef5;font-size: 14px;font-weight:bold;text-align:center;line-height:35px;}
.div-sort-right{float:right;margin-right:10px;margin-bottom:10px;width:240px;}
  @import '~@/assets/css/table.css';
  @import '~@/assets/css/detail.css';
</style>
