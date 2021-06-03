<template>
  <div class="home">
    <div class="logo-tip">
      <div class="logo-img" />
      <div class="logo-desc">
        <span class="black">欢迎来到</span>
        <span class="desc">质量检测系统</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home'
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
