<script setup lang="ts">
import { getTest } from '@/api/test'
import axios from 'axios'

onMounted(async () => {
  const res = await getTest()
  console.log(res)
})
</script>

<template>
  <a-button type="primary"> primary </a-button>
</template>
<style scoped></style>
