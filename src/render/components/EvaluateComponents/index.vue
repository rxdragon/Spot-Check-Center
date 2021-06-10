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
    <div class="panel-title mb-5">今日完成数据</div>
    <div class="panel-content">
      <div class="list-table">
        <div class="title">今日已评价</div>
        <div class="content">0单</div>
      </div>
      <div class="list-table">
        <div class="title">今日已评价</div>
        <div class="content">0张</div>
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
    @submitData="onSubmitData"
  />
</template>

<script lang="ts">
import type PoolRecordModel from '@/model/PoolRecordModel'
import { defineComponent, inject, reactive, ref, h, onMounted } from 'vue'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'

import PeopleNumber from './components/PeopleNumber.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import PoolModule from './components/PoolModule.vue'
import EvaluatePhoto from '@/components/EvaluatePhoto/index.vue'
import { ElMessageBox } from 'element-plus'
import * as EvaluateApi from '@/api/evaluateApi'

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

    /** 评分 */
    const imgarray = ref<any>([])
    const evaluateIndex = ref(0)
    const showEvaluate = ref(false)
    const onEvaluatePhoto = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      imgarray.value = photoData
      evaluateIndex.value = photoIndex
      showEvaluate.value = true
    }

    /** 提交评分 */
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

    /** 获取抽片结果 */
    const getSpotCheckResult = async () => {
      const req = {
        uuid: uuid.value,
        type,
        organizationType
      }
      const res = await EvaluateApi.getSpotCheckResult(req)
      try {
        const peopleType = type === SPOT_TYPE.MAKEUP ? '化妆师' : '摄影师'
        await ElMessageBox({
          title: '抽取结果',
          message: h('div', { style: 'display: grid; grid-template-columns: 4fr 5fr 5fr;' }, [
            h('span', null, `${peopleType}：${res.spotAllPeople}人`),
            h('span', null, `正式伙伴：${res.formalStaffNum}人`),
            h('span', null, `新人伙伴：${res.newStaffNum}人`),
            h('span', null, `总单量：${res.streamOrderNum}单`),
            h('span', null, `正式伙伴单量：${res.formalStaffStreamNum}单`),
            h('span', null, `新人伙伴单量：${res.newStaffStreamNum}单`),
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
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 100
    })
    const poolList = ref<PoolRecordModel[]>([])
    const getSpotCheckResultList = async () => {
      const req = {
        uuid: uuid.value,
        page: pager.page,
        pageSize: pager.pageSize,
        skip: pager.page * pager.pageSize,
        limit: pager.pageSize,
        type,
        organizationType
      }
      const res = await EvaluateApi.getSpotCheckResultList(req)
      poolList.value = res.list
      pager.total = res.total
    }
    const handlePage = () => {
      getSpotCheckResultList()
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
        await getSpotCheckResultList()
      }
      return res
    }
    onMounted(() => getHaveSpotCheckResult())

    /** 抽片 */
    const fullMember = ref('')
    const newMember = ref('')
    const productIds = ref<Array<string | number>>([])
    const spotPhoto = async () => {
      if (await getHaveSpotCheckResult()) return false
      const req = {
        productIds: productIds.value,
        formalStaffCount: fullMember.value ? fullMember.value : 0,
        newStaffCount: fullMember.value ? fullMember.value : 0,
        type,
        organizationType
      }
      const res = await EvaluateApi.takePhoto(req)
      uuid.value = res
      await getSpotCheckResult()
      // 获取抽片数据
      await getSpotCheckResultList()
    }
    

    return {
      type,
      organizationType, productIds,
      fullMember, newMember, spotPhoto,
      showHimoProduct,
      showFamilyProduct,
      poolList,
      pager,
      handlePage,
      onEvaluatePhoto, imgarray, evaluateIndex, showEvaluate,
      onSubmitData
    }
  }
})
</script>

<style lang="less" scoped>
.taday-info {
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
