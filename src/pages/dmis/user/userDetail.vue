<template>
    <section class="container">
        <div class="bread">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                    <el-breadcrumb-item>设置</el-breadcrumb-item>
                    <el-breadcrumb-item>个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <div class="table-content1 clearfix">
                <div class="table-title clearfix">
                    <p>
                        {{$route.params.id?'编辑版块':'添加版块'}}
                    </p>
                </div>
                <el-form ref="form" :model="form" :rules="rules"  label-width="120px" class="demo-ruleForm clearfix">
                    <el-form-item prop="staffName" label="姓名">
                        <el-input v-model="form.staffName" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="邮箱">
                        <el-input v-model="form.email" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="nickName" label="昵称">
                        <el-input v-model="form.nickName"></el-input>
                    </el-form-item>
                    <el-form-item prop="mobile" label="手机号">
                        <el-input v-model="form.mobile"></el-input>
                    </el-form-item>
                    <el-form-item prop="address" label="地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSaveProfile('form')">修改并保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </section>
</template>
<script>
import utils from '@/utils/utils'
let checkMobile = (rule, value, callback) => {
  if (utils.isPoneAvailable(value)) {
    callback(new Error('请输入合法的手机号!'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      form: {
        staffName: '',
        email: '',
        nickName: '',
        mobile: '',
        address: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSaveProfile (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          let params = {}
          params.address = _this.form.address
          params.email = _this.form.email
          params.nickName = _this.form.nickName
          params.mobile = _this.form.mobile
          _this.$services.dmis.updateUser(params).then((res) => {
            if (res.status === 200) {
              _this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
            } else {
              _this.$message({
                showClose: true,
                message: '修改失败,稍后再试',
                type: 'error'
              })
            }
          })
        }
      })
    },
    async getUserInfo () {
      let res = await this.$services.dmis.getUserInfo()
      if (res.status === 200) {
        let data = res.result.data
        this.form.staffName = data.user.staffName
        this.form.address = data.user.address
        this.form.email = data.user.email
        this.form.nickName = data.user.nickName
        this.form.mobile = data.user.mobile
      } else {
        this.$message({
          showClose: true,
          message: '查询失败,稍后再试',
          type: 'error'
        })
      }
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>
