<template>
  <div class="himo-makeup-evaluate-history">
    <EvaluateHistoryComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import EvaluateHistoryComponents from '@/components/EvaluateHistoryComponents/index.vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoMakeupEvaluateHistory',
  components: { EvaluateHistoryComponents },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
