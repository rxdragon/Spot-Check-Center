import type { IPermissionStore } from '~/types/shims-store'
import type { RouteRecordRaw } from 'vue-router'
import type { ActionTree, MutationTree } from 'vuex'
import type { State } from '../index'

import { constantRoutes, asyncRoutes } from '@/router/index'
import { authorityInfo } from '@/api/userApi'
import * as Utils from '@/utils/index'

/**
 * @param roles // 权限
 * @param route // 路由
 */
function hasPermission (roles: string[], route: RouteRecordRaw) {
  return roles.includes(route.name as string)
}

/**
 * 过滤含有权限路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state: IPermissionStore = {
  routes: [],
  addRoutes: [],
  personageRouters: [],
  roles: []
}

const mutations: MutationTree<IPermissionStore> = {
  SET_ROUTES (state, routes: RouteRecordRaw[]) {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },

  SET_ROLES (state, roles: string[]) {
    state.roles = roles

    // 权限控制
  },

  SET_PERSONAGE_ROUTES (state, routes: RouteRecordRaw[]) {
    state.personageRouters = routes
  }
}

const actions: ActionTree<IPermissionStore, State> = {
  // 判断动态路由
  generateRoutes ({ commit }, roles: authorityInfo[]): Promise<RouteRecordRaw[]> {
    return new Promise(resolve => {
      let accessedRoutes = []
      const newRoles: authorityInfo[] = roles
      let newRolesArr: string[] = []
      const newPermissionArr: string[] = []
      newRoles.forEach(roleItem => {
        if (roleItem.name) {
          const nameArr = roleItem.name.split('.')
          nameArr.length = nameArr.length - 1
          // 全部权限列表
          newPermissionArr.push(Utils.toCapitalHump(roleItem.name))
          const componentNames = nameArr.map(item => Utils.toCapitalHump(item))
          newRolesArr = [...newRolesArr, ...componentNames]
        }
      })

      commit('SET_ROLES', newPermissionArr)
      
      newRolesArr = [...new Set(newRolesArr)]
      // TODO:cf
      // accessedRoutes = [...filterAsyncRoutes(asyncRoutes, newRolesArr)]
      accessedRoutes = [...asyncRoutes]
      commit('SET_PERSONAGE_ROUTES', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
