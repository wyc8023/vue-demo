<template>
  <div class="nav" ref="left" >
    <el-menu class="el-menu-vertical-demo"
            router
            unique-opened
            :default-active="currentMenuActive"
            @open=handleOpen
            :collapse="isLeftCollapse">
        <menu-tree v-for="(menu, index) in menuList" :key='index' :value="menu"></menu-tree>
    </el-menu>
  </div>
</template>
<script>
import menuTree from '@/components/menu'
export default {
  props: [
    'isLeftCollapse',
    'isLoginCssActive'
  ],
  data () {
    return {
      menuList: [],
      currentMenuActive: ''
    }
  },
  methods: {
    async getMenu () {
      let response = await this.$services.dmis.menuInit()
      if (response.status === 200) {
        this.menuList = response.result.data.menuList
        let navList = response.result.data.navList
        this.$parent.systemList = navList
        this.$parent.userInfo = response.result.data.userInfo
        let sysName = navList.length > 0 ? navList[0].name : ''
        this.$root.bus.$emit('sysNavInitEvent', sysName)
      }
    },
    async handleOpen (key, keyPath) {
      let _this = this
      let menu = this.getMenuByKeyPath(this.menuList, keyPath)
      if (typeof (menu.loaded) === 'undefined') {
        let response = await this.$services.dmis.getMenuByParentId({parentId: menu.id})
        if (response.status === 200) {
          let data = response.result.data
          if (data && data.length > 0) {
            menu.child = data
            menu.loaded = true
          } else {
            menu.child = null
            _this.currentMenuActive = menu.id.toString()
            if (menu.url !== '') {
              this.$router.push(menu.url)
            }
          }
        }
      }
    },
    onSelect () {},
    async getMenuListByParentId (menuId) {
      let response = await this.$services.dmis.getMenuByParentId({parentId: menuId})
      if (response.status === 200) {
        this.menuList = response.result.data
      }
    },
    getMenuByKeyPath (menuList, keyPath) {
      for (let j = 0; j < keyPath.length; j++) {
        let menuId = keyPath[j]
        let menu = this.getMenuFromMenuList(menuList, menuId)
        if (j === keyPath.length - 1) {
          return menu
        } else {
          menuList = menu.child
          continue
        }
      }
    },
    getMenuFromMenuList (menuList, menuId) {
      for (let i = 0; i < menuList.length; i++) {
        if ((menuList[i].id - menuId) === 0) {
          return menuList[i]
        }
      }
    }
  },
  components: {
    menuTree
  },
  created () {
    if (!this.isLoginCssActive) {
      this.getMenu()
    }
  },
  mounted () {
    this.$root.bus.$on('sysNavInitEvent', sysName => {
      this.systemName = sysName
    })
    this.$root.bus.$on('sysChangeEvent', value => {
      this.getMenuListByParentId(value)
    })
  }
}
</script>
