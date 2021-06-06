<template>
  <el-row class="search-box" :gutter="20">
    <!-- 抽查时间 -->
    <el-col v-bind="{ ...colConfig }">
      <div class="search-item">
        <span>产品</span>
        ///
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
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'

import PeopleNumber from './components/PeopleNumber.vue'

export default defineComponent({
  name: 'EvaluateComponents',
  components: { PeopleNumber },
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
    const type = inject('type')
    const organizationType = inject('organizationType')

    const fullMember = ref('')
    const newMember = ref('')
    const spotPhoto = () => {
      console.warn('抽查信息')
    }

    return {
      type,
      organizationType,
      fullMember, newMember, spotPhoto
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
