<template>
  <div class="jobContent-select">
    <el-cascader
      v-bind="$attrs"
      :options="options"
      :props="deafultProps"
      :disabled="loading"
      collapse-tags
      placeholder="请选择职能"
      filterable
      clearable
    >
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue'
import * as SelectDataApi from '@/api/selectDataApi'

export default defineComponent({
  name: 'JobContentSelect',
  setup () {
    const type = inject('type', '')

    /** 组件基本属性 */
    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })


    /** 获取全部职能 */
    const options: any = ref([])
    const loading = ref(true)
    async function getAllJob () {
      // TODO lj
      const req = {
        type: type
      }
      const list = await SelectDataApi.getJobContentSelectList(req)
      options.value = list
      loading.value = false
    }
    getAllJob()


    return {
      deafultProps,
      type,
      loading, options
    }
  },
})


</script>

<style lang="less">
.jobContent-select {
  width: 100%;

  .el-cascader {
    .el-cascader__tags input {
      font-size: 14px;
    }
  }
}
</style>
