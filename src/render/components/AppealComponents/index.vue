<template>
  <div class="quality-report-components">
    申诉 -
    {{ type }} -
    {{ organizationType }}

    <div class="module-panel mt-6">
      <!-- 更换标签 -->
      <el-tabs v-model="appealType">
        <el-tab-pane :label="`初审`" name="GradeBox" />
        <el-tab-pane :label="`复审`" name="ArraignmentRecordModule" />
        <el-tab-pane :label="`全部`" name="ArraignmentRecordModule" />
      </el-tabs>
      <el-row class="search-box" :gutter="20">
        <!-- 评分时间 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>申诉时间</span>
            <DatePicker v-model="timeSpan" :disabled="Boolean(orderNum)" />
          </div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>订单号</span>
            <el-input v-model="orderNum" placeholder="请输入订单号" clearable />
          </div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>伙伴</span>
            <StaffSelect v-model="staffs" />
          </div>
        </el-col>
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>职能</span>
            <JobContentSelect v-model="jobContentIds" />
          </div>
        </el-col>
        <!-- 申诉人 -->
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref } from 'vue'
import moment from 'moment'
import DatePicker from '@/components/DatePicker/index.vue'
import StaffSelect from '@/components/SelectBox/StaffSelect/index.vue'
import JobContentSelect from '@/components/SelectBox/JobContentSelect/index.vue'
 
export default defineComponent({
  name: 'AppealComponents',
  components: { DatePicker, StaffSelect, JobContentSelect },
  setup () {
    const type = inject('type')
    const organizationType = inject('organizationType')
    const colConfig = reactive({
      span: 24,
      xl: 6,
      lg: 8,
      md: 10,
      sm: 10,
      xs: 24
    })

    const timeSpan: Ref<string | never | any[]> = ref('')
    const startAt = moment().subtract('day', 28).locale('zh-cn').format('YYYY-MM-DD')
    const endAt = moment().locale('zh-cn').format('YYYY-MM-DD')
    timeSpan.value = [startAt, endAt]
    const orderNum = ref('')
    const staffs = ref([])
    const jobContentIds = ref([])

    const appealType = ref('')

    return {
      type,
      organizationType,
      colConfig,
      appealType,
      timeSpan,
      orderNum,
      staffs,
      jobContentIds
    }
  }
})
</script>
