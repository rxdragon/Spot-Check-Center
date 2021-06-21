<template>
  <div class="reviewStatus-select">
    <el-select v-bind="$attrs" clearable :placeholder="placeholder">
      <el-option
        v-for="(optionItem, optionIndex) in options"
        :key="optionIndex"
        :label="optionItem.label"
        :value="optionItem.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { APPEAL_STATUS, appealStatusToCN } from '@/model/AppealModel'

export default defineComponent({
  name: 'ReviewStatusSelect',
  props: {
    reviewType: {
      type: String,
      default: 'first'
    }
  },
  setup (props) {
    /** 初审状态下拉选项 */
    const firstOptions = [{
      label: appealStatusToCN[APPEAL_STATUS.WAIT_FIRST_APPEAL],
      value: APPEAL_STATUS.WAIT_FIRST_APPEAL
    }, {
      label: appealStatusToCN[APPEAL_STATUS.FIRST_APPEAL],
      value: APPEAL_STATUS.FIRST_APPEAL
    }]
    /** 复审状态下拉选项 */
    const secondOptions = [{
      label: appealStatusToCN[APPEAL_STATUS.WAIT_SECOND_APPEAL],
      value: APPEAL_STATUS.WAIT_SECOND_APPEAL
    }, {
      label: appealStatusToCN[APPEAL_STATUS.SECOND_APPEAL],
      value: APPEAL_STATUS.SECOND_APPEAL
    }]

    const otherOptions = [{
      label: appealStatusToCN[APPEAL_STATUS.FINISH],
      value: APPEAL_STATUS.FINISH
    }, {
      label: appealStatusToCN[APPEAL_STATUS.EXPIRED],
      value: APPEAL_STATUS.EXPIRED
    }]

    const placeholder = computed(() => {
      if (props.reviewType === 'first') {
        return '请选择初审状态'
      } else if (props.reviewType === 'second') {
        return '请选择复审状态'
      } else {
        return '请选择审核状态'
      }
    })

    const options = computed(() => {
      if (props.reviewType === 'first'){
        return firstOptions
      } else if (props.reviewType === 'second') {
        return secondOptions
      } else {
        return [...firstOptions, ...secondOptions, ...otherOptions]
      }
    })
    
    return {
      options,
      placeholder
    }
  },
})


</script>

<style lang="less">
.reviewStatus-select {
  width: 100%;
}
</style>
