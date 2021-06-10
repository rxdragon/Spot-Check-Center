import { RouteRecordRaw } from 'vue-router'

interface IUserStore {
  id: string | number
  name: string
  nickname: string
  avatarImg: string
  permissions: string[]
}

interface ISettingStore {
  imgDomain: string | undefined
  imgCompressDomain: string | undefined
  updateDomain: string | undefined
  collapse: boolean
  loadRoutes: string[]
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
