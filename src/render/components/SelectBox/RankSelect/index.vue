<template>
  <div class="rank-select">
    <el-select v-bind="$attrs" clearable placeholder="请选择角色组">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.label"
        :value="item.id"
        :disabled="isLoading"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RankSelect',
  setup () {
    // TODO: cf
    const isLoading = ref(false)
    const options = ref([
      {
        label: '化妆专家',
        id: 1
      },
      {
        label: '化妆督导',
        id: 2
      },
      {
        label: '化妆组长',
        id: 3
      },
      {
        label: '摄影专家',
        id: 5
      },
      {
        label: '摄影督导',
        id: 6
      },
      {
        label: '摄影组长',
        id: 7
      },
    ])

    return {
      options,
      isLoading
    }
  }
})
</script>
