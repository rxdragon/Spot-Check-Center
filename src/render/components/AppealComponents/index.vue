<template>
  <div class="quality-report-components">
    申诉 -
    {{ type }} -
    {{ organizationType }}

    <div class="mt-6">
      <!-- 更换标签 -->
      <el-tabs v-if="type !== 'all'" v-model="appealType">
        <el-tab-pane :label="`初审（${firstAppealsNum}）`" name="first" />
        <el-tab-pane :label="`复审（${secondAppealsNum}）`" name="second" />
        <el-tab-pane :label="`全部（${allAppealsNum}）`" name="all" />
      </el-tabs>
      <div
        class="module-panel"
        :class="{'rounded-tl-none': appealType === 'first' && type !== 'all'}"
      >
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
          <el-col v-if="type !== 'all'" v-bind="{ ...colConfig }">
            <div class="search-item">
              <span>伙伴</span>
              <StoreStaffSelect v-model="staffs" />
            </div>
          </el-col>
          <el-col v-if="type !== 'all'" v-bind="{ ...colConfig }">
            <div class="search-item">
              <span>职能</span>{{ jobContentIds }}
              <PositionStaffSelect v-model="jobContentIds" />
            </div>
          </el-col>
          <el-col v-if="type !== 'all'" v-bind="{ ...colConfig }">
            <div class="search-item">
              <span>申诉人</span>
              <el-input v-model="inputStaffIds" placeholder="请输入申诉人" clearable />
            </div>
          </el-col>
          <el-col v-bind="{ ...colConfig }">
            <div class="search-item">
              <span v-if="appealType === 'first' && type !== 'all'">初审状态</span>
              <span v-if="appealType === 'second' && type !== 'all'">复审状态</span>
              <span v-if="appealType === 'all' || type === 'all'">审核状态</span>
              <ReviewStatusSelect v-model="appealStatus" :review-type="type === 'all' ? type : appealType" />
            </div>
          </el-col>
          <el-col v-bind="{lg: 2, md: 2}">
            <div class="search-item">
              <el-button type="primary" @click="searchData(1)">查询</el-button>
            </div>
          </el-col>
        <!-- 申诉人 -->
        </el-row>
        <div v-if="type !== 'all'" class="top-msg flex items-center mb-6">
          <span class="mr-6">申诉总单量:{{ appealCount }}单</span>
          <span>初审拒绝率:{{ (appealRefuseCount / appealCount * 100).toFixed() }}%</span>
        </div>
        <div class="table-module-box">
          <el-table
            border
            :data="tableData"
            style="width: 100%;"
            :header-cell-style="{'text-align':'center'}"
          >
            <el-table-column
              width="100"
              align="center"
              prop="appealName"
              label="申诉人"
            />
            <el-table-column width="200" prop="orderNum" label="订单号">
              <template #default="{ row }">
                <p>订单号：{{ row.orderInfo.num }}</p>
                <p>化妆师：{{ row.orderInfo.dresser }}</p>
                <p>督导：{{ row.orderInfo.supervisor }}</p>
                <p>专家：{{ row.orderInfo.experts }}</p>
                <p>门店：{{ row.orderInfo.storeName }}</p>
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              align="center"
              prop="appealDate"
              label="申诉时间"
            />
            <el-table-column
              width="80"
              align="center"
              prop="status"
              label="处理状态"
            >
              <!-- TODO lj -->
              <!-- <template #default="{ row }">
                {{ getStatus(row.status) }}
              </template> -->
            </el-table-column>
            <el-table-column width="243" prop="updatedAt" label="初审信息">
              <template #default="{ row }">
                <p>初审人：{{ row.firstExamineInfo.examineName }}</p>
                <p>初审通过时间：{{ row.firstExamineInfo.date }}</p>
              </template>
            </el-table-column>
            <el-table-column width="243" prop="updatedName" label="复审信息">
              <template #default="{ row }">
                <p>复审人：{{ row.secondExamineInfo.examineName }}</p>
                <p>复审通过时间：{{ row.secondExamineInfo.date }}</p>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="操作">
              <template #default="{ row }">
                <el-button type="primary" size="mini" @click="goDetail(row.id, row.status)">
                  {{ getBtnText(row.status) }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <el-pagination
        v-model:current-page="pager.page"
        :hide-on-single-page="false"
        :page-size="pager.pageSize"
        layout="prev, pager, next"
        :total="pager.total"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import { defineComponent, inject, reactive, Ref, ref, watch } from 'vue'
import DatePicker from '@/components/DatePicker/index.vue'
import StoreStaffSelect from '@/components/SelectBox/StoreStaffSelect/index.vue'
import PositionStaffSelect from '@/components/SelectBox/PositionStaffSelect/index.vue'
import ReviewStatusSelect from '@/components/SelectBox/ReviewStatusSelect/index.vue'
import { ORGANIZATION_TYPE } from '@/model/Enumerate'
import * as TimeUtil from '@/utils/TimeUtil'
import * as AppealApi from '@/api/appealApi'
import { AppealListModel, appealStatusToCN, APPEAL_STATUS } from '@/model/AppealModel'
import dayjs from 'dayjs'
 
export default defineComponent({
  name: 'AppealComponents',
  components: { DatePicker, StoreStaffSelect, ReviewStatusSelect, PositionStaffSelect },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const type = inject('type', 'all')
    const organizationType = inject('organizationType', ORGANIZATION_TYPE.HIMO)
    const colConfig = reactive({
      span: 24,
      xl: 5,
      lg: 7,
      md: 9,
      sm: 9,
      xs: 24
    })

    const appealType = ref('first')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })

    /**
     * @description 获取操作栏下按钮的名称
    */
    const getBtnText = (status: string) => {
      if (status === APPEAL_STATUS.WAIT_FIRST_APPEAL || status === APPEAL_STATUS.FIRST_APPEAL) {
        return '初审'
      } else if (status === APPEAL_STATUS.WAIT_SECOND_APPEAL) {
        return '复审'
      } else {
        return '详情'
      }
    }

    /**
     * @description 页面数据
    */
    /** 获取申诉列表 */
    const tableData = ref<AppealListModel[]>([])
    const getAppealByPage = async (req: AppealApi.IGetAppealParams) => {
      const res = await AppealApi.getAppealByPage(req, organizationType)
      pager.total = res.total
      tableData.value = res.list
    }
    /** 获取申诉绩效 */
    const appealCount = ref(0) // 申诉总单量
    const appealRefuseCount = ref(0) // 申诉拒绝单量
    const getAppealQuota = async (req: AppealApi.IGetAppealParams) => {
      const res = await AppealApi.getAppealQuota(req, organizationType)
      appealCount.value = res.count
      appealRefuseCount.value = res.refuseCount
    }

    const orderNum = ref('')
    const staffs = ref([])
    const jobContentIds = ref([])
    const appealStatus = ref()
    const inputStaffIds = ref('')
    const timeSpan: Ref<string | never | any[]> = ref('')
    const startAt = dayjs().subtract(36, 'hour').format('YYYY-MM-DD 00:00:00')
    const endAt = dayjs().format('YYYY-MM-DD 00:00:00')
    timeSpan.value = [startAt, endAt]
    const getAppealData = () => {
      const req: AppealApi.IGetAppealParams = {
        page: pager.page,
        pageSize: pager.pageSize,
        serviceType: type
      }
      if (timeSpan.value) {
        req.startAt = TimeUtil.searchStartTime(timeSpan.value[0])
        req.endAt = TimeUtil.searchEndTime(timeSpan.value[1])
      }
      if ( appealType.value === 'first' ) { req.appealStatus = [APPEAL_STATUS.WAIT_FIRST_APPEAL, APPEAL_STATUS.FIRST_APPEAL] }
      if ( appealType.value === 'second' ) { req.appealStatus = [APPEAL_STATUS.WAIT_SECOND_APPEAL, APPEAL_STATUS.SECOND_APPEAL] }
      if (orderNum.value) req.cloudOrderNum = orderNum.value
      if (inputStaffIds.value) req.inputStaffIds = inputStaffIds.value
      if (staffs.value.length > 0) req.staffId = staffs.value
      if (appealStatus.value) req.appealStatus = appealStatus.value.split(',')
      if (jobContentIds.value.length > 0) req.supervisorArr = jobContentIds.value
      getAppealByPage(req)
      getAppealQuota(req)
    }

    /** 获取全部数据 */
    const searchData = async (page?: number) => {
      pager.page = page ? page : pager.page
      try {
        store.dispatch('settingStore/showLoading', route.name)
        getAppealData()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    searchData(1)

    /**
     * @description 获取审核总量
    */
    const firstAppealsNum = ref(0) // 初审数量
    const secondAppealsNum = ref(0) // 复审数量
    const allAppealsNum = ref(0) // 全部审核数量
    const getAppealCount = async () => {
      const req = {
        serviceType: type
      }
      const res = await AppealApi.getAppealCount(req, organizationType)
      firstAppealsNum.value = res.firstCount
      secondAppealsNum.value = res.secondCount
      allAppealsNum.value = res.firstCount + res.secondCount
    }
    getAppealCount()

    /**
     * @description 监听tab切换
    */
    const initParams = () => {
      orderNum.value = ''
      staffs.value = []
      jobContentIds.value = []
      appealStatus.value = ''
      inputStaffIds.value = ''
      timeSpan.value = [startAt, endAt]
    }
    watch(appealType, (val) => {
      initParams()
      // if (val === 'first') {
      //   appealStatus.value = APPEAL_STATUS.WAIT_FIRST_APPEAL + ',' + APPEAL_STATUS.FIRST_APPEAL
      // }
      // if (val === 'second') {
      //   appealStatus.value = APPEAL_STATUS.WAIT_SECOND_APPEAL + ',' + APPEAL_STATUS.SECOND_APPEAL
      // }
      searchData(1)
    })

    const routerGo = (id: string) => {
      const base = organizationType === ORGANIZATION_TYPE.HIMO ? 'himo-appeal-center/himo-' : 'family-appeal-center/family-'
      router.push({
        path: `/${base}appeal-detail`,
        query: { id, type }
      })
    }

    /**
     * @description 初审绑定
    */
    const bindFirst = async (id: string) => {
      const req = {
        id: id
      }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await AppealApi.bindFirst(req, organizationType)
        routerGo(id)
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /**
     * @description 复审绑定
    */
    const bindSecond = async (id: string) => {
      const req = {
        id: id
      }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await AppealApi.bindSecond(req, organizationType)
        routerGo(id)
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    const goDetail = (id: string, status: string) => {
      if (status === APPEAL_STATUS.WAIT_FIRST_APPEAL) {
        bindFirst(id)
      } else if (status === APPEAL_STATUS.WAIT_SECOND_APPEAL) {
        bindSecond(id)
      } else {
        routerGo(id)
      }
    }

    return {
      type,
      organizationType,
      colConfig,
      appealType,
      timeSpan,
      orderNum,
      staffs,
      inputStaffIds,
      appealStatus,
      jobContentIds,
      tableData,
      pager,
      firstAppealsNum,
      secondAppealsNum,
      allAppealsNum,
      appealCount,
      appealRefuseCount,
      goDetail,
      appealStatusToCN,
      getBtnText,
      searchData,
    }
  }
})
</script>

<style lang="less" scoped>
.top-msg {
  font-size: 14px;
  color: #303133;
}
</style>
