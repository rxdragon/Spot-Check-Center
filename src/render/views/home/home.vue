<template>
  <div class="home">
    <div class="logo-tip">
      <div class="logo-img" />
      <div class="logo-desc">
        <span class="black">欢迎来到</span>
        <span class="desc">质量检测系统</span>
      </div>
      <!-- 下载测试 -->
      <div class="test-down">
        <el-button @click="downPhoto">下载</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as DownPhoto from '@/utils/downPhoto'

export default defineComponent({
  name: 'Home',
  setup () {
    const downPhoto = () => {
      const imagePath = 'https://cloud.cdn-qn.hzmantu.com/upload/2021/06/17/Fv60TLWvjUTlUfUkWkfxufCS8BYu.jpg'
      // const imagePath = 'https://a63ffe63a0d7431fa49dad343bfa6219.dlied1.cdntips.net/dlied1.qq.com/qqweb/PCQQ/PCQQ_EXE/PCQQ2021.exe?mkey=60cb03123cb0231f&f=560f&cip=60.176.5.234&proto=https&access_type='
      const savePath = 'C123456'
      const rename = 'testDown.jpg'
      DownPhoto.downOnePicture(imagePath, savePath, rename)
    }

    return {
      downPhoto,
    }
  }
})
</script>

<style lang="less" scoped>
@logo: url(../../assets/images/logo.png);

.home {
  position: relative;
  // 多减去外层padding
  height: calc(100vh - var(--userTabHeight) - var(--headerHeight) - var(--tagsHeight) - var(--navbarHeight) - 48px);

  .logo-tip {
    position: absolute;
    top: 40%;
    left: 50%;
    width: min-content;
    transform: translateX(-50%) translateY(-50%);

    .logo-img {
      width: 400px;
      height: 106.6px;
      margin: auto;
      background-color: @primaryColor;
      background-image: @logo;
      background-position: 0 0;
      background-size: 400px;
      mask-image: @logo;
      mask-size: 400px;
    }

    .logo-desc {
      width: 500px;
      margin-top: 26px;
      font-family: @pingFang;
      font-size: 30px;
      font-weight: 600;
      line-height: 38px;
      color: #131923;
      text-align: center;

      .desc {
        color: @primaryColor;
      }
    }
  }
}
</style>
