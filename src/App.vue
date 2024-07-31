<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { getTest } from './api/test'
</script>
<style scoped lang="less">
#app {
  height: 100vh;
  width: 100vw;
}
</style>
