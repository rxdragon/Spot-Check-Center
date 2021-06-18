<template>
  <div class="photo-box">
    <div class="image-box" :class="{ 'image-load': loading }">
      <el-image
        v-if="!showCanvas"
        :src="photoSrc"
        :fit="containPhoto ? 'contain' : 'cover'"
        :preview-src-list="previewPhoto"
        @load="onLoadImageSuccess"
        @error="onLoadImageError"
      />
      <PreviewCanvasImg
        v-else
        contain-photo
        :file="fileData"
        @load="onLoadImageSuccess"
        @error="onLoadImageError"
      />
      <div v-if="showName" class="photo-name">
        {{ photoRealName }}
        <i class="copy-tool el-icon-copy-document" @click.stop.self="copyName" />
      </div>
    </div>
    <div v-if="downing" class="handle-box" @click.stop="">
      <slot name="otherInfo" />
      <div class="down-info">
        <el-button type="text" @click="downPhoto">下载照片</el-button>
        <span v-if="version" class="version-name">{{ version }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue'

import { useStore } from '@/store/index'
import { useClipboard } from '@vueuse/core'
import { newMessage } from '@/utils/message'

import PreviewCanvasImg from '@/components/PreviewCanvasImg/index.vue'

import * as DownPhoto from '@/utils/downPhoto'

export default defineComponent({
  name: 'PhotoBox',
  components: { PreviewCanvasImg },
  props: {
    src: { type: String, default: '' },
    version: { type: String, default: '云端成片' },
    downing: { type: Boolean, default: true },
    originalPhoto: { type: Boolean },
    preview: { type: Boolean },
    containPhoto: { type: Boolean, default: true },
    fileData: { type: Object, default: null },
    showName: { type: Boolean, default: true },
    outsideNoInfo: { type: Object, default: () => ({}) },
  },
  setup (props) {
    const store = useStore()
    const imgDomain = computed(() => store.getters.imgDomain)
    const imgCompressDomain = computed(() => store.getters.imgCompressDomain)

    const loading = ref(false)
    let errorReplaceUrl = ''

    /** 图片显示地址 */
    const { src, originalPhoto } = toRefs(props)
    const photoSrc = computed(() => {
      if (src.value.includes('http')) return src.value
      if (src.value.includes('blob')) return src.value
      if (originalPhoto.value) {
        return errorReplaceUrl ? `${imgDomain.value}${errorReplaceUrl}` : `${imgDomain.value}${src.value}`
      } else {
        return errorReplaceUrl ? `${imgCompressDomain.value}${errorReplaceUrl}` : `${imgCompressDomain.value}${src.value}`
      }
    })

    const { fileData } = toRefs(props)
    // 图片地址变化loading
    watch(
      photoSrc,
      () => {
        if (fileData.value) return
        loading.value = true
      }
    )

    /** 图片真实姓名 */
    const photoRealName = computed(() => {
      const photoFileNam = src.value.split('/')
      const realName = photoFileNam[photoFileNam.length - 1]
      const pointIndex = realName.indexOf('?')
      return pointIndex > -1 ? realName.substring(0, pointIndex) : realName
    })

    /** 预览图片数组 */
    const { preview } = toRefs(props)
    const previewPhoto = computed(() => {
      return preview.value ? [photoSrc.value] : []
    })

    /** 图片加载 */
    const onLoadImageSuccess = () => {
      loading.value = false
    }
    const errorCount = ref(0)
    const onLoadImageError = () => {
      if (errorCount.value < 4 && !originalPhoto.value) {
        setTimeout(() => {
          errorCount.value++
          errorReplaceUrl = `${src.value}?errorCounnnt=${errorCount.value}`
        }, 1000)
      } else {
        loading.value = false
      }
    }

    /** 下载图片 */
    const { outsideNoInfo } = toRefs(props)
    const downPhoto = () => {
      const { outsideNo } = outsideNoInfo.value
      DownPhoto.downOnePicture(src.value, outsideNo)
    }

    const showCanvas = ref(false)
    showCanvas.value = Boolean(fileData.value)

    /** 拷贝功能 */
    const copyName = async () => {
      try {
        const { copy } = useClipboard({ read: false })
        await copy(photoRealName.value)
        newMessage.success('拷贝成功')
      } catch (error) {
        newMessage.success(`拷贝失败：${error}`)
      }
    }

    return {
      errorCount,
      photoSrc,
      previewPhoto,
      photoRealName,
      showCanvas,
      downPhoto,
      loading,
      onLoadImageSuccess, onLoadImageError,
      copyName
    }

  },
})
</script>

<style lang="less" scoped>
.photo-box {
  background-color: @photoBack;
  border-radius: 8px;

  .image-box {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 4px;

    .el-image {
      position: absolute;
      width: 100%;
      height: 100%;

      img {
        -webkit-user-select: none;
        object-position: top;
      }
    }

    .photo-name {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      padding: 10px;
      font-size: 12px;
      line-height: 16px;
      color: #fff;
      word-break: break-word;
      word-break: break-all;
      user-select: none;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%);

      .copy-tool {
        position: relative;
        top: 2px;
        float: right;
        font-size: 14px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primaryColor;
        }
      }
    }

    &.image-load {
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        margin: -16px 0 0 -16px;
        font-family: @elementIconFamily !important;
        font-size: 32px;
        color: #606266;
        content: '\e6cf';
        animation: rotating 2s linear infinite;
      }
    }
  }

  .handle-box {
    padding: 12px 6px 6px;

    .down-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .version-name {
      font-size: 12px;
      font-weight: 400;
      color: #606266;
    }

    .el-button {
      padding: 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }

    .people-num {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }

    .joint-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }
  }
}

.icon-bar {
  width: 150px;
  height: 150px;

  .img {
    width: 100%;
    height: 100%;
  }
}
</style>

<style>
.icon-popper-class {
  padding: 2px;
  background: #fff !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
}
</style>
