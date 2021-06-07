<template>
  <div class="quality-report-components">
    申诉 -
    {{ type }} -
    {{ organizationType }}
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'AppealComponents',
  setup () {
    const type = inject('type')
    const organizationType = inject('organizationType')

    return {
      type,
      organizationType
    }
  }
})
</script>
