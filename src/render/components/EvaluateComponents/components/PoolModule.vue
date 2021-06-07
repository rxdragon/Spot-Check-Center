<template>
  <div class="pool-module module-panel mb-6">
    <div class="module-title">
      <div class="title-chunk spot-num">编号：100-1</div>
      <div class="title-chunk product-name">产品名称：精致证件照</div>
      <div class="title-chunk store-type">
        门店类型：蓝标
        <div class="standard-icon">
          <div :class="`iconmap-standard-blue`" />
        </div>
      </div>
    </div>
    <div class="photo-list overflow-x-auto overscroll-x-contain">
      <PhotoBox
        version=""
        class="mr-4"
        src="https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg"
      />
      <PhotoBox
        version=""
        class="mr-4"
        src="https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg"
      />
      <PhotoBox
        version=""
        class="mr-4"
        src="https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg"
      />
      <PhotoBox
        version=""
        class="mr-4"
        src="https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg"
      />
      <PhotoBox
        version=""
        class="mr-4"
        src="https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  name: 'PoolModule',
  components: { PhotoBox }
})
</script>

<style lang="less" scoped>
.module-title {
  display: flex;
  font-size: 16px;

  .title-chunk {
    margin-right: 24px;
  }

  .store-type {
    display: flex;
    align-items: center;
  }
}

.photo-list {
  width: 100%;
  white-space: nowrap;

  .photo-box {
    display: inline-block;
    width: 253px;
    cursor: pointer;
  }
}
</style>
