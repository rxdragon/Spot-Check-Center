<template>
  <div class="store-panel">
    <TransferExtend
      v-if="!productLoading"
      :default-checked-keys="defaultChecks"
      :from-data="fromData"
      :title="title"
      mode="transfer"
      default-transfer
      filter
      height="540px"
      v-bind="$attrs"
      @addbtn="addToData"
      @removebtn="remove"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted } from 'vue'
import TransferExtend from '@/components/TransferExtend/index.vue'
import * as StaffApi from '@/api/staffApi'

export default defineComponent({
  name: 'StorePanel',
  components: { TransferExtend },
  props: {
    defaultCheckedKeys: { type: Array, default: () => [] }, // 默认选中组员
    disabledChecked: { type: Array, default: () => [] } // 禁止选中
  },
  emits: ['update:toData'],
  setup (props, { emit }) {
    StaffApi.getAllStore()
    const { defaultCheckedKeys, disabledChecked } = toRefs(props)

    const productLoading = ref(false)
    const title = ['可选门店', '已选门店']
    const fromData = ref<any>([])
    const defaultChecks = ref<any>([])

    const getAllProductPanel = async (disabledId?: any[]) => {
      productLoading.value = true
      const list = await StaffApi.getAllStore(disabledId)
      fromData.value = JSON.parse(JSON.stringify(list))
      productLoading.value = false
    }

    onMounted(() => {
      if (!disabledChecked.value || !disabledChecked.value.length) {
        defaultChecks.value = defaultCheckedKeys.value
        getAllProductPanel()
      }
    })

    watch(
      defaultCheckedKeys,
      () => {
        const _disabledChecked = disabledChecked.value || []
        const data = new Set([...defaultCheckedKeys.value, ..._disabledChecked])
        defaultChecks.value = [...data]
      },
      { immediate: true }
    )

    watch(
      disabledChecked,
      (value) => {
        const data = new Set([...defaultCheckedKeys.value, ...value])
        defaultChecks.value = [...data]
        getAllProductPanel(value)
      },
      { immediate: true }
    )

    /** 移动数据 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addToData = (fromData: any, toData: any, obj: any) => {
      emit('update:toData', toData)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const remove = (fromData: any, toData: any, obj: any) => {
      emit('update:toData', toData)
    }

    return {
      productLoading,
      fromData, title,
      defaultChecks,
      addToData, remove
    }
  }
})
</script>
