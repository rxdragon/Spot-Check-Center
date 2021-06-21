import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from './store/index'
import router, { setupRouter } from './router/index'
import { setupElementUi } from '@/plugins/element'
import { setupRouterGuard } from '@/router/guard/index'
import { setupGlobalProperties } from '@/setting/globalPropertiesSetting'
import { setupElectronSetting } from '@/setting/electronSetting'
import { setupLodashPlugin } from '@/plugins/lodashPlugin'
import { setupDirective } from '@/directive/index'
import initIndexDb from '@/indexDB/index'

import '@/assets/styles/index.less'

(async () => {
  // 按需引入lodash模块
  setupLodashPlugin()

  const app = createApp(App)

  // 设置vuex
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 配置路由首位
  setupRouterGuard()

  // 配置路由
  setupElementUi(app)

  // 配置全局字段
  setupGlobalProperties(app)

  // 注册自定义指令
  setupDirective(app)

  // 注册electron相关渲染进程事件
  setupElectronSetting()

  // 当路由加载完渲染页面
  // https://next.router.vuejs.org/api/#isready
  await router.isReady()
  await initIndexDb(true)

  app.mount('#app')

  window.__APP__ = app
})()
