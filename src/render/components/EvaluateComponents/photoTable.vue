<template>
  <div class="photo-table">
    <div class="photo-grade-box">
      <div class="base-info panel-row">
        <span class="order-info w-44"><span class="order-info-title">照片编号：</span></span>
        <span class="order-info w-44"><span class="order-info-title">产品名称：</span></span>
        <span class="order-info w-44"><span class="order-info-title">门店类型：</span></span>
      </div>
      <div class="photo-list">
        <!-- TODO -->
        <div class="photo-gulp">
          <photo-box
            :show-name="false"
            :src="'https://cloud-dev.cdn-qn.hzmantu.com/compress/2020/06/17/ljj3UXg3uaY_C0DJ4kBsitaVV8UJ.jpg'"
            preload-photo
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive } from 'vue'
import PhotoBox from '@/components/PhotoBox/index.vue'

export default defineComponent({
  components: {
    PhotoBox
  },
  props: {
    photoInfo: { type: Object, required: true }
  },
  setup (props) {
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
    const photoData = computed(() => props.photoInfo)

    return {
      colConfig,
      type,
      organizationType,
      photoData
    }
  }
})
</script>

<style lang="less" scoped>
.photo-table {
  .panel-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .photo-list {
    display: flex;
    height: 140px;
    margin-top: 16px;

    .photo-gulp {
      position: relative;
      width: 140px;
      height: 140px;
      margin-right: 20px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 4px;

      .photo-version {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        padding: 0 7px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #eee;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 1px 1px 4px 1px;
      }
    }
  }
}
</style>
