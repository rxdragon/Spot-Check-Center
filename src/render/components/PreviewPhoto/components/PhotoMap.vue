<template>
  <div id="smallImg" class="small-img">
    <div class="breviary-photo">
      <div class="smallPhoto">
        <div id="img-box" style="position: relative;">
          <img
            ref="navigationMap"
            :src="showPhoto.src"
            alt="缩略图"
            @mouseover="handOver"
            @mousemove="handMove"
            @mouseout="handOut"
          >
          <div ref="mouseMask" class="_magnifier_zoom" />
        </div>
      </div>
      <div class="contant">
        <el-slider v-model="selfScaleNum" :show-tooltip="false" @change="onScaleChange" />
        <span class="scale-box">{{ scaleNum * 4 + 100 }}%</span>
        <span class="down-button" @click="downPhoto">下载</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, reactive, toRefs, watch } from 'vue'
import * as DownPhoto from '@/utils/downPhoto'

export default defineComponent({
  props: {
    showPhoto: { type: Object, required: true },
    scaleNum: { type: Number, required: true }
  },
  emits: ['update:scaleNum'],
  setup (props, { emit }) {
    const { showPhoto } = toRefs(props)
    const vm: any = getCurrentInstance()
    const parentVm: any = vm.parent

    /** 下载功能 */
    const downPhoto = () => {
      const orderNum = showPhoto.value.orderInfo.orderNum
      DownPhoto.downOnePicture(showPhoto.value.src, orderNum)
    }

    /** 滑动模块 */
    const { scaleNum } = toRefs(props)
    // 解决element value不能使用问题
    const selfScaleNum = ref(scaleNum.value)
    watch(scaleNum, (value) => {
      selfScaleNum.value = value
    })

    const onScaleChange = (value: number) => {
      emit('update:scaleNum', value)
    }

    // 放大图片相关
    const propConfigs = reactive({
      width: 100,
      height: 100,
      maskWidth: 100,
      maskHeight: 50,
      maskColor: 'red',
      maskOpacity: 0.5,
      scale: 100
    })

    const mouseMask = ref<any>(null)
    const imgLayer = ref<any>(null)

    const navigationMap = ref<Element | null>(null)
    let navigationMapBound = {
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    }

    const handOver = () => {
      if (!navigationMap.value) return
      navigationMapBound = navigationMap.value.getBoundingClientRect()

      // 马克图宽度计算系数
      propConfigs.maskWidth = (navigationMapBound.width / (scaleNum.value * 4 + 100)) * 100
      propConfigs.maskHeight = propConfigs.maskWidth * (navigationMapBound.height / navigationMapBound.width)
      // 背景图放大系数
      propConfigs.scale = (navigationMapBound.width / propConfigs.maskWidth) * 100
      
      // 创建鼠标选择区域
      mouseMask.value.style.background = propConfigs.maskColor
      mouseMask.value.style.height = propConfigs.maskHeight + 'px'
      mouseMask.value.style.width = propConfigs.maskWidth + 'px'
      mouseMask.value.style.opacity = propConfigs.maskOpacity

      ;(navigationMap.value.parentNode as Element).appendChild(mouseMask.value)

      // 获取大图尺寸
      const previewImageDomSize = parentVm.refs['OrginImg'].getBoundingClientRect()
      propConfigs.width = previewImageDomSize.width
      propConfigs.height = previewImageDomSize.height

      // 创建预览框
      imgLayer.value = parentVm.refs['magnifier_layer']
      imgLayer.value.style.width = propConfigs.width + 'px'
      imgLayer.value.style.height = propConfigs.height + 'px'
      imgLayer.value.style.backgroundImage = `url('${(vm.props.showPhoto as any).src}')`
      imgLayer.value.style.backgroundRepeat = 'no-repeat'
      imgLayer.value.style.backgroundSize = `${propConfigs.scale}%`

      const photoShowMain = parentVm.refs['photo-show-main']
      if (!photoShowMain) return
      photoShowMain.appendChild(imgLayer.value)
    }
    
    const handMove = (e: any) => {
      // 获取在图片的位置
      const objX = e.clientX - navigationMapBound.left
      const objY = e.clientY - navigationMapBound.top
      // 判断是否超出界限
      let _maskX = objX - mouseMask.value.offsetHeight / 2
      let _maskY = objY - mouseMask.value.offsetWidth / 2

      if (_maskY <= 0) _maskY = 0
      if (_maskY + mouseMask.value.offsetHeight >= navigationMapBound.height) {
        _maskY = navigationMapBound.height - mouseMask.value.offsetHeight
      }

      if (_maskX <= 0) _maskX = 0
      if (_maskX + mouseMask.value.offsetWidth >= navigationMapBound.width) {
        _maskX = navigationMapBound.width - mouseMask.value.offsetWidth
      }
      mouseMask.value.style.webkitTransform = `translate3d(${_maskX}px,${_maskY}px,0)`

      const backgroundX
        = ((_maskX / navigationMapBound.width)
          * propConfigs.width
          * propConfigs.scale)
          / 100
      const backgroundY
        = ((_maskY / navigationMapBound.height)
          * propConfigs.height
          * propConfigs.scale)
          / 100
      imgLayer.value.style.backgroundPositionX = `-${backgroundX}px `
      imgLayer.value.style.backgroundPositionY = `-${backgroundY}px `
    }

    const handOut = () => {
      imgLayer.value.removeAttribute('style')
      mouseMask.value.removeAttribute('style')
    }

    return {
      mouseMask, navigationMap,
      handOver,
      handMove,
      handOut,
      downPhoto,
      onScaleChange,
      selfScaleNum
    }
  }
})
</script>

<style lang="less" scoped>
.small-img {
  position: sticky;
  top: 0;
  box-sizing: border-box;
  box-sizing: content-box;
  width: 250px;
  padding: 0 15px;
  background-color: #535353;
  border-bottom: 1px solid #666;

  .smallPhoto {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 250px;
    background-color: #282828;

    ._magnifier_zoom {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 4010;
      pointer-events: none;
    }

    #img-box {
      width: max-content;
      height: 100%;
      text-align: center;
      vertical-align: bottom;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .contant {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
    color: #ddd;
    text-align: left;

    .el-slider {
      display: inline-block;
      width: 160px;
      margin-right: 8px;
    }

    .scale-box {
      margin-right: auto;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #eee;
    }

    .down-button {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #eee;
      cursor: pointer;

      &:hover {
        color: #ddd;
      }
    }

    :deep(.el-slider__runway) {
      height: 4px;
      margin: 14px 0;
      background-color: #282828;

      .el-slider__bar {
        height: 4px;
        background: linear-gradient(33deg, #91f5ff 0%, #71b9fd 45%, #4669fb 100%);
      }

      .el-slider__button {
        width: 12px;
        height: 12px;
        border: 1px solid #409eff;
      }
    }
  }

  .mark-show-btn {
    padding-bottom: 10px;

    .tag-btn {
      width: 240px;
      background-color: #666;
      border-color: #666;

      &:hover {
        background-color: #535353;
      }
    }

    .tag-show-btn {
      background: linear-gradient(90deg, rgba(79, 136, 255, 1) 0%, rgba(70, 105, 251, 1) 100%);
    }
  }
}
</style>
