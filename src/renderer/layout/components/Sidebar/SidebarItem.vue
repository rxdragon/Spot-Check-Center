<template>
  <div
    v-if="!routeItem.meta || (routeItem.meta && !routeItem.meta.hidden)"
    class="menu-wrapper"
  >
    <!-- 单个菜单 -->
    <template v-if="showSingleMenu">
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon || (routeItem.meta && routeItem.meta.icon)" />
          <template #title>
            {{ onlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </AppLink>
    </template>
    <!-- 多个菜单 -->
    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(routeItem.path)"
      popper-append-to-body
    >
      <template #title>
        <item v-if="routeItem.meta" :icon="routeItem.meta && routeItem.meta.icon" :title="routeItem.meta.title" />
      </template>
      <SidebarItem
        v-for="child in routeItem.children"
        :key="child.path"
        :is-nest="true"
        :route-item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import Item from './Item.vue' // 内容组件
import AppLink from './Link.vue' // 链接跳转

import { defineComponent } from 'vue'
import { isExternal } from '@/utils/validate' // 是否是网址

import * as Utils from '@/utils/index'

export default defineComponent({
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    routeItem: { type: Object, required: true },
    isNest: { type: Boolean, default: false },
    basePath: { type: String, default: '' }
  },
  data () {
    const onlyOneChild: any = null
    return {
      onlyOneChild
    }
  },
  computed: {
    showSingleMenu (): boolean {
      return (
        this.hasOneShowingChild(this.routeItem.children, this.routeItem)
        && (!this.onlyOneChild.children || this.onlyOneChild.noShowingChildren)
        && !this.routeItem.alwaysShow
      )
    }
  },
  methods: {
    /**
     * @description 只有一个列表显示
     */
    hasOneShowingChild (children = [], parent: any) {
      const showingChildren = children.filter((item: any) => {
        if (item.meta.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    /**
     * @description 决定跳转路径
     */
    resolvePath (routePath: string) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return Utils.joinPath(this.basePath, routePath)
    }
  }
})
</script>
