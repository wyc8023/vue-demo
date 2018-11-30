<template>
  <div class="login-container">
        <div class="login-wrapper">
            <div class="logo-title"></div>
            <div class="login-cont">
                <h2>账号登录</h2>
                <el-form :model="form" :rules="rules" ref="form" label-width="0px">
                    <div class="input-box">
                        <el-form-item  prop="username">
                            <el-input v-model="form.username" placeholder="请输入账号"></el-input>
                        </el-form-item>
                    </div>
                    <div class="input-box">
                        <el-form-item  prop="userpsd">
                            <el-input type="password" v-model="form.userpsd" placeholder="请输入密码"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="text-box">
                    <div class="remenber-cont">
                        <input type="checkbox" v-model="form.remenberMe" />
                        <span>记住我</span>
                    </div>
                    <!-- <div class="register-cont">
                        <a href="javascript:;">立即注册</a>
                    </div> -->
                </div>
                <div class="btn-box">
                    <button  @click="login">登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import cookie from '../utils/cookie'
export default {
  name: 'login',
  props: [],
  data () {
    return {
      form: {
        username: '',
        userpsd: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        userpsd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      }

    }
  },

  computed: {
    ...mapState(['userinfo', 'isLogin'])
  },

  mounted () {
    this.$root.bus.$emit('activeLoginCssEvent', true)
    let _this = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        _this.login()
      }
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    async login () {
      let _this = this
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let param = {
            loginAccount: _this.form.username,
            loginPass: _this.form.userpsd,
            rememberMe: _this.form.remenberMe
          }
          _this.$services.dmis.login(param).then((resp) => {
            console.log(resp)
            if (resp.status === 200) {
              let misSid = cookie.get('mis_sid')
              let userinfo = { misSid: misSid, isLogin: true }
              sessionStorage.setItem('userinfo', userinfo)

              // 登录成功后返回访问的页面
              let redirect = decodeURIComponent(_this.$route.query.redirect || '/')
              if (redirect.indexOf('login')) {
                redirect = '/home'
              }
              // 通知取消激活登录样式
              _this.$root.bus.$emit('activeLoginCssEvent', false)
              window.location = redirect
              // _this.$router.push({path: redirect})
            } else {
              sessionStorage.setItem('userinfo', { misSid: '', isLogin: false })
            }
          })
        }
      })
    }
  }

}

</script>
<style>
    body,div,ul,li,dl,dt,dd,p{padding:0;margin:0;list-style: normal;}
    h1,h2,h3,h4,h5,p{font-weight:normal;color:#333;font-size:14px;}
    img{
        width:100%;
        height:auto;
        overflow:hidden;
    }
    .login-container{
        width:100%;
        height:100vh;
        position: static;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background:url('~@/assets/img/login/bg.jpg') no-repeat center;
        background-size:cover;
        display:flex;
        display:-webkit-flex;
        display:-moz-flex;
        display:-ms-flex;
        align-items:center;
        -webkit-align-items:center;
        -moz-align-items:center;
        -ms-align-items:center;
        justify-content: center;
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -ms-justify-content: center;
    }
    .logo-title{
        width:200px;
        height:48px;
        background:url('~@/assets/img/login/logo.png') no-repeat center;
        background-size:100% auto;
        margin:0 auto;
        margin-bottom:25px;
    }
    .login-cont{
        width:350px;
        height:370px;
        background:#fff;
    }
    .login-cont h2{
        text-align:center;
        font-size:24px;
        text-align:center;
        padding-top:50px;
    }
    .btn-box,.input-box,.text-box{
        padding:0 40px;
        height:auto;
        overflow:hidden;
    }
    .btn-box button{
        display:block;
        width:100%;
        height:38px;
        line-height:38px;
        background:#4d9fff;
        color:#fff;
        text-align:center;
        border:0;
        border-radius:19px;
        cursor: pointer;
        font-size:14px;
        outline: none;
    }
    .text-box .remenber-cont{
        float:left;
        color:#333;
        font-size:14px;
    }
    .text-box{
        padding:12px 40px;
    }
    .register-cont{
        float:right;
    }
    .register-cont a{
        color:#333;
        font-size:14px;
        text-decoration: none;
    }
</style>
