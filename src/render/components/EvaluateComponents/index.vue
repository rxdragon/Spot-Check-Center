<template>
  <el-row class="search-box" :gutter="20">
    <!-- 抽查时间 -->
    <el-col v-bind="{ ...colConfig }">
      <div class="search-item">
        <span>产品</span>
        <ProductSelect v-model="productIds" :himo-product="showHimoProduct" :family-product="showFamilyProduct" />
      </div>
    </el-col>
    <el-col v-bind="{ ...colConfig }">
      <div class="search-item">
        <span>正式伙伴抽查单量：</span>
        <PeopleNumber v-model="fullMember" />
      </div>
    </el-col>
    <el-col v-bind="{ ...colConfig }">
      <div class="search-item">
        <span>新人伙伴抽查单量：</span>
        <PeopleNumber v-model="newMember" />
      </div>
    </el-col>
    <el-col v-bind="{ ...colConfig, sm: 4, md: 4 }">
      <div class="search-item">
        <el-button type="primary" @click="spotPhoto">抽查</el-button>
      </div>
    </el-col>
  </el-row>

  <!-- 今日数据 -->
  <div class="module-panel taday-info">
    <div class="panel-title mb-5">
      今日完成数据
      <div v-if="$isElectron" class="panel-slot">
        开启预加载
        <el-switch
          :model-value="isPreLoad"
          active-color="#4669FB"
          class="ml-4"
          @change="onSetPreload"
        />
      </div>
    </div>
    <div class="panel-content">
      <div class="list-table">
        <div class="title">今日已评价</div>
        <div class="content">{{ tadayInfo.evaluationStreamNum }}单</div>
      </div>
      <div class="list-table">
        <div class="title">今日已评价</div>
        <div class="content">{{ tadayInfo.evaluationPhotoNum }}张</div>
      </div>
    </div>
  </div>
  <!-- 页面数据 -->
  <div class="mt-6">
    <PoolModule
      v-for="(poolItem, poolIndex) in poolList"
      :key="poolIndex"
      :pool-item-data="poolItem"
      @evaluatePhoto="onEvaluatePhoto"
    />
  </div>

  <div v-show="pager.total > pager.pageSize" class="module-panel">
    <div class="page-box">
      <el-pagination
        v-model:current-page="pager.page"
        class="mt-0"
        :hide-on-single-page="true"
        :page-size="pager.pageSize"
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handlePage"
      />
    </div>
  </div>

  <EvaluatePhoto
    v-if="showEvaluate"
    v-model:showEvaluate="showEvaluate"
    :imgarray="imgarray"
    :index="evaluateIndex"
    @change="onShowEvaluteChange"
    @changePool="onChangePool"
    @skipStaff="onSkipStaff"
    @submitData="onSubmitData"
  />
</template>

<script lang="ts">
import type PoolRecordModel from '@/model/PoolRecordModel'
import type { ISubmitData } from '@/components/EvaluatePhoto/index'

import { defineComponent, inject, reactive, ref, h, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import PeopleNumber from './components/PeopleNumber.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import PoolModule from './components/PoolModule.vue'
import EvaluatePhoto from '@/components/EvaluatePhoto/index.vue'

import { newMessage } from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import * as EvaluateApi from '@/api/evaluateApi'
import * as Setting from '@/indexDB/getSetting'
import * as PhotoTool from '@/utils/photoTool'

export default defineComponent({
  name: 'EvaluateComponents',
  components: { PeopleNumber, ProductSelect, PoolModule, EvaluatePhoto },
  data () {
    return {
      colConfig: {
        span: 24,
        xl: 6,
        lg: 6,
        md: 10,
        sm: 10,
        xs: 24
      }
    }
  },
  setup () {
    const store = useStore()
    const route = useRoute()

    const type = inject('type') as SPOT_TYPE
    const organizationType = inject('organizationType') as ORGANIZATION_TYPE

    const uuid = ref('')

    /** 是否显示海马体产品 */
    const showHimoProduct = ref(false)
    const showFamilyProduct = ref(false)
    if (organizationType === ORGANIZATION_TYPE.HIMO) {
      showHimoProduct.value = true
    }
    if (organizationType === ORGANIZATION_TYPE.FAMILY) {
      showFamilyProduct.value = true
    }

    /** 获取抽片结果 */
    const showCheckResult = async (data: any) => {
      try {
        const peopleType = type === SPOT_TYPE.MAKEUP ? '化妆师' : '摄影师'
        await ElMessageBox({
          title: '抽取结果',
          message: h('div', { style: 'display: grid; grid-template-columns: 4fr 5fr 5fr;' }, [
            h('span', null, `${peopleType}：${data.spotAllPeople}人`),
            h('span', null, `正式伙伴：${data.formalStaffNum}人`),
            h('span', null, `新人伙伴：${data.newStaffNum}人`),
            h('span', null, `总单量：${data.streamOrderNum}单`),
            h('span', null, `正式伙伴单量：${data.formalStaffStreamNum}单`),
            h('span', null, `新人伙伴单量：${data.newStaffStreamNum}单`),
          ]),
          center: true,
          showClose: false,
          confirmButtonText: '确定'
        })
      } catch {
        console.warn('取消确认')
      }
    }

    /** 获取抽片结果列表 */
    let intervalGetSpotCheckTimer: any = null
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })
    const poolList = ref<PoolRecordModel[]>([])
    const isTakePhoto = ref(false)

    const getSpotCheckResultList = async (page?: number) => {
      pager.page = page ? page : pager.page
      const req = {
        uuid: uuid.value,
        page: pager.page,
        pageSize: pager.pageSize,
        skip: (pager.page - 1) * pager.pageSize,
        limit: pager.pageSize,
        type,
        organizationType
      }
      try {
        const res = await EvaluateApi.getSpotCheckResultList(req)
        poolList.value = res.list
        pager.total = res.total

        // 第一次点击抽片
        if (isTakePhoto.value) {
          // 展示数据
          store.dispatch('settingStore/hiddenLoading', route.name)
          await showCheckResult(res.processInfo)
          isTakePhoto.value = false
        }

        // 如果有数据结果清空相关信息
        if (intervalGetSpotCheckTimer) {
          clearTimeout(intervalGetSpotCheckTimer)
          intervalGetSpotCheckTimer = null
        }

      } catch (error) {
        if (error.message === '正在抽片中') {
          intervalGetSpotCheck()
        } else {
          throw new Error(error)
        }
      }
    }

    function intervalGetSpotCheck () {
      clearTimeout(intervalGetSpotCheckTimer)
      intervalGetSpotCheckTimer = setTimeout(() => {
        getSpotCheckResultList(1)
      }, 500)
    }

    const handlePage = async () => {
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await getSpotCheckResultList()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }


    /** 获取今日抽片指标 */
    const tadayInfo = reactive({
      evaluationPhotoNum: 0,
      evaluationStreamNum: 0
    })
    const getTodayEvaluateCount = async () => {
      const req = {
        type,
        organizationType
      }
      const res = await EvaluateApi.getTodayEvaluateCount(req)
      tadayInfo.evaluationPhotoNum = res.evaluationPhotoNum
      tadayInfo.evaluationStreamNum = res.evaluationStreamNum
    }
    getTodayEvaluateCount()

    /** 判断是否有抽片数据 */
    const getHaveSpotCheckResult = async () => {
      const req = {
        type,
        organizationType
      }
      const res = await EvaluateApi.getHaveSpotCheckResult(req)
      if (res) {
        uuid.value = res
        try {
          store.dispatch('settingStore/showLoading', route.name)
          await getSpotCheckResultList()
        } finally {
          store.dispatch('settingStore/hiddenLoading', route.name)
        }
      }
      return res
    }
    onMounted(() => getHaveSpotCheckResult())

    /** 抽片 */
    const fullMember = ref('')
    const newMember = ref('')
    const productIds = ref<Array<string | number>>([])
    const spotPhoto = async () => {
      if (!productIds.value) return newMessage.warning('请选择产品')
      if (!fullMember.value && !newMember.value) return newMessage.warning('请选择伙伴抽片量')

      if (await getHaveSpotCheckResult()) return false

      try {
        store.dispatch('settingStore/showLoading', route.name)
        const req = {
          productIds: productIds.value,
          formalStaffCount: fullMember.value ? fullMember.value : 0,
          newStaffCount: fullMember.value ? fullMember.value : 0,
          type,
          organizationType
        }
        const res = await EvaluateApi.takePhoto(req)
        uuid.value = res
        isTakePhoto.value = true
        // 获取抽片数据
        await getSpotCheckResultList()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 评分 */
    const imgarray = ref<any>([])
    const evaluateIndex = ref(0)
    const showEvaluate = ref(false)
    const evaluatePoolRecordId = ref('') // 正在打分id
    // 显示打分数据
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
      imgarray.value = photoData
      showEvaluate.value = true
    }
    // 当预览窗口关闭哦时，更改今日指标数据
    const onShowEvaluteChange = () => {
      getTodayEvaluateCount()
    }

    // 跳转下一个评分内容
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
        await getSpotCheckResultList()
        nextPoolItemId = poolList.value[0].id
      } else if (isPageLastPhoto) {
        // 取上一个值
        nextPoolItemId = poolList.value[findPoolItemIndex - 1].id
        await getSpotCheckResultList()
      } else {
        // 更新数据列表
        await getSpotCheckResultList()
      }
      // 显示打分数据
      evaluatePhoto(nextPoolItemId, 0)
    }

    const onEvaluatePhoto = ({ photoIndex, poolItemId }: { photoIndex: number, poolItemId: string }) => {
      evaluatePhoto(poolItemId, photoIndex)
    }

    /** 提交评分 */
    const onSubmitData = async (data: ISubmitData) => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('未找到对应抽片记录，onSubmitData')
      const req = {
        poolItemId: findPoolItemData.id,
        photos: data.photos,
        tags: data.tags,
        type,
        organizationType
      }
      await EvaluateApi.commitHistory(req)
      await goNextEvaluatePhoto()
    }

    /** 跳过伙伴 */
    const onSkipStaff = async () => {
      const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
      if (!findPoolItemData) return newMessage.warning('未找到对应抽片记录，onSkipStaff')
      const staffIds = type === SPOT_TYPE.MAKEUP ? findPoolItemData.streamInfo?.dresserInfo.staffIds : findPoolItemData.streamInfo?.photographyerInfo.staffIds
      if (!staffIds || !staffIds.length) return newMessage.warning('未找到对应的伙伴id')
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

    /** 换一单 */
    const onChangePool = async () => {
      try {
        if (!uuid.value) return newMessage.warning('没有找到对应批次uuid')
        const findPoolItemData = poolList.value.find(poolItem => poolItem.id === evaluatePoolRecordId.value)
        const willChangeIndex = poolList.value.findIndex(poolItem => poolItem.id === evaluatePoolRecordId.value)
        if (!findPoolItemData) return newMessage.warning('没有找到对应id')
        const poolItemId = findPoolItemData.id
        const req = {
          poolItemId,
          uuid: uuid.value,
          type,
          organizationType
        }
        store.dispatch('settingStore/showLoading', route.name)
        try {
          const res = await EvaluateApi.changePool(req)
          // 替换原来有的id未知
          poolList.value.splice(willChangeIndex, 1, res as PoolRecordModel)
          newMessage.success('换取照片成功')
        } catch {
          // 没有更换的产品
          try {
            await ElMessageBox({
              title: '该伙伴没有可以替换的订单',
              message: h('div', null, '是否不评价改订单'),
              center: true,
              showClose: false,
              showCancelButton: true,
              confirmButtonText: '确定'
            })
            // TODO:cf 删除订单接口
            // 删除订单
            await goNextEvaluatePhoto()
            const willDeleteIndex = poolList.value.findIndex(poolItem => poolItem.id === evaluatePoolRecordId.value)
            poolList.value.splice(willDeleteIndex, 1)
          } catch {
            console.warn('取消更换')
          }
        }
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 设置缓存 */
    const isPreLoad = computed(() => store.state.settingStore.cacheImageSwitch)
    const onSetPreload = async (data: boolean) => {
      store.dispatch('settingStore/setImageCacheSwitch', data)
      const settingData = data ? 1 : 0
      await Setting.updateSetting('imageCacheSwitch', settingData)
    }

    return {
      type,
      organizationType, productIds,
      fullMember, newMember, spotPhoto,
      showHimoProduct,
      showFamilyProduct,
      poolList, tadayInfo,
      pager,
      handlePage,
      onEvaluatePhoto, imgarray, evaluateIndex, showEvaluate, onShowEvaluteChange,
      onSubmitData,
      onSkipStaff, onChangePool,
      isPreLoad, onSetPreload
    }
  }
})
</script>

<style lang="less" scoped>
.taday-info {
  .panel-slot {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .panel-content {
    display: flex;
    font-size: 14px;
    line-height: 22px;

    .list-table {
      width: 200px;
    }

    .title {
      background-color: #fafafa;
    }

    .title,
    .content {
      padding: 21px 20px;
    }
  }
}
</style>
