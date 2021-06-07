<template>
  <div class="himo-photography-appeal">
    <AppealComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import AppealComponents from '@/components/AppealComponents/index.vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyPhotographyAppeal',
  components: { AppealComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
  }
})
</script>
