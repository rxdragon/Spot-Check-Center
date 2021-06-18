<template>
  <div class="family-appeal-detail">
    <AppealDetail />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import AppealDetail from '@/components/AppealComponents/appealDetail.vue'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyAppealDetail',
  components: { AppealDetail },
  setup () {
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
  }
})
</script>
