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
import { defineComponent, PropType, reactive, ref } from 'vue'
import * as CommonalityApi from '@/api/commonalityApi'
import { newMessage } from '~/render/utils/message'
import { STORE_TYPE, SPOT_TYPE, ORGANIZATION_TYPE } from '@/model/Enumerate'


export default defineComponent({
  name: 'StoreStaffSelect',
  props: {
    spotType: { type: String as PropType<SPOT_TYPE>, default: '' },
    organizationType: { type: String as PropType<ORGANIZATION_TYPE>, required: true }
  },
  setup (props) {
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

        let storeState: STORE_TYPE[] = []
        if (props.organizationType === ORGANIZATION_TYPE.HIMO) {
          storeState = [
            STORE_TYPE.BLUE,
            STORE_TYPE.GOLD,
            STORE_TYPE.MASTER,
          ]
        }
        if (props.organizationType === ORGANIZATION_TYPE.FAMILY) {
          storeState = [
            STORE_TYPE.KIDS,
            STORE_TYPE.FAMILY,
          ]
        }
        const req: CommonalityApi.IGetStoreStaffTreeParams = {
          state: storeState,
        }
        if (props.spotType) req.type = props.spotType

        const list = await CommonalityApi.getStoreStaffTree(req)
        options.value = list
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
