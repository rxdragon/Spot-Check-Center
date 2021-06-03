<template>
  <ReportMain />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

import ReportMain from './components/ReportMain.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'

export default defineComponent({
  name: 'MakeupQualityReport',
  components: { ReportMain },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
  }
})
</script>
