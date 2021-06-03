import type { BrowserWindow } from "electron"

/**
 * @description 窗口model
 * @param {*} name 
 * @param {*} win 
 */
export default class WindowsModel {
  name: string
  browserWindowObject: BrowserWindow

  constructor (name: string, win: BrowserWindow) {
    this.name = name
    this.browserWindowObject = win
  }
}
