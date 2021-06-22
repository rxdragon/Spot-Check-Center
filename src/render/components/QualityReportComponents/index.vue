<template>
  <div class="quality-report-components pb-0">
    <el-row class="search-box" :gutter="20">
      <!-- 评分时间 -->
      <el-col v-if="activeName === QUALITY_COMPONENT.GRADE_BOX" v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>评分时间</span>
          <DatePicker v-model="timeSpan" :disabled="Boolean(orderNum)" />
        </div>
      </el-col>
      <el-col
        v-if="activeName === QUALITY_COMPONENT.ARRAIGNMENT_RECORD_MODULE"
        v-bind="{ ...colConfig }"
      >
        <div class="search-item">
          <span>AI评分时间</span>
          <DatePicker v-model="aiTimeSpan" :disabled="Boolean(orderNum)" />
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
          <span>产品</span>
          <ProductSelect v-model="productIds" :himo-product="showHimoProduct" :family-product="showFamilyProduct" />
        </div>
      </el-col>
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>伙伴</span>
          <StoreStaffSelect v-model="staffs" :spot-type="type" :organization-type="organizationType" />
        </div>
      </el-col>
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>职能</span>
          <PositionStaffSelect v-model="jobContentIds" />
        </div>
      </el-col>
      <!-- 职能 -->
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>评价标签</span>
          <EvaluateSelect v-model="evaluateIds" :type="type" />
        </div>
      </el-col>
      <!-- 分数 -->
      <el-col v-bind="{...colConfig}">
        <div class="grade-search search-item">
          <span>分数</span>
          <ScopeSearch v-model="scopeData" />
        </div>
      </el-col>
      <el-col
        v-if="activeName === QUALITY_COMPONENT.ARRAIGNMENT_RECORD_MODULE"
        v-bind="{...colConfig}"
      >
        <div class="search-item">
          <span>AI标签</span>
          <AiTagSelect v-model="aiTag" />
        </div>
      </el-col>
      <el-col v-bind="{...colConfig}" class="text-right">
        <div class="search-item">
          <el-checkbox v-model="onlyNew" @change="changeOnlyNew">只看新人</el-checkbox>
          <el-checkbox v-model="onlyOld" @change="changeOnlyOld">只看正式伙伴</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" @click="searchData(1)">查询</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

  
  <div class="quality-tabs mt-6">
    <!-- 更换标签 -->
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`评分明细`" name="GradeBox" />
      <el-tab-pane :label="`AI审核报告`" name="ArraignmentRecordModule" />
    </el-tabs>
    <div
      class="module-panel"
      :class="{'rounded-tl-none': activeName === 'GradeBox'}"
    >
      <keep-alive>
        <component :is="activeName" @previewPhoto="onPreviewPhotoList" />
      </keep-alive>
    </div>
  </div>

  <!-- 分页 -->
  <div class="page-box">
    <el-pagination
      v-model:current-page="pager.page"
      :hide-on-single-page="true"
      :page-size="pager.pageSize"
      layout="prev, pager, next"
      :total="pager.total"
      @current-change="handlePage"
    />
  </div>
  <PreviewPhoto
    v-if="showPreview"
    v-model:showPreview="showPreview"
    :imgarray="photos"
    :index="previewIndex"
  />
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { newMessage } from '@/utils/message'

import * as TimeUtil from '@/utils/TimeUtil'
import DatePicker from '@/components/DatePicker/index.vue'
import ArraignmentRecordModule from './ArraignmentRecordModule.vue'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import StoreStaffSelect from '@/components/SelectBox/StoreStaffSelect/index.vue'
import AiTagSelect from '@/components/SelectBox/AiTagSelect/index.vue'
import ScopeSearch from '@/components/ScopeSearch/index.vue'
import PositionStaffSelect from '@/components/SelectBox/PositionStaffSelect/index.vue'
import EvaluateSelect from '@/components/SelectBox/EvaluateSelect/index.vue'
import GradeBox from './gradeBox.vue'
import * as ArraignmentRecordApi from '@/api/arraignmentRecordApi'
import * as QualityApi from '@/api/qualityApi'

import { ORGANIZATION_TYPE, QUALITY_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import dayjs from 'dayjs'

/**
 * @description 页面组件
 */
const QUALITY_COMPONENT = {
  GRADE_BOX: 'GradeBox', // 评价明细
  ARRAIGNMENT_RECORD_MODULE: 'ArraignmentRecordModule' // AI报告
}

export default defineComponent({
  name: 'QualityReportComponents',
  components: { DatePicker, ArraignmentRecordModule, PreviewPhoto, ProductSelect, StoreStaffSelect, AiTagSelect, GradeBox, ScopeSearch, PositionStaffSelect, EvaluateSelect },
  setup () {
    const route = useRoute()
    const store = useStore()
    const colConfig = reactive({
      span: 24,
      xl: 6,
      lg: 8,
      md: 10,
      sm: 10,
      xs: 24
    })
    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE
    const rangeType = inject('rangeType', 'all')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })

    /** 是否显示海马体产品 */
    const axiosType = ref('')
    const showHimoProduct = ref(false)
    const showFamilyProduct = ref(false)
    if (organizationType === ORGANIZATION_TYPE.HIMO) {
      showHimoProduct.value = true
      if (type === SPOT_TYPE.MAKEUP) axiosType.value = QUALITY_TYPE.HIMO_MAKEUP
      if (type === SPOT_TYPE.PHOTOGRAPHY) axiosType.value = QUALITY_TYPE.HIMO_PHOTOGRAPHY
    }
    if (organizationType === ORGANIZATION_TYPE.FAMILY) {
      showFamilyProduct.value = true
      if (type === SPOT_TYPE.MAKEUP) axiosType.value = QUALITY_TYPE.FAMILY_MAKEUP
      if (type === SPOT_TYPE.PHOTOGRAPHY) axiosType.value = QUALITY_TYPE.FAMILY_PHOTOGRAPHY
    }

    /** 获取提审统计数据 */
    const auditRecordTotal = reactive({
      auditRecordCount: 0,
      auditRecordProblemCount: 0,
      photoQualityCount: 0,
      photoQualityProblemCount: 0
    })

    /**
     * @description 获取质检报告评分明细模块
    */
    /** 质检报告 */
    const gradeBoxData:any = ref([])
    provide('gradeBoxData', gradeBoxData)
    const spotPageData = {
      pageTotal: 0,
      pageNum: 1
    }
    const getSpotCheckResult = async (req: QualityApi.IgetQualityParams) => {
      let res: QualityApi.IGetReportRes
      if (rangeType === 'all') {
        res = await QualityApi.getAllQualityReport(req)
      } else {
        res = await QualityApi.getAreaQualityReport(req)
      }
      spotPageData.pageTotal = res.total
      spotPageData.pageNum = pager.page
      gradeBoxData.value = res.list
    }

    /** 质检报告绩效 */
    const quotaData = reactive({
      dresserQuantity: '',
      expertAvgScore: '',
      orderQuantity: '',
      staffAvgScore: '',
      storeAvgScore: '',
      supervisorAvgScore: '',
    })
    provide('quotaData', quotaData)
    const getQuota = async (req: QualityApi.IgetQualityParams) => {
      let res: any
      if (rangeType === 'all') {
        res = await QualityApi.getAllQuota(req)
      } else if (rangeType === 'region') {
        res = await QualityApi.getAreaQuota(req)
      }
      quotaData.dresserQuantity = res.data.dresserQuantity
      quotaData.expertAvgScore = res.data.expertAvgScore
      quotaData.orderQuantity = res.data.orderQuantity
      quotaData.staffAvgScore = res.data.staffAvgScore
      quotaData.storeAvgScore = res.data.storeAvgScore
      quotaData.supervisorAvgScore = res.data.supervisorAvgScore
    }

    /**
     * @description 页面数据
    */
    const productIds = ref([])
    const staffs = ref([])
    const evaluateIds = ref([])
    const jobContentIds = ref([])
    const scopeData = ref([])
    const onlyNew = ref(false)
    const onlyOld = ref(false)
    const orderNum = ref('')
    const aiTag = ref('')
    const timeSpan: Ref<string | never | any[]> = ref('')
    const aiTimeSpan: Ref<string | never | any[]> = ref('')
    const startAt = dayjs().subtract(36, 'hour').format('YYYY-MM-DD 00:00:00')
    const endAt = dayjs().format('YYYY-MM-DD 00:00:00')
    timeSpan.value = [startAt, endAt]
    aiTimeSpan.value = [startAt, endAt]
    /** 伙伴和职能互斥 */
    watch(staffs, (val) => {
      if (val.length > 0) jobContentIds.value = []
    })
    watch(jobContentIds, (val) => {
      if (val.length > 0) staffs.value = []
    })

    /** 只看新人和只看正式伙伴互斥 */
    const changeOnlyNew = () => {
      if (onlyNew.value) onlyOld.value = false
    }
    const changeOnlyOld = () => {
      if (onlyOld.value) onlyNew.value = false
    }

    /** 统一调用质检报告模块 */
    const getResultAndQuota = () => {
      const req: QualityApi.IgetQualityParams = {
        page: pager.page,
        pageSize: pager.pageSize,
        type: type,
        organizationType: organizationType,
        startTime: '',
        endTime: ''
      }
      if (timeSpan.value) {
        req.startTime = TimeUtil.searchStartTime(timeSpan.value[0])
        req.endTime = TimeUtil.searchEndTime(timeSpan.value[1])
      }
      if (orderNum.value) req.orderNum = orderNum.value
      if (scopeData.value.length > 0) req.score = scopeData.value
      if (productIds.value.length > 0) req.productIds = productIds.value
      if (evaluateIds.value.length > 0) req.problemTagsIds = evaluateIds.value
      if (jobContentIds.value.length > 0) req.supervisorArr = jobContentIds.value
      if (staffs.value.length > 0) req.staffIds = staffs.value
      if (onlyNew.value) req.onlyNew = onlyNew.value
      if (onlyOld.value) req.onlyOld = onlyOld.value

      getSpotCheckResult(req)
      getQuota(req)
    }

    /**
     * @description 获取AI报告
     */
    const arraignmentRecordList = ref<any>([])
    const aiPageData = {
      pageTotal: 0,
      pageNum: 1
    }
    const getRecords = async () => {
      const req: ArraignmentRecordApi.IgetAuditRecordsParams = {
        type: type,
        page: pager.page,
        pageSize: pager.pageSize
      }
      if (aiTimeSpan.value) {
        req.startAt = TimeUtil.searchStartTime(aiTimeSpan.value[0])
        req.endAt = TimeUtil.searchEndTime(aiTimeSpan.value[1])
      }
      if (orderNum.value) req.cloudOrderNum = orderNum.value
      if (aiTag.value.length > 0) req.auditState = aiTag.value
      if (jobContentIds.value.length > 0) req.supervisorArr = jobContentIds.value
      if (staffs.value.length > 0) req.staffIds = staffs.value
      if (onlyNew.value) req.onlyNew = onlyNew.value
      if (onlyOld.value) req.onlyOld = onlyOld.value
      let res
      if (rangeType === 'all') {
        res = await ArraignmentRecordApi.getAuditRecords(req)
        aiPageData.pageTotal = res.total
        aiPageData.pageNum = pager.page
        arraignmentRecordList.value = res.list
      } else if (rangeType === 'region') {
        res = await ArraignmentRecordApi.getAreaAuditRecords(req)
        aiPageData.pageTotal = res.total
        aiPageData.pageNum = pager.page
        arraignmentRecordList.value = res.list
      }
    }
    
    /** 监听tab切换同步分页信息 */
    const activeName = ref('GradeBox')
    watch(activeName, (val) => {
      if (val === 'ArraignmentRecordModule') {
        pager.total = aiPageData.pageTotal
        pager.page = aiPageData.pageNum
      }
      if (val === 'GradeBox') {
        pager.total = spotPageData.pageTotal
        pager.page = spotPageData.pageNum
      }
    })

    /** 获取全部数据 */
    const searchData = async (page?: number) => {
      pager.page = page ? page : pager.page
      if (!orderNum.value && !timeSpan.value) return newMessage.warning('请输入评分时间')
      try {
        store.dispatch('settingStore/showLoading', route.name)
        if (activeName.value === 'GradeBox' ) {
          getResultAndQuota()
        } else {
          getRecords()
        }
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    /** 页面初始化调用 */
    getResultAndQuota()
    getRecords()

    /** 监听预览图片 */
    const showPreview = ref(false)
    const previewIndex = ref(0)
    const photos = ref([])

    const onPreviewPhotoList = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      previewIndex.value = photoIndex
      photos.value = photoData
      showPreview.value = true
    }

    /** 分页逻辑 */
    const handlePage = () => {
      searchData()
    }

    provide('auditRecordTotal', auditRecordTotal)
    provide('arraignmentRecordList', arraignmentRecordList)

    return {
      type,
      organizationType,
      rangeType,
      colConfig,
      timeSpan,
      aiTimeSpan,
      orderNum,
      pager,
      // arraignmentRecordList,
      auditRecordTotal,
      searchData,
      handlePage,
      showPreview,
      photos,
      previewIndex,
      onPreviewPhotoList,
      activeName,
      aiTag,
      scopeData,
      productIds,
      staffs,
      jobContentIds,
      evaluateIds,
      onlyNew,
      onlyOld,
      changeOnlyNew,
      changeOnlyOld,
      showHimoProduct,
      showFamilyProduct,
      QUALITY_COMPONENT
    }
  }
})
</script>
