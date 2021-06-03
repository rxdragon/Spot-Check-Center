<template>
  <el-image
    v-bind="$attrs"
    class="preview-canvas-img"
    :src="src"
    :fit="containPhoto ? 'contain' : 'cover'"
  >
    <template #error>
      <div class="image-slot">
        <i class="el-icon-picture-outline" />
        <span>加载失败...</span>
      </div>
    </template>
  </el-image>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewCanvasImg',
  props: {
    file: { type: Object, required: true },
    containPhoto: { type: Boolean }
  },
  data () {
    return {
      fileData: null,
      quality: 0.8,
      width: 700,
      src: ''
    }
  },
  created () {
    this.fileData = this.file.raw
    this.pressImg()
  },
  methods: {
    /**
     * @param {二进制文件流} file
     */
    changeFileToBaseURL (file: any) {
      return URL.createObjectURL(file)
    },
    /**
     * @description 压缩图片
     */
    async pressImg () {
      // 得到文件类型
      const fileType = (this.fileData as any).type
      const imgSrc = this.changeFileToBaseURL(this.fileData)
      const image = new Image()
      image.src = imgSrc
      image.onload = () => {
        const scale: number = image.width / image.height
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = this.width
        canvas.height = Number(this.width / scale)
        if (!context) return
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blobData) => {
          this.src = URL.createObjectURL(blobData)
        }, fileType, this.quality)
      }
    }
  }
})
</script>
