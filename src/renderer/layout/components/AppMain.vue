<template>
  <section
    v-loading.lock="isLoading"
    element-loading-custom-class="main-loading"
    class="app-main"
    :class="{
      'overhidden': isLoading,
      'micro-app-main': $microSPA,
      'home-main': isHome
    }"
  >
    <!-- 面包屑 -->
    <transition name="breadcrumb-box" mode="out-in">
      <div
        v-show="!isHome"
        class="header-title"
        :class="{
          'micro-header-title': $microSPA
        }"
      >
        <Breadcrumb v-if="$showHeader" />
        <div v-if="$showTitle" class="page-title">{{ $route.meta.title }}</div>
        <div class="header-content" />
      </div>
    </transition>

    <!-- 路由 -->
    <div class="page-view overflow-x-auto py-6 px-6">
      <div class="content">
        <router-view v-slot="{ Component }" :key="key">
          <keep-alive :include="cachedViews" exclude="" :max="4">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'

import Breadcrumb from '@/components/Breadcrumb.vue'

export default defineComponent({
  name: 'AppMain',
  components: { Breadcrumb },
  computed: {
    // 动画名
    transitionName (): string {
      return ''
    },
  },
  setup () {
    const route = useRoute()
    const store = useStore()

    // 是否处于加载中
    const isLoading = computed(() => {
      const loadRoutes = store.getters.loadRoutes
      return loadRoutes.includes(route.name)
    })

    // 缓存路由
    const cachedViews = computed(() => store.state.tagsViewStore.cachedViews)

    const key = computed(() => route.path)

    const isHome = computed(() => route.name === 'Home')

    return {
      isLoading,
      cachedViews,
      key,
      isHome
    }
  }
})
</script>

<style lang="less" scoped>
  .app-main {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: calc(~'100vh - @{userTabHeight} - var(--tagsHeight)');
    overflow-x: hidden;
    overflow-y: overlay;
    scroll-behavior: smooth;

    .header-title {
      position: sticky;
      top: 0;
      z-index: 1990;
      width: 100%;
      height: var(--headerHeight);
      padding: 0 18px;
      background-color: #fff;

      .page-title {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        color: #000;
      }

      .header-content {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }

      &.micro-header-title {
        position: relative;
        z-index: 1;
        width: calc(100% + 48px);
      }

      &.no-sticky-title {
        position: relative !important;
        z-index: inherit;
      }
    }

    .page-view {
      height: calc(~'100vh - @{userTabHeight} - var(--headerHeight) - var(--tagsHeight) - var(--navbarHeight)');
    }

    &.micro-app-main {
      height: 100%;
    }
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }
</style>

<style lang="less">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }

  .overhidden {
    overflow: hidden !important;
  }
</style>
