<template>
  <div class="evaluate-history-components">
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
            <ProductSelect
              v-model="productIds"
              :himo-product="organizationType === ORGANIZATION_TYPE.HIMO"
              :family-product="organizationType === ORGANIZATION_TYPE.FAMILY"
            />
          </div>
        </el-col>
        <!-- 伙伴查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>伙伴</span>
            <StoreStaffSelect v-model="staffs" :spot-type="type" :organization-type="organizationType" />
          </div>
        </el-col>
        <!-- 职能查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>职能</span>
            <PositionStaffSelect v-model="positionStaffIds" :type="type" />
          </div>
        </el-col>
        <!-- 评价标签查询 -->
        <el-col v-bind="{ ...colConfig }">
          <div class="search-item">
            <span>评价标签</span>
            <EvaluateSelect v-model="evaluateIds" :spot-type="type" :organization-type="organizationType" />
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
        <el-col v-bind="{...colConfig}" class="text-right">
          <div class="search-item">
            <el-checkbox v-model="onlyNew" @change="changeOnlyNew">只看新人</el-checkbox>
            <el-checkbox v-model="onlyOld" @change="changeOnlyOld">只看正式伙伴</el-checkbox>
            <el-button class="ml-4" type="primary" @click="getHistoryRecords(1)">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 历史记录详情组件 -->
    <div class="module-panel mt-6">
      <transition name="el-fade-in-linear">
        <div v-if="evaluateRecordList.length" class="arraignment-record-list">
          <EvaluateHistoryModule
            v-for="item in evaluateRecordList"
            :key="item.id"
            class="mt-6"
            :record-info="item"
            @preview-photo="onPreviewPhotoList"
            @evaluate-photo="onEvaluatePhoto"
          />
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

        <NoData v-else />
      </transition>
    </div>

    <!-- 照片预览组件 -->
    <PreviewPhoto
      v-if="showPreview"
      v-model:showPreview="showPreview"
      :imgarray="previewPhotos"
      :index="previewIndex"
    />
    <!-- 修改评分组件 -->
    <transition name="el-fade-in-linear">
      <EvaluatePhoto
        v-if="showEvaluate"
        ref="evaluatePhotoDom"
        v-model:showEvaluate="showEvaluate"
        :imgarray="evaluatePhotos"
        :index="evaluateIndex"
        is-resume-evaluate
        @submitData="onSubmitData"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { newMessage } from '@/utils/message'
import DatePicker from '@/components/DatePicker/index.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import StoreStaffSelect from '@/components/SelectBox/StoreStaffSelect/index.vue'
import EvaluateSelect from '@/components/SelectBox/EvaluateSelect/index.vue'
import ScopeSearch from '@/components/ScopeSearch/index.vue'
import EvaluateHistoryModule from './components/EvaluateHistoryModule.vue'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'
import PositionStaffSelect from '@/components/SelectBox/PositionStaffSelect/index.vue'
import EvaluatePhoto from '@/components/EvaluatePhoto/index.vue'
import NoData from '@/components/NoData/index.vue'

import * as TimeUtil from '@/utils/TimeUtil'
import * as EvaluateApi from '@/api/evaluateApi'
import * as PhotoTool from '@/utils/photoTool'
import * as EvaluateHistoryApi from '@/api/evaluateHistoryApi'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import PoolRecordModel from '@/model/PoolRecordModel'

export default defineComponent({
  name: 'EvaluateHistoryComponents',
  components: { DatePicker, EvaluateHistoryModule, ProductSelect, StoreStaffSelect, PositionStaffSelect, EvaluateSelect, ScopeSearch, PreviewPhoto, EvaluatePhoto, NoData },
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

    const timeSpan: Ref<string | never | any[]> = ref('')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })

    /** 只看新人和只看正式伙伴互斥 */
    const onlyNew = ref(false)
    const onlyOld = ref(false)
    const changeOnlyNew = () => { if (onlyNew.value) onlyOld.value = false }
    const changeOnlyOld = () => { if (onlyOld.value) onlyNew.value = false }

    /** 查询历史记录相关数据 */
    const productIds = ref<idType[]>([])
    const staffs = ref<idType[]>([])
    const positionStaffIds = ref<idType[][]>([])
    const scopeData = ref()
    const evaluateIds = ref<idType[]>([])
    const evaluateRecordList = ref<PoolRecordModel[]>([])
    const orderNum = ref('')

    const getHistoryRecords = async (page?: number) => {
      pager.page = page ? page : pager.page
      if (!orderNum.value && !timeSpan.value) return newMessage.warning('请输入评分时间')

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req: EvaluateHistoryApi.IgetHistoryRecordsParams = {
          type,
          organizationType,
          page: pager.page,
          pageSize: pager.pageSize
        }

        if (timeSpan.value) {
          req.startTime = TimeUtil.searchStartTime(timeSpan.value[0])
          req.endTime = TimeUtil.searchEndTime(timeSpan.value[1])
        }
        if (productIds.value.length > 0) req.productIds = productIds.value
        if (staffs.value.length > 0) req.staffIds = staffs.value
        if (scopeData.value && scopeData.value.length > 0) req.score = scopeData.value
        if (evaluateIds.value.length > 0) req.problemTagsIds = evaluateIds.value
        if (orderNum.value) req.orderNum = orderNum.value
        if (onlyNew.value) req.onlyNew = onlyNew.value
        if (onlyOld.value) req.onlyOld = onlyOld.value

        if (positionStaffIds.value.length > 0) req.supervisorArr = positionStaffIds.value.reduce( (a: idType[], b: idType[]) => { return a.concat(b) }, [] as idType[])

        const res = await EvaluateHistoryApi.getHistoryRecords(req)
        pager.total = res.total
        evaluateRecordList.value = res.list
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }
    
    // 分页逻辑
    const handlePage = () => {
      getHistoryRecords()
    }


    /** 监听预览图片 */
    const showPreview = ref(false)
    const previewIndex = ref(0)
    const previewPhotos = ref([])
    const onPreviewPhotoList = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      previewIndex.value = photoIndex
      previewPhotos.value = photoData
      showPreview.value = true
    }

    /** 重新评分 */
    const evaluatePhotos = ref<any>([])
    const evaluateIndex = ref(0)
    const showEvaluate = ref(false)
    const evaluatePoolRecordId = ref('') // 正在打分id
    // 点击重评事件
    const evaluatePhoto = (poolItemId: string, photoIndex: number) => {
      const findPoolItemData = evaluateRecordList.value.find(poolItem => poolItem.id === poolItemId)
      if (!findPoolItemData) return newMessage.warning('未找到对应照片')
      evaluatePoolRecordId.value = poolItemId
      const photoData = findPoolItemData.photoList?.map((photoItem, index: number) => {
        const { streamInfo } = findPoolItemData
        const photoInfo = {
          ...streamInfo,
          aiSpotLabel: type === SPOT_TYPE.MAKEUP ? photoItem.auditSpotModel?.makeupDegree : photoItem.auditSpotModel?.photographyDegree,
        }
        return {
          id: photoItem.id,
          title: `原片（${index + 1}/${findPoolItemData.photoList?.length}）`,
          src: PhotoTool.compleImagePath(photoItem.path),
          compressSrc: PhotoTool.compleCompressImagePath(photoItem.path),
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
    // 监听修改评分
    const onEvaluatePhoto = ({ photoIndex, poolItemId }: { photoIndex: number, poolItemId: string }) => {
      evaluatePhoto(poolItemId, photoIndex)
    }
    // 提交评分
    const evaluatePhotoDom = ref(null)
    const onSubmitData = async (data: any) => {
      const findPoolItemData = evaluateRecordList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('未找到对应抽片记录，onSubmitData')
      try {
        (evaluatePhotoDom.value as any).imgLoading = true
        const req = {
          poolItemId: findPoolItemData.id,
          photos: data.photos,
          tags: data.tags,
          type,
          organizationType
        }
        await EvaluateApi.updateCommitHistory(req)
        newMessage.success('修改评分成功')
        showEvaluate.value = false
        await getHistoryRecords()
      } finally {
        if (evaluatePhotoDom.value) {
          (evaluatePhotoDom.value as any).imgLoading = false
        }
      }
    }

    return {
      type, organizationType, ORGANIZATION_TYPE,
      timeSpan, orderNum, productIds, staffs, positionStaffIds, scopeData, evaluateIds,
      pager, evaluateRecordList, handlePage, getHistoryRecords,
      showPreview, previewPhotos, previewIndex, onPreviewPhotoList,
      evaluatePhotoDom,
      onEvaluatePhoto, evaluatePhotos, evaluateIndex, showEvaluate, onSubmitData,
      onlyNew, onlyOld, changeOnlyNew, changeOnlyOld
    }
  }
})
</script>
