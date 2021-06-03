<template>
  <div class="user-tab">
    <div class="collapse-switch">
      <el-button
        class="collapse-button focus:outline-none"
        :class="{ 'iscollapse': collapse }"
        icon="el-icon-s-fold"
        @click="switchCollapse"
      />
    </div>
    <div class="release-version">更新时间：{{ updateTime }}</div>
    <div class="user-avatar">
      <el-avatar :size="24" :src="avatarImg">
        <img
          alt="默认头像"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        >
      </el-avatar>
      <div class="user-name">{{ userName || '异常' }}</div>
      <el-button class="icon-button" icon="el-icon-switch-button" @click="logout" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'

import * as SessionTool from '@/utils/sessionTool'
import * as UserApi from '@/api/userApi'
import * as TimeUtil from '@/utils/TimeUtil'

export default defineComponent({
  name: 'UserTab',
  data () {
    return {
      updateTime: TimeUtil.formatTime(__APP_INFO__.lastBuildTime)
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()

    const avatarImg = computed(() => store.state.userStore.avatarImg)
    const userName = computed(() => store.getters.userName)

    // 开关菜单
    const collapse = computed(() => store.getters.collapse)
    const switchCollapse = () => {
      store.commit('settingStore/SET_COLLAPSE')
    }

    // 登出
    const logout = () => {
      SessionTool.removeSession()
      const base = router.options.base
      router.push(`${base}/login`)
      UserApi.logout()
    }

    return {
      avatarImg, userName, collapse,
      switchCollapse,
      logout
    }
  }
})
</script>

<style lang="less" scoped>
  .user-tab {
    position: relative;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: var(--userTabHeight);
    padding: 0 18px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);

    .collapse-switch {
      margin-right: auto;

      .collapse-button {
        width: 24px;
        padding: 0;
        margin-right: 12px;
        font-size: 24px;
        border: none;
        transition: all 0.3s;
      }

      .iscollapse {
        transform: rotate(180deg);
      }
    }

    .release-version {
      margin-right: auto;
      color: deeppink;
    }

    .user-avatar {
      display: flex;
      align-items: center;

      .user-name {
        margin: 0 5px 0 11px;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        color: var(--textColor);
      }
    }

    .icon-button {
      width: 24px;
      padding: 0;
      border: none;

      &:focus,
      &:hover {
        color: #4669fb;
        background-color: #fff;
        border: none;
      }
    }
  }
</style>
