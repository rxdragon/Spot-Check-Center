<template>
  <div v-if="degree" class="ai-check-result">
    <div class="panel-title mb-3">AI审核结果</div>
    <div class="panel-content">
      <el-tag :type="degreeType === 'normal' ? '' : 'danger'">{{ degree }}</el-tag>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, toRefs } from 'vue'
import { SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'AiCheckResult',
  props: {
    resultInfo: { type: Object, required: true },
  },
  setup (props) {
    const { resultInfo } = toRefs(props)
    const type = inject('type')

    const degree = computed(() => {
      switch (type) {
        case SPOT_TYPE.MAKEUP:
          return resultInfo.value.makeupDegree
        case SPOT_TYPE.PHOTOGRAPHY:
          return resultInfo.value.photographyDegree
        default:
          return ''
      }
    })

    const degreeType = computed(() => {
      switch (type) {
        case SPOT_TYPE.MAKEUP:
          return resultInfo.value.makeupDegreeType
        case SPOT_TYPE.PHOTOGRAPHY:
          return resultInfo.value.photographyDegreeType
        default:
          return ''
      }
    })

    return {
      degree,
      degreeType
    }
  }
})
</script>

<style lang="less" scoped>
.ai-check-result {
  padding: 14px 12px;
  font-size: 12px;
  color: #eee;
  border-bottom: 1px solid #666;

  .panel-title {
    color: #eee;
  }

  .panel-content {
    margin-right: -12px;
    margin-bottom: -12px;

    .el-tag {
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
