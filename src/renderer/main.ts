import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from './store/index'
import router, { setupRouter } from './router/index'
import { setupElementUi } from '@/plugins/element'
import { setupRouterGuard } from '@/router/guard/index'
import { setupGlobalProperties } from '@/setting/globalPropertiesSetting'
import { setupLodashPlugin } from '@/plugins/lodashPlugin'

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

  // 当路由加载完渲染页面
  // https://next.router.vuejs.org/api/#isready
  await router.isReady()
  app.mount('#app')

  window.__APP__ = app
})()
