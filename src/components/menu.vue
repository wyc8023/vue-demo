<template>
  <el-submenu :index="value.id+ '' " v-if="value.child != null" >
    <template slot="title">
        <i :class="value.iconUrl === '' ? 'el-icon-message' : value.iconUrl"></i>
        <span slot="title">{{value.name}}</span>
    </template>
    <menu-tree v-for="(child, i) in value.child" :key="i" :index="i" :value="child"></menu-tree>
  </el-submenu>
  <el-menu-item :index="value.url" v-else >
    {{value.name}}
  </el-menu-item>
</template>
<script>
export default {
  props: ['value'],
  name: 'menu-tree'
}
</script>
