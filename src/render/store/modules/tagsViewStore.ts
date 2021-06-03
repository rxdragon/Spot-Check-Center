import type { ITagsViewStore } from '~/types/shims-store'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { ActionTree, MutationTree } from 'vuex'
import type { State } from '../index'

const state: ITagsViewStore = {
  visitedViews: [],
  cachedViews: []
}

const mutations: MutationTree<ITagsViewStore> = {
  ADD_VISITED_VIEW (state: ITagsViewStore, view: RouteRecordRaw) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: (view.meta as RouteMeta).title || 'no-name'
      })
    )
  },

  ADD_CACHED_VIEW (state: ITagsViewStore, view: RouteRecordRaw) {
    if (state.cachedViews.includes(view.name as string)) return
    if (!(view.meta as RouteMeta).noCache) {
      state.cachedViews.push(view.name as string)
    }
  },

  DEL_VISITED_VIEW (state: ITagsViewStore, view: RouteRecordRaw) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },

  DEL_CACHED_VIEW (state: ITagsViewStore, view: RouteRecordRaw) {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS (state: ITagsViewStore, view: RouteRecordRaw) {
    state.visitedViews = state.visitedViews.filter(v => {
      return (v.meta as RouteMeta).affix || v.path === view.path
    })
  },

  DEL_OTHERS_CACHED_VIEWS (state: ITagsViewStore, view: RouteRecordRaw) {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = state.cachedViews.slice(index, index + 1)
        break
      }
    }
  },

  DEL_ALL_VISITED_VIEWS (state: ITagsViewStore) {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => (tag.meta as RouteMeta).affix)
    state.visitedViews = affixTags
  },

  DEL_ALL_CACHED_VIEWS (state: ITagsViewStore) {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW (state: ITagsViewStore, view: RouteMeta) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions: ActionTree<ITagsViewStore, State> = {
  addView ({ dispatch }, view: RouteRecordRaw) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },

  addVisitedView ({ commit }, view: RouteRecordRaw) {
    commit('ADD_VISITED_VIEW', view)
  },

  addCachedView ({ commit }, view: RouteRecordRaw) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView ({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delVisitedView ({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },

  delCachedView ({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews ({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delOthersVisitedViews ({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },

  delOthersCachedViews ({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews ({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delAllVisitedViews ({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },

  delAllCachedViews ({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView ({ commit }, view: RouteRecordRaw) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
