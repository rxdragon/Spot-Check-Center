import type { Router, RouteMeta } from 'vue-router'

import NProgress from 'nprogress' // 加载进度条
import '@/assets/styles/nprogress.less' // 进度条颜色

import getPageTitle from '@/utils/get-page-title' // 获取页面title

import { store } from '@/store/index'

import * as SessionTool from '@/utils/sessionTool' // get token from cookie
import * as UserApi from '@/api/userApi'

export function createPermissionGuard (router: Router) {
  NProgress.configure({ showSpinner: false }) // 关闭加载微调器

  const baseWhiteList: string[] = ['/', '/login', '/auth-redirect', '/401', '/404']
  const appWhiteList: string[] = []
  const whiteList = [...baseWhiteList, ...appWhiteList] // 白名单

  router.beforeEach(async (to, from) => {
    NProgress.start() // 读取进度条
    document.title = getPageTitle((to.meta as RouteMeta).title)
    const hasXStreamId = SessionTool.getXStreamId() // 获取token
    console.warn(to.path)
    // 没有过期时的操作
    async function noExpire () {
      if (to.path === '/login') {
        return { path: '/' }
      } else {
        if (whiteList.includes(to.path)) {
          return true
        }
        const name = store.getters.userName
        if (name) {
          return true
        } else {
          await store.dispatch('userStore/getUserInfo')
          const redirectPath = (from.query.redirect || to.path) as string
          const redirect = decodeURIComponent(redirectPath)
          const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
          return nextData
        }
      }
    }

    function goLogin () {
      if (whiteList.indexOf(to.path) !== -1) {
        return true
      } else {
        return { path: `/login?redirect=${to.path}` }
      }
    }

    if (hasXStreamId) {
      // 下次的过期时间
      const expireTime = SessionTool.getStreamIdExpireTime() * 1000
      const nowTime = new Date().getTime()
      const discrepancyTime = expireTime - nowTime

      if (discrepancyTime > 0) {
        // 过期时间小于1小时续上
        if (discrepancyTime < 60 * 60 * 1000) {
          await UserApi.userExpire()
        }

        return noExpire()
      } else if (discrepancyTime < 0) {
        UserApi.logout()
        return goLogin()
      }
    } else {
      return goLogin() // 没有xStreamId
    }
  })

  router.afterEach(() => {
    NProgress.done() // 读取完成
  })
}
