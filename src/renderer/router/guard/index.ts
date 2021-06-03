import router from '@/router/index'

import { createPermissionGuard } from './permissionGuard'

export function setupRouterGuard () {
  createPermissionGuard(router)
}
