<template>
  <el-container :class="{ 'micro-container-main': $microSPA, hideSidebar: collapse }">
    <!-- 顶部 -->
    <el-header v-if="$isElectron">
      <Navbar />
    </el-header>
    <el-container class="container-main">
      <!-- 菜单 -->
      <el-aside v-if="!$microSPA" :class="{ hideSidebar: collapse }" class="app-wrapper">
        <Sidebar class="sidebar-container" />
      </el-aside>
      <!-- 内容 -->
      <el-main class="main-box" :class="{ 'micro-main': $microSPA }">
        <UserTab v-if="!$microSPA && !$isElectron" />
        <TagsView v-if="$showTags" />
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { AppMain, UserTab, Sidebar, TagsView, Navbar } from './components/index'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Layout',
  components: { AppMain, UserTab, Sidebar, TagsView, Navbar },
  setup () {
    const store = useStore()

    const collapse = computed(() => store.getters.collapse)

    return {
      collapse
    }
  }
})
</script>

<style lang="less" scoped>
  .el-header {
    height: @navbarHeight !important;
    padding: 0 !important;
    background: @gradualGray;
  }

  .el-aside {
    position: relative;
    width: @sideBarWidth !important;
    padding: 0 !important;
    margin-bottom: 0;
    line-height: inherit;
    background-color: #d3dce6;
    transition: width 0.3s;

    &.hideSidebar {
      width: @hiddenSideBarWidth !important;
    }
  }

  .el-main {
    width: calc(~'100% - @{sideBarWidth}');
    height: 100vh;
    padding: 0 !important;
    background-color: #f0f2f5;

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background: #cdcdcd;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-button {
      display: none;
      background: #fff;
    }

    ::-webkit-scrollbar-corner {
      display: none;
    }

    &.micro-main {
      width: 100%;
      height: 100%;
    }
  }

  .hideSidebar {
    .el-main {
      width: calc(~'100% - @{hiddenSideBarWidth}');
    }
  }

  .el-container .main-box {
    overflow: inherit;
  }

  .container-main {
    background-color: #131923;
  }

  .micro-container-main {
    height: 100%;
  }

  .tap-view {
    height: 34px;
    background-color: red;
  }
</style>
