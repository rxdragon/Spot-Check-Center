<template>
  <div class="no-data">
    <div ref="lottieEmpty" class="lottie-content" />
    <div class="no-data-desc">
      <slot>暂无数据</slot>
    </div>
  </div>
</template>

<script lang="ts">
import lottie from 'lottie-web'
import animationData from './empty-data.json'

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'NoData',
  setup () {
    const lottieEmpty = ref<any>(null)

    onMounted(() => {
      lottie.loadAnimation({
        container: lottieEmpty.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData // the path to the animation json
      })
    })

    return {
      lottieEmpty
    }
  }
})
</script>

<style lang="less" scoped>
.no-data {
  display: flex;
}

.lottie-content {
  width: 500px;
  margin-left: calc(50% - 300px);
}

.no-data-desc {
  margin-top: 100px;
  margin-left: -100px;
  font-size: 18px;
  color: #ccd8de;
}
</style>
