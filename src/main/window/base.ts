import { BrowserWindow } from "electron"
import WindowsModel from './WindowModel'

export const windows: Record<string, WindowsModel> = {}

/**
 * @description 创建窗口
 * @param {*} name 窗口名字
 * @param {*} url 地址
 * @param {*} options 选项
 */
export async function startWindow (name: string, url: string, options: Electron.BrowserWindowConstructorOptions) {

  if (!windows[name]) {
    options.show = false
    const win = new BrowserWindow(options)
    windows[name] = new WindowsModel(name, win)

    win.on('ready-to-show', () => {
      win.show()
    })

    win.on('closed', () => {
      delete windows[name]
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `#${url}`)
    } else {
      // Load the index.html when not in development
      await win.loadURL(`app://${global.env}/index.html#${url}`)
    }

    if (global.isDevelopment) win.webContents.openDevTools({ mode: "detach" })
  } else {
    windows[name].browserWindowObject.focus()
  }
}

/**
 * @description 创建窗口
 * @param {*} name 窗口名字
 * @param {*} url 地址
 * @param {*} options 选项
 */
export async function startOtherWindow (name: string, url: string, options: Electron.BrowserWindowConstructorOptions) {
  if (!windows[name]) {
    options.show = true
    const win = new BrowserWindow(options)
    windows[name] = new WindowsModel(name, win)

    win.on('ready-to-show', () => {
      win.show()
    })

    win.on('closed', () => {
      delete windows[name]
    })

    await win.loadURL(url)

    if (global.isDevelopment) win.webContents.openDevTools({ mode: "detach" })
  } else {
    if (!windows[name]) return
    windows[name].browserWindowObject.focus()
  }
}

/**
 * @description 关闭窗口
 * @param {*} windowName 姓名
 */
export function closeWindow (windowName: string) {
  const WindowsModelObject = windows[windowName]
  if (!WindowsModelObject) return
  // 发出关闭窗口欧通信
  windows['main'].browserWindowObject.webContents.send(`${windowName}-close`)
  // 销毁窗口
  WindowsModelObject.browserWindowObject.destroy()
  delete windows[windowName]
}
