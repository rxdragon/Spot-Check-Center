<template>
  <div class="evaluate-components">
    评价历史组件 -
    {{ type }} -
    {{ organizationType }}
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'EvaluateComponents',
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
