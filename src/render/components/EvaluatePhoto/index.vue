<template>
  <div v-loading="loading" class="evaluate-photo">
    <div class="evaluate-title">
      {{ showPhoto.title }}
      <div class="close-btn">
        <button type="button" class="button-close" @click="closePreview">
          <i class="el-icon-close" />
        </button>
      </div>
    </div>
    <div class="evaluate-main flex">
      <div class="left-column flex-none">
        <PhotoMap ref="photoMap" v-model:scaleNum="scaleNum" :show-photo="showPhoto" />
        <MarkTool :canvas-option="canvasOption" @changeTool="changeDrawType" />
        <PhotoInfo :order-info="showPhoto.photoInfo" />
        <div v-if="!isResumeEvaluate" class="button-box">
          <el-button type="primary" @click="skipStaff">跳过伙伴</el-button>
          <el-button class="change-btn" @click="changePool">换一单</el-button>
        </div>
      </div>
      <div class="content-column flex-grow">
        <div class="photo-main">
          <div ref="photo-show-main" class="orginPhoto">
            <img
              id="orginImg"
              ref="OrginImg"
              :style="photoZoomStyle + (inZoomIn && 'cursor: zoom-out;')"
              :src="showPhoto.src"
              :alt="showPhoto.title"
              @load="loadingPhoto"
              @click.capture.stop="zoom"
            >
            <!-- 放大图片 -->
            <div id="_magnifier_layer" ref="magnifier_layer" />
            <!-- 批注组件 -->
            <FabricCanvas
              ref="fabricCanvas"
              :style="photoZoomStyle"
              :option-obj="canvasOption"
              @click="zoom"
            />
          </div>
          <!-- 左右按钮 -->
          <button v-if="photoArray.length !== 1" class="button-left" @click.stop="prePhoto">
            <i class="el-icon-arrow-left" />
          </button>
          <button v-if="photoArray.length !== 1" class="button-right" @click.stop="nextPhoto">
            <i class="el-icon-arrow-right" />
          </button>
        </div>
        <div class="photo-list p-5">
          <PhotoListMap v-model:photo-index="photoIndex" :photo-list="photoArray" />
        </div>
      </div>
      <div class="right-column flex-none">
        <GradeLabel ref="gradeLabel" />
        <div class="button-box">
          <el-button type="info" class="out-btn" @click="closePreview">退出</el-button>
          <el-button type="primary" @click="submitData">提交评分</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, Ref, toRefs, reactive, watch, computed, h } from 'vue'

import type { IOptionObj } from './composables/useCanvasTool'
import type { IPhotoItemData, ISubmitData } from './index'
import { ElMessageBox } from 'element-plus'

import { TOOL_TYPE } from './components/ToolEnumerate'

import usePhotoIndex from '@/components/PreviewPhoto/composables/usePhotoIndex'
import usePhotoZoom from '@/components/PreviewPhoto/composables/usePhotoZoom'
import useKeydown from './composables/useKeydown'

import PhotoMap from '@/components/PreviewPhoto/components/PhotoMap.vue'
import PhotoInfo from '@/components/PreviewPhoto/components/PhotoInfo.vue'
import MarkTool from './components/MarkTool.vue'
import PhotoListMap from './components/PhotoListMap.vue'
import FabricCanvas from './components/FabricCanvas.vue'
import GradeLabel from './components/GradeLabel.vue'

import * as CanvasTool from '@/utils/canvasTool'
import * as CommonalityApi from '@/api/commonalityApi'

export default defineComponent({
  name: 'EvaluatePhoto',
  components: { PhotoMap, PhotoInfo, MarkTool, PhotoListMap, FabricCanvas, GradeLabel },
  props: {
    imgarray: { type: Array, required: true },
    index: { type: Number, default: 0 },
    showEvaluate: { type: Boolean, required: true },
    isResumeEvaluate: { type: Boolean }
  },
  emits: ['update:showEvaluate', 'submitData', 'change', 'skipStaff', 'changePool'],
  setup (props, { emit }) {
    const vm: any = getCurrentInstance()
    const fabricCanvas = ref<any>(null)
    const imgLoading = ref(true)
    const canvasLoading = ref(false)
    const loading = computed(() => imgLoading.value || canvasLoading.value)
      
    const photoArray: Ref<IPhotoItemData[]> = ref([])

    /** 上下图片 */
    const { photoIndex, prePhoto, nextPhoto, showPhoto } = usePhotoIndex({
      photoArray,
      loading: imgLoading,
      emit,
      props
    })

    /** 关闭窗口 */
    const closePreview = () => {
      emit('update:showEvaluate', false)
      emit('change', false)
    }

    /** 跳过伙伴 */
    const skipStaff = async () => {
      try {
        await ElMessageBox({
          title: '确认跳过伙伴?',
          message: h('div', null, '当天不会再抽取到该伙伴任何订单'),
          center: true,
          showClose: false,
          showCancelButton: true,
          confirmButtonText: '确定'
        })
        emit('skipStaff')
      } catch {
        console.warn('取消跳过')
      }
    }

    /** 换一单 */
    const changePool = async () => {
      try {
        await ElMessageBox({
          title: '确认换单么?',
          message: h('div', null, '将替换现有订单'),
          center: true,
          showClose: false,
          showCancelButton: true,
          confirmButtonText: '确定'
        })
        emit('changePool')
      } catch {
        console.warn('取消更换')
      }
    }

    /** 绘图相关 */
    const canvasOption: IOptionObj = reactive({
      width: 200,
      height: 200,
      penColor: '#E34F51',
      lineWidth: 2,
      drawType: TOOL_TYPE.MOVE
    })

    const { showEvaluate } = toRefs(props)
    const changeDrawType = (drawInfo: { type: TOOL_TYPE, value: string }) => {
      if (!showEvaluate.value) return false
      const { type, value } = drawInfo

      if (type === TOOL_TYPE.COLOR) {
        canvasOption.penColor = value
        return
      }
      canvasOption.drawType = type
    }

    // 监听屏幕重置重新设置宽高 TODO:cf
    // onWindowResize (e, item) {
    //   this.getImgInfo()
    //   if (!this.showCanvas) return
    //   this.$nextTick(() => {
    //     if (!this.$refs['fabric-canvas']) return
    //     this.$refs['fabric-canvas'].resetCanvas()
    //   })
    // }
    
    /** 切换照片时候储存json到照片模型下 */
    watch(
      photoIndex,
      async (newIndex, oldIndex) => {
        if (!fabricCanvas.value) return
        canvasLoading.value = true
        // 将上一张的mark信息存储起来
        const jsonInfo = fabricCanvas.value.exportJsonInfo()
        if (jsonInfo) {
          photoArray.value[oldIndex].markJson = jsonInfo
          const markBase64 = fabricCanvas.value.exportBase64()
          photoArray.value[oldIndex].markBase = markBase64
          fabricCanvas.value.clearCanvas()
        }
        const nextMarkJson = showPhoto.value.markJson
        await fabricCanvas.value.loadMarkJson(nextMarkJson)
        canvasLoading.value = false
      }
    )

    /** 获取图片 */
    /** 获取主图加载完毕 */
    const OrginImg = ref<Element | null>(null)
    const loadingPhoto = () => {
      if (OrginImg.value) {
        canvasOption.width = OrginImg.value.clientWidth
        canvasOption.height = OrginImg.value.clientHeight
      }
      imgLoading.value = false
    }

    /** 放大功能 */
    // 放大
    const judgeHasZoom = () => {
      const isOverIn = _.get(vm.refs['magnifier_layer'], 'style.width')
      if (isOverIn && vm.refs['photoMap']) vm.refs['photoMap'].handOver()
    }
    const { zoom, photoZoomStyle, scaleNum, inZoomIn } = usePhotoZoom({ canvasOption })


    /** 上传批注图片 */
    // 获取token
    const qNConfig = ref<any>('')
    const getQNSign = async () => {
      qNConfig.value = await CommonalityApi.getSignature()
    }
    getQNSign()
    const uploadPhotoMap = async () => {
      for (const photoItem of photoArray.value) {
        if (!photoItem.markBase) continue
        const blobData = CanvasTool.convertBase64ToBlob(photoItem.markBase)
        const fileData = CanvasTool.structureFile(blobData)
        const fileDataUploadUrl = await CanvasTool.uploadTagPhoto(fileData, qNConfig.value)
        photoItem.markPath = fileDataUploadUrl as string
      }
    }

    /** 提交分数 */
    const gradeLabel = ref<any>(null)
    const submitData = async () => {
      // 储存当前批注照片
      const markBase64 = fabricCanvas.value.exportBase64()
      photoArray.value[photoIndex.value].markBase = markBase64
      await uploadPhotoMap()
      const photos = photoArray.value.map(photoItem => {
        return {
          markPath: photoItem.markPath,
          photoId: photoItem.id
        }
      })
      const gradeLabelVm = gradeLabel.value
      const data: ISubmitData = {
        tags: gradeLabelVm.getAllSelectLabel(),
        photos
      }
      emit('submitData', data)
    }

    // 更换照片清空label信息和map信息
    watch(
      photoArray,
      () => {
        const gradeLabelVm = gradeLabel.value
        gradeLabelVm.resetSelectLabel()
        fabricCanvas.value.clearCanvas()
      }
    )

    /** 快捷键 */
    useKeydown({ prePhoto, nextPhoto, closePreview, scaleNum, judgeHasZoom, changeDrawType })

    return {
      loading, imgLoading,
      photoArray,
      photoIndex, prePhoto, nextPhoto, showPhoto,
      zoom, photoZoomStyle, scaleNum, inZoomIn,
      loadingPhoto, closePreview, judgeHasZoom, OrginImg,
      canvasOption, changeDrawType,
      fabricCanvas,
      submitData, gradeLabel,
      skipStaff, changePool
    }
  }
})
</script>

<style lang="less" scoped>
@navtop: 0px;
@baseBgColor: #535353;

.evaluate-photo {
  @titleHeight: 40px;

  position: fixed;
  top: @navtop;
  left: 0;
  z-index: 2000 !important;
  width: 100vw;
  height: calc(100vh - @navtop);
  overflow: hidden;
  background-color: #282828;

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

    height: calc(~'100% - @{titleHeight}');

    .left-column {
      width: @left-column;
      background-color: @baseBgColor;
    }

    .right-column {
      width: @right-column;
      background-color: @baseBgColor;
    }

    .left-column,
    .right-column {
      position: relative;

      .button-box {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 60px;
        border-top: 1px solid #666;

        .change-btn {
          color: @primaryColor;
        }

        .out-btn {
          background-color: #666;
          border-color: #666;

          &:hover {
            background-color: #535353;
          }
        }
      }
    }

    .content-column {
      @photoListHeight: 160px;

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
          z-index: 3001;
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

:deep(.el-loading-mask) {
  z-index: 3500 !important;
}

#_magnifier_layer {
  position: absolute;
  z-index: 3100;
  background: #000;
}
</style>
