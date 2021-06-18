<template>
  <div class="evaluate-history-components">
    评价历史组件 -
    {{ type }} -
    {{ organizationType }}
    <div class="module-panel pb-0">
      <el-row class="search-box" :gutter="20">
        <!-- 时间查询 -->
        <el-col v-bind="{...colConfig}">
          <div class="search-item">
            <span>评分时间</span>
            <DatePicker v-model="timeSpan" :disabled="Boolean(orderNum)" />
          </div>
        </el-col>
        <!-- 单号查询 -->
        <el-col v-bind="{...colConfig}">
          <div class="search-item">
            <span>订单号</span>
            <el-input v-model="orderNum" placeholder="请输入订单号" clearable />
          </div>
        </el-col>
        <!-- 产品查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>产品</span>
            <ProductSelect v-model="productIds" />
          </div>
        </el-col>
        <!-- 伙伴查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>伙伴</span>
            <StaffSelect v-model="staffs" />
          </div>
        </el-col>
        <!-- 职能查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>职能</span>
            <JobContentSelect v-model="jobContentIds" />
          </div>
        </el-col>
        <!-- 评价标签查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>评价标签</span>
            <EvaluateSelect v-model="evaluateIds" />
          </div>
        </el-col>
        <!-- 分数查询 -->
        <el-col :span="8" :xl="6">
          <div class="grade-search search-item">
            <span>分数</span>
            <ScopeSearch v-model="scopeData" />
          </div>
        </el-col>
        <!-- 查询按钮 -->
        <el-col v-bind="{...colConfig, sm: 4, md: 4}">
          <div class="search-item">
            <el-button type="primary" @click="searchData(1)">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 历史记录详情组件 -->
    <div class="module-panel mt-6">
      <div class="arraignment-record-list">
        <EvaluateHistoryModule
          v-for="item in evaluateRecordList"
          :key="item.id"
          class="mt-6"
          :record-info="item"
          @preview-photo="onPreviewPhotoList"
          @evaluate-photo="onEvaluatePhoto"
        />
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
    </div>
    <!-- 照片预览组件 -->
    <PreviewPhoto
      v-if="showPreview"
      v-model:showPreview="showPreview"
      :imgarray="previewPhotos"
      :index="previewIndex"
    />
    <!-- 修改评分组件 -->
    <EvaluatePhoto
      v-if="showEvaluate"
      v-model:showEvaluate="showEvaluate"
      :imgarray="evaluatePhotos"
      :index="evaluateIndex"
      @changePool="onChangePool"
      @skipStaff="onSkipStaff"
      @submitData="onSubmitData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { newMessage } from '@/utils/message'

import * as TimeUtil from '@/utils/TimeUtil'
import DatePicker from '@/components/DatePicker/index.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import StaffSelect from '@/components/SelectBox/StaffSelect/index.vue'
import JobContentSelect from '@/components/SelectBox/JobContentSelect/index.vue'
import EvaluateSelect from '@/components/SelectBox/EvaluateSelect/index.vue'
import ScopeSearch from '@/components/ScopeSearch/index.vue'
import EvaluateHistoryModule from './components/EvaluateHistoryModule.vue'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'
import EvaluatePhoto from '@/components/EvaluatePhoto/index.vue'

import * as EvaluateApi from '@/api/evaluateApi'
import * as EvaluateHistoryApi from '@/api/evaluateHistoryApi'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import PoolRecordModel from '@/model/PoolRecordModel'

export default defineComponent({
  name: 'EvaluateHistoryComponents',
  components: { DatePicker, EvaluateHistoryModule, ProductSelect, StaffSelect, JobContentSelect, EvaluateSelect, ScopeSearch, PreviewPhoto, EvaluatePhoto },
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
    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    const productIds = ref([])
    const staffs = ref([])
    const jobContentIds = ref([])
    const scopeData = ref([])
    const evaluateIds = ref([])
    const timeSpan: Ref<string | never | any[]> = ref('')
    const orderNum = ref('')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })
    const evaluateRecordList = ref<any>([])
    const poolList = ref<PoolRecordModel[]>([])
    /** 
     * @description 查询历史记录相关数据 
     */
    const getHistoryRecords = async () => {
      const req = {
        type,
        organizationType,
        startAt: '',
        endAt: '',
        cloudOrderNum: '',
        productIds: productIds.value,
        staffIds: staffs.value,
        supervisorArr: jobContentIds.value,
        score: scopeData.value,
        problemTagsIds: evaluateIds.value,
        page: pager.page,
        pageSize: pager.pageSize
      }
      if (timeSpan.value) {
        req.startAt = TimeUtil.searchStartTime(timeSpan.value[0])
        req.endAt = TimeUtil.searchEndTime(timeSpan.value[1])
      }
      if (orderNum.value) {
        req.cloudOrderNum = orderNum.value
        // delete req.startAt
        // delete req.endAt
      }
      const res = await EvaluateHistoryApi.getHistoryRecords(req)
      poolList.value = res.list
      pager.total = res.total
      evaluateRecordList.value = res.list
    }
    
    /** 
     * @description 获取全部数据
     */
    const searchData = async (page?: number) => {
      pager.page = page ? page : pager.page
      if (!orderNum.value && !timeSpan.value) return newMessage.warning('请输入评分时间')
      try {
        store.dispatch('settingStore/showLoading', route.name)
        Promise.all([getHistoryRecords()])
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    const showPreview = ref(false)
    const previewIndex = ref(0)
    const previewPhotos = ref([])
    /** 
     * @description 监听预览图片
     */
    const onPreviewPhotoList = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      previewIndex.value = photoIndex
      previewPhotos.value = photoData
      showPreview.value = true
    }
    /**
     * 评分
     */
    const evaluatePhotos = ref<any>([])
    const evaluateIndex = ref(0)
    const showEvaluate = ref(false)
    const evaluatePoolRecordId = ref('') // 正在打分id
    /**
     * @description 显示打分数据
     */
    const evaluatePhoto = (poolItemId: string, photoIndex: number) => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === poolItemId)
      if (!findPoolItemData) return newMessage.warning('未找到对应照片')
      evaluatePoolRecordId.value = poolItemId
      const photoData = findPoolItemData.photoList?.map((photoItem, index: number) => {
        const { streamInfo } = findPoolItemData
        const photoInfo = {
          ...streamInfo,
          aiSpotLabel: type === SPOT_TYPE.MAKEUP ? photoItem.auditSpotModel?.makeupDegree : photoItem.auditSpotModel?.photographyDegree,
        }
        return {
          // todo photoModel 增加完成src
          id: photoItem.id,
          title: `原片（${index + 1}/${findPoolItemData.photoList?.length}）`,
          src: photoItem.path,
          photoInfo,
          markPath: '',
          markJson: '',
          markBase: ''
        }
      })
      evaluateIndex.value = photoIndex
      evaluatePhotos.value = photoData
      showEvaluate.value = true
    }

    /** 
     * @description 监听修改评分
     */
    const onEvaluatePhoto = ({ photoIndex, poolItemId }: { photoIndex: number, poolItemId: string }) => {
      evaluatePhoto(poolItemId, photoIndex)
    }

    /**
     * @description 跳转下一个评分内容
     */
    const goNextEvaluatePhoto = async () => {
      // 获取下一个数据的uuid
      const findPoolItemIndex = poolList.value.findIndex(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (findPoolItemIndex < 0) return newMessage.warning('获取当前uuid失败，goNextEvaluatePhoto')
      const nextIndex = findPoolItemIndex + 1
      let nextPoolItemId = poolList.value[nextIndex].id
      const isPageLastPhoto = (findPoolItemIndex + 1) === poolList.value.length
      const isAllLast = pager.total === 1
      if (isAllLast) {
        newMessage.success('你已经打完全部照片')
      } else if (isPageLastPhoto && pager.page > 1 && findPoolItemIndex === 0 ) {
        // 向前翻页
        pager.page--
        await getHistoryRecords()
        nextPoolItemId = poolList.value[0].id
      } else if (isPageLastPhoto) {
        // 取上一个值
        nextPoolItemId = poolList.value[findPoolItemIndex - 1].id
        await getHistoryRecords()
      } else {
        // 更新数据列表
        await getHistoryRecords()
      }
      // 显示打分数据
      evaluatePhoto(nextPoolItemId, 0)
    }

    /**
     * @description 跳过伙伴
     */
    const onSkipStaff = async () => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('未找到对应抽片记录，onSkipStaff')
      const staffIds = type === SPOT_TYPE.MAKEUP ? findPoolItemData.streamInfo?.dresserInfo.staffIds : findPoolItemData.streamInfo?.photographyerInfo.staffIds
      if (!staffIds) return newMessage.warning('未找到对应的伙伴id')
      const poolItemId = findPoolItemData.id
      const req = {
        staffIds,
        poolItemId,
        type,
        organizationType
      }
      await EvaluateApi.skipStaff(req)
      newMessage.success('跳过伙伴成功，今日将不会再抽取')
      await goNextEvaluatePhoto()
    }

    /**
     * @description 换一单
     */
    const onChangePool = async () => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('onChangePool')
      const poolItemId = findPoolItemData.id
      const req = {
        poolItemId,
        type,
        organizationType
      }
      await EvaluateApi.changePool(req)
      // TODO: 待定
      newMessage.success('换取照片成功')
      await goNextEvaluatePhoto()
    }

    /** 
     * @description 提交评分 
     */
    const onSubmitData = async (data: any) => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('未找到对应抽片记录，onSubmitData')
      const req = {
        poolItemId: findPoolItemData.id,
        photos: data.photos,
        tags: data.tags,
        type,
        organizationType
      }
      await EvaluateApi.emptyPoolByStaffId(req)
      await goNextEvaluatePhoto()
    }

    /** 
     * @description 分页逻辑 
     */
    const handlePage = () => {
      searchData()
    }

    return {
      type,
      organizationType,
      timeSpan,
      orderNum,
      productIds,
      staffs,
      jobContentIds,
      scopeData,
      evaluateIds,
      pager,
      evaluateRecordList,
      searchData,
      handlePage,
      showPreview,
      previewPhotos,
      previewIndex,
      onPreviewPhotoList,
      onEvaluatePhoto, evaluatePhotos, evaluateIndex, showEvaluate,
      onSubmitData,
      onSkipStaff, onChangePool
    }
  }
})
</script>
