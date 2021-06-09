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
  updateDomain: (state: State) => state.settingStore.updateDomain,
  collapse: (state: State) => state.settingStore.collapse,
  loadRoutes: (state: State) => state.settingStore.loadRoutes
}

const getters: GetterTree<State, State> = {
  ...userGetters,
  ...settingGetters
}

export default getters
