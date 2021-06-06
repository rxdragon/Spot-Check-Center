<template>
  <div class="staff-select">
    <el-cascader
      ref="staffCascader"
      :options="componentData.options"
      :props="propsValue"
      collapse-tags
      v-bind="$attrs"
      placeholder="请选择伙伴"
      :show-all-levels="false"
      :popper-append-to-body="false"
      :disabled="componentData.loadingDown"
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
import { defineComponent, inject, reactive, computed } from 'vue'

export default defineComponent({
  name: 'StaffSelect',
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const type = inject('type')

    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })
    const componentData = reactive({
      options: [],
      loadingDown: true
    })
    const propsValue = computed(() => Object.assign({}, deafultProps, props))
    
    return {
      componentData, type, propsValue
    }
  },
  methods: {
    // TODO: lj
    /**
    * @description 获取选中节点
    */
    getCheckedStaff () {
      return this.$refs["staffCascader"].getCheckedNodes(true)
    }
  }
})


</script>

<style lang="less">
.staff-select {
  width: 100%;

  .el-cascader {
    .el-cascader__tags input {
      font-size: 14px;
    }
  }
}
</style>
