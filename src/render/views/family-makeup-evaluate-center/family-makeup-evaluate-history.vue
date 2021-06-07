<template>
  <div class="family-makeup-evaluate-history">
    <EvaluateHistoryComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import EvaluateHistoryComponents from '@/components/EvaluateHistoryComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyMakeupEvaluateHistory',
  components: { EvaluateHistoryComponents },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
  }
})
</script>
