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
          v-for="item in arraignmentRecordList"
          :key="item.id"
          class="mt-6"
          :record-info="item"
          @preview-photo="onPreviewPhotoList"
          @evaluatePhoto="onEvaluatePhoto"
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
      :imgarray="photos"
      :index="previewIndex"
    />
    <!-- 修改评分组件 -->
    <EvaluatePhoto
      v-if="showEvaluate"
      v-model:showEvaluate="showEvaluate"
      :imgarray="imgarray"
      :index="evaluateIndex"
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

import * as EvaluateHistoryApi from '@/api/evaluateHistoryApi'
import { SPOT_TYPE } from '@/model/Enumerate'
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
    const type: string = inject('type', '')
    const organizationType = inject('organizationType')

    const imgarray = ref<any>([])
    const evaluateIndex = ref(0)
    const showEvaluate = ref(false)
    /** 
     * @description 修改评分
     */
    const onEvaluatePhoto = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      imgarray.value = photoData
      evaluateIndex.value = photoIndex
      showEvaluate.value = true
    }

    const poolList = ref<PoolRecordModel[]>([])
    /** 
     * @description 提交评分 
     */
    const onSubmitData = (data: any) => {
      // 记入提交的uuid，获取下一个数据的uuid
      // 更新数据列表
      // 获取记录id的数据
      console.warn(data)
      // eslint-disable-next-line no-use-before-define
      const photoData = poolList.value[1].photoList?.map((photoItem, index: number) => {
        // eslint-disable-next-line no-use-before-define
        const { streamInfo } = poolList.value[1]
        const photoInfo = {
          ...streamInfo,
          aiSpotLabel: type === SPOT_TYPE.MAKEUP ? photoItem.auditSpotModel?.makeupDegree : photoItem.auditSpotModel?.photographyDegree,
        }
        return {
          // todo photoModel 增加完成src
          // eslint-disable-next-line no-use-before-define
          title: `原片（${index + 1}/${poolList.value[1].photoList?.length}）`,
          src: photoItem.path,
          photoInfo,
          markPath: '',
          markJson: '',
          markBase: ''
        }
      })

      imgarray.value = photoData
      evaluateIndex.value = 0
    }

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
    const arraignmentRecordList = ref<any>([])
    /** 
     * @description 查询历史记录相关数据 
     */
    const getHistoryRecords = async () => {
      const req = {
        type,
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
      pager.total = res.total
      arraignmentRecordList.value = res.list
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
    const photos = ref([])
    /** 
     * @description 监听预览图片
     */
    const onPreviewPhotoList = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      previewIndex.value = photoIndex
      photos.value = photoData
      showPreview.value = true
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
      arraignmentRecordList,
      searchData,
      handlePage,
      showPreview,
      photos,
      previewIndex,
      onPreviewPhotoList,
      onSubmitData,
      onEvaluatePhoto, imgarray, evaluateIndex, showEvaluate
    }
  }
})
</script>
