/**
 * @description 拼接地址
 * @param basePath
 * @param path
 */
export function joinPath (basePath: string, path: string): string {
  const joinPath = basePath + '/' + path
  const addPath = joinPath.replace('//', '/')
  if (addPath.charAt(addPath.length - 1) === '/') {
    return addPath.substring(0, addPath.length - 1)
  }
  return addPath
}

/**
 * 下划线转大驼峰
 * @param {*} name
 */
export function toCapitalHump (name: string): string {
  name = name.charAt(0).toUpperCase() + name.slice(1)
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
