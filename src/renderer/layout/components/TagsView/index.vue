<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="(tag, tagIndex) in visitedViews"
        :ref="setItemRef"
        :key="tag.path"
        :class="isActive(tag, tagIndex)"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="tab-box">
          {{ tag.title }}
          <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li
        v-if="!(selectedTag.meta && selectedTag.meta.affix)"
        @click="closeSelectedTag(selectedTag)"
      >
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { RouteLocationRaw } from 'vue-router'

import { defineComponent } from 'vue'
import ScrollPane from './ScrollPance.vue'

import * as Utils from '@/utils/index'

export default defineComponent({
  components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {
        meta: { affix: false }
      },
      affixTags: [],
      activeTagIndex: 0,
      tagsRef: []
    }
  },
  computed: {
    visitedViews (): any {
      return this.$store.state.tagsViewStore.visitedViews
    },
    routes () {
      return this.$store.state.permissionStore.routes
    }
  },
  watch: {
    $route () {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.initTags()
    this.addTags()
  },
  beforeUpdate () {
    this.tagsRef = []
  },
  methods: {
    setItemRef (el: any) {
      if (!el) return
      const findSameTag = this.tagsRef.find((item: any) => item._.uid === el._.uid)
      if (findSameTag) return
      (this.tagsRef as any[]).push(el)
    },
    /**
     * @description 是否激活
     */
    isActive (route: { path: string }, tagIndex: any) {
      let classText = ''
      if (route.path === this.$route.path) {
        this.activeTagIndex = tagIndex
        classText += 'active'
      }
      if (tagIndex === this.activeTagIndex - 1) {
        classText += 'isBorderActive-left'
      }
      if (tagIndex === this.activeTagIndex + 1) {
        classText += 'isBorderActive-right'
      }
      return classText
    },
    /**
     * @description 过滤可标记tag
     */
    filterAffixTags (routes: any[], basePath = '/') {
      let tags: any[] = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = Utils.joinPath(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    /**
     * @description 是否初始化tag
     */
    initTags () {
      (this.affixTags as any[]) = this.filterAffixTags(this.routes)
      const affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsViewStore/addVisitedView', tag)
        }
      }
    },
    /**
     * @description 是否添加标签
     */
    addTags () {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsViewStore/addView', this.$route)
      }
      return false
    },
    /**
     * @description 是否移动标签
     */
    moveToCurrentTag () {
      const tags: any = this.tagsRef
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            (this.$refs.scrollPane as any).moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsViewStore/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    /**
     * @description 刷新页面
     */
    refreshSelectedTag (view: any) {
      this.$store.dispatch('tagsViewStore/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    /**
     * @description 关闭当前标签
     */
    closeSelectedTag (view: any) {
      this.$store.dispatch('settingStore/hiddenLoading', this.$route.name)
      this.$store.dispatch('tagsViewStore/delView', view).then(({ visitedViews }: any) => {
        if (view.path === this.$route.path) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    /**
     * @description 关闭其他页面
     */
    closeOthersTags () {
      this.$store.dispatch('settingStore/hiddenLoading', this.$route.name)
      this.$router.push(this.selectedTag as RouteLocationRaw)
      this.$store.dispatch('tagsViewStore/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    /**
     * @description 关闭全部标签
     */
    closeAllTags (view: any) {
      this.$store.dispatch('settingStore/hiddenLoading', this.$route.name)
      this.$store.dispatch('tagsViewStore/delAllViews').then(({ visitedViews }: any) => {
        if (this.affixTags.some((tag: any) => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    /**
     * @description 调整到最后的额标签
     */
    toLastView (visitedViews: any[], view: { path?: any; name?: any; fullPath?: any }) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        delete latestView.name
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    /**
     * @description 右击菜单
     */
    openMenu (tag: any, e: { clientX: number; clientY: number }) {
      const menuMinWidth = 260
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth + menuMinWidth - 80 // left boundary
      const left = e.clientX + 15 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    /**
     * @description 关闭右键菜单
     */
    closeMenu () {
      this.visible = false
    }
  }
})
</script>

<style lang="less" scoped>
  .tags-view-container {
    width: 100%;
    min-width: @minWidth;
    height: @tagsHeight;
    overflow: hidden;
    background: #fff;
    border-top-left-radius: 20px;

    &::-webkit-scrollbar {
      width: 15px;
    }

    .tags-view-wrapper {
      background: #e4e7ed;

      .tags-view-item {
        position: relative;
        display: inline-block;
        height: @tagsHeight;
        background-color: #f2f6fc;

        &::before {
          position: absolute;
          top: 10px;
          left: 0;
          z-index: 20;
          display: inline-block;
          width: 1px;
          height: 16px;
          content: '';
          background-color: #c0c4cc;
        }

        .tab-box {
          position: relative;
          display: inline-block;
          padding: 0 20px;
          font-size: 12px;
          line-height: @tagsHeight;
          color: #45454d;
          cursor: pointer;
          -webkit-user-select: none;
          background: #e4e7ed;
        }

        &:first-of-type {
          .tab-box {
            padding-left: 30px;
          }

          &::before {
            background-color: transparent;
          }
        }

        &.active {
          background-color: #e4e7ed;

          .tab-box {
            color: #45454d;
            background-color: #f2f6fc;
            border-radius: 6px 6px 0 0;
          }

          &::before {
            background-color: transparent;
          }
        }

        &.isBorderActive-left {
          .tab-box {
            border-radius: 0 0 6px 0;
          }
        }

        &.isBorderActive-right {
          .tab-box {
            border-radius: 0 0 0 6px;
          }

          &::before {
            background-color: transparent;
          }
        }
      }
    }

    .contextmenu {
      position: absolute;
      z-index: 3000;
      padding: 5px 0;
      margin: 0;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      list-style-type: none;
      background: #fff;
      border-radius: 4px;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

      li {
        padding: 7px 16px;
        margin: 0;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style lang="less">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    position: relative;

    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        text-align: center;
        vertical-align: 2px;
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;

        &::before {
          display: inline-block;
          vertical-align: -3px;
        }

        &:hover {
          color: #fff;
          background-color: #b4bccc;
        }
      }
    }
  }
</style>
