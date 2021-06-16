<template>
  <div class="rank-select">
    <el-select v-bind="$attrs" clearable placeholder="请选择角色组">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="isLoading"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as StaffApi from '@/api/staffApi'

export default defineComponent({
  name: 'RankSelect',
  setup () {
    const isLoading = ref(true)
    const options = ref<StaffApi.ISelectType[]>([])

    const getPositions = async () => {
      try {
        options.value = await StaffApi.getPositions()
        isLoading.value = false
      } catch (error) {
        console.warn(error)
      }
    }
    getPositions()

    return {
      options,
      isLoading
    }
  }
})
</script>
