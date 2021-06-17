import type { ISettingStore } from '~/types/shims-store'
import type { ActionTree, MutationTree } from 'vuex'
import type { State } from '../index'

import * as SessionTool from '@/utils/sessionTool'

const state: ISettingStore = {
  imgDomain: process.env.VUE_APP_DOMAIN,
  imgCompressDomain: process.env.VUE_APP_COMPRESS_DOMAIN,
  imgUpdateFinishDomain: process.env.VUE_APP_UPDATE_FINISH_DOMAIN,
  updateDomain: process.env.VUE_APP_UPDATE_DOMAIN,
  collapse: SessionTool.getCollapseStorage(),
  loadRoutes: [],
  // TODO: cf
  savePath: '/Users/yzend/Desktop/'
}

const mutations: MutationTree<ISettingStore> = {
  // 设置是否缩减菜单栏
  SET_COLLAPSE (state) {
    state.collapse = !state.collapse
    SessionTool.setCollapseStorage(state.collapse ? 1 : 0)
  },
  SHOW_LOADING: (state, routeName: string) => {
    const loadRoutes = new Set(state.loadRoutes)
    loadRoutes.add(routeName)
    state.loadRoutes = [...loadRoutes]
  },
  HIDDEN_LOADING: (state, routeName: string) => {
    const loadRoutes = new Set(state.loadRoutes)
    loadRoutes.delete(routeName)
    state.loadRoutes = [...loadRoutes]
  },
  SET_SAVE_PATH: (state, data) => {
    state.savePath = data
  },
}

const actions: ActionTree<ISettingStore, State> = {
  showLoading ({ commit }, routeName: string) {
    commit('SHOW_LOADING', routeName)
  },
  // 取消loadign
  hiddenLoading ({ commit }, routeName: string) {
    setTimeout(() => {
      commit('HIDDEN_LOADING', routeName)
    }, 300)
  },
  // 设置保存路径
  setSavePath ({ commit }, path) {
    commit('SET_SAVE_PATH', path)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
