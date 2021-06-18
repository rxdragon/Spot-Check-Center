/**
 * @description 获取图片路径
 */
export function getFileIcon (path: string): Promise<string> {
  const defaultIcon = 'some-default.jpg'
  return new Promise((resolve) => {
    if (!window.ElectronIpcRenderer) return resolve(defaultIcon)
    if (!path) return resolve(defaultIcon)

    const iconPath = window.ElectronIpcRenderer.sendSync('app:getFileIcon', path)
    if (!iconPath) return resolve(defaultIcon)
    return resolve(iconPath)
  })
}

