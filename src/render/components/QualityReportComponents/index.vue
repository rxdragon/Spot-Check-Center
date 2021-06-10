<template>
  <div class="quality-report-components pb-0">
    质检报告 -
    {{ type }} -
    {{ organizationType }} -
    {{ rangeType }}
    <el-row class="search-box" :gutter="20">
      <!-- 评分时间 -->
      <el-col v-if="activeName === 'GradeBox'" v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>评分时间</span>
          <DatePicker v-model="timeSpan" :disabled="Boolean(orderNum)" />
        </div>
      </el-col>
      <el-col v-if="activeName === 'ArraignmentRecordModule'" v-bind="{ ...colConfig }">
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
          <StaffSelect v-model="staffs" />
        </div>
      </el-col>
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>职能</span>
          <JobContentSelect v-model="jobContentIds" />
        </div>
      </el-col>
      <!-- 职能 -->
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>评价标签</span>
          <EvaluateSelect v-model="evaluateIds" />
        </div>
      </el-col>
      <!-- 分数 -->
      <el-col :span="8" :xl="6">
        <div class="grade-search search-item">
          <span>分数</span>
          <ScopeSearch v-model="scopeData" />
        </div>
      </el-col>
      <el-col v-if="activeName === 'ArraignmentRecordModule'" v-bind="{...colConfig}">
        <div class="search-item">
          <span>AI标签</span>
          <AiTagSelect v-model="aiTag" />
        </div>
      </el-col>
    </el-row>
    <el-row class="text-right">
      <el-col :span="24" class="text-right">
        <div class="text-right">
          <el-checkbox v-model="onlyNew" @change="changeOnlyNew">只看新人</el-checkbox>
          <el-checkbox v-model="onlyOld" @change="changeOnlyOld">只看正式伙伴</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" @click="searchData(1)">查询</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

  
  <div class="module-panel mt-6">
    <!-- 更换标签 -->
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`评分明细`" name="GradeBox" />
      <el-tab-pane :label="`AI审核报告`" name="ArraignmentRecordModule" />
    </el-tabs>

    <keep-alive>
      <component :is="activeName" @previewPhoto="onPreviewPhotoList" />
    </keep-alive>
  </div>



  <!-- <div class="module-panel mt-6">
    <div class="spot-info grid grid-cols-4">
      <div class="info-item">审核总单量<span class="num">{{ auditRecordTotal.auditRecordCount }}单</span></div>
      <div class="info-item">审核总张数<span class="num">{{ auditRecordTotal.photoQualityCount }}张</span></div>
      <div class="info-item">问题单量<span class="num text-red-400">{{ auditRecordTotal.auditRecordProblemCount }}单</span></div>
      <div class="info-item">问题张数<span class="num text-red-400">{{ auditRecordTotal.photoQualityProblemCount }}张</span></div>
    </div>
    <div class="arraignment-record-list">
      <ArraignmentRecordModule
        v-for="item in arraignmentRecordList"
        :key="item.id"
        class="mt-6"
        :record-info="item"
        @previewPhoto="onPreviewPhotoList"
      />
    </div>

  </div> -->
  <!-- 分页 -->
  <div class="page-box">
    <el-pagination
      v-model:current-page="pager.page"
      :hide-on-single-page="false"
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
import { defineComponent, inject, reactive, Ref, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { newMessage } from '@/utils/message'

import * as TimeUtil from '@/utils/TimeUtil'
import DatePicker from '@/components/DatePicker/index.vue'
import ArraignmentRecordModule from './ArraignmentRecordModule.vue'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import StaffSelect from '@/components/SelectBox/StaffSelect/index.vue'
import AiTagSelect from '@/components/SelectBox/AiTagSelect/index.vue'
import ScopeSearch from '@/components/ScopeSearch/index.vue'
import JobContentSelect from '@/components/SelectBox/JobContentSelect/index.vue'
import EvaluateSelect from '@/components/SelectBox/EvaluateSelect/index.vue'
import GradeBox from './gradeBox.vue'
import * as ArraignmentRecordApi from '@/api/arraignmentRecordApi'
import * as QualityApi from '@/api/qualityApi'

import { ORGANIZATION_TYPE, QUALITY_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import moment from 'moment'

export default defineComponent({
  name: 'QualityReportComponents',
  components: { DatePicker, ArraignmentRecordModule, PreviewPhoto, ProductSelect, StaffSelect, AiTagSelect, GradeBox, ScopeSearch, JobContentSelect, EvaluateSelect },
  data () {
    return {
      colConfig: {
        span: 24,
        xl: 6,
        lg: 8,
        md: 10,
        sm: 10,
        xs: 24
      }
    }
  },
  setup () {
    const route = useRoute()
    const store = useStore()

    const type: string = inject('type' ,'')
    const organizationType = inject('organizationType')
    const rangeType = inject('rangeType')

    const timeSpan: Ref<string | never | any[]> = ref('')
    const aiTimeSpan: Ref<string | never | any[]> = ref('')
    const startAt = moment().subtract('day', 28).locale('zh-cn').format('YYYY-MM-DD')
    const endAt = moment().locale('zh-cn').format('YYYY-MM-DD')
    timeSpan.value = [startAt, endAt]
    aiTimeSpan.value = [startAt, endAt]
    const orderNum = ref('')
    const aiTag = ref('')
    const scopeData = ref([])
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })
    const activeName = ref('GradeBox')
    const gradeBoxData:any = ref([])
    const productIds = ref([])
    const staffs = ref([])
    const jobContentIds = ref([])
    const evaluateIds = ref([])
    const onlyNew = ref(false)
    const onlyOld = ref(false)
    const axiosType = ref('')

    const changeOnlyNew = () => {
      if (onlyNew.value) onlyOld.value = false
    }
    const changeOnlyOld = () => {
      if (onlyOld.value) onlyNew.value = false
    }

    /** 是否显示海马体产品 */
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

    provide('gradeBoxData', gradeBoxData)

    /** 获取提审统计数据 */
    const auditRecordTotal = ref({
      auditRecordCount: 0,
      auditRecordProblemCount: 0,
      photoQualityCount: 0,
      photoQualityProblemCount: 0
    })

    /** 获取质检报告 */
    const getSpotCheckResult = async () => {
      const req: QualityApi.IgetQualityParams = {
        page: pager.page,
        pageSize: pager.pageSize,
        productIds: productIds.value,
        problemTagsIds: evaluateIds.value,
        supervisorArr: jobContentIds.value,
        staffIds: staffs.value,
        score: scopeData.value,
        orderNum: orderNum.value,
        onlyNew: onlyNew.value,
        onlyOld: onlyNew.value,
        startTime: '',
        endTime: ''
      }
      if (timeSpan.value) {
        req.startTime = TimeUtil.searchStartTime(timeSpan.value[0])
        req.endTime = TimeUtil.searchEndTime(timeSpan.value[1])
      }
      const res = await QualityApi.getSpotCheckResult(req, axiosType.value)
      gradeBoxData.value = res.list
      pager.total = res.total
    }

    /**
     * @description 获取AI报告
     */
    const arraignmentRecordList = ref<any>([])
    const getAuditRecords = async () => {
      const req: ArraignmentRecordApi.IgetAuditRecordsParams = {
        type,
        page: pager.page,
        pageSize: pager.pageSize
      }
      if (timeSpan.value) {
        req.startAt = TimeUtil.searchStartTime(timeSpan.value[0])
        req.endAt = TimeUtil.searchEndTime(timeSpan.value[1])
      }
      if (orderNum.value) {
        req.cloudOrderNum = orderNum.value
        delete req.startAt
        delete req.endAt
      }
      const res = await ArraignmentRecordApi.getAuditRecords(req)
      pager.total = res.total
      arraignmentRecordList.value = res.list
    }
    
    /** 获取全部数据 */
    const searchData = async (page?: number) => {
      pager.page = page ? page : pager.page
      if (!orderNum.value && !timeSpan.value) return newMessage.warning('请输入评分时间')
      try {
        store.dispatch('settingStore/showLoading', route.name)
        if (activeName.value === 'GradeBox' ) {
          getSpotCheckResult()
        } else {
          getAuditRecords()
        }
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    searchData(1)

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
      showFamilyProduct
    }
  }
})
</script>

<style lang="less" scoped>
// .ml-reportMain {
//   .info-item {
//     font-weight: 500;

//     .num {
//       margin-left: 12px;
//       font-size: 16px;
//       font-weight: 400;
//       color: #333;
//     }
//   }
// }
</style>

