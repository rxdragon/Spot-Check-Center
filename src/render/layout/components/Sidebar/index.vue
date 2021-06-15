<template>
  <div>
    <Logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :background-color="$isDev ? variables.devmenubg : variables.menubg"
        :text-color="$isDev ? variables.devmenutext : variables.menutext"
        :unique-opened="false"
        :active-text-color="variables.menuactivetext"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in permission_routes"
          :key="route.path"
          :route-item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'

import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'

import variablesCss from '@assetsDir/styles/variables.module.less'

export default defineComponent({
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  data () {
    return {
      experimentCounts: 0,
      expireTime: 0
    }
  },
  setup () {
    const store = useStore()
    const route = useRoute()

    // 当前是否展开
    const collapse = computed(() => store.getters.collapse)

    // 当前激活菜单
    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const variables: any = computed(() => variablesCss)

    /**
     * @description 获取全新
     */
    const permission_routes = computed(() => store.getters.permission_routes)

    return {
      collapse,
      activeMenu,
      variables,
      permission_routes
    }
  }
})
</script>
