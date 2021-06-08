<template>
  <div class="staff-select">
    <el-cascader
      ref="staffCascader"
      :options="options"
      :props="propsValue"
      collapse-tags
      v-bind="$attrs"
      placeholder="请选择伙伴"
      :show-all-levels="false"
      :popper-append-to-body="false"
      :disabled="loadingDown"
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
import { defineComponent, inject, reactive, ref, computed } from 'vue'
import * as Staff from '@/api/staff'

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
    const propsValue = computed(() => Object.assign({}, deafultProps, props))

    /**
     * @description 获取伙伴列表
     */
    const options: any = ref([])
    const loadingDown = ref(true)
    const getStaffList = async () => {
      const list = await Staff.getStaffSelectList()
      options.value = list
      loadingDown.value = false
    }
    getStaffList()
    
    return {
      options, loadingDown, type, propsValue
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
