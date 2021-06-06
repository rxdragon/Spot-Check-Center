<template>
  <div class="evaluate-components">
    评价组件 -
    {{ type }} -
    {{ organizationType }}
    <el-row class="search-box" :gutter="20">
      <!-- 产品 -->
      <el-col v-bind="{ ...colConfig }">
        <div class="search-item">
          <span>产品</span>
          <ProductSelect v-model="productIds" />
        </div>
      </el-col>
      <!-- 正式伙伴抽取单量 -->
      <!-- 新人伙伴抽取单量 -->
      <el-col v-bind="{ ...colConfig, sm: 4, md: 4 }">
        <div class="search-item">
          <el-button type="primary">抽取</el-button>
        </div>
      </el-col>
    </el-row>

    <div class="module-panel mt-6">
      <div v-for="photoItem in photoList" :key="photoItem.businessId" class="photo-data mb-6">
        <PhotoTable :photo-info="photoItem" />
      </div>
      <div v-if="!photoList.length" class="no-data">暂无数据</div>
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
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue'
import ProductSelect from '@/components/SelectBox/ProductSelect/index.vue'
import PhotoTable from './photoTable.vue'

export default defineComponent({
  name: 'EvaluateComponents',
  components: { ProductSelect, PhotoTable },
  setup () {
    /** 页面样式配置 */
    const colConfig = reactive({
      span: 24,
      xl: 6,
      lg: 8,
      md: 10,
      sm: 10,
      xs: 24
    })

    const type = inject('type')
    const organizationType = inject('organizationType')
    const pager = reactive({
      page: 1,
      pageSize: 10,
      total: 10
    })

    const photoList = ref<any>([])
    const productIds = ref([])

    /** 分页逻辑 */
    const handlePage = () => {
      // TODO
    }
    
    return {
      colConfig,
      type,
      organizationType,
      pager,
      photoList,
      productIds,
      handlePage
    }
  }
})
</script>
