import type { IUserStore } from '~/types/shims-store'
import type { ActionTree, MutationTree } from 'vuex'
import type { State } from '../index'
import type { RouteRecordRaw } from 'vue-router'
import type { authorityInfo, userBaseInfo } from '@/api/userApi'

import * as SessionTool from '@/utils/sessionTool'
// eslint-disable-next-line no-duplicate-imports
import * as UserApi from '@/api/userApi'
import router from '@/router/index'
import { store } from '@/store/index'

const state: IUserStore = {
  id: '', // 员工id
  name: '', // 真名
  nickname: '', // 花名
  avatarImg: '', // 头像
  permissions: []
}

const mutations: MutationTree<IUserStore> = {
  SET_USERINFO (state, info: userBaseInfo) {
    state.id = info.id
    state.name = info.name
    state.nickname = info.nickname
    state.avatarImg = info.avatar
  }
}

const actions: ActionTree<IUserStore, State> = {
  // 用户名登录
  login (_context, key: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const token: string = await UserApi.login({ token: key })
        SessionTool.setXStreamId(token)
        await UserApi.userExpire()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  // 登出
  async loginOut ({ commit }) {
    try {
      await UserApi.logout()
    } finally {
      const info = {
        id: '',
        name: '',
        nickname: '',
        avatarImg: ''
      }
      commit('SET_USERINFO', info)
      SessionTool.removeSession()
    }
  },

  // 获取用户信息
  getUserInfo ({ commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      try {
        const saveInfo = SessionTool.getUserInfo()
        const info = saveInfo || (await UserApi.info())
        SessionTool.setUserInfo(info)
        commit('SET_USERINFO', info)
        await dispatch('getUserPermission')
        resolve(info)
      } catch (error) {
        const base = router.options.base
        router.push(`${base}/401`)
        reject(error)
      }
    })
  },

  // 获取用户权限
  getUserPermission () {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const savePermission = SessionTool.getUserPermission()
        const permissions: authorityInfo[] = savePermission || (await UserApi.getAuthority())
        SessionTool.setUserPermission(permissions)
        // 动态添加路由
        if (!window.__POWERED_BY_QIANKUN__) {
          const accessRoutes: RouteRecordRaw[] = await store.dispatch(
            'permissionStore/generateRoutes',
            permissions
          )
          accessRoutes.forEach((item: RouteRecordRaw) => {
            router.addRoute(item)
          })
        }
        resolve()
      } catch (error) {
        const base = router.options.base
        router.push(`${base}/401`)
        reject(error)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
