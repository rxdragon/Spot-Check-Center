<template>
  <QualityReportComponents />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import QualityReportComponents from '@/components/QualityReportComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { QUALITY_REPORT_RANGE, ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'MakeupQualityReport',
  components: { QualityReportComponents },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
    provide('rangeType', QUALITY_REPORT_RANGE.ALL)
  }
})
</script>
