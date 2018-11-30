<template>
  <section>
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item >ota</el-breadcrumb-item>
        <el-breadcrumb-item >设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <ul class="search-form clearfix">
        <li class="clearfix">
          <label>唯一标示</label>
          <div class="input">
            <el-input v-model="queryForm.keyword" placeholder="请输入唯一标识"></el-input>
          </div>
        </li>
        <li class="clearfix">
          <label>VIN</label>
          <div class="input">
            <el-input v-model="queryForm.keyword" placeholder="请输入VIN码"></el-input>
          </div>
        </li>
        <li class="clearfix" style="margin-left: 20px;">
          <el-button type="primary">搜索</el-button>
        </li>
      </ul>
      <div class="table-content">
        <div class="table-title clearfix">
          <p>活动项目列表</p>
          <div class="add-btn">
            <el-button type="primary" @click="addDesignModal = true">导出Excel报表</el-button>
          </div>
        </div>
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="code" label="序号" width="80" fixed></el-table-column>
          <el-table-column prop="num" label="项目编号" fixed width="180"></el-table-column>
          <el-table-column prop="name" label="业主姓名" fixed></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
          <el-table-column prop="projectType" label="项目类型" width="200"></el-table-column>
          <el-table-column prop="time" label="创建时间" width="150"></el-table-column>
          <el-table-column prop="designer" label="设计师" width="100"></el-table-column>
          <el-table-column prop="company" label="装饰公司" width="150"></el-table-column>
          <el-table-column prop="province" label="省"></el-table-column>
          <el-table-column prop="city" label="市"></el-table-column>
          <el-table-column prop="region" label="区" width="100"></el-table-column>
          <el-table-column prop="district" label="小区" width="150"></el-table-column>
          <el-table-column prop="area" label="套内面积"></el-table-column>
          <el-table-column prop="projectAmount" label="支付金额"></el-table-column>
          <el-table-column prop="amounted" label="已付金额"></el-table-column>
          <el-table-column prop="unAmount" label="未付金额"></el-table-column>
          <el-table-column prop="returnAmount" label="返现金额"></el-table-column>
          <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="checkDetail()">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          layout="prev, pager, next, total, jumper"
          :total="400"
          prev-text="上一页"
          next-text="下一页">
        </el-pagination>
      </div>
    </div>
    <!--活动项目详情-->
    <el-dialog title="活动项目详情" size="large" :visible.sync="activityProjectDetailModal">
      <div class="project-info">
        <div class="sub-title">项目信息</div>
        <ul>
          <li>
            <span>客户姓名</span>
            <span>杨晓峰</span>
            <span>联系电话</span>
            <span>18677783287</span>
          </li>
          <li>
            <span>项目编号</span>
            <span>173788777</span>
            <span>创建时间</span>
            <span>2017-09-22</span>
          </li>
          <li>
            <span>业务类型</span>
            <span>2017十一大促施工项目</span>
            <span>面积(㎡)</span>
            <span>1223</span>
          </li>
          <li>
            <span>项目地址</span>
            <span>北京市东城区</span>
            <span>小区</span>
            <span>幸福时光</span>
          </li>
        </ul>
      </div>
      <div class="fee-info">
        <div class="sub-title">费用信息</div>
        <div class="fee">
          <span>项目总金额：￥2000</span>
          <span>已付金额：￥800</span>
          <span>未付金额：￥1200</span>
        </div>
        <el-table
          :data="tableData3"
          height="250"
          border
          style="width: 100%">
          <el-table-column
            prop="time"
            label="交易时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="orderSerialNumber"
            label="交易流水号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="payAmount"
            label="交易金额(元)">
          </el-table-column>
          <el-table-column
            prop="payMethod"
            label="支付方式"
            width="180">
          </el-table-column>
          <el-table-column
            prop="returnCash"
            label="返现金额(元)">
          </el-table-column>
          <el-table-column
            prop="terminalNo"
            label="终端编号">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="modifyAmount()">修改支付金额</el-button>
      </div>
    </el-dialog>
    <!--修改支付金额-->
    <el-dialog title="修改支付金额" size="small" :visible.sync="modifyAmountModal">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="待付金额">
          <span>￥10000</span>
        </el-form-item>
        <el-form-item label="项目金额">
          <span>￥8000</span>
        </el-form-item>
        <el-form-item label="已付金额">
          <span>￥2000</span>
        </el-form-item>
        <el-form-item label="支付金额" prop="payAmount">
          <el-input v-model="ruleForm.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="检索参考号" prop="number">
          <el-input v-model="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="是否返券" prop="ticket">
          <el-radio-group v-model="ruleForm.ticket">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="终端号" prop="terminalNo">
          <el-input v-model="ruleForm.terminalNo"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payMethod">
          <el-select v-model="ruleForm.payMethod" placeholder="请选择支付方式">
            <el-option label="线下录入借记卡支付" value="jjk"></el-option>
            <el-option label="线下录入微信支付" value="wx"></el-option>
            <el-option label="线下录入支付宝支付" value="zfb"></el-option>
            <el-option label="线下录入信用卡支付" value="xyk"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="modifyAmountModal = false">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style lang="scss">
@import "~@/assets/scss/detail.scss";
@import "~@/assets/scss/search.scss";
@import "~@/assets/scss/table.scss";
</style>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      formInline: {
        keyword: '',
        classify: ''
      },
      tableData: [
        {
          code: '1', num: 'u59438543854385', name: '张三', mobile: '13877782227', projectType: '2017十一大促', time: '2017-02-09', designer: '林晓晓', company: '宇飞装饰', province: '北京', city: '北京', region: '朝阳区', district: '云趣园一区', area: '120', projectAmount: '2000', amounted: '100', unAmount: '1000', returnAmount: '900'
        },
        {
          code: '2', num: 'u59438543854385', name: '张三', mobile: '13877782227', projectType: '2017十一大促', time: '2017-02-09', designer: '林晓晓', company: '宇飞装饰', province: '北京', city: '北京', region: '朝阳区', district: '云趣园一区', area: '120', projectAmount: '2000', amounted: '100', unAmount: '1000', returnAmount: '900'
        },
        {
          code: '3', num: 'u59438543854385', name: '张三', mobile: '13877782227', projectType: '2017十一大促', time: '2017-02-09', designer: '林晓晓', company: '宇飞装饰', province: '北京', city: '北京', region: '朝阳区', district: '云趣园一区', area: '120', projectAmount: '2000', amounted: '100', unAmount: '1000', returnAmount: '900'
        },
        {
          code: '4', num: 'u59438543854385', name: '张三', mobile: '13877782227', projectType: '2017十一大促', time: '2017-02-09', designer: '林晓晓', company: '宇飞装饰', province: '北京', city: '北京', region: '朝阳区', district: '云趣园一区', area: '120', projectAmount: '2000', amounted: '100', unAmount: '1000', returnAmount: '900'
        },
        {
          code: '5', num: 'u59438543854385', name: '张三', mobile: '13877782227', projectType: '2017十一大促', time: '2017-02-09', designer: '林晓晓', company: '宇飞装饰', province: '北京', city: '北京', region: '朝阳区', district: '云趣园一区', area: '120', projectAmount: '2000', amounted: '100', unAmount: '1000', returnAmount: '900'
        }
      ],
      tableData3: [{
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }, {
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }, {
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }, {
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }, {
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }, {
        time: '2016-05-03',
        orderSerialNumber: '793783247893742',
        payAmount: '￥2000',
        payMethod: '线下支付',
        returnCash: '￥200',
        terminalNo: '30'
      }],
      activityProjectDetailModal: false,
      modifyAmountModal: false,
      ruleForm: {
        payAmount: '',
        number: '',
        ticket: false,
        terminalNo: '',
        payMethod: 'jjk'
      },
      rules: {
        payAmount: [
          {required: true, message: '请输入支付金额', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入检索参考号', trigger: 'blur'}
        ],
        ticket: [
          {required: true, message: '请选择活动资源', trigger: 'change'}
        ],
        terminalNo: [
          {required: true, message: '请输入终端号', trigger: 'blur'}
        ],
        payMethod: [
          {required: true, message: '请选择支付方式', trigger: 'blur'}
        ]
      }
    }
  },
  //    async asyncData ({req}) {
  //      let advList = await services.local.getUserList()
  //      return {
  //        name: req ? 'server' : 'client',
  //        advList: advList
  //      }
  //    },
  head () {
    return {
      title: `活动项目管理`
    }
  },
  methods: {
    checkDetail () {
      this.activityProjectDetailModal = true
    },
    modifyAmount () {
      this.activityProjectDetailModal = false
      this.modifyAmountModal = true
    }
  },
  computed: {
  }
}
</script>
