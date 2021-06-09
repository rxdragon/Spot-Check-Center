<template>
  <div class="himo-makeup-evaluate">
    <EvaluateComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

import EvaluateComponents from '@/components/EvaluateComponents/index.vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoMakeupEvaluate',
  components: { EvaluateComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
