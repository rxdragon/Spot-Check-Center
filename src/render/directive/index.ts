import type { App } from 'vue'
import type { DirectiveObjConfig } from '~/types/config'

import numberOnly from './limit-num/index'
import noSpecialChar from './no-special-char/index'


const directives: DirectiveObjConfig = {
  numberOnly,
  noSpecialChar
}

export function setupDirective (app: App<Element>): void {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key])
  })
}
