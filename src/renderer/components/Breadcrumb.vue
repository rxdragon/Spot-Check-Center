<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
          class="no-redirect"
        >{{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import type { RouteLocationMatched } from 'vue-router'

import { defineComponent } from 'vue'
import * as pathToRegexp from 'path-to-regexp'

export default defineComponent({
  name: 'Breadcrumb',
  data () {
    const levelList: RouteLocationMatched[] = []
    return {
      levelList
    }
  },
  watch: {
    $route (route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    /**
     * @description 获取裂解列表
     */
    getBreadcrumb () {
      // only show routes with meta.title
      const matched = this.$route.matched.filter((item: any) => item.meta && item.meta.title)
      this.levelList = matched.filter(
        (item: any) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    /**
     * @description 获取拼接地址
     */
    pathCompile (path: string) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    /**
     * @description 链接跳转
     */
    handleLink (item: any) {
      const { redirect, path } = item
      const nowPath = this.$route.fullPath
      if (nowPath === redirect || nowPath === path) return
      if (redirect) {
        this.$router.push(redirect as string)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
})
</script>

<style lang="less" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
