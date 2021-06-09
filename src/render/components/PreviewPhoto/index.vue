<template>
  <div v-loading="loading" class="preview-photo">
    <div class="preview-main">
      <div class="photo-title">{{ showPhoto.title || "暂无信息" }}</div>
      <!-- 图片内容 -->
      <div class="photo-main">
        <div
          ref="photo-show-main"
          class="orginPhoto"
          :style="photoZoomStyle + (inZoomIn ? 'cursor: zoom-out;' : 'cursor: zoom-in;')"
          @click.capture.stop="zoom"
        >
          <img
            id="orginImg"
            ref="OrginImg"
            :src="showPhoto.src"
            :alt="showPhoto.title"
            @load="loadingPhoto"
          >
          <!-- 放大图片 -->
          <div id="_magnifier_layer" ref="magnifier_layer" />
        </div>

        <!-- 左右按钮 -->
        <button v-if="photoArray.length !== 1" class="button-left" @click.stop="prePhoto">
          <i class="el-icon-arrow-left" />
        </button>
        <button v-if="photoArray.length !== 1" class="button-right" @click.stop="nextPhoto">
          <i class="el-icon-arrow-right" />
        </button>
      </div>
    </div>

    <div class="photo-column">
      <div class="close-module">
        <button type="button" class="button-close" @click="closePreview">
          <i class="el-icon-close" />
        </button>
      </div>
      <PhotoMap ref="photoMap" v-model:scaleNum="scaleNum" :show-photo="showPhoto" />
      <PhotoInfo :order-info="showPhoto.orderInfo" />
      <AiCheckResult :result-info="showPhoto" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, getCurrentInstance } from 'vue'
import usePhotoIndex from './composables/usePhotoIndex'
import usePhotoZoom from './composables/usePhotoZoom'
import useKeydown from './composables/useKeydown'

import PhotoMap from './components/PhotoMap.vue'
import PhotoInfo from './components/PhotoInfo.vue'
import AiCheckResult from './components/AiCheckResult.vue'

export default defineComponent({
  name: 'PreviewPhoto',
  components: { PhotoMap, PhotoInfo, AiCheckResult },
  props: {
    imgarray: { type: Array, required: true },
    index: { type: Number, default: 0 },
    showPreview: { type: Boolean, required: true },
  },
  emits: ['update:showPreview'],
  setup (props, { emit }) {
    const vm: any = getCurrentInstance()
    const loading = ref(true)
    
    const photoArray: Ref<any[]> = ref([])

    /** 上下图片 */
    const { photoIndex, prePhoto, nextPhoto, showPhoto } = usePhotoIndex({
      photoArray,
      loading,
      emit,
      props
    })

    /** 获取主图加载完毕 */
    const OrginImg = ref<Element | null>(null)
    const imgBigObj = ref<Element | null>(null)
    const showImageRect = reactive({
      width: 0,
      height: 0
    })

    /** 获取图片 */
    const loadingPhoto = () => {
      imgBigObj.value = OrginImg.value

      if (imgBigObj.value) {
        showImageRect.width = imgBigObj.value.clientWidth
        showImageRect.height = imgBigObj.value.clientHeight
      }
      loading.value = false
    }

    /** 关闭窗口 */
    const closePreview = () => {
      emit('update:showPreview', false)
    }

    /** 放大功能 */
    // 放大
    const judgeHasZoom = () => {
      const isOverIn = _.get(vm.refs['magnifier_layer'], 'style.width')
      if (isOverIn && vm.refs['photoMap']) vm.refs['photoMap'].handOver()
    }

    const { zoom, photoZoomStyle, scaleNum, inZoomIn } = usePhotoZoom({})
    /** 快捷指令 */
    useKeydown({ prePhoto, nextPhoto, closePreview, scaleNum, judgeHasZoom })

    return {
      photoIndex, prePhoto, nextPhoto, showPhoto,
      zoom, photoZoomStyle, scaleNum, inZoomIn,
      loading,
      photoArray,
      OrginImg,
      loadingPhoto,
      closePreview,
    }
  }
})
</script>

<style lang="less" scoped>
@navtop: 0px;

.preview-photo {
  position: fixed;
  top: @navtop;
  left: 0;
  z-index: 2000 !important;
  display: flex;
  width: 100vw;
  height: calc(100vh - @navtop);
  overflow: hidden;

  @photoToolWidth: 280px;

  .preview-main {
    width: calc(~'100vw - @{photoToolWidth}');
    background-color: rgba(0, 0, 0, 0.8);

    .photo-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      font-size: 22px;
      line-height: 40px;
      color: #ddd;
    }

    .photo-main {
      position: relative;
      height: 100%;
      overflow: hidden;

      .orginPhoto {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin: auto;
        overflow: hidden;
        touch-action: none;
        user-select: none;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        img {
          max-width: 100%;
          max-height: 100%;
        }

        .sign-dom {
          position: absolute;
          z-index: 1002;

          .sign-item {
            .circle-box {
              z-index: 1003;
              width: 100%;
              height: 100%;
              border: 2px solid;
              border-radius: 50%;
            }

            .retouch-reason {
              position: absolute;
              display: flex;

              &.top-left {
                top: 30%;
                left: 100%;
              }

              &.top-right {
                top: 30%;
                right: 100%;
              }

              &.bottom-left {
                bottom: 30%;
                left: 100%;
              }

              &.bottom-right {
                right: 100%;
                bottom: 30%;
              }

              .part-reason-list {
                display: flex;
                flex-direction: column;

                .part-tag {
                  width: max-content;
                  max-width: 140px;
                }

                .reason-tag-common {
                  padding: 10px;
                  margin: 0 10px 10px 0;
                  font-size: 12px;
                  color: #eee;
                  background: rgba(0, 0, 0, 0.5);
                  border-radius: 5px;
                }
              }

              .detail-box {
                display: flex;
                align-items: center;

                .triangle-left {
                  position: relative;
                  left: 15px;
                  width: 0;
                  height: 0;
                  border-top: 5px solid transparent;
                  border-right: 10px solid #fff;
                  border-bottom: 5px solid transparent;
                }

                .detail-content {
                  position: relative;
                  left: 10px;
                  width: max-content;
                  height: fit-content;
                  padding: 10px 5px;
                  font-size: 14px;
                  color: #303133;
                  background-color: #fff;
                  border-radius: 5px;
                }
              }
            }
          }
        }

        .mask-photo {
          position: absolute;
        }
      }

      .button-module {
        position: absolute;
        top: calc(50% - 25px);
        z-index: 2000;
        width: 50px;
        height: 50px;
        cursor: pointer;
        background-color: #383838;
        border: none;
        border-radius: 50%;
        outline: none;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        i {
          font-size: 20px;
          color: #979797;
        }

        &:hover {
          background-color: #535353;

          i {
            color: #fff;
          }
        }
      }

      .button-left {
        left: 10px;

        .button-module;
      }

      .button-right {
        right: 10px;
        .button-module;
      }
    }
  }

  .photo-column {
    width: @photoToolWidth;
    background-color: #535353;

    .close-module {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 40px;

      .button-close {
        width: 30px;
        height: 30px;
        padding: 0;
        margin-right: 10px;
        cursor: pointer;
        background-color: #535353;
        border: none;
        outline: none;

        .el-icon-close {
          font-size: 20px;
          color: #cdcdcd;
        }

        &:hover {
          i {
            color: #fff;
          }
        }
      }
    }
  }
}

#_magnifier_layer {
  position: absolute;
  z-index: 4000;
  background: #000;
}
</style>
