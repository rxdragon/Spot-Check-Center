<template>
  <div class="family-makeup-quality-report">
    <QualityReportComponents />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import QualityReportComponents from '@/components/QualityReportComponents/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'
import { QUALITY_REPORT_RANGE, ORGANIZATION_TYPE } from '@/model/Enumerate'

export default defineComponent({
  name: 'FamilyMakeupQualityReport',
  components: { QualityReportComponents },
  setup () {
    provide('type', SPOT_TYPE.MAKEUP)
    provide('organizationType', ORGANIZATION_TYPE.FAMILY)
    provide('rangeType', QUALITY_REPORT_RANGE.ALL)
  }
})
</script>
