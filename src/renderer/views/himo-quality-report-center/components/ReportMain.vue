<template>
  <div class="module-panel pb-0">
    <el-row class="search-box" :gutter="20">
      <!-- 抽查时间 -->
      <el-col v-bind="{...colConfig}">
        <div class="search-item">
          <span>评分时间</span>
          <DatePicker v-model="timeSpan" :disabled="Boolean(orderNum)" />
        </div>
      </el-col>
      <el-col v-bind="{...colConfig}">
        <div class="search-item">
          <span>订单号</span>
          <el-input v-model="orderNum" placeholder="请输入订单号" clearable />
        </div>
      </el-col>
      <el-col v-bind="{...colConfig, sm: 4, md: 4}">
        <div class="search-item">
          <el-button type="primary" @click="searchData(1)">查询</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

  <div class="module-panel mt-6">
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
  
  <PreviewPhoto
    v-if="showPreview"
    v-model:showPreview="showPreview"
    :imgarray="photos"
    :index="previewIndex"
  />
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import { newMessage } from '@/utils/message'

import * as TimeUtil from '@/utils/TimeUtil'
import DatePicker from '@/components/DatePicker/index.vue'
import ArraignmentRecordModule from './ArraignmentRecordModule.vue'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'

import * as ArraignmentRecordApi from '@/api/arraignmentRecordApi'

export default defineComponent({
  name: 'MakeupQualityReport',
  components: { DatePicker, ArraignmentRecordModule, PreviewPhoto },
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

    const timeSpan: Ref<string | never | any[]> = ref('')
    const orderNum = ref('')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })

    /** 获取提审统计数据 */
    const auditRecordTotal = ref({
      auditRecordCount: 0,
      auditRecordProblemCount: 0,
      photoQualityCount: 0,
      photoQualityProblemCount: 0
    })
    /**
     * @description 获取统计信息
     */
    const getAuditRecordTotal = async () => {
      const req: ArraignmentRecordApi.IgetAuditRecordTotalParams = {
        type,
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
      const res = await ArraignmentRecordApi.getAuditRecordTotal(req)
      auditRecordTotal.value = reactive(res)
    }

    /** 提审记录列表相关数据 */
    const arraignmentRecordList = ref<any>([])
    // 订单搜索
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
        Promise.all([
          getAuditRecordTotal(),
          getAuditRecords()
        ])
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

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

    return {
      timeSpan,
      orderNum,
      pager,
      arraignmentRecordList,
      auditRecordTotal,
      searchData,
      handlePage,
      showPreview,
      photos,
      previewIndex,
      onPreviewPhotoList
    }
  }
})
</script>

<style lang="less" scoped>
.spot-info {
  .info-item {
    font-weight: 500;

    .num {
      margin-left: 12px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
    }
  }
}
</style>
