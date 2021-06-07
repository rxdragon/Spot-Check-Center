<template>
  <div v-loading="loading" class="evaluate-photo">
    <div class="evaluate-title">
      原片（1/6）
      <div class="close-btn">
        <button type="button" class="button-close" @click="closePreview">
          <i class="el-icon-close" />
        </button>
      </div>
    </div>
    <div class="evaluate-main h-full flex">
      <div class="left-column flex-none">
        <PhotoMap ref="photoMap" v-model:scaleNum="scaleNum" :show-photo="showPhoto" />
        <MarkTool :canvas-option="canvasOption" @changeTool="changeDrawType" />
        <PhotoInfo :order-info="showPhoto.photoInfo" />
      </div>
      <div class="content-column flex-grow">
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
        <div class="photo-list">
          <PhotoListMap />
        </div>
      </div>
      <div class="right-column flex-none">右侧栏目</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, Ref, reactive } from 'vue'

import { TOOL_TYPE } from './components/ToolEnumerate'

import usePhotoIndex from '@/components/PreviewPhoto/composables/usePhotoIndex'
import usePhotoZoom from '@/components/PreviewPhoto/composables/usePhotoZoom'

import PhotoMap from '@/components/PreviewPhoto/components/PhotoMap.vue'
import PhotoInfo from '@/components/PreviewPhoto/components/PhotoInfo.vue'
import MarkTool from './components/MarkTool.vue'
import PhotoListMap from './components/PhotoListMap.vue'
import { toRefs } from '@vueuse/core'

export default defineComponent({
  name: 'EvaluatePhoto',
  components: { PhotoMap, PhotoInfo, MarkTool, PhotoListMap },
  props: {
    imgarray: { type: Array, required: true },
    index: { type: Number, default: 0 },
    showEvaluate: { type: Boolean, required: true },
  },
  emits: ['update:showEvaluate'],
  setup (props, { emit }) {
    const vm: any = getCurrentInstance()
    const loading = ref(false)

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

    /** 关闭窗口 */
    const closePreview = () => {
      emit('update:showEvaluate', false)
    }

    /** 获取图片 */
    const loadingPhoto = () => {
      imgBigObj.value = OrginImg.value

      if (imgBigObj.value) {
        showImageRect.width = imgBigObj.value.clientWidth
        showImageRect.height = imgBigObj.value.clientHeight
      }
      loading.value = false
    }

    /** 放大功能 */
    // 放大
    const judgeHasZoom = () => {
      const isOverIn = _.get(vm.refs['magnifier_layer'], 'style.width')
      if (isOverIn && vm.refs['photoMap']) vm.refs['photoMap'].handOver()
    }

    const { zoom, photoZoomStyle, scaleNum, inZoomIn } = usePhotoZoom()

    /** 绘图相关 */
    const canvasOption = reactive({
      width: 200,
      height: 200,
      penColor: '#E34F51',
      lineWidth: 2,
      drawType: ''
    })

    const { showEvaluate } = toRefs(props)
    const changeDrawType = (drawInfo: { type: TOOL_TYPE, value: string }) => {
      if (!showEvaluate.value) return false
      const { type, value } = drawInfo

      if (type === TOOL_TYPE.COLOR) {
        canvasOption.penColor = value
        return
      }

      // if (type !== TOOL_TYPE.BLOWUP && !this.showCanvas) {
      //   this.createCanvas(drawInfo)
      //   return
      // }
      // if (type === TOOL_TYPE.BLOWUP && this.inZoomIn) {
      //   this.$refs['fabric-canvas'].$el.style.cursor = 'zoom-out'
      // }
      canvasOption.drawType = type
    }

    return {
      loading,
      photoArray,
      photoIndex, prePhoto, nextPhoto, showPhoto,
      zoom, photoZoomStyle, scaleNum, inZoomIn,
      loadingPhoto, closePreview, judgeHasZoom,
      canvasOption, changeDrawType
    }
  }
})
</script>

<style lang="less" scoped>
@navtop: 0px;
@baseBgColor: #535353;

.evaluate-photo {
  position: fixed;
  top: @navtop;
  left: 0;
  z-index: 2000 !important;
  width: 100vw;
  height: calc(100vh - @navtop);
  overflow: hidden;
  background-color: red;

  .evaluate-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 22px;
    line-height: 40px;
    color: #ddd;
    background-color: @baseBgColor;

    .close-btn {
      position: absolute;
      right: 10px;
    }
  }

  .evaluate-main {
    @left-column: 280px;
    @right-column: 280px;

    .left-column {
      width: @left-column;
      background-color: @baseBgColor;
    }

    .right-column {
      width: @right-column;
      background-color: yellow;
    }

    .content-column {
      @photoListHeight: 150px;

      .photo-main {
        position: relative;
        height: calc(~'100% - @{photoListHeight}');
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

      .photo-list {
        height: @photoListHeight;
        background-color: #303133;
      }
    }
  }
}

#_magnifier_layer {
  position: absolute;
  z-index: 1999;
  background: #000;
}
</style>
