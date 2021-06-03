import type { App } from 'vue'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import './element-variables.scss'

export function setupElementUi (app: App<Element>): void {
  app.use(ElementPlus, { size: 'medium', zIndex: 3000, locale })
}
