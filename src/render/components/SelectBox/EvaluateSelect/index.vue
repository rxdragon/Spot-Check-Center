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
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue'

export default defineComponent({
  name: 'EvaluateSelect',
  setup () {
    const type = inject('type', '')

    /** 组件基本属性 */
    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })


    /** 获取评价标签 */
    const options = ref([])
    const loading = ref(true)
    async function getAllEvaluate () {
      // TODO lj
      // const req = {

      // }
      options.value = []
      loading.value = false
    }
    getAllEvaluate()


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
