<template>
  <div class="himo-makeup-appeal">
    <AppealComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import AppealComponents from '@/components/AppealComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'HimoMakeupAppeal',
  components: { AppealComponents },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
  }
})
</script>
