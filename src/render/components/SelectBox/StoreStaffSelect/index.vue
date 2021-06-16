<template>
  <div class="store-staff-select">
    <el-cascader
      ref="staffCascader"
      :options="options"
      :props="deafultProps"
      collapse-tags
      v-bind="$attrs"
      placeholder="请选择伙伴"
      :show-all-levels="false"
      :disabled="staffStoreLoading"
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
import { defineComponent, reactive, ref } from 'vue'
import * as CommonalityApi from '@/api/commonalityApi'
import { newMessage } from '~/render/utils/message'

export default defineComponent({
  name: 'StoreStaffSelect',
  setup () {
    /** 确认配置选项 */
    const deafultProps = reactive({
      multiple: true,
      emitPath: false
    })

    const staffStoreLoading = ref(true)
    const options = ref<CommonalityApi.ICascaderSelect[]>([])

    /** 获取门店分级的修图师列表 */
    const getStaffList = async () => {
      try {
        staffStoreLoading.value = true
        const req = {}
        options.value = await CommonalityApi.getStoreStaffTree(req)
        staffStoreLoading.value = false
      } catch (error) {
        newMessage.error(String(error))
      }
    }
    getStaffList()

    /** 对外抛出接口获取节点 */
    const staffCascader = ref<any>(null)
    const getCheckedStaff = () => {
      return staffCascader.value.getCheckedNodes(true)
    }
    
    return {
      staffStoreLoading, deafultProps, options,
      staffCascader, getCheckedStaff
    }
  }
})


</script>

<style lang="less" scoped>
.store-staff-select {
  width: 100%;

  .el-cascader {
    .el-cascader__tags input {
      font-size: 14px;
    }
  }
}
</style>
