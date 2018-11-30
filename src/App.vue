<template>
<section>
  <sitech-header :systemList="systemList" :userInfo = "userInfo" :class="{'loginClass':loginIsActive}"></sitech-header>
  <div id="app" class="main">
    <sitech-left :isLeftCollapse="isLeftCollapse" :isLoginCssActive="loginIsActive" :class="{'loginClass': loginIsActive}"></sitech-left>
    <div :class="[{'content-wrapper2': !isLeftCollapse},{'content-wrapper': isLeftCollapse},{'main-login-css' : loginIsActive }]">
      <router-view/>
    </div>
  </div>
</section>
</template>

<script>
import header from '@/components/header'
import left from '@/components/left'

export default {
  data () {
    return {
      isLeftCollapse: false,
      systemList: [],
      userInfo: {},
      loginIsActive: false
    }
  },
  components: {
    'sitech-header': header,
    'sitech-left': left
  },
  methods: {
  },
  created () {
    this.$root.bus.$on('activeLoginCssEvent', (val) => {
      this.loginIsActive = val
      console.log('aaaaa')
    })
  },
  computed: {
  }
}
</script>
<style>

  .el-table th{
          border-bottom: 1px solid #ebeef5;
          background: #EEF1F6;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100vh;
    background: #EEF1F6;
  }
  .el-menu{
    border-right:0;
     background: #EEF1F6;
  }
  .el-menu--collapse{
    min-height: 100vh;
  }
  .head {
    height: 60px;
    background: #20A0FF;
  }

  .head img {
    float: left;
    width: 130px;
    background-size: 100%;
    margin: 10px 50px 0 20px;
  }

  .head .el-icon-menu {
    float: left;
    color: #fff;
    margin: 23px 0 0 0;
  }

  .head .logout {
    float: right;
    padding: 20px 20px 0 0;
  }

  .head .logout .el-dropdown,.sysMenu .el-dropdown {
    color: #fff;
  }
  .sysMenu {
    float: right;
    padding: 20px 20px 0 0;
    margin-right: 20px;
  }
  .sysMenu span{
    font-size: 14px;
    color: #fff;
    margin-right: 10px;
  }
  .main {
    position: relative;
  }

  .main .nav {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #EEF1F6;
  }

  .main .nav a {
    color: #48576a;
    text-decoration: none;
  }

  .main .content-wrapper {
    transition-duration: 0.5s;
    -ms-transition-duration: 0.5s;
    -moz-transition-duration: 0.5s;
    -webkit-transition-duration: 0.5s;
    -o-transition-duration: 0.5s;
    padding-left: 84px;
    padding-right: 20px;
  }

  .main .content-wrapper2 {
    transition-duration: 0.5s;
    -ms-transition-duration: 0.5s;
    -moz-transition-duration: 0.5s;
    -webkit-transition-duration: 0.5s;
    -o-transition-duration: 0.5s;
    margin-left: 200px;
    padding-left:20px;
    border-left:1px solid #f9f9f9;
    padding-right: 20px;
  }
  .main .content-wrapper2.main-login-css {
    padding:0;
    margin:0;
    padding-left:0px;
    padding-right: 0px;
  }
  .main .content-wrapper .bread, .main .content-wrapper2 .bread {
    padding-top: 20px;
    margin-bottom: 10px;
  }

  .main .content-wrapper .page, .main .content-wrapper2 .page {
    text-align: center;
    margin-top: 20px;
    padding-bottom: 50px;
  }

  .el-tabs {
    margin-top: 5px;
  }

  .el-tabs__header {
    margin: 0
  }

  .el-tabs__new-tab {
    display: none;
  }
  .loginClass {
    display: none;
  }

  /*.button, .button:visited {*/
  /*display: inline-block;*/
  /*color: #3B8070;*/
  /*letter-spacing: 1px;*/
  /*background-color: #fff;*/
  /*border: 2px solid #3B8070;*/
  /*text-decoration: none;*/
  /*text-transform: uppercase;*/
  /*padding: 15px 45px;*/
  /*}*/

  /*.button:hover, .button:focus {*/
  /*color: #fff;*/
  /*background-color: #3B8070;*/
  /*}*/

  /*.title {*/
  /*color: #505153;*/
  /*font-weight: 300;*/
  /*font-size: 2.5em;*/
  /*margin: 0;*/
  /*}*/
</style>
