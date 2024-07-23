<script setup lang="ts">
import { theme } from 'ant-design-vue'
import Header from './header/index.vue'
import Menu from './menu/index.vue'
</script>

<template>
  <!-- antDesign 全局自定义样式 -->
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#5cdbd3',
      },
      algorithm: theme.darkAlgorithm,
    }"
  >
    <Header></Header>
    <Menu></Menu>
    <router-view></router-view>
  </a-config-provider>
</template>
<style scoped></style>
