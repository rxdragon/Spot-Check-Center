<template>
  <div class="photography-quality-report-area">
    <QualityReportComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import QualityReportComponents from '@/components/QualityReportComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { QUALITY_REPORT_RANGE, ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'PhotographyQualityReportArea',
  components: { QualityReportComponents },
  setup () {
    provide('type', SPOT_TYPE.PHOTOGRAPHY)
    provide('organizationType', ORGANIZATION_TYPE.HIMO)
    provide('rangeType', QUALITY_REPORT_RANGE.REGION)
  }
})
</script>
