import type { BrowserWindow } from 'electron'

import { ipcMain, app } from 'electron'
import { closeWindow, windows } from '../window/base'

export default function registerIpc (win: BrowserWindow) {
  ipcMain.on('close-app', (event, name) => {
    win.close()
    event.returnValue = 'success'
  })

  // 当需要获取配置项时
  ipcMain.on('config:get', (event, name: string) => {
    if (!global.config || !(global.config as any)[name]) {
      event.returnValue = ''
      return
    }
    event.returnValue = (global.config as any)[name]
  })

  // 获取路径配置
  ipcMain.on('app:getPath', (event, path) => {
    try {
      event.returnValue = app.getPath(path)
    } catch {
      event.returnValue = ''
    }
  })

  // 获取图标地址
  ipcMain.on('app:getFileIcon', async (event, path) => {
    try {
      const nativeImage = await app.getFileIcon(path)
      event.returnValue = nativeImage.toDataURL() // 使用base64展示图标
    } catch {
      event.returnValue = ''
    }
  })

  ipcMain.on('close-window', async (event, windowName) => {
    closeWindow(windowName)
    event.returnValue = 'success'
  })

  ipcMain.on('version:get', (event) => {
    event.returnValue = global.currentVersion
  })

  ipcMain.on('getServePort', (event) => {
    event.returnValue = global.localServePort
  })

  ipcMain.on('other-window-down', async (event, data) => {
    if (!windows['main']) {
      event.returnValue = 'fail'
      return
    }
    windows['main'].browserWindowObject.webContents.send('main-window-down', data)
    event.returnValue = 'success'
  })
}
