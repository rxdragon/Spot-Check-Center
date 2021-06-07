<template>
  <div class="himo-photography-evaluate-history">
    <EvaluateHistoryComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import EvaluateHistoryComponents from '@/components/EvaluateHistoryComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoPhotographyEvaluateHistory',
  components: { EvaluateHistoryComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
