<template>
  <div class="head" ref="header">
    <img src="~@/assets/img/login/logo.png">
    <i class="el-icon-menu" @click="toggleMenu"></i>
    <!-- <el-radio-group v-model="isCollapse" style="margin-top: 10px; margin-bottom: 20px;">
    <el-radio-button :label="false" @click="isCollapse = false">展开</el-radio-button>
    <el-radio-button :label="true" @click="isCollapse = true">收起</el-radio-button>
    </el-radio-group> -->
    <div class="logout">
      <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.nickName}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1" @click="forget()">修改密码</el-dropdown-item>
          <el-dropdown-item command="2" @click="logout()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="sysMenu">
      <span>当前系统:</span>
      <el-dropdown @command="handleSysCmd">
        <span class="el-dropdown-link">
          {{systemName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="menu" v-for="(menu, index) in systemList" :key='index'>{{menu.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" size="small" :visible.sync="modifyPwd">
      <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="pwdForm.oldPwd" ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="pwdForm.newPwd" ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="pwdForm.confirmPwd" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitPwd">确定</el-button>
        <el-button @click="resetForm('pwdForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import http from '../../../helper/http'
// import { removeStore } from '../../../helper/cookie'
import cookie from '../utils/cookie'
export default {
  props: [
    'systemList',
    'userInfo'
  ],
  data () {
    let validateNewPass = (rule, value, callback) => {
      if (value === this.pwdForm.oldPwd) {
        callback(new Error('新密码和旧密码相同!'))
      } else {
        callback()
      }
    }
    let validateConfirmPass = (rule, value, callback) => {
      if (value !== this.pwdForm.newPwd) {
        callback(new Error('新密码和确认密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      systemName: '',
      modifyPwd: false,
      pwdForm: {
      },

      rules: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' },
          { validator: validateNewPass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === '1') {
        this.forget()
      } else {
        this.logout()
      }
    },
    async logout () {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonClass: 'el-button--warning'
      }).then(() => {
        this.$services.dmis.logout().then((resp) => {
          if (resp.status === 200) {
            sessionStorage.setItem('userinfo', '')
            sessionStorage.setItem('isLogin', '')
            cookie.remove('mis_sid')
            this.$router.push('/login')
          } else {
            this.$message({
              message: '恭喜你，登出成功！',
              type: 'success'
            })
          }
        })
      })
    },
    forget () {
      this.modifyPwd = true
      this.pwdForm = {}
    },
    toggleMenu () {
      this.$parent.isLeftCollapse = !this.$parent.isLeftCollapse
    },
    handleSysCmd (menu) {
      this.systemName = menu.name
      this.$root.bus.$emit('sysChangeEvent', menu.id)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async submitPwd () {
      let param = {
        password: this.pwdForm.oldPwd,
        newPwd: this.pwdForm.newPwd
      }
      let res = await this.$services.dmis.changeUserPwd(param)
      if (res.status === 200) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.modifyPwd = false
        this.pwdForm = {}
        this.logout()
      } else {
        console.log(res)
        let msg = res.result.message || '系统错误'
        this.$message({
          showClose: true,
          message: msg,
          type: 'error'
        })
      }
    }
  },
  mounted () {
    this.$root.bus.$on('sysNavInitEvent', sysName => {
      this.systemName = sysName
    })
  }
}
</script>
