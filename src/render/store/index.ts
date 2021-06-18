import type { App, InjectionKey } from 'vue'
import type {
  IPermissionStore,
  ISettingStore,
  ITagsViewStore,
  IUserStore,
  IDownLoadedList
} from '~/types/shims-store'

import { createStore, Store, useStore as baseUseStore } from 'vuex'
import getters from './getters'

// 为 store state 声明类型
export interface State {
  userStore: IUserStore
  settingStore: ISettingStore
  tagsViewStore: ITagsViewStore
  permissionStore: IPermissionStore
  downLoadedListStore: IDownLoadedList
}


// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles: any = require.context('./modules', true, /\.ts$/)

// 批量倒入modules模块
const modules = modulesFiles.keys().reduce((modules: any, modulePath: string) => {
  // 设置 './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})


// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<State>({
  modules,
  getters
})

// 定义自己的‘useStore’
export function useStore (): Store<State> {
  return baseUseStore(key)
}

// 定义自己的‘useStore’
export function setupStore (app: App<Element>): void {
  app.use(store, key)
}
