import type { App } from 'vue'
import type { DirectiveObjConfig } from '~/types/config'

import numberOnly from './limit-num'


const directives: DirectiveObjConfig = {
  numberOnly
}

export function setupDirective (app: App<Element>): void {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key])
  })
}
