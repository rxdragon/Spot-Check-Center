/**
 * @description 打开文件
 */
export const openFile = (path: string) => {
  if (!window.ElectronShell || !window.OriginalFs) return false

  if (!window.OriginalFs.existsSync(path)) return false // 文件不存在的情况
  window.ElectronShell.openPath(path) // 打开文件
  return true
}

/**
 * @description 打开文件夹
 */
export const openFileFolder = (path: string) => {
  if (!window.ElectronShell || !window.OriginalFs) return false

  if (!window.OriginalFs.existsSync(path)) return false
  window.ElectronShell.showItemInFolder(path) // 打开文件所在文件夹
  return true
}
