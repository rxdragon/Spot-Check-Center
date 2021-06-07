<template>
  <div class="family-makeup-evaluate">
    <EvaluateComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

import EvaluateComponents from '@/components/EvaluateComponents/index.vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyMakeupEvaluate',
  components: { EvaluateComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
  }
})
</script>
