/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { IPermissionStore, ISettingStore, ITagsViewStore, IUserStore } from './shims-store'

declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
    userStore: IUserStore
    settingStore: ISettingStore
    tagsViewStore: ITagsViewStore
    permissionStore: IPermissionStore
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
