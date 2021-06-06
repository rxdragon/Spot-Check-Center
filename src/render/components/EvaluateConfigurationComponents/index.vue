<template>
  <div class="evaluate-configuration-components">
    评价配置 -
    {{ type }} -
    {{ organizationType }}
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'EvaluateConfigurationComponents',
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
