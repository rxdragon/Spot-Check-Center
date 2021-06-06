<template>
  <div class="quality-report-components">
    质检报告 -
    {{ type }} -
    {{ organizationType }} -
    {{ rangeType }}
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'QualityReportComponents',
  setup () {
    const type = inject('type')
    const organizationType = inject('organizationType')
    const rangeType = inject('rangeType')

    return {
      type,
      organizationType,
      rangeType
    }
  }
})
</script>
