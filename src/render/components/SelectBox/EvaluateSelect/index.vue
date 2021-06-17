<template>
  <div class="evaluate-select">
    <el-cascader
      v-bind="$attrs"
      :options="options"
      :props="deafultProps"
      :disabled="loading"
      collapse-tags
      placeholder="请选择评价"
      filterable
      clearable
    >
      <template #default="{ node, data }">
        <span>{{ data.name }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import * as SelectDataApi from '@/api/selectDataApi'

export default defineComponent({
  name: 'EvaluateSelect',
  props: {
    type: { type: String, default: '' }
  },
  setup (props) {
    /** 组件基本属性 */
    const deafultProps = reactive({
      multiple: true,
      emitPath: false,
      value: 'id',
      label: 'name'
    })


    /** 获取评价标签 */
    const options: any = ref([])
    const loading = ref(true)
    const getAllLabel = async () => {
      try {
        loading.value = true
        const req = {
          type: props.type
        }
        const res: any[] = await SelectDataApi.getEvaluateSelectList(req)
        options.value = res
      } finally {
        loading.value = false
      }
    }
    getAllLabel()


    return {
      deafultProps,
      loading,
      options
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
