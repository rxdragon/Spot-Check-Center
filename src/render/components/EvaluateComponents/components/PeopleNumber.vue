<template>
  <el-select v-bind="$attrs" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'PeopleNumber',
  setup () {
    const options = <Record<string, string | number>[]>reactive([])
    const maxNum: any = 5

    for (let index = 1; index <= maxNum; index++) {
      options.push({
        label: String(index),
        value: index
      })
    }
   
    return {
      options
    }
  }
})
</script>
