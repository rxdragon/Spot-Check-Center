/**
 * @description 是否是外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}
