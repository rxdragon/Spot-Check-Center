<template>
  <div class="Navbar">
    <div class="navbar-main">
      <div class="nav-left">
        <el-button class="icon-button" icon="el-icon-arrow-left" @click="back" />
        <el-button class="icon-button" icon="el-icon-arrow-right" @click="go" />
        <el-button
          class="icon-button refresh"
          icon="el-icon-refresh-right"
          @mousedown="realRefreshStar"
          @mouseup="realRefreshEnd"
          @click="throttleRefresh"
        />
      </div>
      <span class="nav-main">
        缦图云端 修图中心
      </span>
      <div class="nav-right">
        <!-- <download-management /> -->
        <!-- 修图师在线功能 -->
        <el-avatar :src="userInfo.avatarImg" />
        <div class="user-name">{{ userInfo.nickname || userInfo.name }}</div>
        <div class="label">{{ userInfo.departmentName }}</div>
        <el-button class="icon-button" icon="iconfont iconlogin-out" @click="logout" />
      </div>
    </div>
  </div>
</template>

<script>
// import DownloadManagement from '@/components/DownloadManagement'

import * as UserApi from '@/api/userApi'

import { throttle } from '@/utils/throttle'
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  // components: { DownloadManagement, InformationSwitch },
  data () {
    return {
      throttleRefresh: throttle(this.refresh, 1000),
      starTime: null,
      deplay: 3000,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'lineState', 'isRetoucher', 'hasWorkbench', 'showInformation']),
    isOnline () {
      return this.lineState === 'online'
    }
  },
  mounted () {
    // TODO:cf
    // this.$ipcRenderer.on('enter-full', (e, item) => {
    //   document.body.style.setProperty('--navbarMainLeft', '30px')
    // })
    // this.$ipcRenderer.on('leave-full', (e, item) => {
    //   document.body.style.setProperty('--navbarMainLeft', '120px')
    // })
  },
  methods: {
    /**
     * @description 返回
     */
    back () {
      this.$router.go(-1)
    },
    /**
     * @description 前进
     */
    go () {
      this.$router.go(1)
    },
    /**
     * @description 刷新
     */
    refresh () {
      const view = this.$route
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
     * @description 鼠标点击
     */
    realRefreshStar () {
      this.starTime = new Date().getTime()
    },
    /**
     * @description 鼠标拿起
     */
    realRefreshEnd () {
      const endTime = new Date().getTime()
      if (!this.starTime) return
      if (endTime - this.starTime > this.deplay) {
        window.location.reload()
      }
    },
    async logoutReset () {
      await UserApi.logout()
      const userInfo = {
        id: '',
        name: '',
        nickname: '',
        department: { name: '' },
        avatarImg: '',
      }
      this.$store.commit('userStore/SET_USERINFO', userInfo)
      this.$router.push('/login')
    },
    /**
     * @description 退出登录
     */
    async logout () {
      try {
        await this.logoutReset()
      } catch (error) {
        this.$newMessage.error(error)
      }
    }
  }
}
</script>

<style lang="less">

.Navbar {
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;

  .navbar-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - var(--navbarMainLeft));
    height: 100%;
    margin-left: var(--navbarMainLeft);
    transition: all 0.3s;

    .nav-left {
      -webkit-app-region: no-drag;

      .icon-button {
        width: 24px;
        height: 24px;
        min-height: 24px;
        padding: 0;
      }

      .refresh {
        margin-left: 28px;
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      -webkit-user-select: none;
      -webkit-app-region: no-drag;

      .download-management {
        margin-right: 20px;
      }

      .el-avatar {
        width: 24px;
        height: 24px;
        margin-right: 6px;
        cursor: pointer;
        border: 1px solid #fff;
        outline: none;
      }

      .user-name {
        margin-right: 8px;
        font-size: 14px;
      }

      .label {
        margin-right: 10px;
      }

      .icon-button {
        width: 24px;
        height: 24px;
        min-height: 24px;
        padding: 0;
        background-color: transparent;
      }
    }

    .nav-main {
      width: 50%;
      height: 100%;
      line-height: @navbarHeight;
      text-align: center;
      cursor: pointer;
      -webkit-user-select: none;

      .test-title {
        font-size: 40px;
        color: red;
        vertical-align: middle;
      }
    }
  }
}

.change-state {
  ul {
    padding: 0 12px;
    margin: 0;
    list-style: none;

    li {
      height: 34px;
      line-height: 34px;
      cursor: pointer;

      .change-point {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 12px;
        background-color: @green;
        border-radius: 50%;
      }

      .li-check {
        float: right;
        margin-top: 9px;
        font-size: 16px;
        font-weight: 600;
        color: @blue;
      }

      .change-text {
        font-size: 14px;
        font-weight: 500;
        color: #606266;

        &.active {
          color: @blue;
        }

        &.disabled-li {
          color: #c1c0c0 !important;
          cursor: progress;
        }
      }

      &:hover {
        .change-text {
          color: @blue;
        }
      }
    }

    .online-li {
      .change-point {
        background-color: @green;
      }
    }

    .offline-li {
      .change-point {
        background-color: #909399;
      }
    }
  }
}
</style>
