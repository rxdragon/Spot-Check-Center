<template>
  <div :class="{ 'micro-app': $microSPA }">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import variables from '@assetsDir/styles/variables.module.less'

import { useCssVar } from '@vueuse/core'

export default defineComponent({
  name: 'App',
  setup () {
    const vm = getCurrentInstance()
    if (!vm) return
    const globalProperties = vm.appContext.config.globalProperties

    if (globalProperties.$isDev && !globalProperties.$microSPA) {
      const subMenuBgColor = useCssVar('--subMenuBg', document.body)
      subMenuBgColor.value = (variables as any).devsubmenubg
      const menuBgColor = useCssVar('--menuBg', document.body)
      menuBgColor.value = (variables as any).devmenubg
    }

    if (!globalProperties.$showTags) {
      const tagsHeight = useCssVar('--tagsHeight', document.body)
      tagsHeight.value = '0px'
    }

    if (!globalProperties.$isElectron) {
      const navbarHeight = useCssVar('--navbarHeight', document.body)
      navbarHeight.value = '0px'
    }

    if (globalProperties.$isElectron) {
      const userTabHeight = useCssVar('--userTabHeight', document.body)
      userTabHeight.value = '0px'
    }
    
    const tagsHeight = useCssVar('--headerHeight', document.body)
    if (!globalProperties.$showHeader) {
      tagsHeight.value = '0px'
    }
    if (globalProperties.$showTitle) {
      tagsHeight.value = '52px'
    }

  }
})
</script>

<style lang="less" scoped>
  .micro-app {
    height: 100%;
  }
</style>
