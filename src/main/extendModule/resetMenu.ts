import type { BrowserWindow as typeBrowserWindow, MenuItemConstructorOptions } from 'electron'
import { app, BrowserWindow, Menu, dialog } from 'electron'
import { MenuItem } from 'electron'
import path from 'path'

const name = app.getName()
const template: MenuItemConstructorOptions[] = [{
  label: name,
  submenu: [{
    label: '复制',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: '粘贴',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: '全选',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectAll'
  }, {
    label: '剪切',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: '重新加载',
    accelerator: '',
    click: function (item: MenuItem, focusedWindow: typeBrowserWindow | undefined) {
      if (focusedWindow) {
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(async function (win) {
            const ses = win.webContents.session
            await ses.clearHostResolverCache()
            const cacheSize = await ses.getCacheSize()
            const cacheSizeMB = cacheSize / 1024 / 1024
            // eslint-disable-next-line no-console
            console.log(`\x1b[42;30m 当前缓存 \x1b[40;32m ${cacheSizeMB}MB`)
            await ses.clearCache()
            if (win.id > 1) { win.close() }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: '打开调试器',
    accelerator: 'CmdOrCtrl+I',
    click: function (item: MenuItem, focusedWindow: typeBrowserWindow | undefined) {
      if (focusedWindow) {
        if (focusedWindow.webContents.isDevToolsOpened()) {
          focusedWindow.webContents.closeDevTools()
        } else {
          focusedWindow.webContents.openDevTools()
        }
      }
    }
  }]
}, {
  label: '关于',
  submenu: [{
    label: '版本',
    accelerator: 'CmdOrCtrl+M',
    click: function (item: MenuItem, focusedWindow: typeBrowserWindow | undefined) {
      dialog.showMessageBoxSync({
        type: 'info',
        title: '版本号',
        icon: path.join(global.staticDir, 'icon.png'),
        message: global.currentVersion
      })
    }
  }]
}]

/**
 * @description 初始化菜单
 */
export function setMenu () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
