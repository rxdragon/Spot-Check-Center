<template>
  <div class="photo-info">
    <div class="panel-title mb-3">照片信息</div>
    <div class="panel-content">
      <div v-if="basePhotoInfo.spotNum" class="info-row">
        <div class="info-title">编号：</div>
        <div class="info-content">{{ basePhotoInfo.spotNum }}</div>
      </div>
      <div class="info-row">
        <div class="info-title">订单号：</div>
        <div class="info-content">{{ basePhotoInfo.orderNum }}</div>
      </div>
      <div v-if="basePhotoInfo.productName" class="info-row">
        <div class="info-title">产品名称：</div>
        <div class="info-content">{{ basePhotoInfo.productName }}</div>
      </div>
      <div v-if="basePhotoInfo.photoCount" class="info-row">
        <div class="info-title">照片张数：</div>
        <div class="info-content">{{ basePhotoInfo.photoCount }}</div>
      </div>
      <div class="info-row">
        <div class="info-title">门店类型：</div>
        <div class="info-content">
          {{ basePhotoInfo.storeTypeCN }}
          <div class="standard-icon">
            <div :class="`iconmap-standard-${basePhotoInfo.storeType}`" />
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-title">门店：</div>
        <div class="info-content">{{ basePhotoInfo.storeName }}</div>
      </div>
      <div v-if="basePhotoInfo.aiSpotLabel" class="info-row">
        <div class="info-title">AI审核结果：</div>
        <div class="info-content">{{ basePhotoInfo.aiSpotLabel }}</div>
      </div>
      <div class="info-row">
        <div class="info-title">订单备注：</div>
        <div class="info-content">{{ basePhotoInfo.note.orderNote }}</div>
      </div>
      <div class="info-row">
        <div class="info-title">摄影备注：</div>
        <div class="info-content">{{ basePhotoInfo.note.photographyNote }}</div>
      </div>
      <div class="info-row">
        <div class="info-title">化妆备注：</div>
        <div class="info-content">{{ basePhotoInfo.note.dresserNote }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoInfo',
  props: {
    orderInfo: { type: Object, required: true }
  },
  setup (props) {
    const basePhotoInfo = computed(() => props.orderInfo)

    return {
      basePhotoInfo
    }
  }
})
</script>

<style lang="less" scoped>
.photo-info {
  padding: 14px 12px;
  font-size: 12px;
  color: #eee;
  border-bottom: 1px solid #666;

  .panel-title {
    color: #eee;
  }

  .panel-content {
    .info-row {
      display: flex;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #eee;

      .info-title {
        flex-shrink: 0;
        width: 90px;
        text-align-last: justify;
      }
    }
  }
}
</style>
