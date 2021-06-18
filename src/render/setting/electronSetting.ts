/**
 * @description 注册相关渲染进程事件
 */
export function setupElectronSetting (): void {
  if (!window.ElectronIpcRendererAddListener) return
  window.ElectronIpcRendererAddListener.on('enter-full', () => {
    document.body.style.setProperty('--navbarMainLeft', '30px')
  })
  window.ElectronIpcRendererAddListener.on('leave-full', () => {
    document.body.style.setProperty('--navbarMainLeft', '95px')
  })
}
