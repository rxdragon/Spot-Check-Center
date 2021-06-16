<template>
  <div class="scorer-select">
    <el-select
      v-bind="$attrs"
      multiple
      clearable
      placeholder="请选择评分人"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.nickname"
        :value="item.id"
        :disabled="isLoading"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import * as GradeConfigurationApi from '@/api/gradeConfigurationApi'

export default defineComponent({
  name: 'ScorerSelect',
  props: {
    spotType: { type: String as PropType<SPOT_TYPE>, required: true },
    organizationType: { type: String as PropType<ORGANIZATION_TYPE>, required: true }
  },
  setup (props) {
    /** 获取评分人列表 */
    const isLoading = ref(true)
    const options = ref<GradeConfigurationApi.IGetTakeStaffListRes[]>([])
    const getGradeConfiguration = async () => {
      try {
        isLoading.value = true
        const req = {
          type: props.spotType,
          organizationType: props.organizationType
        }
        options.value = await GradeConfigurationApi.getTakeStaffList(req)
      } finally {
        isLoading.value = false
      }
    }
    getGradeConfiguration()

    return {
      options,
      isLoading
    }
  },
})
</script>
