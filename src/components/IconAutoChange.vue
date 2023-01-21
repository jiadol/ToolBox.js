<template>
  <template v-if="props.value">
    <el-icon>
      <CircleCheck color="green"/>
    </el-icon>
  </template>
  <template v-else>
    <el-icon>
      <CircleClose color="red"/>
    </el-icon>
  </template>
</template>

<script setup>
import {CircleCheck, CircleClose} from '@element-plus/icons-vue'
import {ref} from 'vue'

const props = defineProps(['value'])
</script>