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
    <PoolModule v-for="(poolItem, poolIndex) in poolList" :key="poolIndex" />
  </div>

  <EvaluatePhoto
    v-if="showEvaluate"
    v-model:showEvaluate="showEvaluate"
    :imgarray="imgarray"
    :index="evaluateIndex"
  />
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'

import PeopleNumber from './components/PeopleNumber.vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import PoolModule from './components/PoolModule.vue'
import EvaluatePhoto from '@/components/EvaluatePhoto/index.vue'

import { ORGANIZATION_TYPE } from '@/model/Enumerate'

// TODO test 
import StreamOrderModel from '@/model/StreamOrderModel'

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
      },
      imgarray: [
        {
          src: 'https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg',
          markPath: '',
          photoInfo: new StreamOrderModel({})
        },
        {
          src: 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2021/06/07/For1yk41pocbeTppJeqF95ijLvSz.jpg',
          markPath: '',
          photoInfo: new StreamOrderModel({})
        }
      ],
      evaluateIndex: 0,
      showEvaluate: true
    }
  },
  setup () {
    const type = inject('type')
    const organizationType = inject('organizationType')

    const fullMember = ref('')
    const newMember = ref('')
    const productIds = ref([])
    const spotPhoto = () => {
      console.warn('抽查信息')
    }

    /** 是否显示海马体产品 */
    const showHimoProduct = ref(false)
    const showFamilyProduct = ref(false)
    if (organizationType === ORGANIZATION_TYPE.HIMO) {
      showHimoProduct.value = true
    }
    if (organizationType === ORGANIZATION_TYPE.FAMILY) {
      showFamilyProduct.value = true
    }

    /** 获取抽片信息 */
    const poolList = ref(['', ''])

    return {
      type,
      organizationType, productIds,
      fullMember, newMember, spotPhoto,
      showHimoProduct,
      showFamilyProduct,
      poolList
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
