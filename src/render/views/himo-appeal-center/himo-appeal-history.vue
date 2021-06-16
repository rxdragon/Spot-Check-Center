<template>
  <div class="himo-appeal-history">
    <AppealComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import AppealComponents from '@/components/AppealComponents/index.vue'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoAppealHistory',
  components: { AppealComponents },
  setup () {
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
