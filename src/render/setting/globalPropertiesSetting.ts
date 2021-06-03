import type { App } from 'vue'

import ProjectSetting from '@/setting/projectSetting'
import { newMessage } from '@/utils/message'

/**
 * @description 设置全局字段
 */
export function setupGlobalProperties (app: App<Element>): void {
  app.config.globalProperties.$microSPA = Boolean(window.__POWERED_BY_QIANKUN__)
  app.config.globalProperties.$showTags = ProjectSetting.showTags
  app.config.globalProperties.$showHeader = ProjectSetting.showHeader
  app.config.globalProperties.$showTitle = ProjectSetting.showTitle
  app.config.globalProperties.$newMessage = newMessage
  app.config.globalProperties.$isElectron = process.env.IS_ELECTRON
  app.config.globalProperties.$isDev = Boolean( !process.env.VUE_APP_LOGIN_API?.includes('online'))
}
