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
import { defineComponent, PropType, reactive, ref } from 'vue'
import { getEvaluateSelectList } from '@/api/evaluateHistoryApi'
import { SPOT_TYPE, ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'EvaluateSelect',
  props: {
    spotType: { type: String as PropType<SPOT_TYPE>, required: true },
    organizationType: { type: String as PropType<ORGANIZATION_TYPE>, required: true }
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
          type: props.spotType,
          organizationType: props.organizationType
        }
        const res: any[] = await getEvaluateSelectList(req)
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

<style lang="less" scoped>
.jobContent-select {
  width: 100%;

  .el-cascader {
    .el-cascader__tags input {
      font-size: 14px;
    }
  }
}
</style>
