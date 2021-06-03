<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <router-link key="expand" class="sidebar-logo-link" to="/">
      <transition name="fade" mode="out-in">
        <div v-if="collapse" class="sidebar-logo sidebar-logo-collapse-image" />
        <div v-else class="sidebar-logo sidebar-logo-image" />
      </transition>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Logo',
  data () {
    return {
      title: 'MAINTO'
    }
  },
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

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.28s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: @logoHeight;
    overflow: hidden;
    text-align: center;

    .sidebar-logo-link {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100%;
      height: 100%;

      .sidebar-logo {
        width: 200px;
        height: 53.3px;
        vertical-align: middle;
      }

      .sidebar-title {
        display: inline-block;
        margin: 0;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        font-size: 14px;
        font-weight: 600;
        line-height: 50px;
        color: #fff;
        vertical-align: middle;
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0;
      }
    }
  }
</style>
