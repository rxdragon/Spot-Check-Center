<template>
  <div class="family-appeal-history">
    <AppealComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import AppealComponents from '@/components/AppealComponents/index.vue'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyAppealHistory',
  components: { AppealComponents },
  setup () {
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
  }
})
</script>
