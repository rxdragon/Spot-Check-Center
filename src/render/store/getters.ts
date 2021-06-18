import type { GetterTree } from 'vuex'
import type { State } from './index'

// 用户信息getters
const userGetters = {
  userInfo: (state: State) => state.userStore,
  userName: (state: State) => state.userStore.nickname || state.userStore.name,
  permission_routes: (state: State) => state.permissionStore.routes
}

const settingGetters: GetterTree<State, State> = {
  imgDomain: (state: State) => state.settingStore.imgDomain,
  imgCompressDomain: (state: State) => state.settingStore.imgCompressDomain,
  imgUpdateFinishDomain: (state: State) => state.settingStore.imgUpdateFinishDomain,
  updateDomain: (state: State) => state.settingStore.updateDomain,
  collapse: (state: State) => state.settingStore.collapse,
  loadRoutes: (state: State) => state.settingStore.loadRoutes,
  saveFolder: (state: State) => state.settingStore.savePath
}

const downLoadedListGetters: GetterTree<State, State> = {
  downloadList: (state: State) => state.downLoadedListStore.downloadList
}

const getters: GetterTree<State, State> = {
  ...userGetters,
  ...settingGetters,
  ...downLoadedListGetters
}

export default getters
