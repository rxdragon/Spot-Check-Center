<template>
  <div class="himo-makeup-evaluate-config">
    <EvaluateConfigurationComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

import EvaluateConfigurationComponents from '@/components/EvaluateConfigurationComponents/index.vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoMakeupEvaluateConfig',
  components: { EvaluateConfigurationComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
