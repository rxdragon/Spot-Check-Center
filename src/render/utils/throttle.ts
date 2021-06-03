/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/**
 * @description 防止抖动
 * @param {*} fn
 * @param {*} delay
 */
export function debounce (fn: any, delay: any) {
  let timer: any = null
  return function () {
    const _this: any = this
    const _args = arguments
    // 清除上一个timer
    clearTimeout(timer)
    // 当最后回调时，经过delay毫秒后执行事件处理程序
    timer = setTimeout(function () {
      fn.apply(_this, _args)
    }, delay)
  }
}

/**
 * @description 节流
 * @param {*} fn
 * @param {*} delay
 */
export const throttle = function (fn: any, delay: any) {
  let last = 0
  return function () {
    const cur = +new Date()
    if (cur - last > delay) {
      fn.apply()
      last = cur
    }
  }
}
