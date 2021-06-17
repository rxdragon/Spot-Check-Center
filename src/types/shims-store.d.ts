import { RouteRecordRaw } from 'vue-router'
import type { IDownItem } from '~/main/downModule/index'

interface IUserStore {
  id: string | number
  name: string
  nickname: string
  avatarImg: string
  permissions: string[]
}

interface IDownLoadedList {
  downloadList: IDownItem[]
}

interface ISettingStore {
  imgDomain: string | undefined
  imgCompressDomain: string | undefined
  updateDomain: string | undefined
  imgUpdateFinishDomain: string | undefined
  collapse: boolean
  loadRoutes: string[]
  savePath: string
}

interface ITagsViewStore {
  visitedViews: RouteRecordRaw[]
  cachedViews: string[]
}

interface IPermissionStore {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
  personageRouters: RouteRecordRaw[]
  roles: string[]
}
